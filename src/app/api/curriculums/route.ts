import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

// GET /api/curriculums - Fetch all curriculum levels
export async function GET() {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const levels = await prisma.level.findMany({
      orderBy: { orderIndex: "asc" },
    });

    const formatted = levels.map((l) => ({
      id: l.id,
      orderIndex: l.orderIndex,
      levelTitle: l.levelName,
      shortDesc: l.shortDesc || "",
      learningGoals: l.learningGoals || "",
      competencies: l.competencies || "",
      learningMaterials: l.learningMaterials || "",
      indicators: l.indicators ? JSON.parse(l.indicators) : [],
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching curriculums:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/curriculums - Add curriculum module
export async function POST(req: Request) {
  try {
    const { error } = await requireAuth("SUPER_ADMIN");
    if (error) return error;

    const body = await req.json();
    const { levelTitle, shortDesc, learningGoals, competencies, learningMaterials, indicators } = body;

    const count = await prisma.level.count();

    const created = await prisma.level.create({
      data: {
        levelName: levelTitle || "Level Baru",
        shortDesc: shortDesc || "",
        learningGoals: learningGoals || "",
        competencies: competencies || "",
        learningMaterials: learningMaterials || "",
        indicators: indicators ? JSON.stringify(indicators) : JSON.stringify([]),
        orderIndex: count + 1,
      },
    });

    return NextResponse.json(
      {
        id: created.id,
        orderIndex: created.orderIndex,
        levelTitle: created.levelName,
        shortDesc: created.shortDesc || "",
        learningGoals: created.learningGoals || "",
        competencies: created.competencies || "",
        learningMaterials: created.learningMaterials || "",
        indicators: created.indicators ? JSON.parse(created.indicators) : [],
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
    const { error } = await requireAuth("SUPER_ADMIN");
    if (error) return error;

    const body = await req.json();
    const { id, levelTitle, shortDesc, learningGoals, competencies, learningMaterials, indicators } = body;

    if (!id) {
      return NextResponse.json({ error: "ID modul kurikulum diperlukan" }, { status: 400 });
    }

    const updated = await prisma.level.update({
      where: { id },
      data: {
        ...(levelTitle ? { levelName: levelTitle } : {}),
        ...(shortDesc !== undefined ? { shortDesc } : {}),
        ...(learningGoals !== undefined ? { learningGoals } : {}),
        ...(competencies !== undefined ? { competencies } : {}),
        ...(learningMaterials !== undefined ? { learningMaterials } : {}),
        ...(indicators !== undefined ? { indicators: JSON.stringify(indicators) } : {}),
      },
    });

    return NextResponse.json({
      id: updated.id,
      orderIndex: updated.orderIndex,
      levelTitle: updated.levelName,
      shortDesc: updated.shortDesc || "",
      learningGoals: updated.learningGoals || "",
      competencies: updated.competencies || "",
      learningMaterials: updated.learningMaterials || "",
      indicators: updated.indicators ? JSON.parse(updated.indicators) : [],
    });
  } catch (error: any) {
    console.error("Error updating curriculum:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/curriculums - Delete module
export async function DELETE(req: Request) {
  try {
    const { error } = await requireAuth("SUPER_ADMIN");
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID modul kurikulum diperlukan" }, { status: 400 });
    }

    await prisma.level.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting curriculum:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
