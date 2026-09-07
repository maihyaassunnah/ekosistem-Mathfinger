import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/reading-grades?studentId=xxx&branchId=xxx
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const branchId = searchParams.get("branchId");

    const where: any = {};
    if (studentId) where.studentId = studentId;
    if (branchId) where.branchId = branchId;

    const grades = await prisma.readingGrade.findMany({
      where,
      include: { readingLevel: true, student: { select: { studentName: true, studentCode: true } } },
      orderBy: { assessmentDate: "desc" },
    });

    return NextResponse.json(grades);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/reading-grades - Create new reading assessment
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, branchId, readingLevelId, assessmentDate, teacherNotes, kelancaran, pemahaman, pelafalan } = body;

    if (!studentId || !branchId || !readingLevelId || !assessmentDate) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const created = await prisma.readingGrade.create({
      data: {
        studentId,
        branchId,
        readingLevelId,
        assessmentDate: new Date(assessmentDate),
        teacherNotes: teacherNotes || null,
        kelancaran: kelancaran || "Baik",
        pemahaman: pemahaman || "Baik",
        pelafalan: pelafalan || "Baik",
      },
      include: { readingLevel: true, student: { select: { studentName: true, studentCode: true } } },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/reading-grades - Update reading assessment
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, readingLevelId, assessmentDate, teacherNotes, kelancaran, pemahaman, pelafalan } = body;

    if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });

    const updated = await prisma.readingGrade.update({
      where: { id },
      data: {
        ...(readingLevelId ? { readingLevelId } : {}),
        ...(assessmentDate ? { assessmentDate: new Date(assessmentDate) } : {}),
        ...(teacherNotes !== undefined ? { teacherNotes } : {}),
        ...(kelancaran ? { kelancaran } : {}),
        ...(pemahaman ? { pemahaman } : {}),
        ...(pelafalan ? { pelafalan } : {}),
      },
      include: { readingLevel: true, student: { select: { studentName: true, studentCode: true } } },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/reading-grades?id=xxx
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });
    await prisma.readingGrade.delete({ where: { id } });
    return NextResponse.json({ message: "Data penilaian berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
