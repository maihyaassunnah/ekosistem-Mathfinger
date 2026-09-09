import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

// GET /api/behaviors - Ambil riwayat penilaian keaktifan siswa
export async function GET(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const className = searchParams.get("className");
    const date = searchParams.get("date");
    const studentId = searchParams.get("studentId");
    const programType = searchParams.get("programType");

    const where: any = {};
    if (className && className !== "ALL") {
      where.className = className;
    }
    if (studentId) {
      where.studentId = studentId;
    }
    if (programType) {
      where.programType = programType;
    }
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      where.behaviorDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const behaviors = await prisma.studentBehavior.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            studentName: true,
            studentCode: true,
            className: true,
            parentName: true,
            branch: { select: { branchName: true } },
          },
        },
      },
      orderBy: { behaviorDate: "desc" },
      take: 200,
    });

    const formatted = behaviors.map((b) => ({
      id: b.id,
      studentId: b.studentId,
      studentName: b.student?.studentName || "Siswa",
      studentCode: b.student?.studentCode || "",
      className: b.className || b.student?.className || "-",
      tutorName: b.tutorName || "Tutor",
      date: b.behaviorDate.toISOString().split("T")[0],
      sessionTopic: b.sessionTopic,
      focus: b.focus,
      participation: b.participation,
      attitude: b.attitude,
      note: b.notes || "",
      programType: b.programType,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching behaviors:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/behaviors - Simpan penilaian (Single / Batch untuk Satu Kelas)
export async function POST(req: Request) {
  try {
    const { session, error } = await requireAuth();
    if (error) return error;

    const body = await req.json();

    // Dukung batch saving (array of entries) atau single entry
    const entries: any[] = Array.isArray(body.entries)
      ? body.entries
      : Array.isArray(body)
      ? body
      : [body];

    if (entries.length === 0) {
      return NextResponse.json({ error: "Tidak ada data yang dikirim" }, { status: 400 });
    }

    const commonTopic = body.sessionTopic || body.topic || "Observasi Keaktifan & Karakter Siswa";
    const commonDate = body.date ? new Date(body.date) : new Date();
    const commonTutor = body.tutorName || (session?.user?.name ?? "Tutor Math Fingers");
    const commonProgram = body.programType || "MATEMATIKA";

    const savedResults = [];

    for (const item of entries) {
      const targetStudentId = item.studentId;
      if (!targetStudentId) continue;

      const student = await prisma.student.findUnique({
        where: { id: targetStudentId },
        select: { id: true, branchId: true, className: true, studentName: true },
      });

      if (!student) continue;

      const behaviorDate = item.date ? new Date(item.date) : commonDate;
      const startOfDay = new Date(behaviorDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(behaviorDate);
      endOfDay.setHours(23, 59, 59, 999);

      const focusVal = item.focus || "A";
      const partVal = item.participation || "A";
      const attVal = item.attitude || "A";
      const noteVal = item.note !== undefined ? item.note : item.notes || "";
      const topicVal = item.sessionTopic || commonTopic;
      const classNameVal = item.className || student.className || "-";
      const tutorVal = item.tutorName || commonTutor;
      const programVal = (item.programType || commonProgram) as any;

      // Cek apakah data untuk siswa ini di tanggal yang sama sudah ada (update jika ada)
      const existing = item.id && !item.id.startsWith("temp-")
        ? await prisma.studentBehavior.findUnique({ where: { id: item.id } })
        : await prisma.studentBehavior.findFirst({
            where: {
              studentId: student.id,
              behaviorDate: {
                gte: startOfDay,
                lte: endOfDay,
              },
            },
          });

      if (existing) {
        const updated = await prisma.studentBehavior.update({
          where: { id: existing.id },
          data: {
            className: classNameVal,
            tutorName: tutorVal,
            sessionTopic: topicVal,
            focus: focusVal,
            participation: partVal,
            attitude: attVal,
            notes: noteVal,
            programType: programVal,
            behaviorDate: behaviorDate,
          },
        });
        savedResults.push(updated);
      } else {
        const created = await prisma.studentBehavior.create({
          data: {
            studentId: student.id,
            branchId: student.branchId,
            className: classNameVal,
            tutorName: tutorVal,
            sessionTopic: topicVal,
            focus: focusVal,
            participation: partVal,
            attitude: attVal,
            notes: noteVal,
            programType: programVal,
            behaviorDate: behaviorDate,
          },
        });
        savedResults.push(created);
      }
    }

    return NextResponse.json({
      success: true,
      count: savedResults.length,
      data: savedResults,
    });
  } catch (error: any) {
    console.error("Error saving behavior records:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/behaviors - Hapus rekaman penilaian
export async function DELETE(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

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
    console.error("Error deleting behavior record:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
