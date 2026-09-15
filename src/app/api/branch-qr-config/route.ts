import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

// GET /api/branch-qr-config - Get GPS & QR config for branches
export async function GET(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const branchName = searchParams.get("branch");

    const whereClause: any = {};
    if (branchName && branchName !== "ALL") {
      whereClause.branchName = { contains: branchName.replace(/^Cabang\s+/i, ""), mode: "insensitive" };
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
          // Encoded payload inside QR for scanner
          qrPayload: JSON.stringify({
            type: "MATHFINGERS_TUTOR_ATTENDANCE",
            branchId: b.id,
            branchCode: b.branchCode,
            branchName: b.branchName,
            secret: setting.qrSecret,
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

// PUT /api/branch-qr-config - Update GPS location and/or regenerate QR Secret
export async function PUT(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const body = await req.json();
    const { branchId, branchName, latitude, longitude, radiusMeters, regenerateQr } = body;

    let targetBranch = null;
    if (branchId) {
      targetBranch = await prisma.branch.findUnique({
        where: { id: branchId },
        include: { setting: true },
      });
    } else if (branchName) {
      targetBranch = await prisma.branch.findFirst({
        where: { branchName: { contains: branchName.replace(/^Cabang\s+/i, ""), mode: "insensitive" } },
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

    return NextResponse.json({
      success: true,
      branchId: targetBranch.id,
      branchName: targetBranch.branchName,
      latitude: updatedSetting.latitude,
      longitude: updatedSetting.longitude,
      radiusMeters: updatedSetting.radiusMeters,
      qrSecret: updatedSetting.qrSecret,
      qrPayload: JSON.stringify({
        type: "MATHFINGERS_TUTOR_ATTENDANCE",
        branchId: targetBranch.id,
        branchCode: targetBranch.branchCode,
        branchName: targetBranch.branchName,
        secret: updatedSetting.qrSecret,
      }),
    });
  } catch (error: any) {
    console.error("Error updating branch QR config:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
