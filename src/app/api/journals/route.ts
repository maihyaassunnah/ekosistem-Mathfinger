import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

// GET /api/journals - Fetch all teacher journals
export async function GET(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const program = searchParams.get("program");
    const branch = searchParams.get("branch");

    const whereClause: any = {};
    if (program) {
      whereClause.programType = program.toUpperCase() === "MEMBACA" ? "MEMBACA" : "MATEMATIKA";
    }
    if (branch && branch !== "ALL") {
      whereClause.branch = { branchName: { contains: branch, mode: "insensitive" } };
    }

    const journals = await prisma.teacherJournal.findMany({
      where: whereClause,
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
      programType: j.programType,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching journals:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/journals - Create new teacher journal
// POST /api/journals - Create new teacher journal (supports single or bulk)
export async function POST(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const body = await req.json();
    const {
      studentName,
      studentNames,
      students: rawStudents,
      journals: rawJournals,
      className,
      branch: branchName,
      topic,
      content,
      teacher,
      date,
      programType: rawProgramType,
    } = body;

    const generateRefCode = () => `#${Math.random().toString(16).substring(2, 8)}`;
    const journalDate = date ? new Date(date) : new Date();

    // Find branch
    let branch = await prisma.branch.findFirst({
      where: { branchName: { contains: branchName || "Singkut", mode: "insensitive" } },
    });
    if (!branch) {
      branch = await prisma.branch.findFirst();
    }

    // Case 1: Bulk journals array provided
    if (Array.isArray(rawJournals) && rawJournals.length > 0) {
      const createdList = [];
      for (const item of rawJournals) {
        if (!item.topic || !item.content) continue;

        let itemBranch = branch;
        if (item.branch) {
          const found = await prisma.branch.findFirst({
            where: { branchName: { contains: item.branch, mode: "insensitive" } },
          });
          if (found) itemBranch = found;
        }

        const pType = (
          item.programType ||
          (item.className?.toLowerCase().includes("membaca") ? "MEMBACA" : "MATEMATIKA")
        ).toUpperCase() === "MEMBACA"
          ? "MEMBACA"
          : "MATEMATIKA";

        const itemDate = item.date ? new Date(item.date) : new Date();

        const created = await prisma.teacherJournal.create({
          data: {
            branchId: itemBranch!.id,
            studentId: item.studentId || null,
            studentName: item.studentName || "Semua Siswa",
            className: item.className || "Kelas Reguler",
            teacherName: item.teacher || "Tutor",
            topic: item.topic,
            content: item.content,
            journalDate: itemDate,
            refCode: generateRefCode(),
            programType: pType,
          },
          include: { branch: true },
        });

        createdList.push({
          id: created.id,
          studentName: created.studentName,
          className: created.className,
          branch: created.branch?.branchName || "Singkut",
          topic: created.topic,
          content: created.content,
          teacher: created.teacherName,
          date: created.journalDate.toISOString().split("T")[0],
          refCode: created.refCode,
          programType: created.programType,
        });
      }

      return NextResponse.json(createdList, { status: 201 });
    }

    // Case 2: Array of studentNames or students objects provided
    const targetStudents: { id?: string; name: string }[] = [];
    if (Array.isArray(rawStudents) && rawStudents.length > 0) {
      targetStudents.push(
        ...rawStudents.map((s: any) =>
          typeof s === "string" ? { name: s } : { id: s.id, name: s.name || s.studentName }
        )
      );
    } else if (Array.isArray(studentNames) && studentNames.length > 0) {
      targetStudents.push(...studentNames.map((name: string) => ({ name })));
    }

    if (targetStudents.length > 0) {
      if (!topic || !content) {
        return NextResponse.json({ error: "Topik dan materi jurnal wajib diisi" }, { status: 400 });
      }

      const programType = (
        rawProgramType || (className?.toLowerCase().includes("membaca") ? "MEMBACA" : "MATEMATIKA")
      ).toUpperCase() === "MEMBACA"
        ? "MEMBACA"
        : "MATEMATIKA";

      const createdList = [];
      for (const st of targetStudents) {
        let studentId = st.id || null;
        if (!studentId && st.name) {
          const foundStudent = await prisma.student.findFirst({
            where: { studentName: { contains: st.name, mode: "insensitive" } },
          });
          if (foundStudent) studentId = foundStudent.id;
        }

        const created = await prisma.teacherJournal.create({
          data: {
            branchId: branch!.id,
            studentId,
            studentName: st.name || "Semua Siswa",
            className: className || "Kelas Reguler",
            teacherName: teacher || "Tutor",
            topic,
            content,
            journalDate,
            refCode: generateRefCode(),
            programType,
          },
          include: { branch: true },
        });

        createdList.push({
          id: created.id,
          studentName: created.studentName,
          className: created.className,
          branch: created.branch?.branchName || "Singkut",
          topic: created.topic,
          content: created.content,
          teacher: created.teacherName,
          date: created.journalDate.toISOString().split("T")[0],
          refCode: created.refCode,
          programType: created.programType,
        });
      }

      return NextResponse.json(createdList, { status: 201 });
    }

    // Case 3: Single student creation (backward compatibility)
    if (!topic || !content) {
      return NextResponse.json({ error: "Topik dan materi jurnal wajib diisi" }, { status: 400 });
    }

    const programType = (
      rawProgramType || (className?.toLowerCase().includes("membaca") ? "MEMBACA" : "MATEMATIKA")
    ).toUpperCase() === "MEMBACA"
      ? "MEMBACA"
      : "MATEMATIKA";

    const refCode = generateRefCode();

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
        programType,
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
        programType: created.programType,
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
    const { error } = await requireAuth();
    if (error) return error;

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
