import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/attendances - Fetch recent attendances
export async function GET() {
  try {
    const attendances = await prisma.attendance.findMany({
      include: {
        student: true,
        branch: true,
        tutor: true,
      },
      orderBy: { attendanceDate: "desc" },
      take: 50,
    });

    return NextResponse.json(attendances);
  } catch (error: any) {
    console.error("Error fetching attendances:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/attendances - Record attendance (QR or manual)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, studentCode, qrIdentifier, method, status, notes } = body;

    // Find student by id, studentCode, or qrIdentifier
    let student = null;
    if (studentId) {
      student = await prisma.student.findUnique({ where: { id: studentId } });
    }
    if (!student && studentCode) {
      student = await prisma.student.findUnique({ where: { studentCode } });
    }
    if (!student && qrIdentifier) {
      student = await prisma.student.findUnique({ where: { qrIdentifier } });
    }

    if (!student) {
      return NextResponse.json({ error: "Siswa tidak ditemukan" }, { status: 404 });
    }

    // Default tutor
    const tutor = await prisma.user.findFirst({ where: { role: "TUTOR" } });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await prisma.attendance.upsert({
      where: {
        studentId_attendanceDate: {
          studentId: student.id,
          attendanceDate: today,
        },
      },
      update: {
        status: status || "HADIR",
        method: method || "QR_SCAN",
        notes: notes || "Presensi tercatat",
      },
      create: {
        studentId: student.id,
        branchId: student.branchId,
        tutorId: tutor ? tutor.id : student.branchId, // fallback
        attendanceDate: today,
        method: method || "QR_SCAN",
        status: status || "HADIR",
        notes: notes || "Presensi otomatis sistem",
      },
      include: {
        student: true,
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error: any) {
    console.error("Error recording attendance:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
