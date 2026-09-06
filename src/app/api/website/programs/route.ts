import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/website/programs - Fetch all website programs
export async function GET() {
  try {
    const programs = await prisma.websiteProgram.findMany({
      orderBy: { orderIndex: "asc" },
    });

    const formatted = programs.map((p) => ({
      id: p.id,
      levelTitle: p.levelTitle,
      targetAge: p.targetAge,
      description: p.description,
      monthlyFee: Number(p.monthlyFee),
      registrationFee: Number(p.registrationFee),
      benefits: p.benefits ? JSON.parse(p.benefits) : [],
      popular: p.popular,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching website programs:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/website/programs - Add program
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { levelTitle, targetAge, description, monthlyFee, registrationFee, benefits, popular } = body;

    const count = await prisma.websiteProgram.count();

    const created = await prisma.websiteProgram.create({
      data: {
        levelTitle: levelTitle || "Program Baru",
        targetAge: targetAge || "4 - 12 Tahun",
        description: description || "",
        monthlyFee: monthlyFee ? Number(monthlyFee) : 250000,
        registrationFee: registrationFee ? Number(registrationFee) : 100000,
        benefits: benefits ? JSON.stringify(benefits) : JSON.stringify([]),
        popular: popular ?? false,
        orderIndex: count + 1,
      },
    });

    return NextResponse.json(
      {
        id: created.id,
        levelTitle: created.levelTitle,
        targetAge: created.targetAge,
        description: created.description,
        monthlyFee: Number(created.monthlyFee),
        registrationFee: Number(created.registrationFee),
        benefits: created.benefits ? JSON.parse(created.benefits) : [],
        popular: created.popular,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating website program:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/website/programs - Update program
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, levelTitle, targetAge, description, monthlyFee, registrationFee, benefits, popular } = body;

    if (!id) {
      return NextResponse.json({ error: "ID program diperlukan" }, { status: 400 });
    }

    const updated = await prisma.websiteProgram.update({
      where: { id },
      data: {
        ...(levelTitle ? { levelTitle } : {}),
        ...(targetAge ? { targetAge } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(monthlyFee !== undefined ? { monthlyFee: Number(monthlyFee) } : {}),
        ...(registrationFee !== undefined ? { registrationFee: Number(registrationFee) } : {}),
        ...(benefits !== undefined ? { benefits: JSON.stringify(benefits) } : {}),
        ...(popular !== undefined ? { popular } : {}),
      },
    });

    return NextResponse.json({
      id: updated.id,
      levelTitle: updated.levelTitle,
      targetAge: updated.targetAge,
      description: updated.description,
      monthlyFee: Number(updated.monthlyFee),
      registrationFee: Number(updated.registrationFee),
      benefits: updated.benefits ? JSON.parse(updated.benefits) : [],
      popular: updated.popular,
    });
  } catch (error: any) {
    console.error("Error updating website program:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/website/programs - Delete program
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID program diperlukan" }, { status: 400 });
    }

    await prisma.websiteProgram.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting website program:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
