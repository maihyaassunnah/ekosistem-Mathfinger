import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/attendances - Fetch attendances from database
export async function GET() {
  try {
    const attendances = await prisma.attendance.findMany({
      include: {
        student: true,
        branch: true,
        tutor: true,
      },
      orderBy: { attendanceDate: "desc" },
      take: 500,
    });

    const formatted = attendances.map((att) => {
      const dateStr = att.attendanceDate ? att.attendanceDate.toISOString().split("T")[0] : "";
      
      // Try to extract time from notes if formatted as "Waktu: HH:MM WIB"
      let recordedTime = "14:00 WIB";
      let cleanNote = att.notes || "";
      if (cleanNote.includes("Waktu: ")) {
        const match = cleanNote.match(/Waktu:\s*([^\n,]+)/);
        if (match) {
          recordedTime = match[1].trim();
        }
      }

      return {
        id: att.id,
        studentId: att.studentId,
        studentName: att.student?.studentName || "Siswa",
        studentCode: att.student?.studentCode || "-",
        className: att.student?.className || "-",
        branch: (att.branch?.branchName as "Singkut" | "Bangko") || "Singkut",
        date: dateStr,
        time: recordedTime,
        status: att.status === "ALPHA" ? "ABSEN" : att.status,
        method: att.method,
        note: cleanNote,
      };
    });

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching attendances:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper to resolve student and tutor
async function resolveStudent(item: any) {
  let student = null;
  if (item.studentId && !item.studentId.startsWith("att-") && !item.studentId.startsWith("st-")) {
    student = await prisma.student.findUnique({ where: { id: item.studentId } });
  }
  if (!student && item.studentCode && item.studentCode !== "-") {
    student = await prisma.student.findUnique({ where: { studentCode: item.studentCode } });
  }
  if (!student && item.qrIdentifier) {
    student = await prisma.student.findUnique({ where: { qrIdentifier: item.qrIdentifier } });
  }
  if (!student && item.studentName && item.studentName !== "Siswa") {
    student = await prisma.student.findFirst({
      where: { studentName: { equals: item.studentName, mode: "insensitive" } },
    });
  }

  // Fallback: If student not found in PostgreSQL (e.g. initial demo student), create record
  if (!student) {
    let branch = await prisma.branch.findFirst({
      where: {
        branchName: {
          contains: item.branch || "Singkut",
          mode: "insensitive",
        },
      },
    });
    if (!branch) {
      branch = await prisma.branch.findFirst();
    }

    let level = await prisma.level.findFirst();
    if (!level) {
      level = await prisma.level.create({
        data: {
          levelName: "Level Dasar: Pengenalan Simbol Jari",
          orderIndex: 1,
        },
      });
    }

    const code = item.studentCode && item.studentCode !== "-"
      ? item.studentCode
      : `ST-${Date.now().toString().slice(-5)}`;

    // Check if code already taken
    const existingCode = await prisma.student.findUnique({ where: { studentCode: code } });
    const finalCode = existingCode ? `ST-${Date.now().toString().slice(-5)}-${Math.floor(Math.random() * 100)}` : code;

    student = await prisma.student.create({
      data: {
        id: item.studentId && item.studentId.length === 36 ? item.studentId : undefined,
        studentCode: finalCode,
        qrIdentifier: `MF-QR-${finalCode}`,
        studentName: item.studentName || "Siswa",
        className: item.className || "-",
        gender: "L",
        birthPlace: "Singkut",
        birthDate: "2018-01-01",
        address: "Jl. Poros Singkut",
        parentName: "-",
        parentWhatsapp: "-",
        branchId: branch!.id,
        currentLevelId: level.id,
      },
    });
  }

  return student;
}

// POST /api/attendances - Record attendance (single or batch)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = Array.isArray(body) ? body : [body];

    if (items.length === 0) {
      return NextResponse.json({ message: "No attendance data provided" }, { status: 400 });
    }

    // Default user as tutor
    const defaultUser =
      (await prisma.user.findFirst({ where: { role: "TUTOR" } })) ||
      (await prisma.user.findFirst({ where: { role: "SUPER_ADMIN" } })) ||
      (await prisma.user.findFirst());

    if (!defaultUser) {
      return NextResponse.json({ error: "Tidak ada user sistem untuk menandatangani absensi" }, { status: 500 });
    }

    const results = [];

    for (const item of items) {
      const student = await resolveStudent(item);
      if (!student) continue;

      // Parse Date to UTC midnight
      let attDate: Date;
      if (item.date) {
        const cleanDate = item.date.includes("T") ? item.date.split("T")[0] : item.date;
        const parts = cleanDate.split("-").map(Number);
        if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
          attDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0));
        } else {
          attDate = new Date();
          attDate.setUTCHours(0, 0, 0, 0);
        }
      } else {
        attDate = new Date();
        attDate.setUTCHours(0, 0, 0, 0);
      }

      // Map status
      let mappedStatus: "HADIR" | "IZIN" | "SAKIT" | "ALPHA" = "HADIR";
      const upperStatus = (item.status || "HADIR").toUpperCase();
      if (upperStatus === "ABSEN" || upperStatus === "ALPHA") {
        mappedStatus = "ALPHA";
      } else if (upperStatus === "IZIN") {
        mappedStatus = "IZIN";
      } else if (upperStatus === "SAKIT") {
        mappedStatus = "SAKIT";
      } else {
        mappedStatus = "HADIR";
      }

      // Map method
      const mappedMethod: "QR_SCAN" | "MANUAL" = item.method === "QR_SCAN" ? "QR_SCAN" : "MANUAL";

      // Build note with time info if present
      let noteText = item.note || item.notes || "";
      if (item.time && !noteText.includes(item.time)) {
        noteText = noteText ? `${noteText} (${item.time})` : `Waktu: ${item.time}`;
      }

      const saved = await prisma.attendance.upsert({
        where: {
          studentId_attendanceDate: {
            studentId: student.id,
            attendanceDate: attDate,
          },
        },
        update: {
          status: mappedStatus,
          method: mappedMethod,
          notes: noteText,
          branchId: student.branchId,
        },
        create: {
          studentId: student.id,
          branchId: student.branchId,
          tutorId: defaultUser.id,
          attendanceDate: attDate,
          method: mappedMethod,
          status: mappedStatus,
          notes: noteText,
        },
        include: {
          student: true,
          branch: true,
        },
      });

      results.push(saved);
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      data: results,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error recording attendance in PostgreSQL:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/attendances - Update attendance record
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, studentId, date, status, note, method } = body;

    let targetId = id;

    if (!targetId && studentId && date) {
      const cleanDate = date.includes("T") ? date.split("T")[0] : date;
      const parts = cleanDate.split("-").map(Number);
      const attDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0));

      const found = await prisma.attendance.findUnique({
        where: {
          studentId_attendanceDate: {
            studentId,
            attendanceDate: attDate,
          },
        },
      });
      if (found) targetId = found.id;
    }

    if (!targetId || targetId.startsWith("att-")) {
      // If not in DB yet, forward to POST
      return POST(req);
    }

    let mappedStatus: "HADIR" | "IZIN" | "SAKIT" | "ALPHA" | undefined = undefined;
    if (status) {
      const s = status.toUpperCase();
      mappedStatus = s === "ABSEN" ? "ALPHA" : s;
    }

    const updated = await prisma.attendance.update({
      where: { id: targetId },
      data: {
        ...(mappedStatus && { status: mappedStatus }),
        ...(note !== undefined && { notes: note }),
        ...(method && { method: method === "QR_SCAN" ? "QR_SCAN" : "MANUAL" }),
      },
      include: { student: true, branch: true },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating attendance:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/attendances - Delete attendance record
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const studentId = searchParams.get("studentId");
    const date = searchParams.get("date");
    const key = searchParams.get("key"); // format: studentId_date

    let targetId = id;

    if (!targetId && key) {
      const [kStudentId, kDate] = key.split("_");
      if (kStudentId && kDate) {
        const parts = kDate.split("-").map(Number);
        const attDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0));
        const found = await prisma.attendance.findUnique({
          where: {
            studentId_attendanceDate: {
              studentId: kStudentId,
              attendanceDate: attDate,
            },
          },
        });
        if (found) targetId = found.id;
      }
    } else if (!targetId && studentId && date) {
      const parts = date.split("-").map(Number);
      const attDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0));
      const found = await prisma.attendance.findUnique({
        where: {
          studentId_attendanceDate: {
            studentId,
            attendanceDate: attDate,
          },
        },
      });
      if (found) targetId = found.id;
    }

    if (targetId && !targetId.startsWith("att-")) {
      await prisma.attendance.delete({ where: { id: targetId } });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting attendance:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
