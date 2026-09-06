import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/students - Fetch all students with branch and level info
export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        branch: true,
        currentLevel: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = students.map((s, idx) => ({
      id: s.id,
      index: idx + 1,
      studentCode: s.studentCode,
      name: s.studentName,
      gender: s.qrIdentifier?.includes("P") ? "P" : "L",
      codeLabel: s.currentLevel?.levelName?.includes("Dasar") ? "8P" : "6L",
      branch: (s.branch?.branchName as "Singkut" | "Bangko") || "Singkut",
      className: "Kelas A",
      birthPlace: "-",
      birthDate: "-",
      address: "-",
      gradeLevel: s.currentLevel?.levelName || "Tingkat Dasar",
      parentName: s.parentName,
      parentWhatsapp: s.parentWhatsapp,
      levelCurriculum: s.currentLevel?.levelName || "Level Dasar",
      registeredDate: s.createdAt.toISOString().split("T")[0],
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/students - Create a new student
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const studentName = body.name || body.studentName;
    const parentName = body.parentName || "-";
    const parentWhatsapp = body.parentWhatsapp || "-";
    const branchName = body.branch || body.branchName || "Singkut";
    const levelName = body.levelCurriculum || body.gradeLevel || body.levelName || "Dasar";

    if (!studentName) {
      return NextResponse.json({ error: "Nama siswa wajib diisi" }, { status: 400 });
    }

    // Find branch by name or default to first branch
    let branch = await prisma.branch.findFirst({
      where: {
        branchName: { contains: branchName, mode: "insensitive" },
      },
    });
    if (!branch) {
      branch = await prisma.branch.findFirst();
    }

    // Find level by name or default to first level
    let level = await prisma.level.findFirst({
      where: {
        levelName: { contains: levelName.replace("Ket: ", ""), mode: "insensitive" },
      },
    });
    if (!level) {
      level = await prisma.level.findFirst();
    }

    const code =
      body.studentCode ||
      Math.floor(10000 + Math.random() * 90000).toString();

    const created = await prisma.student.create({
      data: {
        studentCode: code,
        qrIdentifier: `MF-QR-${code}`,
        studentName: studentName,
        parentName: parentName,
        parentWhatsapp: parentWhatsapp,
        branchId: branch!.id,
        currentLevelId: level!.id,
      },
      include: {
        branch: true,
        currentLevel: true,
      },
    });

    const formatted = {
      id: created.id,
      index: 1,
      studentCode: created.studentCode,
      name: created.studentName,
      gender: created.qrIdentifier?.includes("P") ? "P" : "L",
      codeLabel: created.currentLevel?.levelName?.includes("Dasar") ? "8P" : "6L",
      branch: created.branch?.branchName || "Singkut",
      className: "Kelas A",
      birthPlace: "-",
      birthDate: "-",
      address: "-",
      gradeLevel: created.currentLevel?.levelName || "Tingkat Dasar",
      parentName: created.parentName,
      parentWhatsapp: created.parentWhatsapp,
      levelCurriculum: created.currentLevel?.levelName || "Level Dasar",
      registeredDate: created.createdAt.toISOString().split("T")[0],
    };

    return NextResponse.json(formatted, { status: 201 });
  } catch (error: any) {
    console.error("Error creating student:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/students - Update existing student
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, parentName, parentWhatsapp } = body;

    if (!id) {
      return NextResponse.json({ error: "ID siswa diperlukan" }, { status: 400 });
    }

    const updated = await prisma.student.update({
      where: { id },
      data: {
        ...(name ? { studentName: name } : {}),
        ...(parentName ? { parentName } : {}),
        ...(parentWhatsapp ? { parentWhatsapp } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating student:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/students - Delete student
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID siswa diperlukan" }, { status: 400 });
    }

    await prisma.student.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting student:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
