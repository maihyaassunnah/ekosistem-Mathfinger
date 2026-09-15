import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

// Helper: Haversine distance in meters
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Helper: Build branch filter supporting aliases (Bangko, Tabir Timur, Singkut)
function buildBranchFilter(branchStr: string) {
  const clean = branchStr.replace(/^Cabang\s+/i, "").trim();
  const isBangkoOrTabir = /^(bangko|tabir|bgk)/i.test(clean);
  const isSingkut = /^(singkut|skt)/i.test(clean);

  if (isBangkoOrTabir) {
    return {
      OR: [
        { branchName: { contains: "Tabir", mode: "insensitive" as const } },
        { branchName: { contains: "Bangko", mode: "insensitive" as const } },
        { branchCode: { equals: "BGK", mode: "insensitive" as const } },
      ],
    };
  }

  if (isSingkut) {
    return {
      OR: [
        { branchName: { contains: "Singkut", mode: "insensitive" as const } },
        { branchCode: { equals: "SKT", mode: "insensitive" as const } },
      ],
    };
  }

  return {
    OR: [
      { branchName: { contains: clean, mode: "insensitive" as const } },
      { branchCode: { contains: clean, mode: "insensitive" as const } },
    ],
  };
}

// GET /api/tutor-attendance - List tutor attendances
export async function GET(req: Request) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const authUser = session?.user as any;
    const { searchParams } = new URL(req.url);
    let branch = searchParams.get("branch");
    const date = searchParams.get("date");
    const month = searchParams.get("month"); // format: YYYY-MM
    const userId = searchParams.get("userId");

    // Auto-scope for branch admin if branch query is ALL or missing
    if ((!branch || branch === "ALL") && authUser?.role === "BRANCH_ADMIN" && authUser?.branchName) {
      branch = authUser.branchName.replace(/^Cabang\s+/i, "").trim();
    }

    const whereClause: any = {};

    if (branch && branch !== "ALL") {
      whereClause.branch = buildBranchFilter(branch);
    }

    if (userId) {
      whereClause.userId = userId;
    } else if (
      authUser &&
      (authUser.role === "TUTOR" || authUser.role === "BRANCH_ASSISTANT") &&
      authUser.id &&
      !searchParams.has("all")
    ) {
      // Tutor and Assistant default to their own attendance records
      whereClause.userId = authUser.id;
    }

    if (date) {
      const parts = date.split("-").map(Number);
      if (parts.length === 3) {
        const startDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0));
        const endDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 23, 59, 59, 999));
        whereClause.attendanceDate = {
          gte: startDate,
          lte: endDate,
        };
      }
    } else if (month) {
      const parts = month.split("-").map(Number);
      if (parts.length === 2) {
        const startOfMonth = new Date(Date.UTC(parts[0], parts[1] - 1, 1, 0, 0, 0, 0));
        const endOfMonth = new Date(Date.UTC(parts[0], parts[1], 0, 23, 59, 59, 999));
        whereClause.attendanceDate = {
          gte: startOfMonth,
          lte: endOfMonth,
        };
      }
    }

    const records = await prisma.tutorAttendance.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            avatarUrl: true,
          },
        },
        branch: {
          select: {
            id: true,
            branchName: true,
            branchCode: true,
          },
        },
      },
      orderBy: { attendanceDate: "desc" },
    });

    const formatted = records.map((r) => ({
      id: r.id,
      userId: r.userId,
      tutorName: r.user?.fullName || "Tutor",
      tutorEmail: r.user?.email || "-",
      tutorRole: r.user?.role || "TUTOR",
      avatarUrl: r.user?.avatarUrl || "",
      branchId: r.branchId,
      branchName: r.branch?.branchName || "Singkut",
      date: r.attendanceDate.toISOString().split("T")[0],
      checkInTime: r.checkInTime,
      checkOutTime: r.checkOutTime || "-",
      status: r.status,
      lateMinutes: (r as any).lateMinutes ?? 0,
      earlyLeaveMinutes: (r as any).earlyLeaveMinutes ?? 0,
      latitude: r.latitude,
      longitude: r.longitude,
      distanceMeter: r.distanceMeter,
      isLocationValid: r.isLocationValid,
      notes: r.notes || "",
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching tutor attendances:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/tutor-attendance - Record scan attendance with GPS geofencing
export async function POST(req: Request) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const authUser = session?.user as any;
    const body = await req.json();
    const { qrData, latitude, longitude, userId: targetUserId, notes, isCheckOut } = body;

    // 1. Resolve User
    let userId = targetUserId || authUser?.id;
    let userRecord = null;
    if (userId) {
      userRecord = await prisma.user.findUnique({ where: { id: userId } });
    }
    if (!userRecord && authUser?.email) {
      userRecord = await prisma.user.findUnique({ where: { email: authUser.email } });
    }
    if (!userRecord) {
      userRecord = await prisma.user.findFirst({
        where: { role: { in: ["TUTOR", "BRANCH_ASSISTANT", "BRANCH_ADMIN"] } },
      });
    }

    if (!userRecord) {
      return NextResponse.json({ error: "Akun tutor/asisten tidak ditemukan" }, { status: 404 });
    }

    // 2. Parse & Validate QR Data
    let parsedQr: any = null;
    try {
      parsedQr = typeof qrData === "string" ? JSON.parse(qrData) : qrData;
    } catch {
      // If plain string secret
      parsedQr = { secret: qrData };
    }

    // Find branch by QR secret or branchId in payload
    let branch = null;
    if (parsedQr?.branchId) {
      branch = await prisma.branch.findUnique({
        where: { id: parsedQr.branchId },
        include: { setting: true },
      });
    } else if (parsedQr?.secret) {
      const setting = await prisma.branchSetting.findFirst({
        where: { qrSecret: parsedQr.secret },
        include: { branch: true },
      });
      if (setting?.branch) {
        branch = { ...setting.branch, setting };
      }
    }

    // Fallback: match QR branch name/code if specified
    if (!branch && (parsedQr?.branchName || parsedQr?.branchCode)) {
      const branchTerm = parsedQr.branchName || parsedQr.branchCode;
      branch = await prisma.branch.findFirst({
        where: buildBranchFilter(branchTerm),
        include: { setting: true },
      });
    }

    // Fallback: match user branch
    if (!branch && userRecord.branchId) {
      branch = await prisma.branch.findUnique({
        where: { id: userRecord.branchId },
        include: { setting: true },
      });
    }
    if (!branch) {
      branch = await prisma.branch.findFirst({ include: { setting: true } });
    }

    if (!branch) {
      return NextResponse.json({ error: "QR Code Presensi Cabang tidak valid" }, { status: 400 });
    }

    // 3. Geofencing GPS Distance Calculation
    let distanceMeter: number | null = null;
    let isLocationValid = true;
    const branchLat = branch.setting?.latitude;
    const branchLon = branch.setting?.longitude;
    const maxRadius = branch.setting?.radiusMeters || 100;

    if (latitude !== undefined && longitude !== undefined && branchLat && branchLon) {
      distanceMeter = calculateDistance(Number(latitude), Number(longitude), branchLat, branchLon);

      if (distanceMeter > maxRadius) {
        isLocationValid = false;
        return NextResponse.json(
          {
            error: `Lokasi Anda berada di luar jangkauan cabang! Jarak Anda: ${distanceMeter} meter (Batas Maksimal: ${maxRadius} meter). Harap lakukan presensi di area cabang.`,
            distanceMeter,
            maxRadius,
            isLocationValid: false,
          },
          { status: 400 }
        );
      }
    }

    // 4. Determine Date & Time in WIB (Asia/Jakarta, UTC+7)
    const now = new Date();
    const wibDateParts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now).split("-").map(Number); // [YYYY, MM, DD]

    const todayMidnight = new Date(Date.UTC(wibDateParts[0], wibDateParts[1] - 1, wibDateParts[2], 0, 0, 0, 0));

    // Format live time string (HH:mm WIB) in Asia/Jakarta
    const timeFormatter = new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const currentTimeStr = `${timeFormatter.format(now).replace(".", ":")} WIB`;

    // Helper: parse "HH:mm" to minutes
    const parseTimeToMinutes = (timeStr?: string | null): number | null => {
      if (!timeStr) return null;
      const match = timeStr.match(/(\d{1,2})[:.](\d{1,2})/);
      if (!match) return null;
      return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
    };

    const currentWibMinutes = parseTimeToMinutes(currentTimeStr) ?? 0;

    // 5. Check if already checked in today
    const existingAttendance = await prisma.tutorAttendance.findUnique({
      where: {
        userId_attendanceDate: {
          userId: userRecord.id,
          attendanceDate: todayMidnight,
        },
      },
    });

    if (isCheckOut) {
      if (!existingAttendance) {
        return NextResponse.json(
          { error: "Anda belum melakukan presensi masuk hari ini." },
          { status: 400 }
        );
      }

      const workEndStr = branch.setting?.workEndTime || "17:00";
      const earlyLeaveTolerance = branch.setting?.earlyLeaveToleranceMinutes ?? 0;
      const workEndMinutes = parseTimeToMinutes(workEndStr) ?? 1020; // 17:00 default

      let isEarlyLeave = false;
      let earlyMinutes = 0;
      if (currentWibMinutes < workEndMinutes - earlyLeaveTolerance) {
        isEarlyLeave = true;
        earlyMinutes = workEndMinutes - currentWibMinutes;
      }

      let checkoutNote = notes ? `Pulang: ${notes.trim()}` : "";
      if (isEarlyLeave) {
        const earlyNote = `Pulang Awal ${earlyMinutes} mnt (Jadwal: ${workEndStr})`;
        checkoutNote = checkoutNote ? `${checkoutNote} | ${earlyNote}` : earlyNote;
      }

      const existingNotes = existingAttendance.notes || "";
      const combinedNotes = [existingNotes, checkoutNote].filter(Boolean).join(" | ");

      const updated = await prisma.tutorAttendance.update({
        where: { id: existingAttendance.id },
        data: {
          checkOutTime: currentTimeStr,
          notes: combinedNotes || undefined,
        },
        include: { user: true, branch: true },
      });

      if (isEarlyLeave && earlyMinutes > 0) {
        try {
          await prisma.$executeRawUnsafe(
            `UPDATE "tutor_attendances" SET "early_leave_minutes" = $1 WHERE "id" = $2`,
            earlyMinutes,
            existingAttendance.id
          );
        } catch (err) {
          console.warn("Error updating early_leave_minutes:", err);
        }
      }

      return NextResponse.json({
        success: true,
        isCheckOut: true,
        isEarlyLeave,
        earlyMinutes,
        message: isEarlyLeave
          ? `Presensi Pulang berhasil dicatat pada ${currentTimeStr} (Pulang lebih awal ${earlyMinutes} menit).`
          : `Presensi Pulang berhasil dicatat pada ${currentTimeStr}!`,
        attendance: updated,
        distanceMeter,
      });
    }

    // Check In
    const workStartStr = branch.setting?.workStartTime || "08:00";
    const lateTolerance = branch.setting?.lateToleranceMinutes ?? 15;
    const workStartMinutes = parseTimeToMinutes(workStartStr) ?? 480; // 08:00 default

    let isLate = false;
    let lateMinutes = 0;
    if (currentWibMinutes > workStartMinutes + lateTolerance) {
      isLate = true;
      lateMinutes = currentWibMinutes - workStartMinutes;
    }

    const statusToSave = body.status || (isLate ? "TERLAMBAT" : "HADIR");
    let initialNotes = notes ? notes.trim() : "";
    if (isLate) {
      const lateNote = `Terlambat ${lateMinutes} mnt (Jadwal: ${workStartStr}, Toleransi: ${lateTolerance} mnt)`;
      initialNotes = initialNotes ? `${initialNotes} | ${lateNote}` : lateNote;
    }

    const attendance = await prisma.tutorAttendance.upsert({
      where: {
        userId_attendanceDate: {
          userId: userRecord.id,
          attendanceDate: todayMidnight,
        },
      },
      update: {
        checkInTime: currentTimeStr,
        status: statusToSave,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        distanceMeter: distanceMeter,
        isLocationValid: isLocationValid,
        notes: initialNotes || undefined,
        branchId: branch.id,
      },
      create: {
        userId: userRecord.id,
        branchId: branch.id,
        attendanceDate: todayMidnight,
        checkInTime: currentTimeStr,
        status: statusToSave,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        distanceMeter: distanceMeter,
        isLocationValid: isLocationValid,
        notes: initialNotes || null,
      },
      include: {
        user: true,
        branch: true,
      },
    });

    if (isLate && lateMinutes > 0) {
      try {
        await prisma.$executeRawUnsafe(
          `UPDATE "tutor_attendances" SET "late_minutes" = $1 WHERE "id" = $2`,
          lateMinutes,
          attendance.id
        );
      } catch (err) {
        console.warn("Error updating late_minutes:", err);
      }
    }

    return NextResponse.json({
      success: true,
      isCheckIn: true,
      isLate,
      lateMinutes,
      message: isLate
        ? `Presensi Masuk dicatat pada ${currentTimeStr} (Terlambat ${lateMinutes} menit). Harap perhatikan jam kerja!`
        : `Presensi Masuk berhasil dicatat tepat waktu pada ${currentTimeStr}! (Jarak: ${distanceMeter !== null ? `${distanceMeter}m` : "Terverifikasi"})`,
      attendance,
      distanceMeter,
      maxRadius,
    });
  } catch (error: any) {
    console.error("Error recording tutor attendance:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/tutor-attendance - Manual adjustment by Admin
export async function PUT(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const body = await req.json();
    const { id, status, notes, checkInTime, checkOutTime, lateMinutes, earlyLeaveMinutes } = body;

    if (!id) {
      return NextResponse.json({ error: "ID presensi diperlukan" }, { status: 400 });
    }

    const updated = await prisma.tutorAttendance.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(checkInTime ? { checkInTime } : {}),
        ...(checkOutTime !== undefined ? { checkOutTime } : {}),
      },
      include: { user: true, branch: true },
    });

    if (lateMinutes !== undefined) {
      try {
        await prisma.$executeRawUnsafe(
          `UPDATE "tutor_attendances" SET "late_minutes" = $1 WHERE "id" = $2`,
          Number(lateMinutes),
          id
        );
      } catch (err) {
        console.warn("Error updating late_minutes in PUT:", err);
      }
    }
    if (earlyLeaveMinutes !== undefined) {
      try {
        await prisma.$executeRawUnsafe(
          `UPDATE "tutor_attendances" SET "early_leave_minutes" = $1 WHERE "id" = $2`,
          Number(earlyLeaveMinutes),
          id
        );
      } catch (err) {
        console.warn("Error updating early_leave_minutes in PUT:", err);
      }
    }

    return NextResponse.json({ success: true, attendance: updated });
  } catch (error: any) {
    console.error("Error updating tutor attendance:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/tutor-attendance - Delete record
export async function DELETE(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID presensi diperlukan" }, { status: 400 });
    }

    await prisma.tutorAttendance.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting tutor attendance:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
