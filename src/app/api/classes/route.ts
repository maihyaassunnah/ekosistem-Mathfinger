import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/classes - List all classes with branch details
export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      include: { branch: true },
      orderBy: { createdAt: "asc" },
    });

    const formatted = await Promise.all(
      classes.map(async (c) => {
        const studentCount = await prisma.student.count({
          where: { className: c.className, status: "ACTIVE" },
        });
        return {
          id: c.id,
          name: c.className,
          branch: (c.branch?.branchName as "Singkut" | "Bangko") || "Singkut",
          days: c.days,
          time: c.time,
          teacher: c.teacherName || "Tutor Belum Ditentukan",
          room: c.room || "Ruang 1",
          level: c.levelName || "Tingkat Dasar",
          enrolledCount: studentCount > 0 ? studentCount : c.enrolledCount,
          maxCapacity: c.maxCapacity,
        };
      })
    );

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching classes:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/classes - Create new class
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, branch: branchName, days, time, teacher, room, level, maxCapacity } = body;

    if (!name || !days || !time) {
      return NextResponse.json({ error: "Nama kelas, hari, dan jam wajib diisi" }, { status: 400 });
    }

    let branch = await prisma.branch.findFirst({
      where: { branchName: { contains: branchName || "Singkut", mode: "insensitive" } },
    });
    if (!branch) {
      branch = await prisma.branch.findFirst();
    }

    const created = await prisma.class.create({
      data: {
        branchId: branch!.id,
        className: name,
        days: days,
        time: time,
        teacherName: teacher || "Tutor Baru",
        room: room || "Ruang 1",
        levelName: level || "Tingkat Dasar",
        maxCapacity: maxCapacity ? Number(maxCapacity) : 15,
        enrolledCount: 0,
      },
      include: { branch: true },
    });

    return NextResponse.json(
      {
        id: created.id,
        name: created.className,
        branch: created.branch?.branchName || "Singkut",
        days: created.days,
        time: created.time,
        teacher: created.teacherName,
        room: created.room,
        level: created.levelName,
        enrolledCount: created.enrolledCount,
        maxCapacity: created.maxCapacity,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating class:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/classes - Update class
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, days, time, teacher, room, level, maxCapacity } = body;

    if (!id) {
      return NextResponse.json({ error: "ID kelas diperlukan" }, { status: 400 });
    }

    const updated = await prisma.class.update({
      where: { id },
      data: {
        ...(name ? { className: name } : {}),
        ...(days ? { days } : {}),
        ...(time ? { time } : {}),
        ...(teacher ? { teacherName: teacher } : {}),
        ...(room ? { room } : {}),
        ...(level ? { levelName: level } : {}),
        ...(maxCapacity !== undefined ? { maxCapacity: Number(maxCapacity) } : {}),
      },
      include: { branch: true },
    });

    return NextResponse.json({
      id: updated.id,
      name: updated.className,
      branch: updated.branch?.branchName || "Singkut",
      days: updated.days,
      time: updated.time,
      teacher: updated.teacherName,
      room: updated.room,
      level: updated.levelName,
      enrolledCount: updated.enrolledCount,
      maxCapacity: updated.maxCapacity,
    });
  } catch (error: any) {
    console.error("Error updating class:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/classes - Delete class
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID kelas diperlukan" }, { status: 400 });
    }

    await prisma.class.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting class:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
