import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";
import { DEFAULT_WEEKLY_SCHEDULE } from "@/app/api/branch-qr-config/route";

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

// Helper: parse "HH:mm" to minutes
function parseTimeToMinutes(timeStr?: string | null): number | null {
  if (!timeStr) return null;
  const match = timeStr.match(/(\d{1,2})[:.](\d{1,2})/);
  if (!match) return null;
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
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
    const sessionFilter = searchParams.get("session");

    // Auto-scope for branch admin if branch query is ALL or missing
    if ((!branch || branch === "ALL") && authUser?.role === "BRANCH_ADMIN" && authUser?.branchName) {
      branch = authUser.branchName.replace(/^Cabang\s+/i, "").trim();
    }

    const whereClause: any = {};

    if (branch && branch !== "ALL") {
      const branchFilter = buildBranchFilter(branch);
      whereClause.OR = [
        { branch: branchFilter },
        { user: { branch: branchFilter } },
      ];
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
            branch: {
              select: {
                id: true,
                branchName: true,
                branchCode: true,
              },
            },
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

    let formatted = records.map((r) => ({
      id: r.id,
      userId: r.userId,
      tutorName: r.user?.fullName || "Tutor",
      tutorEmail: r.user?.email || "-",
      tutorRole: r.user?.role || "TUTOR",
      avatarUrl: r.user?.avatarUrl || "",
      branchId: r.branchId,
      branchName: (r.user as any)?.branch?.branchName || r.branch?.branchName || "Singkut",
      date: r.attendanceDate.toISOString().split("T")[0],
      sessionName: (r as any).sessionName || "Sesi 1",
      sessionId: (r as any).sessionId || null,
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

    if (sessionFilter && sessionFilter !== "ALL") {
      formatted = formatted.filter((f) => f.sessionName?.toLowerCase() === sessionFilter.toLowerCase());
    }

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching tutor attendances:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/tutor-attendance - Record scan attendance with GPS geofencing and multi-session detection
export async function POST(req: Request) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const authUser = session?.user as any;
    const body = await req.json();
    const {
      qrData,
      latitude,
      longitude,
      userId: targetUserId,
      notes,
      isCheckOut,
      sessionId,
      sessionName,
    } = body;

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
    let branch: any = null;
    if (parsedQr?.branchId) {
      branch = await prisma.branch.findUnique({
        where: { id: parsedQr.branchId },
        include: { setting: true },
      });
    }

    if (!branch && parsedQr?.secret) {
      // 1. Look up in dedicated tutor_attendance_qrs table
      try {
        const qrRows = await prisma.$queryRawUnsafe<any[]>(
          `SELECT "branch_id" FROM "tutor_attendance_qrs" WHERE "qr_secret" = $1 LIMIT 1`,
          parsedQr.secret
        );
        if (qrRows.length > 0 && qrRows[0].branch_id) {
          branch = await prisma.branch.findUnique({
            where: { id: qrRows[0].branch_id },
            include: { setting: true },
          });
        }
      } catch (qrLookupErr) {
        console.warn("Could not query tutor_attendance_qrs by secret:", qrLookupErr);
      }

      // 2. Fallback to branchSetting.qrSecret
      if (!branch) {
        const setting = await prisma.branchSetting.findFirst({
          where: { qrSecret: parsedQr.secret },
          include: { branch: true },
        });
        if (setting?.branch) {
          branch = { ...setting.branch, setting };
        }
      }
    }

    // Fallback: match QR branch name/code if specified in payload
    if (!branch && (parsedQr?.branchName || parsedQr?.branchCode)) {
      const branchTerm = parsedQr.branchName || parsedQr.branchCode;
      branch = await prisma.branch.findFirst({
        where: buildBranchFilter(branchTerm),
        include: { setting: true },
      });
    }

    if (!branch) {
      return NextResponse.json({ error: "QR Code Presensi tidak dikenali atau belum terdaftar di cabang manapun." }, { status: 400 });
    }

    // Cross-Branch Validation: Ensure tutor only scans QR belonging to their assigned branch
    if (userRecord.role !== "SUPER_ADMIN" && userRecord.branchId && branch) {
      if (userRecord.branchId !== branch.id) {
        const userBranch = await prisma.branch.findUnique({
          where: { id: userRecord.branchId },
          select: { branchName: true },
        });
        return NextResponse.json(
          {
            error: `Presensi Ditolak! Kode QR ini milik Cabang ${branch.branchName}. Anda terdaftar di Cabang ${userBranch?.branchName || "lain"}!`,
          },
          { status: 400 }
        );
      }
    }

    // 3. Fetch branch work schedule & weekly_schedule from tutor_attendance_qrs
    let branchScheduleRow: any = null;
    try {
      const rows = await prisma.$queryRawUnsafe<any[]>(
        `SELECT * FROM "tutor_attendance_qrs" WHERE "branch_id" = $1 LIMIT 1`,
        branch.id
      );
      if (rows.length > 0) branchScheduleRow = rows[0];
    } catch {}

    const weeklySchedule = branchScheduleRow?.weekly_schedule || DEFAULT_WEEKLY_SCHEDULE;

    // 4. Geofencing GPS Distance Calculation
    let distanceMeter: number | null = null;
    let isLocationValid = true;
    const branchLat = branchScheduleRow?.latitude ?? branch.setting?.latitude;
    const branchLon = branchScheduleRow?.longitude ?? branch.setting?.longitude;
    const configuredRadius = Number(branchScheduleRow?.radius_meters ?? branch.setting?.radiusMeters ?? 100);

    // Dynamic radius with minimum 150m buffer + client accuracy allowance
    const clientAccuracy = Number(body.accuracy || 0);
    const baseRadius = Math.max(configuredRadius, 150);
    const maxRadius = baseRadius + Math.min(clientAccuracy, 100);

    if (latitude !== undefined && longitude !== undefined && branchLat && branchLon) {
      distanceMeter = calculateDistance(Number(latitude), Number(longitude), branchLat, branchLon);

      // During Check-Out: tutor is already verified on site from Check-In.
      // Indoor smartphone signal jitter / cell tower jump should not trap the tutor.
      const checkoutGraceRadius = isCheckOut ? Math.max(maxRadius * 2, 400) : maxRadius;

      if (distanceMeter > checkoutGraceRadius) {
        if (isCheckOut) {
          // If check-out and distance exceeds grace radius, permit check-out with warning flag
          console.warn(`Tutor checkout GPS distance (${distanceMeter}m) exceeds radius (${checkoutGraceRadius}m) - permitting checkout.`);
          isLocationValid = false;
        } else {
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
    }

    // 5. Determine Date & Time in WIB (Asia/Jakarta, UTC+7)
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
    const currentWibMinutes = parseTimeToMinutes(currentTimeStr) ?? 0;

    // Calculate day of week in WIB (0 = Minggu, 1 = Senin, ..., 6 = Sabtu)
    const dayOfWeek = String(todayMidnight.getUTCDay());
    const daySessions: any[] = (weeklySchedule && Array.isArray(weeklySchedule[dayOfWeek]))
      ? weeklySchedule[dayOfWeek]
      : [];

    // 6. Match Active Work Session for today
    let matchedSession: any = null;
    if (sessionId) {
      matchedSession = daySessions.find((s) => s.id === sessionId);
    }
    if (!matchedSession && sessionName) {
      matchedSession = daySessions.find((s) => s.name?.toLowerCase() === sessionName?.toLowerCase());
    }
    if (!matchedSession && daySessions.length > 0) {
      // Find session where current time falls into [start - 60 min, end + 60 min]
      matchedSession = daySessions.find((s) => {
        if (!s.isActive && s.isActive !== undefined) return false;
        const sStart = parseTimeToMinutes(s.startTime);
        const sEnd = parseTimeToMinutes(s.endTime);
        if (sStart !== null && sEnd !== null) {
          return currentWibMinutes >= sStart - 60 && currentWibMinutes <= sEnd + 60;
        }
        return false;
      });

      // If still none, find session with closest start time
      if (!matchedSession) {
        let minDiff = Infinity;
        for (const s of daySessions) {
          if (!s.isActive && s.isActive !== undefined) continue;
          const sStart = parseTimeToMinutes(s.startTime);
          if (sStart !== null) {
            const diff = Math.abs(currentWibMinutes - sStart);
            if (diff < minDiff) {
              minDiff = diff;
              matchedSession = s;
            }
          }
        }
      }
    }

    // Fallback if no sessions configured for this day
    const activeSessionName = matchedSession?.name || sessionName || (daySessions[0]?.name) || "Sesi 1";
    const activeSessionId = matchedSession?.id || sessionId || (daySessions[0]?.id) || null;
    const workStartStr = matchedSession?.startTime || branchScheduleRow?.work_start_time || branch.setting?.workStartTime || "08:00";
    const workEndStr = matchedSession?.endTime || branchScheduleRow?.work_end_time || branch.setting?.workEndTime || "17:00";
    const lateTolerance = matchedSession?.lateTolerance ?? (branchScheduleRow?.late_tolerance_minutes ?? branch.setting?.lateToleranceMinutes ?? 15);
    const earlyLeaveTolerance = matchedSession?.earlyLeaveTolerance ?? (branchScheduleRow?.early_leave_tolerance_minutes ?? branch.setting?.earlyLeaveToleranceMinutes ?? 0);

    // 7. Check existing attendance for this user and date
    let existingAttendance: any = null;

    if (isCheckOut) {
      // Check-Out: prioritize finding an OPEN check-in today for this user
      // 1. Try to match activeSessionName with an open status
      existingAttendance = await prisma.tutorAttendance.findFirst({
        where: {
          userId: userRecord.id,
          attendanceDate: todayMidnight,
          sessionName: activeSessionName,
          OR: [
            { checkOutTime: null },
            { checkOutTime: "-" },
            { checkOutTime: "" },
          ],
        },
        orderBy: { createdAt: "desc" },
      });

      // 2. If not found, match ANY open check-in today (in case session switched or shift was named differently)
      if (!existingAttendance) {
        existingAttendance = await prisma.tutorAttendance.findFirst({
          where: {
            userId: userRecord.id,
            attendanceDate: todayMidnight,
            OR: [
              { checkOutTime: null },
              { checkOutTime: "-" },
              { checkOutTime: "" },
            ],
          },
          orderBy: { createdAt: "desc" },
        });
      }

      // 3. If STILL not found, check if user already completed checkout today
      if (!existingAttendance) {
        const closedAttendance = await prisma.tutorAttendance.findFirst({
          where: {
            userId: userRecord.id,
            attendanceDate: todayMidnight,
          },
          orderBy: { createdAt: "desc" },
        });

        if (closedAttendance && closedAttendance.checkOutTime && closedAttendance.checkOutTime !== "-") {
          return NextResponse.json(
            {
              error: `Anda sudah menyelesaikan presensi pulang hari ini (${closedAttendance.sessionName || "Sesi"}) pada pukul ${closedAttendance.checkOutTime}.`,
              alreadyCheckedOut: true,
              checkOutTime: closedAttendance.checkOutTime,
            },
            { status: 400 }
          );
        }

        return NextResponse.json(
          { error: `Anda belum melakukan presensi masuk hari ini. Silakan lakukan presensi masuk terlebih dahulu.` },
          { status: 400 }
        );
      }
    } else {
      // Check-In: find existing record for this exact session
      existingAttendance = await prisma.tutorAttendance.findFirst({
        where: {
          userId: userRecord.id,
          attendanceDate: todayMidnight,
          sessionName: activeSessionName,
        },
      });
    }

    if (isCheckOut) {
      // Determine effective session & end times
      const effectiveSessionName = existingAttendance.sessionName || activeSessionName;
      const sessionForTimes = daySessions.find((s) => s.name?.toLowerCase() === effectiveSessionName?.toLowerCase()) || matchedSession;
      const effectiveWorkEndStr = sessionForTimes?.endTime || workEndStr;
      const effectiveEarlyLeaveTolerance = sessionForTimes?.earlyLeaveTolerance ?? earlyLeaveTolerance;

      const workEndMinutes = parseTimeToMinutes(effectiveWorkEndStr) ?? 1020; // 17:00 default

      let isEarlyLeave = false;
      let earlyMinutes = 0;
      if (currentWibMinutes < workEndMinutes - effectiveEarlyLeaveTolerance) {
        isEarlyLeave = true;
        earlyMinutes = workEndMinutes - currentWibMinutes;
      }

      let checkoutNote = notes ? `Pulang: ${notes.trim()}` : "";
      if (isEarlyLeave) {
        const earlyNote = `Pulang Awal ${earlyMinutes} mnt (${effectiveSessionName}: ${effectiveWorkEndStr})`;
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
        sessionName: effectiveSessionName,
        sessionId: existingAttendance.sessionId || activeSessionId,
        workStartTime: sessionForTimes?.startTime || workStartStr,
        workEndTime: effectiveWorkEndStr,
        earlyLeaveToleranceMinutes: effectiveEarlyLeaveTolerance,
        message: isEarlyLeave
          ? `Presensi Pulang ${effectiveSessionName} berhasil dicatat pada ${currentTimeStr} (Pulang lebih awal ${earlyMinutes} menit).`
          : `Presensi Pulang ${effectiveSessionName} berhasil dicatat pada ${currentTimeStr}! 🏠`,
        attendance: updated,
        distanceMeter,
      });
    }

    // Check In
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
      const lateNote = `Terlambat ${lateMinutes} mnt (${activeSessionName}: ${workStartStr}, Toleransi: ${lateTolerance} mnt)`;
      initialNotes = initialNotes ? `${initialNotes} | ${lateNote}` : lateNote;
    }

    const attendanceBranchId = userRecord.branchId || branch.id;

    let attendanceRecord: any;
    if (existingAttendance) {
      attendanceRecord = await prisma.tutorAttendance.update({
        where: { id: existingAttendance.id },
        data: {
          checkInTime: currentTimeStr,
          status: statusToSave,
          latitude: latitude ? Number(latitude) : null,
          longitude: longitude ? Number(longitude) : null,
          distanceMeter: distanceMeter,
          isLocationValid: isLocationValid,
          notes: initialNotes || undefined,
          branchId: attendanceBranchId,
          sessionName: activeSessionName,
          sessionId: activeSessionId,
        },
        include: { user: true, branch: true },
      });
    } else {
      attendanceRecord = await prisma.tutorAttendance.create({
        data: {
          userId: userRecord.id,
          branchId: attendanceBranchId,
          attendanceDate: todayMidnight,
          checkInTime: currentTimeStr,
          status: statusToSave,
          latitude: latitude ? Number(latitude) : null,
          longitude: longitude ? Number(longitude) : null,
          distanceMeter: distanceMeter,
          isLocationValid: isLocationValid,
          notes: initialNotes || null,
          sessionName: activeSessionName,
          sessionId: activeSessionId,
        },
        include: { user: true, branch: true },
      });
    }

    if (isLate && lateMinutes > 0) {
      try {
        await prisma.$executeRawUnsafe(
          `UPDATE "tutor_attendances" SET "late_minutes" = $1 WHERE "id" = $2`,
          lateMinutes,
          attendanceRecord.id
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
      sessionName: activeSessionName,
      sessionId: activeSessionId,
      workStartTime: workStartStr,
      workEndTime: workEndStr,
      lateToleranceMinutes: lateTolerance,
      message: isLate
        ? `Presensi Masuk ${activeSessionName} dicatat pada ${currentTimeStr} (Terlambat ${lateMinutes} menit). Harap perhatikan jam sesi!`
        : `Presensi Masuk ${activeSessionName} berhasil dicatat tepat waktu pada ${currentTimeStr}! (Jarak: ${distanceMeter !== null ? `${distanceMeter}m` : "Terverifikasi"})`,
      attendance: attendanceRecord,
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
    const { id, status, notes, checkInTime, checkOutTime, lateMinutes, earlyLeaveMinutes, sessionName } = body;

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
        ...(sessionName ? { sessionName } : {}),
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
