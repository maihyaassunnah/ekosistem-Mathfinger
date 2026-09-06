import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/behaviors - Get all student behaviors/keaktifan records
export async function GET() {
  try {
    const behaviors = await prisma.studentBehavior.findMany({
      include: {
        student: true,
      },
      orderBy: { behaviorDate: "desc" },
    });

    const formatted = behaviors.map((b) => ({
      id: b.id,
      studentId: b.studentId,
      studentName: b.student?.studentName || "Siswa",
      date: b.behaviorDate.toISOString().split("T")[0],
      sessionTopic: b.sessionTopic,
      focus: b.focus,
      participation: b.participation, // e.g. "Akurasi: 95%" or accuracy value
      attitude: b.attitude,           // e.g. "Kecepatan: 1.8s/soal" or speed value
      note: b.notes || "",
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching behaviors:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/behaviors - Create or update behavior/keaktifan record for a student
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, studentId, date, sessionTopic, focus, participation, attitude, note } = body;

    let student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      student = await prisma.student.findFirst();
      if (!student) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 });
      }
    }

    const dateObj = date ? new Date(date) : new Date();

    // If existing id passed
    if (id && !id.startsWith("beh-")) {
      const existing = await prisma.studentBehavior.findUnique({ where: { id } });
      if (existing) {
        const updated = await prisma.studentBehavior.update({
          where: { id },
          data: {
            behaviorDate: dateObj,
            sessionTopic: sessionTopic || existing.sessionTopic,
            focus: focus || existing.focus,
            participation: participation || existing.participation,
            attitude: attitude || existing.attitude,
            notes: note !== undefined ? note : existing.notes,
          },
          include: { student: true },
        });

        return NextResponse.json({
          id: updated.id,
          studentId: updated.studentId,
          studentName: updated.student?.studentName,
          date: updated.behaviorDate.toISOString().split("T")[0],
          sessionTopic: updated.sessionTopic,
          focus: updated.focus,
          participation: updated.participation,
          attitude: updated.attitude,
          note: updated.notes || "",
        });
      }
    }

    // Check if there's an existing record for this student on the same date or topic
    const existingForStudent = await prisma.studentBehavior.findFirst({
      where: {
        studentId: student.id,
      },
      orderBy: { behaviorDate: "desc" },
    });

    if (existingForStudent) {
      const updated = await prisma.studentBehavior.update({
        where: { id: existingForStudent.id },
        data: {
          behaviorDate: dateObj,
          sessionTopic: sessionTopic || existingForStudent.sessionTopic,
          focus: focus || existingForStudent.focus,
          participation: participation || existingForStudent.participation,
          attitude: attitude || existingForStudent.attitude,
          notes: note !== undefined ? note : existingForStudent.notes,
        },
        include: { student: true },
      });

      return NextResponse.json({
        id: updated.id,
        studentId: updated.studentId,
        studentName: updated.student?.studentName,
        date: updated.behaviorDate.toISOString().split("T")[0],
        sessionTopic: updated.sessionTopic,
        focus: updated.focus,
        participation: updated.participation,
        attitude: updated.attitude,
        note: updated.notes || "",
      });
    }

    const created = await prisma.studentBehavior.create({
      data: {
        studentId: student.id,
        branchId: student.branchId,
        behaviorDate: dateObj,
        sessionTopic: sessionTopic || "Observasi Keaktifan & Ketangkasan",
        focus: focus || "Sangat Tinggi",
        participation: participation || "95%",
        attitude: attitude || "1.8s",
        notes: note || "",
      },
      include: { student: true },
    });

    return NextResponse.json({
      id: created.id,
      studentId: created.studentId,
      studentName: created.student?.studentName,
      date: created.behaviorDate.toISOString().split("T")[0],
      sessionTopic: created.sessionTopic,
      focus: created.focus,
      participation: created.participation,
      attitude: created.attitude,
      note: created.notes || "",
    });
  } catch (error: any) {
    console.error("Error saving behavior:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/behaviors - Delete a behavior record
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    await prisma.studentBehavior.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting behavior:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
