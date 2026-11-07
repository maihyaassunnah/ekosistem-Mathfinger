import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

// Helper to get normalized UTC date range for a date string (YYYY-MM-DD)
function getDateRange(dateInput: string | Date | undefined) {
  if (!dateInput) {
    const now = new Date();
    return { startOfDay: now, endOfDay: now, cleanDate: now };
  }
  const dateStr = dateInput instanceof Date ? dateInput.toISOString().split("T")[0] : String(dateInput).split("T")[0];
  const startOfDay = new Date(`${dateStr}T00:00:00.000Z`);
  const endOfDay = new Date(`${dateStr}T23:59:59.999Z`);
  return { startOfDay, endOfDay, cleanDate: startOfDay };
}

// GET /api/grades - Fetch all student grades
export async function GET(req: Request) {
  try {
    const { error, session } = await requireAuth();
    if (error || !session) return error;

    const user = session.user as any;
    const isSuperAdmin = user?.role === "SUPER_ADMIN" || user?.role === "Super Admin";
    const branchId = user?.branchId;

    const { searchParams } = new URL(req.url);
    const branchParam = searchParams.get("branch");

    let whereClause: any = {};

    if (!isSuperAdmin && branchId) {
      whereClause.branchId = branchId;
    } else if (branchParam && branchParam !== "ALL") {
      const branchObj = await prisma.branch.findFirst({
        where: {
          OR: [
            { branchName: { equals: branchParam, mode: "insensitive" } },
            { branchCode: { equals: branchParam, mode: "insensitive" } },
          ],
        },
      });
      if (branchObj) {
        whereClause.branchId = branchObj.id;
      }
    }

    const grades = await prisma.studentGrade.findMany({
      where: whereClause,
      include: {
        student: {
          include: { branch: true },
        },
        branch: true,
      },
      orderBy: { examDate: "desc" },
    });

    const formatted = grades.map((g) => ({
      id: g.id,
      studentId: g.studentId,
      studentCode: g.student?.studentCode || "",
      studentName: g.student?.studentName || "Siswa",
      className: g.className || "Kelas Reguler",
      branch: g.branch?.branchName || g.student?.branch?.branchName || "Singkut",
      branchId: g.branchId,
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

      // Find student to verify and obtain authentic branchId
      let student = await prisma.student.findUnique({
        where: { id: studentId },
      });

      if (!student && item.studentCode) {
        student = await prisma.student.findUnique({
          where: { studentCode: item.studentCode },
        });
      }
      if (!student) continue;

      const branchId = student.branchId;
      const { startOfDay, endOfDay, cleanDate } = getDateRange(examDate);
      const numScore = score !== undefined && score !== "" ? Number(score) : 80;
      const cleanTopic = (topic || "Ujian Reguler").trim();

      // 1. Try finding existing by exact ID if valid
      let existingRecord = null;
      if (id && !id.startsWith("temp-") && !id.startsWith("gr-")) {
        existingRecord = await prisma.studentGrade.findUnique({ where: { id } });
      }

      // 2. If not matched by ID, match by studentId + topic + date range
      if (!existingRecord) {
        existingRecord = await prisma.studentGrade.findFirst({
          where: {
            studentId: student.id,
            topic: { equals: cleanTopic, mode: "insensitive" },
            examDate: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        });
      }

      if (existingRecord) {
        const updated = await prisma.studentGrade.update({
          where: { id: existingRecord.id },
          data: {
            className: className || existingRecord.className,
            topic: cleanTopic,
            examDate: cleanDate,
            score: numScore,
            notes: note !== undefined ? note : existingRecord.notes,
            isJoined: isJoined !== undefined ? isJoined : existingRecord.isJoined,
          },
        });
        results.push(updated);
      } else {
        const created = await prisma.studentGrade.create({
          data: {
            ...(id && !id.startsWith("temp-") && !id.startsWith("gr-") ? { id } : {}),
            studentId: student.id,
            branchId,
            className: className || student.className || "Kelas Reguler",
            topic: cleanTopic,
            examDate: cleanDate,
            score: numScore,
            notes: note || "",
            isJoined: isJoined !== undefined ? isJoined : true,
          },
        });
        results.push(created);
      }
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error: any) {
    console.error("Error saving grades:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/grades - Update single grade OR rename session
export async function PUT(req: Request) {
  try {
    const { error, session } = await requireAuth();
    if (error || !session) return error;

    const body = await req.json();

    // Case 1: Session Rename ({ oldTopic, oldExamDate, newTopic, newExamDate })
    if (body.oldTopic && body.newTopic) {
      const { oldTopic, oldExamDate, newTopic, newExamDate } = body;
      const { startOfDay, endOfDay } = getDateRange(oldExamDate);
      const { cleanDate: targetDate } = getDateRange(newExamDate || oldExamDate);

      const updated = await prisma.studentGrade.updateMany({
        where: {
          topic: { equals: oldTopic.trim(), mode: "insensitive" },
          examDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        data: {
          topic: newTopic.trim(),
          examDate: targetDate,
        },
      });

      return NextResponse.json({ success: true, count: updated.count });
    }

    // Case 2: Single Grade Update ({ id, studentId, studentCode, topic, examDate, score, note, isJoined, className })
    const { id, studentId, studentCode, topic, examDate, score, note, isJoined, className } = body;

    let student = null;
    if (studentId) {
      student = await prisma.student.findUnique({ where: { id: studentId } });
    }
    if (!student && studentCode) {
      student = await prisma.student.findUnique({ where: { studentCode } });
    }

    const { startOfDay, endOfDay, cleanDate } = getDateRange(examDate);
    const numScore = score !== undefined && score !== "" ? Number(score) : 80;
    const cleanTopic = (topic || "Ujian Reguler").trim();

    // Check if record exists by ID
    let existingRecord = null;
    if (id && !id.startsWith("temp-") && !id.startsWith("gr-")) {
      existingRecord = await prisma.studentGrade.findUnique({
        where: { id },
        include: { student: true, branch: true },
      });
    }

    // If not found by ID, look up by studentId + topic + date range
    if (!existingRecord && student) {
      existingRecord = await prisma.studentGrade.findFirst({
        where: {
          studentId: student.id,
          topic: { equals: cleanTopic, mode: "insensitive" },
          examDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        include: { student: true, branch: true },
      });
    }

    if (existingRecord) {
      const updated = await prisma.studentGrade.update({
        where: { id: existingRecord.id },
        data: {
          score: numScore,
          notes: note !== undefined ? note : existingRecord.notes,
          isJoined: isJoined !== undefined ? isJoined : existingRecord.isJoined,
          className: className || existingRecord.className,
          topic: cleanTopic,
          examDate: examDate ? cleanDate : existingRecord.examDate,
        },
        include: {
          student: { include: { branch: true } },
          branch: true,
        },
      });

      return NextResponse.json({
        id: updated.id,
        studentId: updated.studentId,
        studentCode: updated.student?.studentCode || "",
        studentName: updated.student?.studentName || "Siswa",
        className: updated.className || "Kelas Reguler",
        branch: updated.branch?.branchName || updated.student?.branch?.branchName || "Singkut",
        branchId: updated.branchId,
        topic: updated.topic,
        examDate: updated.examDate.toISOString().split("T")[0],
        score: Number(updated.score),
        note: updated.notes || "",
        isJoined: updated.isJoined,
      });
    } else {
      if (!student) {
        return NextResponse.json({ error: "Siswa tidak ditemukan" }, { status: 404 });
      }

      const created = await prisma.studentGrade.create({
        data: {
          ...(id && !id.startsWith("temp-") && !id.startsWith("gr-") ? { id } : {}),
          studentId: student.id,
          branchId: student.branchId,
          className: className || student.className || "Kelas Reguler",
          topic: cleanTopic,
          examDate: cleanDate,
          score: numScore,
          notes: note || "",
          isJoined: isJoined !== undefined ? isJoined : true,
        },
        include: {
          student: { include: { branch: true } },
          branch: true,
        },
      });

      return NextResponse.json({
        id: created.id,
        studentId: created.studentId,
        studentCode: created.student?.studentCode || "",
        studentName: created.student?.studentName || "Siswa",
        className: created.className || "Kelas Reguler",
        branch: created.branch?.branchName || created.student?.branch?.branchName || "Singkut",
        branchId: created.branchId,
        topic: created.topic,
        examDate: created.examDate.toISOString().split("T")[0],
        score: Number(created.score),
        note: created.notes || "",
        isJoined: created.isJoined,
      }, { status: 201 });
    }
  } catch (error: any) {
    console.error("Error updating grade in PostgreSQL:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/grades - Delete single grade or whole session
export async function DELETE(req: Request) {
  try {
    const { error, session } = await requireAuth();
    if (error || !session) return error;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const topic = searchParams.get("topic");
    const examDate = searchParams.get("examDate");

    // Case 1: Delete by id
    if (id) {
      await prisma.studentGrade.deleteMany({
        where: { id },
      });
      return NextResponse.json({ success: true });
    }

    // Case 2: Delete entire session by topic & examDate
    if (topic && examDate) {
      const { startOfDay, endOfDay } = getDateRange(examDate);

      const deleted = await prisma.studentGrade.deleteMany({
        where: {
          topic: { equals: topic.trim(), mode: "insensitive" },
          examDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });
      return NextResponse.json({ success: true, count: deleted.count });
    }

    return NextResponse.json({ error: "Parameter id atau topic & examDate diperlukan" }, { status: 400 });
  } catch (error: any) {
    console.error("Error deleting grade:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
