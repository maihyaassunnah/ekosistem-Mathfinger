import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/journals - Fetch all teacher journals
export async function GET() {
  try {
    const journals = await prisma.teacherJournal.findMany({
      include: { branch: true },
      orderBy: { journalDate: "desc" },
    });

    const formatted = journals.map((j) => ({
      id: j.id,
      studentName: j.studentName || "Semua Siswa",
      className: j.className || "Kelas Reguler",
      branch: (j.branch?.branchName as "Singkut" | "Bangko") || "Singkut",
      topic: j.topic,
      content: j.content,
      teacher: j.teacherName,
      date: j.journalDate.toISOString().split("T")[0],
      refCode: j.refCode,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching journals:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/journals - Create new teacher journal
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentName, className, branch: branchName, topic, content, teacher, date } = body;

    if (!topic || !content) {
      return NextResponse.json({ error: "Topik dan materi jurnal wajib diisi" }, { status: 400 });
    }

    let branch = await prisma.branch.findFirst({
      where: { branchName: { contains: branchName || "Singkut", mode: "insensitive" } },
    });
    if (!branch) {
      branch = await prisma.branch.findFirst();
    }

    const refCode = `#${Math.random().toString(16).substring(2, 8)}`;
    const journalDate = date ? new Date(date) : new Date();

    const created = await prisma.teacherJournal.create({
      data: {
        branchId: branch!.id,
        studentName: studentName || "Semua Siswa",
        className: className || "Kelas Reguler",
        teacherName: teacher || "Tutor",
        topic,
        content,
        journalDate,
        refCode,
      },
      include: { branch: true },
    });

    return NextResponse.json(
      {
        id: created.id,
        studentName: created.studentName,
        className: created.className,
        branch: created.branch?.branchName || "Singkut",
        topic: created.topic,
        content: created.content,
        teacher: created.teacherName,
        date: created.journalDate.toISOString().split("T")[0],
        refCode: created.refCode,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating journal:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/journals - Delete journal
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID jurnal diperlukan" }, { status: 400 });
    }

    await prisma.teacherJournal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting journal:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
