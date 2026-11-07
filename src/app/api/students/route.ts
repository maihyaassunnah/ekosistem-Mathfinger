import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

// GET /api/students - Fetch all students with branch and level info
export async function GET(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const program = searchParams.get("program");
    const branch = searchParams.get("branch");

    const whereClause: any = {};
    if (program) {
      whereClause.programType = program.toUpperCase() === "MEMBACA" ? "MEMBACA" : "MATEMATIKA";
    }
    if (branch && branch !== "ALL") {
      whereClause.branch = { branchName: { contains: branch, mode: "insensitive" } };
    }

    const students = await prisma.student.findMany({
      where: whereClause,
      include: {
        branch: true,
        currentLevel: true,
        enrollments: {
          where: { status: "ACTIVE" },
          include: { class: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const formatted = students.map((s, idx) => {
      const enrolledClasses = (s.enrollments || []).map((e) => ({
        id: e.class.id,
        className: e.class.className,
        programType: e.class.programType,
        days: e.class.days,
        time: e.class.time,
      }));

      const activeClassNames = enrolledClasses.map((c) => c.className);
      const displayClassName = activeClassNames.length > 0 ? activeClassNames.join(", ") : (s.className || "-");

      return {
        id: s.id,
        index: idx + 1,
        studentCode: s.studentCode,
        name: s.studentName,
        studentName: s.studentName,
        gender: (s.gender as "P" | "L") || (s.qrIdentifier?.includes("P") ? "P" : "L"),
        codeLabel: s.gender === "L" ? "6L" : "8P",
        branch: (s.branch?.branchName as "Singkut" | "Bangko") || "Singkut",
        branchId: s.branchId,
        className: displayClassName,
        enrolledClasses,
        birthPlace: s.birthPlace || "Singkut",
        birthDate: s.birthDate || "2018-01-01",
        address: s.address || "Jl. Poros Singkut",
        gradeLevel: s.gradeLevel || (s.currentLevel?.levelName ? `Ket: ${s.currentLevel.levelName}` : "Ket: Kelas 3"),
        parentName: s.parentName,
        parentWhatsapp: s.parentWhatsapp,
        levelCurriculum:
          s.programType === "MEMBACA"
            ? (s.gradeLevel || "Level 1: Pra-Membaca & Pengenalan Huruf")
            : (s.currentLevel?.levelName || "Level Dasar: Pengenalan Simbol Jari"),
        registeredDate: s.registeredDate ? s.registeredDate.toISOString().split("T")[0] : s.createdAt.toISOString().split("T")[0],
        status: s.status,
        programType: s.programType || "MATEMATIKA",
      };
    });

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/students - Create a new student
export async function POST(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

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
    if (!branch) {
      branch = await prisma.branch.create({
        data: {
          branchCode: "SKT",
          branchName: "Singkut",
          address: "Sungai Gedang, Kec. Singkut, Kab. Sarolangun, Jambi",
          phone: "0812-7949-8907",
          programs: "MATEMATIKA,MEMBACA",
        },
      });
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
    if (!level) {
      level = await prisma.level.create({
        data: {
          levelName: "Level Dasar: Pengenalan Simbol Jari",
          orderIndex: 1,
        },
      });
    }

    let code = (body.studentCode || "").trim();
    if (!code) {
      if (body.programType === "MEMBACA") {
        const count = await prisma.student.count({ where: { programType: "MEMBACA" } });
        code = `MB-${101 + count}`;
      } else {
        code = Math.floor(10000 + Math.random() * 90000).toString();
      }
    }

    // Ensure studentCode & qrIdentifier are guaranteed unique in PostgreSQL
    let existing = await prisma.student.findFirst({
      where: {
        OR: [{ studentCode: code }, { qrIdentifier: `MF-QR-${code}` }],
      },
    });
    while (existing) {
      if (body.programType === "MEMBACA") {
        code = `MB-${Math.floor(100 + Math.random() * 900)}`;
      } else {
        code = Math.floor(10000 + Math.random() * 90000).toString();
      }
      existing = await prisma.student.findFirst({
        where: {
          OR: [{ studentCode: code }, { qrIdentifier: `MF-QR-${code}` }],
        },
      });
    }

    const safeRegisteredDate =
      body.registeredDate && !isNaN(new Date(body.registeredDate).getTime())
        ? new Date(body.registeredDate)
        : new Date();

    const created = await prisma.student.create({
      data: {
        studentCode: code,
        qrIdentifier: `MF-QR-${code}`,
        studentName: studentName,
        gender: body.gender || "P",
        className: body.className || (body.programType === "MEMBACA" ? "Kelas Membaca 1" : "Kelas A"),
        birthPlace: body.birthPlace || "Singkut",
        birthDate: body.birthDate || "2018-01-01",
        address: body.address || "Jl. Poros Singkut",
        schoolOrigin: body.schoolOrigin || (branchName === "Singkut" ? "SDN 1 Singkut" : "SDN 1 Bangko"),
        gradeLevel:
          body.programType === "MEMBACA"
            ? (body.levelCurriculum || body.gradeLevel || "Level 1: Pra-Membaca & Pengenalan Huruf")
            : (body.gradeLevel || "Ket: Kelas 3"),
        parentName: parentName,
        parentWhatsapp: parentWhatsapp,
        branchId: branch!.id,
        currentLevelId: level!.id,
        registeredDate: safeRegisteredDate,
        programType: (body.programType === "MEMBACA" ? "MEMBACA" : "MATEMATIKA") as any,
      },
      include: {
        branch: true,
        currentLevel: true,
      },
    });

    // Automatically enroll in ClassEnrollment if className is specified
    let targetClass = null;
    const requestedClass = body.className || created.className;
    if (requestedClass && requestedClass !== "-") {
      targetClass = await prisma.class.findFirst({
        where: {
          className: { equals: requestedClass.trim(), mode: "insensitive" },
          branchId: branch!.id,
        },
      });
      if (targetClass) {
        await prisma.classEnrollment.upsert({
          where: {
            studentId_classId: {
              studentId: created.id,
              classId: targetClass.id,
            },
          },
          update: {
            status: "ACTIVE",
            branchId: targetClass.branchId,
          },
          create: {
            studentId: created.id,
            classId: targetClass.id,
            branchId: targetClass.branchId,
            status: "ACTIVE",
          },
        });
        const newCount = await prisma.classEnrollment.count({
          where: { classId: targetClass.id, status: "ACTIVE" },
        });
        await prisma.class.update({
          where: { id: targetClass.id },
          data: { enrolledCount: newCount },
        });
      }
    }

    const enrolledClasses = targetClass
      ? [
          {
            id: targetClass.id,
            className: targetClass.className,
            programType: targetClass.programType,
            days: targetClass.days,
            time: targetClass.time,
          },
        ]
      : [];

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
      className: targetClass?.className || created.className || "Kelas A",
      enrolledClasses,
      birthPlace: created.birthPlace || "-",
      birthDate: created.birthDate || "-",
      address: created.address || "-",
      gradeLevel: created.gradeLevel || "Ket: Kelas 3",
      parentName: created.parentName,
      parentWhatsapp: created.parentWhatsapp,
      levelCurriculum:
        created.programType === "MEMBACA"
          ? (created.gradeLevel || "Level 1: Pra-Membaca & Pengenalan Huruf")
          : (created.currentLevel?.levelName || "Level Dasar: Pengenalan Simbol Jari"),
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
    const { error } = await requireAuth();
    if (error) return error;

    const body = await req.json();
    const { id, name, parentName, parentWhatsapp, gender, className, birthPlace, birthDate, address, gradeLevel, levelCurriculum, branch, status } = body;

    if (!id) {
      return NextResponse.json({ error: "ID siswa diperlukan" }, { status: 400 });
    }

    const currentStudent = await prisma.student.findUnique({
      where: { id },
      include: {
        branch: true,
        enrollments: {
          where: { status: "ACTIVE" },
          include: { class: true },
        },
      },
    });

    if (!currentStudent) {
      return NextResponse.json({ error: "Siswa tidak ditemukan" }, { status: 404 });
    }

    let branchId: string | undefined = undefined;
    if (branch) {
      const b = await prisma.branch.findFirst({
        where: { branchName: { contains: branch, mode: "insensitive" } },
      });
      if (b) branchId = b.id;
    }

    const effectiveBranchId = branchId || currentStudent.branchId;
    const effectiveProgramType = (body.programType || currentStudent.programType || "MATEMATIKA") as any;

    let currentLevelId: string | undefined = undefined;
    if (levelCurriculum) {
      const l = await prisma.level.findFirst({
        where: { levelName: { contains: levelCurriculum.replace("Ket: ", ""), mode: "insensitive" } },
      });
      if (l) currentLevelId = l.id;
    }

    let mappedStatus: "ACTIVE" | "INACTIVE" | "GRADUATED" | undefined = undefined;
    if (status !== undefined) {
      const s = String(status).toUpperCase();
      if (s === "INACTIVE" || s === "TIDAK AKTIF" || s === "NONAKTIF") {
        mappedStatus = "INACTIVE";
      } else if (s === "GRADUATED" || s === "LULUS" || s === "ALUMNI") {
        mappedStatus = "GRADUATED";
      } else if (s === "ACTIVE" || s === "AKTIF") {
        mappedStatus = "ACTIVE";
      }
    }

    // Synchronize ClassEnrollment when className is provided
    let finalClassName: string | null | undefined = className;
    if (className !== undefined) {
      const cleanClassName = (className || "").trim();
      if (!cleanClassName || cleanClassName === "-") {
        // Unenroll from current active classes in this program
        const prevEnrollments = await prisma.classEnrollment.findMany({
          where: {
            studentId: id,
            class: { programType: effectiveProgramType },
          },
          select: { classId: true },
        });

        if (prevEnrollments.length > 0) {
          const prevClassIds = prevEnrollments.map((e) => e.classId);
          await prisma.classEnrollment.deleteMany({
            where: {
              studentId: id,
              classId: { in: prevClassIds },
            },
          });
          for (const cid of prevClassIds) {
            const count = await prisma.classEnrollment.count({
              where: { classId: cid, status: "ACTIVE" },
            });
            await prisma.class.update({
              where: { id: cid },
              data: { enrolledCount: count },
            });
          }
        }
        finalClassName = null;
      } else {
        // Find target class strictly scoped by effectiveBranchId
        const targetClass = await prisma.class.findFirst({
          where: {
            className: { equals: cleanClassName, mode: "insensitive" },
            branchId: effectiveBranchId,
          },
        });

        if (targetClass) {
          finalClassName = targetClass.className;

          // Remove old active enrollments for this student in this program (except target class)
          const oldEnrollments = await prisma.classEnrollment.findMany({
            where: {
              studentId: id,
              class: { programType: effectiveProgramType },
              classId: { not: targetClass.id },
            },
            select: { classId: true },
          });

          if (oldEnrollments.length > 0) {
            const oldClassIds = oldEnrollments.map((e) => e.classId);
            await prisma.classEnrollment.deleteMany({
              where: {
                studentId: id,
                classId: { in: oldClassIds },
              },
            });
            for (const oldId of oldClassIds) {
              const count = await prisma.classEnrollment.count({
                where: { classId: oldId, status: "ACTIVE" },
              });
              await prisma.class.update({
                where: { id: oldId },
                data: { enrolledCount: count },
              });
            }
          }

          // Enroll student into targetClass
          await prisma.classEnrollment.upsert({
            where: {
              studentId_classId: {
                studentId: id,
                classId: targetClass.id,
              },
            },
            update: {
              status: "ACTIVE",
              branchId: targetClass.branchId,
            },
            create: {
              studentId: id,
              classId: targetClass.id,
              branchId: targetClass.branchId,
              status: "ACTIVE",
            },
          });

          // Recalculate enrolledCount for targetClass
          const newTargetCount = await prisma.classEnrollment.count({
            where: { classId: targetClass.id, status: "ACTIVE" },
          });
          await prisma.class.update({
            where: { id: targetClass.id },
            data: { enrolledCount: newTargetCount },
          });
        }
      }
    }

    const updated = await prisma.student.update({
      where: { id },
      data: {
        ...(name ? { studentName: name } : {}),
        ...(parentName ? { parentName } : {}),
        ...(parentWhatsapp ? { parentWhatsapp } : {}),
        ...(gender ? { gender } : {}),
        ...(className !== undefined ? { className: finalClassName } : {}),
        ...(birthPlace ? { birthPlace } : {}),
        ...(birthDate ? { birthDate } : {}),
        ...(address ? { address } : {}),
        ...(gradeLevel ? { gradeLevel } : {}),
        ...(branchId ? { branchId } : {}),
        ...(currentLevelId ? { currentLevelId } : {}),
        ...(body.programType ? { programType: body.programType as any } : {}),
        ...(mappedStatus ? { status: mappedStatus } : {}),
      },
      include: {
        branch: true,
        currentLevel: true,
        enrollments: {
          where: { status: "ACTIVE" },
          include: { class: true },
        },
      },
    });

    const enrolledClasses = (updated.enrollments || []).map((e) => ({
      id: e.class.id,
      className: e.class.className,
      programType: e.class.programType,
      days: e.class.days,
      time: e.class.time,
    }));
    const activeClassNames = enrolledClasses.map((c) => c.className);
    const displayClassName = activeClassNames.length > 0 ? activeClassNames.join(", ") : (updated.className || "-");

    return NextResponse.json({
      id: updated.id,
      studentCode: updated.studentCode,
      name: updated.studentName,
      studentName: updated.studentName,
      gender: updated.gender,
      codeLabel: updated.gender === "L" ? "6L" : "8P",
      branch: updated.branch?.branchName || "Singkut",
      branchId: updated.branchId,
      className: displayClassName,
      enrolledClasses,
      birthPlace: updated.birthPlace,
      birthDate: updated.birthDate,
      address: updated.address,
      gradeLevel: updated.gradeLevel,
      parentName: updated.parentName,
      parentWhatsapp: updated.parentWhatsapp,
      levelCurriculum: updated.currentLevel?.levelName,
      status: updated.status,
      programType: updated.programType || "MATEMATIKA",
    });
  } catch (error: any) {
    console.error("Error updating student:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/students - Quick status or field toggle
export async function PATCH(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const body = await req.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json({ error: "ID siswa diperlukan" }, { status: 400 });
    }

    let mappedStatus: "ACTIVE" | "INACTIVE" | "GRADUATED" | undefined = undefined;
    if (status !== undefined) {
      const s = String(status).toUpperCase();
      if (s === "INACTIVE" || s === "TIDAK AKTIF" || s === "NONAKTIF") {
        mappedStatus = "INACTIVE";
      } else if (s === "GRADUATED" || s === "LULUS" || s === "ALUMNI") {
        mappedStatus = "GRADUATED";
      } else if (s === "ACTIVE" || s === "AKTIF") {
        mappedStatus = "ACTIVE";
      }
    }

    const updated = await prisma.student.update({
      where: { id },
      data: {
        ...(mappedStatus ? { status: mappedStatus } : {}),
      },
      include: {
        branch: true,
        currentLevel: true,
      },
    });

    return NextResponse.json({
      success: true,
      id: updated.id,
      status: updated.status,
      name: updated.studentName,
    });
  } catch (error: any) {
    console.error("Error patching student:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/students - Delete student
export async function DELETE(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID siswa diperlukan" }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { id },
      include: { enrollments: true },
    });
    if (student) {
      const classIds = student.enrollments.map((e) => e.classId);
      await prisma.student.delete({ where: { id } });
      for (const cid of classIds) {
        const count = await prisma.classEnrollment.count({
          where: { classId: cid, status: "ACTIVE" },
        });
        await prisma.class.update({
          where: { id: cid },
          data: { enrolledCount: count },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting student:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
