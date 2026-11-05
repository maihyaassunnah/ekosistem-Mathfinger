import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

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

      // Find student to verify and obtain branchId
      let student = await prisma.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        // Fallback search by studentCode
        if (item.studentCode) {
          student = await prisma.student.findUnique({
            where: { studentCode: item.studentCode },
          });
        }
        if (!student) continue;
      }

      const branchId = student.branchId;

      if (id && !id.startsWith("temp-") && !id.startsWith("gr-")) {
        // Upsert by ID
        const existing = await prisma.studentGrade.findUnique({ where: { id } });
        if (existing) {
          const updated = await prisma.studentGrade.update({
            where: { id },
            data: {
              className: className || existing.className,
              topic: topic || existing.topic,
              examDate: examDate ? new Date(examDate) : existing.examDate,
              score: score !== undefined && score !== "" ? Number(score) : existing.score,
              notes: note !== undefined ? note : existing.notes,
              isJoined: isJoined !== undefined ? isJoined : existing.isJoined,
            },
          });
          results.push(updated);
          continue;
        }
      }

      // Check if already exists by studentId + examDate + topic
      const existingRecord = await prisma.studentGrade.findFirst({
        where: {
          studentId: student.id,
          topic,
          examDate: new Date(examDate),
        },
      });

      if (existingRecord) {
        const updated = await prisma.studentGrade.update({
          where: { id: existingRecord.id },
          data: {
            className: className || existingRecord.className,
            score: score !== undefined && score !== "" ? Number(score) : existingRecord.score,
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
            topic,
            examDate: new Date(examDate),
            score: score !== undefined && score !== "" ? Number(score) : 80,
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
