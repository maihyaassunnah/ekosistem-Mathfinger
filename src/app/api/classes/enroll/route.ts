import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

// GET /api/classes/enroll - Get class enrollments
export async function GET(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const classId = searchParams.get("classId");

    const whereClause: any = { status: "ACTIVE" };
    if (studentId) whereClause.studentId = studentId;
    if (classId) whereClause.classId = classId;

    const enrollments = await prisma.classEnrollment.findMany({
      where: whereClause,
      include: {
        class: true,
        student: true,
      },
      orderBy: { joinedAt: "desc" },
    });

    return NextResponse.json(enrollments);
  } catch (error: any) {
    console.error("Error fetching class enrollments:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/classes/enroll - Enroll a student in a class
export async function POST(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const body = await req.json();
    const { studentId, classId } = body;

    if (!studentId || !classId) {
      return NextResponse.json(
        { error: "studentId dan classId diperlukan" },
        { status: 400 }
      );
    }

    // Check student and class existence
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    const targetClass = await prisma.class.findUnique({ where: { id: classId } });

    if (!student) {
      return NextResponse.json({ error: "Siswa tidak ditemukan" }, { status: 404 });
    }
    if (!targetClass) {
      return NextResponse.json({ error: "Kelas tidak ditemukan" }, { status: 404 });
    }

    // Upsert enrollment to prevent duplicate in SAME class
    const enrollment = await prisma.classEnrollment.upsert({
      where: {
        studentId_classId: {
          studentId,
          classId,
        },
      },
      update: {
        status: "ACTIVE",
      },
      create: {
        studentId,
        classId,
        status: "ACTIVE",
      },
      include: {
        class: true,
      },
    });

    // Recalculate enrolledCount for this class
    const newEnrolledCount = await prisma.classEnrollment.count({
      where: {
        classId,
        status: "ACTIVE",
      },
    });

    await prisma.class.update({
      where: { id: classId },
      data: { enrolledCount: newEnrolledCount },
    });

    // Reconstruct student's active class summary string (e.g. "Kelas A, Kelas B")
    const allStudentEnrollments = await prisma.classEnrollment.findMany({
      where: {
        studentId,
        status: "ACTIVE",
      },
      include: { class: true },
    });

    const classNames = allStudentEnrollments.map((e) => e.class.className);
    const combinedClassName = classNames.length > 0 ? classNames.join(", ") : null;

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: { className: combinedClassName },
      include: {
        branch: true,
        currentLevel: true,
        enrollments: {
          include: { class: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      enrollment,
      classEnrolledCount: newEnrolledCount,
      student: {
        id: updatedStudent.id,
        name: updatedStudent.studentName,
        className: updatedStudent.className || "-",
        enrolledClasses: updatedStudent.enrollments.map((e) => ({
          id: e.class.id,
          className: e.class.className,
          programType: e.class.programType,
          days: e.class.days,
          time: e.class.time,
        })),
      },
    });
  } catch (error: any) {
    console.error("Error enrolling student in class:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/classes/enroll - Remove student from a class
export async function DELETE(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const body = await req.json();
    const { studentId, classId } = body;

    if (!studentId || !classId) {
      return NextResponse.json(
        { error: "studentId dan classId diperlukan" },
        { status: 400 }
      );
    }

    // Delete enrollment record if exists
    await prisma.classEnrollment.deleteMany({
      where: {
        studentId,
        classId,
      },
    });

    // Recalculate enrolledCount for this class
    const newEnrolledCount = await prisma.classEnrollment.count({
      where: {
        classId,
        status: "ACTIVE",
      },
    });

    await prisma.class.update({
      where: { id: classId },
      data: { enrolledCount: newEnrolledCount },
    });

    // Reconstruct student's active class summary string
    const remainingEnrollments = await prisma.classEnrollment.findMany({
      where: {
        studentId,
        status: "ACTIVE",
      },
      include: { class: true },
    });

    const classNames = remainingEnrollments.map((e) => e.class.className);
    const combinedClassName = classNames.length > 0 ? classNames.join(", ") : null;

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: { className: combinedClassName },
      include: {
        branch: true,
        currentLevel: true,
        enrollments: {
          include: { class: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      classEnrolledCount: newEnrolledCount,
      student: {
        id: updatedStudent.id,
        name: updatedStudent.studentName,
        className: updatedStudent.className || "-",
        enrolledClasses: updatedStudent.enrollments.map((e) => ({
          id: e.class.id,
          className: e.class.className,
          programType: e.class.programType,
          days: e.class.days,
          time: e.class.time,
        })),
      },
    });
  } catch (error: any) {
    console.error("Error removing student from class:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
