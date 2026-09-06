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

    // Format to match frontend StudentItem structure
    const formatted = students.map((s, idx) => ({
      id: s.id,
      index: idx + 1,
      studentCode: s.studentCode,
      name: s.studentName,
      gender: s.qrIdentifier?.includes("P") ? "P" : "L",
      codeLabel: s.currentLevel?.levelName?.includes("Dasar") ? "8P" : "6L",
      branch: s.branch?.branchName || "Singkut",
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
    const {
      studentCode,
      name,
      parentName,
      parentWhatsapp,
      branchName,
      levelName,
    } = body;

    // Find branch by name or default to first branch
    let branch = await prisma.branch.findFirst({
      where: { branchName: branchName || "Singkut" },
    });
    if (!branch) {
      branch = await prisma.branch.findFirst();
    }

    // Find level by name or default to first level
    let level = await prisma.level.findFirst({
      where: { levelName: { contains: levelName || "Dasar" } },
    });
    if (!level) {
      level = await prisma.level.findFirst();
    }

    const code = studentCode || Math.floor(10000 + Math.random() * 90000).toString();

    const created = await prisma.student.create({
      data: {
        studentCode: code,
        qrIdentifier: `MF-QR-${code}`,
        studentName: name,
        parentName: parentName || "-",
        parentWhatsapp: parentWhatsapp || "-",
        branchId: branch!.id,
        currentLevelId: level!.id,
      },
      include: {
        branch: true,
        currentLevel: true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error("Error creating student:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
