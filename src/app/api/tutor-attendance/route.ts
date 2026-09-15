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

// GET /api/tutor-attendance - List tutor attendances
export async function GET(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const branch = searchParams.get("branch");
    const date = searchParams.get("date");
    const month = searchParams.get("month"); // format: YYYY-MM
    const userId = searchParams.get("userId");

    const whereClause: any = {};

    if (branch && branch !== "ALL") {
      whereClause.branch = {
        branchName: { contains: branch.replace(/^Cabang\s+/i, ""), mode: "insensitive" },
      };
    }

    if (userId) {
      whereClause.userId = userId;
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

    // 4. Determine Date & Time (WIB)
    const now = new Date();
    // UTC Midnight date for indexing
    const todayMidnight = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));
    
    // Format live time string (HH:mm WIB)
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const currentTimeStr = `${hours}:${minutes} WIB`;

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

      const updated = await prisma.tutorAttendance.update({
        where: { id: existingAttendance.id },
        data: {
          checkOutTime: currentTimeStr,
          notes: notes ? `${existingAttendance.notes ? existingAttendance.notes + " | " : ""}Pulang: ${notes}` : existingAttendance.notes,
        },
        include: { user: true, branch: true },
      });

      return NextResponse.json({
        success: true,
        isCheckOut: true,
        message: `Presensi Pulang berhasil dicatat pada ${currentTimeStr}!`,
        attendance: updated,
        distanceMeter,
      });
    }

    // Check In
    const statusToSave = body.status || "HADIR";

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
        notes: notes || undefined,
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
        notes: notes || null,
      },
      include: {
        user: true,
        branch: true,
      },
    });

    return NextResponse.json({
      success: true,
      isCheckIn: true,
      message: `Presensi Masuk berhasil dicatat pada ${currentTimeStr}! (Jarak ke Cabang: ${distanceMeter !== null ? `${distanceMeter}m` : "Terverifikasi"})`,
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
    const { id, status, notes, checkInTime, checkOutTime } = body;

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
