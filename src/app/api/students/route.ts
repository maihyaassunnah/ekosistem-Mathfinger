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
      orderBy: { createdAt: "asc" },
    });

    const formatted = students.map((s, idx) => ({
      id: s.id,
      index: idx + 1,
      studentCode: s.studentCode,
      name: s.studentName,
      studentName: s.studentName,
      gender: (s.gender as "P" | "L") || (s.qrIdentifier?.includes("P") ? "P" : "L"),
      codeLabel: s.gender === "L" ? "6L" : "8P",
      branch: (s.branch?.branchName as "Singkut" | "Bangko") || "Singkut",
      branchId: s.branchId,
      className: s.className || "Kelas A",
      birthPlace: s.birthPlace || "Singkut",
      birthDate: s.birthDate || "2018-01-01",
      address: s.address || "Jl. Poros Singkut",
      gradeLevel: s.gradeLevel || (s.currentLevel?.levelName ? `Ket: ${s.currentLevel.levelName}` : "Ket: Kelas 3"),
      parentName: s.parentName,
      parentWhatsapp: s.parentWhatsapp,
      levelCurriculum: s.currentLevel?.levelName || "Level Dasar: Pengenalan Simbol Jari",
      registeredDate: s.registeredDate ? s.registeredDate.toISOString().split("T")[0] : s.createdAt.toISOString().split("T")[0],
      status: s.status,
      programType: s.programType || "MATEMATIKA",
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
        gender: body.gender || "P",
        className: body.className || "Kelas A",
        birthPlace: body.birthPlace || "Singkut",
        birthDate: body.birthDate || "2018-01-01",
        address: body.address || "Jl. Poros Singkut",
        schoolOrigin: body.schoolOrigin || (branchName === "Singkut" ? "SDN 1 Singkut" : "SDN 1 Bangko"),
        gradeLevel: body.gradeLevel || "Ket: Kelas 3",
        parentName: parentName,
        parentWhatsapp: parentWhatsapp,
        branchId: branch!.id,
        currentLevelId: level!.id,
        registeredDate: body.registeredDate ? new Date(body.registeredDate) : new Date(),
        programType: (body.programType === "MEMBACA" ? "MEMBACA" : "MATEMATIKA") as any,
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
      studentName: created.studentName,
      gender: (created.gender as "P" | "L") || "P",
      codeLabel: created.gender === "L" ? "6L" : "8P",
      branch: created.branch?.branchName || "Singkut",
      branchId: created.branchId,
      className: created.className || "Kelas A",
      birthPlace: created.birthPlace || "-",
      birthDate: created.birthDate || "-",
      address: created.address || "-",
      gradeLevel: created.gradeLevel || "Ket: Kelas 3",
      parentName: created.parentName,
      parentWhatsapp: created.parentWhatsapp,
      levelCurriculum: created.currentLevel?.levelName || "Level Dasar: Pengenalan Simbol Jari",
      registeredDate: created.registeredDate ? created.registeredDate.toISOString().split("T")[0] : created.createdAt.toISOString().split("T")[0],
      status: created.status,
      programType: created.programType || "MATEMATIKA",
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
    const { id, name, parentName, parentWhatsapp, gender, className, birthPlace, birthDate, address, gradeLevel, levelCurriculum, branch } = body;

    if (!id) {
      return NextResponse.json({ error: "ID siswa diperlukan" }, { status: 400 });
    }

    let branchId: string | undefined = undefined;
    if (branch) {
      const b = await prisma.branch.findFirst({
        where: { branchName: { contains: branch, mode: "insensitive" } },
      });
      if (b) branchId = b.id;
    }

    let currentLevelId: string | undefined = undefined;
    if (levelCurriculum) {
      const l = await prisma.level.findFirst({
        where: { levelName: { contains: levelCurriculum.replace("Ket: ", ""), mode: "insensitive" } },
      });
      if (l) currentLevelId = l.id;
    }

    const updated = await prisma.student.update({
      where: { id },
      data: {
        ...(name ? { studentName: name } : {}),
        ...(parentName ? { parentName } : {}),
        ...(parentWhatsapp ? { parentWhatsapp } : {}),
        ...(gender ? { gender } : {}),
        ...(className ? { className } : {}),
        ...(birthPlace ? { birthPlace } : {}),
        ...(birthDate ? { birthDate } : {}),
        ...(address ? { address } : {}),
        ...(gradeLevel ? { gradeLevel } : {}),
        ...(branchId ? { branchId } : {}),
        ...(currentLevelId ? { currentLevelId } : {}),
      },
      include: {
        branch: true,
        currentLevel: true,
      },
    });

    return NextResponse.json({
      id: updated.id,
      studentCode: updated.studentCode,
      name: updated.studentName,
      gender: updated.gender,
      codeLabel: updated.gender === "L" ? "6L" : "8P",
      branch: updated.branch?.branchName || "Singkut",
      className: updated.className || "Kelas A",
      birthPlace: updated.birthPlace,
      birthDate: updated.birthDate,
      address: updated.address,
      gradeLevel: updated.gradeLevel,
      parentName: updated.parentName,
      parentWhatsapp: updated.parentWhatsapp,
      levelCurriculum: updated.currentLevel?.levelName,
      status: updated.status,
    });
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
