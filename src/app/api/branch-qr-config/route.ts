import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

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

// Default Weekly Work Session Schedule (0 = Minggu, 1 = Senin, ..., 6 = Sabtu)
export const DEFAULT_WEEKLY_SCHEDULE: Record<string, any[]> = {
  "1": [ // Senin
    { id: "mon-1", name: "Sesi Pagi", startTime: "08:00", endTime: "11:00", lateTolerance: 15, earlyLeaveTolerance: 0, isActive: true },
    { id: "mon-2", name: "Sesi Siang", startTime: "13:30", endTime: "15:30", lateTolerance: 15, earlyLeaveTolerance: 0, isActive: true },
    { id: "mon-3", name: "Sesi Sore", startTime: "16:00", endTime: "17:30", lateTolerance: 15, earlyLeaveTolerance: 0, isActive: true },
  ],
  "2": [ // Selasa
    { id: "tue-1", name: "Sesi Pagi", startTime: "08:00", endTime: "11:00", lateTolerance: 15, earlyLeaveTolerance: 0, isActive: true },
    { id: "tue-2", name: "Sesi Sore", startTime: "14:00", endTime: "17:00", lateTolerance: 15, earlyLeaveTolerance: 0, isActive: true },
  ],
  "3": [ // Rabu
    { id: "wed-1", name: "Sesi Pagi", startTime: "08:00", endTime: "11:00", lateTolerance: 15, earlyLeaveTolerance: 0, isActive: true },
    { id: "wed-2", name: "Sesi Siang", startTime: "13:30", endTime: "15:30", lateTolerance: 15, earlyLeaveTolerance: 0, isActive: true },
    { id: "wed-3", name: "Sesi Sore", startTime: "16:00", endTime: "17:30", lateTolerance: 15, earlyLeaveTolerance: 0, isActive: true },
  ],
  "4": [ // Kamis
    { id: "thu-1", name: "Sesi Pagi", startTime: "08:00", endTime: "11:00", lateTolerance: 15, earlyLeaveTolerance: 0, isActive: true },
    { id: "thu-2", name: "Sesi Sore", startTime: "14:00", endTime: "17:00", lateTolerance: 15, earlyLeaveTolerance: 0, isActive: true },
  ],
  "5": [ // Jumat
    { id: "fri-1", name: "Sesi Pagi", startTime: "08:00", endTime: "10:30", lateTolerance: 15, earlyLeaveTolerance: 0, isActive: true },
    { id: "fri-2", name: "Sesi Sore", startTime: "14:00", endTime: "17:00", lateTolerance: 15, earlyLeaveTolerance: 0, isActive: true },
  ],
  "6": [ // Sabtu
    { id: "sat-1", name: "Sesi Pagi", startTime: "08:00", endTime: "11:00", lateTolerance: 15, earlyLeaveTolerance: 0, isActive: true },
    { id: "sat-2", name: "Sesi Sore", startTime: "14:00", endTime: "17:00", lateTolerance: 15, earlyLeaveTolerance: 0, isActive: true },
  ],
  "0": [], // Minggu (Libur)
};

// GET /api/branch-qr-config - Get GPS & QR config for branches
export async function GET(req: Request) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const authUser = session?.user as any;
    const { searchParams } = new URL(req.url);
    let branchName = searchParams.get("branch");

    // Strict isolation for Branch Admin: Branch Admin only ever gets their own branch config
    if (authUser?.role === "BRANCH_ADMIN") {
      if (authUser?.branchName) {
        branchName = authUser.branchName.replace(/^Cabang\s+/i, "").trim();
      } else if (authUser?.email?.toLowerCase().includes("bangko") || authUser?.email?.toLowerCase().includes("dwsafitri")) {
        branchName = "Tabir Timur";
      } else {
        branchName = "Singkut";
      }
    }

    let whereClause: any = {};
    if (branchName && branchName !== "ALL") {
      whereClause = buildBranchFilter(branchName);
    }

    const branches = await prisma.branch.findMany({
      where: whereClause,
      include: {
        setting: true,
      },
      orderBy: { branchName: "asc" },
    });

    const formatted = await Promise.all(
      branches.map(async (b) => {
        let setting = b.setting;

        // 1. Check tutor_attendance_qrs via Prisma
        let qrData = await prisma.tutorAttendanceQr.findUnique({
          where: { branchId: b.id },
        });

        // If no QR row exists in tutor_attendance_qrs, create one with distinct secret
        if (!qrData) {
          const distinctSecret = `MF-QR-${b.branchCode.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          const lat = setting?.latitude ?? (b.branchCode === "SKT" ? -2.3125 : -2.0717);
          const lon = setting?.longitude ?? (b.branchCode === "SKT" ? 102.6847 : 102.2655);
          const rad = setting?.radiusMeters ?? 100;
          const workStart = (setting as any)?.workStartTime || "08:00";
          const workEnd = (setting as any)?.workEndTime || "17:00";
          const lateTol = (setting as any)?.lateToleranceMinutes ?? 15;
          const earlyTol = (setting as any)?.earlyLeaveToleranceMinutes ?? 0;

          const payload = JSON.stringify({
            type: "MATHFINGERS_TUTOR_ATTENDANCE",
            branchId: b.id,
            branchCode: b.branchCode,
            branchName: b.branchName,
            secret: distinctSecret,
            workStartTime: workStart,
            workEndTime: workEnd,
            lateToleranceMinutes: lateTol,
          });

          qrData = await prisma.tutorAttendanceQr.create({
            data: {
              branchId: b.id,
              branchName: b.branchName,
              branchCode: b.branchCode,
              qrSecret: distinctSecret,
              qrPayload: payload,
              workStartTime: workStart,
              workEndTime: workEnd,
              lateToleranceMinutes: lateTol,
              earlyLeaveToleranceMinutes: earlyTol,
              latitude: lat,
              longitude: lon,
              radiusMeters: rad,
              weeklySchedule: DEFAULT_WEEKLY_SCHEDULE,
              isActive: true,
            },
          });
        }

        const workStart = qrData.workStartTime || "08:00";
        const workEnd = qrData.workEndTime || "17:00";
        const lateTol = qrData.lateToleranceMinutes ?? 15;
        const earlyTol = qrData.earlyLeaveToleranceMinutes ?? 0;
        const secret = qrData.qrSecret;
        const weeklySchedule = (qrData.weeklySchedule as any) || DEFAULT_WEEKLY_SCHEDULE;

        const distinctPayload = qrData.qrPayload || (qrData as any).qr_payload || JSON.stringify({
          type: "MATHFINGERS_TUTOR_ATTENDANCE",
          branchId: b.id,
          branchCode: b.branchCode,
          branchName: b.branchName,
          secret: secret,
          workStartTime: workStart,
          workEndTime: workEnd,
          lateToleranceMinutes: lateTol,
        });

        return {
          branchId: b.id,
          branchCode: b.branchCode,
          branchName: b.branchName,
          address: b.address,
          latitude: qrData.latitude ?? setting?.latitude ?? -2.3125,
          longitude: qrData.longitude ?? setting?.longitude ?? 102.6847,
          radiusMeters: qrData.radiusMeters ?? (qrData as any).radius_meters ?? setting?.radiusMeters ?? 100,
          qrSecret: secret,
          workStartTime: workStart,
          workEndTime: workEnd,
          lateToleranceMinutes: lateTol,
          earlyLeaveToleranceMinutes: earlyTol,
          qrPayload: distinctPayload,
          weeklySchedule,
        };
      })
    );

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching branch QR config:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/branch-qr-config - Update GPS location, work hours, tolerance, weekly schedule, or regenerate QR Secret
export async function PUT(req: Request) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const authUser = session?.user as any;
    const body = await req.json();
    const {
      branchId,
      branchName,
      latitude,
      longitude,
      radiusMeters,
      regenerateQr,
      workStartTime,
      workEndTime,
      lateToleranceMinutes,
      earlyLeaveToleranceMinutes,
      weeklySchedule,
    } = body;

    let targetBranch = null;
    let queryBranchName = branchName;

    // Strict isolation for Branch Admin: Branch Admin can only modify their own branch!
    if (authUser?.role === "BRANCH_ADMIN") {
      if (authUser?.branchName) {
        queryBranchName = authUser.branchName.replace(/^Cabang\s+/i, "").trim();
      } else if (authUser?.email?.toLowerCase().includes("bangko") || authUser?.email?.toLowerCase().includes("dwsafitri")) {
        queryBranchName = "Tabir Timur";
      } else {
        queryBranchName = "Singkut";
      }
      targetBranch = await prisma.branch.findFirst({
        where: buildBranchFilter(queryBranchName),
        include: { setting: true },
      });
    } else if (branchId) {
      targetBranch = await prisma.branch.findUnique({
        where: { id: branchId },
        include: { setting: true },
      });
    } else if (branchName) {
      targetBranch = await prisma.branch.findFirst({
        where: buildBranchFilter(branchName),
        include: { setting: true },
      });
    }

    if (!targetBranch) {
      return NextResponse.json({ error: "Cabang tidak ditemukan" }, { status: 404 });
    }

    // Fetch existing QR data from tutor_attendance_qrs
    const existingQrRows = await prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM "tutor_attendance_qrs" WHERE "branch_id" = $1 LIMIT 1`,
      targetBranch.id
    );
    const existingQr = existingQrRows[0];

    let effectiveSecret = existingQr?.qr_secret || targetBranch.setting?.qrSecret;
    if (regenerateQr || !effectiveSecret) {
      effectiveSecret = `MF-QR-${targetBranch.branchCode.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }

    // Update branchSetting base values
    const updatedSetting = await prisma.branchSetting.upsert({
      where: { branchId: targetBranch.id },
      update: {
        ...(latitude !== undefined ? { latitude: Number(latitude) } : {}),
        ...(longitude !== undefined ? { longitude: Number(longitude) } : {}),
        ...(radiusMeters !== undefined ? { radiusMeters: Number(radiusMeters) } : {}),
        qrSecret: effectiveSecret,
      },
      create: {
        branchId: targetBranch.id,
        latitude: latitude ? Number(latitude) : -2.3125,
        longitude: longitude ? Number(longitude) : 102.6847,
        radiusMeters: radiusMeters ? Number(radiusMeters) : 100,
        qrSecret: effectiveSecret,
      },
    });

    // Update work hours and tolerances in branch_settings
    if (
      workStartTime !== undefined ||
      workEndTime !== undefined ||
      lateToleranceMinutes !== undefined ||
      earlyLeaveToleranceMinutes !== undefined
    ) {
      try {
        await prisma.$executeRawUnsafe(
          `UPDATE "branch_settings"
           SET "work_start_time" = COALESCE($1, "work_start_time"),
               "work_end_time" = COALESCE($2, "work_end_time"),
               "late_tolerance_minutes" = COALESCE($3, "late_tolerance_minutes"),
               "early_leave_tolerance_minutes" = COALESCE($4, "early_leave_tolerance_minutes")
           WHERE "branch_id" = $5`,
          workStartTime !== undefined ? String(workStartTime) : null,
          workEndTime !== undefined ? String(workEndTime) : null,
          lateToleranceMinutes !== undefined ? Number(lateToleranceMinutes) : null,
          earlyLeaveToleranceMinutes !== undefined ? Number(earlyLeaveToleranceMinutes) : null,
          targetBranch.id
        );
      } catch (sqlErr) {
        console.warn("Could not update work hours via raw SQL in branch_settings:", sqlErr);
      }
    }

    const finalWorkStart = workStartTime !== undefined ? String(workStartTime) : (existingQr?.work_start_time || (updatedSetting as any).workStartTime || "08:00");
    const finalWorkEnd = workEndTime !== undefined ? String(workEndTime) : (existingQr?.work_end_time || (updatedSetting as any).workEndTime || "17:00");
    const finalLateTol = lateToleranceMinutes !== undefined ? Number(lateToleranceMinutes) : (existingQr?.late_tolerance_minutes ?? (updatedSetting as any).lateToleranceMinutes ?? 15);
    const finalEarlyTol = earlyLeaveToleranceMinutes !== undefined ? Number(earlyLeaveToleranceMinutes) : (existingQr?.early_leave_tolerance_minutes ?? (updatedSetting as any).earlyLeaveToleranceMinutes ?? 0);

    const finalLat = latitude !== undefined ? Number(latitude) : (existingQr?.latitude ?? updatedSetting.latitude ?? -2.3125);
    const finalLon = longitude !== undefined ? Number(longitude) : (existingQr?.longitude ?? updatedSetting.longitude ?? 102.6847);
    const finalRad = radiusMeters !== undefined ? Number(radiusMeters) : (existingQr?.radius_meters ?? updatedSetting.radiusMeters ?? 100);

    const distinctQrPayload = JSON.stringify({
      type: "MATHFINGERS_TUTOR_ATTENDANCE",
      branchId: targetBranch.id,
      branchCode: targetBranch.branchCode,
      branchName: targetBranch.branchName,
      secret: effectiveSecret,
      workStartTime: finalWorkStart,
      workEndTime: finalWorkEnd,
      lateToleranceMinutes: finalLateTol,
    });

    // Save to dedicated tutor_attendance_qrs via Prisma
    let savedQr = null;
    try {
      savedQr = await prisma.tutorAttendanceQr.upsert({
        where: { branchId: targetBranch.id },
        update: {
          branchName: targetBranch.branchName,
          branchCode: targetBranch.branchCode,
          qrSecret: effectiveSecret,
          qrPayload: distinctQrPayload,
          workStartTime: finalWorkStart,
          workEndTime: finalWorkEnd,
          lateToleranceMinutes: finalLateTol,
          earlyLeaveToleranceMinutes: finalEarlyTol,
          latitude: finalLat,
          longitude: finalLon,
          radiusMeters: finalRad,
          ...(weeklySchedule !== undefined ? { weeklySchedule: weeklySchedule } : {}),
        },
        create: {
          branchId: targetBranch.id,
          branchName: targetBranch.branchName,
          branchCode: targetBranch.branchCode,
          qrSecret: effectiveSecret,
          qrPayload: distinctQrPayload,
          workStartTime: finalWorkStart,
          workEndTime: finalWorkEnd,
          lateToleranceMinutes: finalLateTol,
          earlyLeaveToleranceMinutes: finalEarlyTol,
          latitude: finalLat,
          longitude: finalLon,
          radiusMeters: finalRad,
          weeklySchedule: weeklySchedule || DEFAULT_WEEKLY_SCHEDULE,
        },
      });
    } catch (qrErr) {
      console.warn("Could not sync to tutor_attendance_qrs via Prisma:", qrErr);
    }

    const finalWeeklySchedule = weeklySchedule !== undefined ? weeklySchedule : ((savedQr?.weeklySchedule as any) || DEFAULT_WEEKLY_SCHEDULE);

    return NextResponse.json({
      success: true,
      branchId: targetBranch.id,
      branchName: targetBranch.branchName,
      latitude: finalLat,
      longitude: finalLon,
      radiusMeters: finalRad,
      qrSecret: effectiveSecret,
      workStartTime: finalWorkStart,
      workEndTime: finalWorkEnd,
      lateToleranceMinutes: finalLateTol,
      earlyLeaveToleranceMinutes: finalEarlyTol,
      weeklySchedule: finalWeeklySchedule,
      qrPayload: distinctQrPayload,
    });
  } catch (error: any) {
    console.error("Error updating branch QR config:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
