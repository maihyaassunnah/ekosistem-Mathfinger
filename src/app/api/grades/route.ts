import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

// GET /api/grades - Fetch all student grades
export async function GET() {
  try {
    const { error } = await requireAuth();
    if (error) return error;

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
    const { error } = await requireAuth();
    if (error) return error;

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

// PUT /api/grades - Update a grade or rename a test column session
export async function PUT(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const body = await req.json();
    const { id, studentId, topic, examDate, score, note, isJoined, oldTopic, oldExamDate, newTopic, newExamDate } = body;

    // Case A: Batch rename a test session column (topic and/or examDate)
    if (oldTopic && oldExamDate) {
      const oldDateObj = new Date(oldExamDate);
      const updateData: any = {};
      if (newTopic) updateData.topic = newTopic;
      if (newExamDate) updateData.examDate = new Date(newExamDate);

      const updatedBatch = await prisma.studentGrade.updateMany({
        where: {
          topic: oldTopic,
          examDate: oldDateObj,
        },
        data: updateData,
      });

      return NextResponse.json({ success: true, count: updatedBatch.count });
    }

    // Case B: Update by id
    if (id && !id.startsWith("gr-")) {
      const updated = await prisma.studentGrade.update({
        where: { id },
        data: {
          score: score !== undefined ? Number(score) : undefined,
          notes: note !== undefined ? note : undefined,
          topic: topic || undefined,
          examDate: examDate ? new Date(examDate) : undefined,
          isJoined: isJoined !== undefined ? isJoined : undefined,
        },
        include: { student: true },
      });

      return NextResponse.json({
        id: updated.id,
        studentId: updated.studentId,
        studentName: updated.student?.studentName,
        className: updated.className,
        topic: updated.topic,
        examDate: updated.examDate.toISOString().split("T")[0],
        score: Number(updated.score),
        note: updated.notes || "",
        isJoined: updated.isJoined,
      });
    }

    // Case C: Upsert by studentId + topic + examDate
    if (studentId && topic && examDate) {
      const dateObj = new Date(examDate);
      const existing = await prisma.studentGrade.findFirst({
        where: {
          studentId,
          topic,
          examDate: dateObj,
        },
        include: { student: true },
      });

      if (existing) {
        const updated = await prisma.studentGrade.update({
          where: { id: existing.id },
          data: {
            score: score !== undefined ? Number(score) : existing.score,
            notes: note !== undefined ? note : existing.notes,
            isJoined: isJoined !== undefined ? isJoined : existing.isJoined,
          },
          include: { student: true },
        });

        return NextResponse.json({
          id: updated.id,
          studentId: updated.studentId,
          studentName: updated.student?.studentName,
          className: updated.className,
          topic: updated.topic,
          examDate: updated.examDate.toISOString().split("T")[0],
          score: Number(updated.score),
          note: updated.notes || "",
          isJoined: updated.isJoined,
        });
      } else {
        const student = await prisma.student.findUnique({ where: { id: studentId } });
        if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

        const created = await prisma.studentGrade.create({
          data: {
            studentId: student.id,
            branchId: student.branchId,
            className: student.className || "Kelas Reguler",
            topic,
            examDate: dateObj,
            score: score !== undefined ? Number(score) : 0,
            notes: note || "",
            isJoined: isJoined !== undefined ? isJoined : true,
          },
          include: { student: true },
        });

        return NextResponse.json({
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
    }

    return NextResponse.json({ error: "Invalid payload for grade update" }, { status: 400 });
  } catch (error: any) {
    console.error("Error updating grade:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/grades - Delete a grade or entire test column session
export async function DELETE(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const topic = searchParams.get("topic");
    const examDate = searchParams.get("examDate");

    // Case A: Delete entire session column
    if (topic && examDate) {
      const dateObj = new Date(examDate);
      const deletedBatch = await prisma.studentGrade.deleteMany({
        where: {
          topic,
          examDate: dateObj,
        },
      });

      return NextResponse.json({ success: true, count: deletedBatch.count });
    }

    // Case B: Delete single grade by id
    if (id) {
      await prisma.studentGrade.delete({
        where: { id },
      });

      return NextResponse.json({ success: true, id });
    }

    return NextResponse.json({ error: "Missing id or topic+examDate parameters" }, { status: 400 });
  } catch (error: any) {
    console.error("Error deleting grade:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

