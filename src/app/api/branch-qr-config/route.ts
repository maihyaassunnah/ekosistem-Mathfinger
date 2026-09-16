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

// GET /api/branch-qr-config - Get GPS & QR config for branches
export async function GET(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const branchName = searchParams.get("branch");

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
        // If branch setting doesn't exist or qrSecret is empty, create or update with default QR code
        if (!setting) {
          const defaultSecret = `MF-QR-${b.branchCode.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          setting = await prisma.branchSetting.create({
            data: {
              branchId: b.id,
              latitude: -2.3125, // default Singkut coordinate
              longitude: 102.6847,
              radiusMeters: 100,
              qrSecret: defaultSecret,
            },
          });
        } else if (!setting.qrSecret) {
          const defaultSecret = `MF-QR-${b.branchCode.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          setting = await prisma.branchSetting.update({
            where: { id: setting.id },
            data: {
              qrSecret: defaultSecret,
              latitude: setting.latitude ?? -2.3125,
              longitude: setting.longitude ?? 102.6847,
              radiusMeters: setting.radiusMeters ?? 100,
            },
          });
        }

        return {
          branchId: b.id,
          branchCode: b.branchCode,
          branchName: b.branchName,
          address: b.address,
          latitude: setting.latitude,
          longitude: setting.longitude,
          radiusMeters: setting.radiusMeters || 100,
          qrSecret: setting.qrSecret,
          workStartTime: setting.workStartTime || "08:00",
          workEndTime: setting.workEndTime || "17:00",
          lateToleranceMinutes: setting.lateToleranceMinutes ?? 15,
          earlyLeaveToleranceMinutes: setting.earlyLeaveToleranceMinutes ?? 0,
          // Encoded payload inside QR for scanner
          qrPayload: JSON.stringify({
            type: "MATHFINGERS_TUTOR_ATTENDANCE",
            branchId: b.id,
            branchCode: b.branchCode,
            branchName: b.branchName,
            secret: setting.qrSecret,
            workStartTime: setting.workStartTime || "08:00",
            workEndTime: setting.workEndTime || "17:00",
            lateToleranceMinutes: setting.lateToleranceMinutes ?? 15,
          }),
        };
      })
    );

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching branch QR config:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/branch-qr-config - Update GPS location, work hours, tolerance, or regenerate QR Secret
export async function PUT(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

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
    } = body;

    let targetBranch = null;
    if (branchId) {
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

    let newQrSecret = targetBranch.setting?.qrSecret;
    if (regenerateQr || !newQrSecret) {
      newQrSecret = `MF-QR-${targetBranch.branchCode.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }

    const updatedSetting = await prisma.branchSetting.upsert({
      where: { branchId: targetBranch.id },
      update: {
        ...(latitude !== undefined ? { latitude: Number(latitude) } : {}),
        ...(longitude !== undefined ? { longitude: Number(longitude) } : {}),
        ...(radiusMeters !== undefined ? { radiusMeters: Number(radiusMeters) } : {}),
        ...(newQrSecret ? { qrSecret: newQrSecret } : {}),
      },
      create: {
        branchId: targetBranch.id,
        latitude: latitude ? Number(latitude) : -2.3125,
        longitude: longitude ? Number(longitude) : 102.6847,
        radiusMeters: radiusMeters ? Number(radiusMeters) : 100,
        qrSecret: newQrSecret,
      },
    });

    // Update work hours and tolerances directly in PostgreSQL
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
        console.warn("Could not update work hours via raw SQL:", sqlErr);
      }
    }

    const finalWorkStart = workStartTime ? String(workStartTime) : ((updatedSetting as any).workStartTime || "08:00");
    const finalWorkEnd = workEndTime ? String(workEndTime) : ((updatedSetting as any).workEndTime || "17:00");
    const finalLateTol = lateToleranceMinutes !== undefined ? Number(lateToleranceMinutes) : ((updatedSetting as any).lateToleranceMinutes ?? 15);
    const finalEarlyTol = earlyLeaveToleranceMinutes !== undefined ? Number(earlyLeaveToleranceMinutes) : ((updatedSetting as any).earlyLeaveToleranceMinutes ?? 0);

    return NextResponse.json({
      success: true,
      branchId: targetBranch.id,
      branchName: targetBranch.branchName,
      latitude: updatedSetting.latitude,
      longitude: updatedSetting.longitude,
      radiusMeters: updatedSetting.radiusMeters,
      qrSecret: updatedSetting.qrSecret,
      workStartTime: finalWorkStart,
      workEndTime: finalWorkEnd,
      lateToleranceMinutes: finalLateTol,
      earlyLeaveToleranceMinutes: finalEarlyTol,
      qrPayload: JSON.stringify({
        type: "MATHFINGERS_TUTOR_ATTENDANCE",
        branchId: targetBranch.id,
        branchCode: targetBranch.branchCode,
        branchName: targetBranch.branchName,
        secret: updatedSetting.qrSecret,
        workStartTime: finalWorkStart,
        workEndTime: finalWorkEnd,
        lateToleranceMinutes: finalLateTol,
      }),
    });
  } catch (error: any) {
    console.error("Error updating branch QR config:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
