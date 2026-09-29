import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

// GET /api/curriculums - Fetch curriculum levels isolated by branch
export async function GET(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const branchParam = searchParams.get("branch");

    const levels = await prisma.level.findMany({
      orderBy: { orderIndex: "asc" },
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

      let itemBranch = "Singkut";
      if (l.description) {
        const raw = l.description.trim();
        if (raw.startsWith("{")) {
          try {
            const meta = JSON.parse(raw);
            if (meta.branch) itemBranch = meta.branch;
          } catch {
            itemBranch = "Singkut";
          }
        } else if (raw.startsWith("branch:")) {
          itemBranch = raw.replace("branch:", "").trim();
        } else {
          const lower = raw.toLowerCase();
          if (lower.includes("tabir") || lower.includes("bangko")) {
            itemBranch = "Tabir Timur";
          } else {
            itemBranch = "Singkut";
          }
        }
      }

      return {
        id: l.id,
        orderIndex: l.orderIndex,
        levelTitle: l.levelName,
        shortDesc: l.shortDesc || "",
        learningGoals: l.learningGoals || "",
        competencies: l.competencies || "",
        learningMaterials: l.learningMaterials || "",
        indicators: parsedIndicators,
        branch: itemBranch,
      };
    });

    // If branch filter specified, filter results
    if (branchParam && branchParam !== "ALL") {
      const lower = branchParam.toLowerCase().trim();
      const filtered = formatted.filter((item) => {
        const itemLower = (item.branch || "Singkut").toLowerCase().trim();
        if (lower === "bangko" || lower.includes("tabir")) {
          return itemLower === "bangko" || itemLower.includes("tabir");
        }
        return itemLower === lower;
      });
      return NextResponse.json(filtered);
    }

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching curriculums:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/curriculums - Add curriculum module
export async function POST(req: Request) {
  try {
    const { error } = await requireAuth(["SUPER_ADMIN", "BRANCH_ADMIN"]);
    if (error) return error;

    const body = await req.json();
    const {
      levelTitle,
      shortDesc,
      learningGoals,
      competencies,
      learningMaterials,
      indicators,
      branch,
    } = body;

    const targetBranch = branch || "Singkut";
    const branchMeta = JSON.stringify({ branch: targetBranch });

    const count = await prisma.level.count();

    const created = await prisma.level.create({
      data: {
        levelName: levelTitle || "Level Baru",
        shortDesc: shortDesc || "",
        description: branchMeta,
        learningGoals: learningGoals || "",
        competencies: competencies || "",
        learningMaterials: learningMaterials || "",
        indicators: indicators ? JSON.stringify(indicators) : JSON.stringify([]),
        orderIndex: count + 1,
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
        orderIndex: created.orderIndex,
        levelTitle: created.levelName,
        shortDesc: created.shortDesc || "",
        learningGoals: created.learningGoals || "",
        competencies: created.competencies || "",
        learningMaterials: created.learningMaterials || "",
        indicators: parsedIndicators,
        branch: targetBranch,
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
      levelTitle,
      shortDesc,
      learningGoals,
      competencies,
      learningMaterials,
      indicators,
      branch,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "ID modul kurikulum diperlukan" }, { status: 400 });
    }

    // Try finding by ID first
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

    const branchMeta = branch ? JSON.stringify({ branch }) : undefined;

    // If still not found, create a new record
    if (!target) {
      const count = await prisma.level.count();
      const created = await prisma.level.create({
        data: {
          levelName: levelTitle || "Level Baru",
          shortDesc: shortDesc || "",
          description: branchMeta || JSON.stringify({ branch: "Singkut" }),
          learningGoals: learningGoals || "",
          competencies: competencies || "",
          learningMaterials: learningMaterials || "",
          indicators: indicators ? JSON.stringify(indicators) : JSON.stringify([]),
          orderIndex: count + 1,
        },
      });

      return NextResponse.json({
        id: created.id,
        orderIndex: created.orderIndex,
        levelTitle: created.levelName,
        shortDesc: created.shortDesc || "",
        learningGoals: created.learningGoals || "",
        competencies: created.competencies || "",
        learningMaterials: created.learningMaterials || "",
        indicators: indicators || [],
        branch: branch || "Singkut",
      });
    }

    const updated = await prisma.level.update({
      where: { id: target.id },
      data: {
        ...(levelTitle ? { levelName: levelTitle } : {}),
        ...(shortDesc !== undefined ? { shortDesc } : {}),
        ...(branchMeta !== undefined ? { description: branchMeta } : {}),
        ...(learningGoals !== undefined ? { learningGoals } : {}),
        ...(competencies !== undefined ? { competencies } : {}),
        ...(learningMaterials !== undefined ? { learningMaterials } : {}),
        ...(indicators !== undefined ? { indicators: JSON.stringify(indicators) } : {}),
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

    let itemBranch = branch || "Singkut";
    if (!branch && updated.description) {
      try {
        const meta = JSON.parse(updated.description);
        if (meta.branch) itemBranch = meta.branch;
      } catch {}
    }

    return NextResponse.json({
      id: updated.id,
      orderIndex: updated.orderIndex,
      levelTitle: updated.levelName,
      shortDesc: updated.shortDesc || "",
      learningGoals: updated.learningGoals || "",
      competencies: updated.competencies || "",
      learningMaterials: updated.learningMaterials || "",
      indicators: parsedIndicators,
      branch: itemBranch,
    });
  } catch (error: any) {
    console.error("Error updating curriculum:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/curriculums - Delete module
export async function DELETE(req: Request) {
  try {
    const { error } = await requireAuth(["SUPER_ADMIN", "BRANCH_ADMIN"]);
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const branch = searchParams.get("branch");
    const isResetAll = searchParams.get("all") === "true" || id === "all";

    // Handle Reset All ("Kosongkan Kurikulum") - Scoped by branch
    if (isResetAll) {
      if (branch && branch !== "ALL") {
        await prisma.level.deleteMany({
          where: {
            description: { contains: branch, mode: "insensitive" },
          },
        });
      } else {
        const studentCount = await prisma.student.count();
        if (studentCount > 0) {
          const baseLevel = await prisma.level.create({
            data: {
              levelName: "Level Dasar: Pengenalan Simbol Jari",
              shortDesc: "Level awal pembelajaran",
              description: JSON.stringify({ branch: "Singkut" }),
              orderIndex: 1,
            },
          });
          await prisma.student.updateMany({
            data: { currentLevelId: baseLevel.id },
          });
          await prisma.level.deleteMany({
            where: { id: { not: baseLevel.id } },
          });
        } else {
          await prisma.level.deleteMany({});
        }
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
      const fallbackLevel = await prisma.level.findFirst({
        where: { id: { not: target.id } },
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
            error: `Tidak dapat menghapus modul ini karena masih digunakan oleh ${studentsUsingLevel} siswa aktif.`,
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
