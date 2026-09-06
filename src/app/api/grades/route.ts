import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/grades - Fetch all student grades
export async function GET() {
  try {
    const grades = await prisma.studentGrade.findMany({
      include: {
        student: true,
        branch: true,
      },
      orderBy: { examDate: "desc" },
    });

    const formatted = grades.map((g) => ({
      id: g.id,
      studentId: g.studentId,
      studentName: g.student?.studentName || "Siswa",
      className: g.className || "Kelas Reguler",
      topic: g.topic,
      examDate: g.examDate.toISOString().split("T")[0],
      score: Number(g.score),
      note: g.notes || "",
      isJoined: g.isJoined,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching grades:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/grades - Batch or single save grades
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = Array.isArray(body) ? body : [body];

    const results = [];

    for (const item of items) {
      const { id, studentId, className, topic, examDate, score, note, isJoined } = item;

      // Find student to verify and obtain branchId
      let student = await prisma.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        // Try fallback find first student
        student = await prisma.student.findFirst();
        if (!student) continue;
      }

      const dateObj = examDate ? new Date(examDate) : new Date();

      // If id exists and is not temp (starts with 'gr-' or valid uuid), attempt upsert
      if (id && !id.startsWith("gr-")) {
        const existing = await prisma.studentGrade.findUnique({ where: { id } });
        if (existing) {
          const updated = await prisma.studentGrade.update({
            where: { id },
            data: {
              className: className || existing.className,
              topic: topic || existing.topic,
              examDate: dateObj,
              score: score !== undefined ? Number(score) : existing.score,
              notes: note !== undefined ? note : existing.notes,
              isJoined: isJoined !== undefined ? isJoined : existing.isJoined,
            },
            include: { student: true },
          });
          results.push({
            id: updated.id,
            studentId: updated.studentId,
            studentName: updated.student.studentName,
            className: updated.className,
            topic: updated.topic,
            examDate: updated.examDate.toISOString().split("T")[0],
            score: Number(updated.score),
            note: updated.notes || "",
            isJoined: updated.isJoined,
          });
          continue;
        }
      }

      const created = await prisma.studentGrade.create({
        data: {
          studentId: student.id,
          branchId: student.branchId,
          className: className || "Kelas Reguler",
          topic: topic || "Ulangan Bab",
          examDate: dateObj,
          score: score !== undefined ? Number(score) : 0,
          notes: note || "",
          isJoined: isJoined !== undefined ? isJoined : true,
        },
        include: { student: true },
      });

      results.push({
        id: created.id,
        studentId: created.studentId,
        studentName: created.student.studentName,
        className: created.className,
        topic: created.topic,
        examDate: created.examDate.toISOString().split("T")[0],
        score: Number(created.score),
        note: created.notes || "",
        isJoined: created.isJoined,
      });
    }

    return NextResponse.json(Array.isArray(body) ? results : results[0]);
  } catch (error: any) {
    console.error("Error saving grades:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
