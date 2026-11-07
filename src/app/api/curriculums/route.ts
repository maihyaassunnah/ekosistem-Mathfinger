import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

// Helper to resolve branchId
async function resolveBranchId(branchId?: string | null, branchName?: string | null) {
  if (branchId) return branchId;
  if (!branchName) return null;

  const targetName =
    branchName.toLowerCase().includes("bangko") || branchName.toLowerCase().includes("tabir")
      ? "Bangko"
      : "Singkut";

  const branch = await prisma.branch.findFirst({
    where: {
      OR: [
        { branchName: { contains: targetName, mode: "insensitive" } },
        { branchCode: targetName === "Bangko" ? "BGK" : "SKT" },
      ],
    },
  });
  return branch?.id || null;
}

// GET /api/curriculums - Fetch curriculum levels (optionally filtered by branch)
export async function GET(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const branchParam = searchParams.get("branchId") || searchParams.get("branch");

    let whereClause: any = {};
    if (branchParam && branchParam !== "ALL") {
      const resolvedBranchId = await resolveBranchId(
        branchParam.length > 20 ? branchParam : null,
        branchParam
      );
      if (resolvedBranchId) {
        whereClause.branchId = resolvedBranchId;
      }
    }

    const levels = await prisma.level.findMany({
      where: whereClause,
      include: {
        branch: {
          select: { id: true, branchName: true, branchCode: true },
        },
      },
      orderBy: [{ branchId: "asc" }, { orderIndex: "asc" }],
    });

    const formatted = levels.map((l) => {
      let parsedIndicators: string[] = [];
      try {
        if (l.indicators) {
          parsedIndicators = Array.isArray(l.indicators)
            ? l.indicators
            : JSON.parse(l.indicators);
        }
      } catch {
        parsedIndicators = l.indicators ? [String(l.indicators)] : [];
      }

      const branchName =
        l.branch?.branchName ||
        (l.description?.includes("Tabir") ? "Bangko" : "Singkut");

      return {
        id: l.id,
        branchId: l.branchId,
        branch: branchName,
        branchCode: l.branch?.branchCode || (branchName === "Bangko" ? "BGK" : "SKT"),
        orderIndex: l.orderIndex,
        levelTitle: l.levelName,
        shortDesc: l.shortDesc || "",
        learningGoals: l.learningGoals || "",
        competencies: l.competencies || "",
        learningMaterials: l.learningMaterials || "",
        indicators: parsedIndicators,
      };
    });

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching curriculums:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/curriculums - Add curriculum module scoped to branch
export async function POST(req: Request) {
  try {
    const { error } = await requireAuth(["SUPER_ADMIN", "BRANCH_ADMIN"]);
    if (error) return error;

    const body = await req.json();
    const {
      branchId,
      branch: branchName,
      levelTitle,
      shortDesc,
      learningGoals,
      competencies,
      learningMaterials,
      indicators,
    } = body;

    const resolvedBranchId = await resolveBranchId(branchId, branchName);
    if (!resolvedBranchId) {
      return NextResponse.json(
        { error: "Cabang wajib ditentukan untuk modul kurikulum ini." },
        { status: 400 }
      );
    }

    // Compute orderIndex scoped per branch
    const branchLevelCount = await prisma.level.count({
      where: { branchId: resolvedBranchId },
    });

    const created = await prisma.level.create({
      data: {
        branchId: resolvedBranchId,
        levelName: levelTitle || "Level Baru",
        shortDesc: shortDesc || "",
        learningGoals: learningGoals || "",
        competencies: competencies || "",
        learningMaterials: learningMaterials || "",
        indicators: indicators ? JSON.stringify(indicators) : JSON.stringify([]),
        orderIndex: branchLevelCount + 1,
      },
      include: {
        branch: {
          select: { id: true, branchName: true, branchCode: true },
        },
      },
    });

    let parsedIndicators: string[] = [];
    try {
      if (created.indicators) {
        parsedIndicators = JSON.parse(created.indicators);
      }
    } catch {
      parsedIndicators = [];
    }

    return NextResponse.json(
      {
        id: created.id,
        branchId: created.branchId,
        branch: created.branch?.branchName || "Singkut",
        branchCode: created.branch?.branchCode || "SKT",
        orderIndex: created.orderIndex,
        levelTitle: created.levelName,
        shortDesc: created.shortDesc || "",
        learningGoals: created.learningGoals || "",
        competencies: created.competencies || "",
        learningMaterials: created.learningMaterials || "",
        indicators: parsedIndicators,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating curriculum:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/curriculums - Update module
export async function PUT(req: Request) {
  try {
    const { error } = await requireAuth(["SUPER_ADMIN", "BRANCH_ADMIN"]);
    if (error) return error;

    const body = await req.json();
    const {
      id,
      branchId,
      branch: branchName,
      levelTitle,
      shortDesc,
      learningGoals,
      competencies,
      learningMaterials,
      indicators,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "ID modul kurikulum diperlukan" }, { status: 400 });
    }

    let target = await prisma.level.findUnique({ where: { id } });

    // Fallback: If id is a mock ID like cur-1, match by orderIndex or levelTitle
    if (!target) {
      const indexMatch = String(id).match(/cur-(\d+)/);
      if (indexMatch) {
        const orderIdx = parseInt(indexMatch[1], 10);
        target = await prisma.level.findFirst({ where: { orderIndex: orderIdx } });
      }
      if (!target && levelTitle) {
        target = await prisma.level.findFirst({
          where: {
            levelName: { contains: levelTitle.trim(), mode: "insensitive" },
          },
        });
      }
    }

    if (!target) {
      const resolvedBranchId = await resolveBranchId(branchId, branchName);
      const count = await prisma.level.count({
        where: resolvedBranchId ? { branchId: resolvedBranchId } : {},
      });
      const created = await prisma.level.create({
        data: {
          branchId: resolvedBranchId,
          levelName: levelTitle || "Level Baru",
          shortDesc: shortDesc || "",
          learningGoals: learningGoals || "",
          competencies: competencies || "",
          learningMaterials: learningMaterials || "",
          indicators: indicators ? JSON.stringify(indicators) : JSON.stringify([]),
          orderIndex: count + 1,
        },
        include: {
          branch: { select: { id: true, branchName: true, branchCode: true } },
        },
      });

      return NextResponse.json({
        id: created.id,
        branchId: created.branchId,
        branch: created.branch?.branchName || "Singkut",
        branchCode: created.branch?.branchCode || "SKT",
        orderIndex: created.orderIndex,
        levelTitle: created.levelName,
        shortDesc: created.shortDesc || "",
        learningGoals: created.learningGoals || "",
        competencies: created.competencies || "",
        learningMaterials: created.learningMaterials || "",
        indicators: indicators || [],
      });
    }

    const resolvedBranchId = branchId || (branchName ? await resolveBranchId(null, branchName) : undefined);

    const updated = await prisma.level.update({
      where: { id: target.id },
      data: {
        ...(resolvedBranchId ? { branchId: resolvedBranchId } : {}),
        ...(levelTitle ? { levelName: levelTitle } : {}),
        ...(shortDesc !== undefined ? { shortDesc } : {}),
        ...(learningGoals !== undefined ? { learningGoals } : {}),
        ...(competencies !== undefined ? { competencies } : {}),
        ...(learningMaterials !== undefined ? { learningMaterials } : {}),
        ...(indicators !== undefined ? { indicators: JSON.stringify(indicators) } : {}),
      },
      include: {
        branch: { select: { id: true, branchName: true, branchCode: true } },
      },
    });

    let parsedIndicators: string[] = [];
    try {
      if (updated.indicators) {
        parsedIndicators = JSON.parse(updated.indicators);
      }
    } catch {
      parsedIndicators = [];
    }

    return NextResponse.json({
      id: updated.id,
      branchId: updated.branchId,
      branch: updated.branch?.branchName || "Singkut",
      branchCode: updated.branch?.branchCode || "SKT",
      orderIndex: updated.orderIndex,
      levelTitle: updated.levelName,
      shortDesc: updated.shortDesc || "",
      learningGoals: updated.learningGoals || "",
      competencies: updated.competencies || "",
      learningMaterials: updated.learningMaterials || "",
      indicators: parsedIndicators,
    });
  } catch (error: any) {
    console.error("Error updating curriculum:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/curriculums - Delete module with branch isolation
export async function DELETE(req: Request) {
  try {
    const { error } = await requireAuth(["SUPER_ADMIN", "BRANCH_ADMIN"]);
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const isResetAll = searchParams.get("all") === "true" || id === "all";
    const branchParam = searchParams.get("branchId") || searchParams.get("branch");

    // Handle Reset ("Kosongkan Kurikulum") strictly isolated per branch
    if (isResetAll) {
      const resolvedBranchId = await resolveBranchId(
        branchParam && branchParam.length > 20 ? branchParam : null,
        branchParam
      );

      if (resolvedBranchId) {
        const studentCount = await prisma.student.count({
          where: { branchId: resolvedBranchId },
        });

        if (studentCount > 0) {
          const baseLevel = await prisma.level.create({
            data: {
              branchId: resolvedBranchId,
              levelName: "Level Dasar: Pengenalan Simbol Jari",
              shortDesc: "Level awal pembelajaran",
              orderIndex: 1,
            },
          });
          await prisma.student.updateMany({
            where: { branchId: resolvedBranchId },
            data: { currentLevelId: baseLevel.id },
          });
          await prisma.level.deleteMany({
            where: {
              branchId: resolvedBranchId,
              id: { not: baseLevel.id },
            },
          });
        } else {
          await prisma.level.deleteMany({
            where: { branchId: resolvedBranchId },
          });
        }
      } else {
        // Global reset if no branch specified
        await prisma.level.deleteMany({});
      }

      return NextResponse.json({ success: true, reset: true });
    }

    if (!id) {
      return NextResponse.json({ error: "ID modul kurikulum diperlukan" }, { status: 400 });
    }

    // Find target level
    let target = await prisma.level.findUnique({ where: { id } });
    if (!target) {
      const indexMatch = String(id).match(/cur-(\d+)/);
      if (indexMatch) {
        const orderIdx = parseInt(indexMatch[1], 10);
        target = await prisma.level.findFirst({ where: { orderIndex: orderIdx } });
      }
    }

    if (!target) {
      return NextResponse.json({ success: true, notFoundInDb: true });
    }

    // Check if any students are referencing this level
    const studentsUsingLevel = await prisma.student.count({
      where: { currentLevelId: target.id },
    });

    if (studentsUsingLevel > 0) {
      // Reassign students to another level OF THE SAME BRANCH
      const fallbackLevel = await prisma.level.findFirst({
        where: {
          id: { not: target.id },
          ...(target.branchId ? { branchId: target.branchId } : {}),
        },
        orderBy: { orderIndex: "asc" },
      });

      if (fallbackLevel) {
        await prisma.student.updateMany({
          where: { currentLevelId: target.id },
          data: { currentLevelId: fallbackLevel.id },
        });
      } else {
        return NextResponse.json(
          {
            error: `Tidak dapat menghapus modul ini karena masih digunakan oleh ${studentsUsingLevel} siswa aktif di cabang ini.`,
          },
          { status: 400 }
        );
      }
    }

    await prisma.level.delete({ where: { id: target.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting curriculum:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
