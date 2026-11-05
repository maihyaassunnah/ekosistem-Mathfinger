const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 STARTING MIGRATION: Fix Classes, Enrollments, and Students Isolation");

  // 1. Fetch branches
  const singkut = await prisma.branch.findFirst({ where: { branchName: 'Singkut' } });
  const bangko = await prisma.branch.findFirst({ where: { branchName: 'Bangko' } });

  if (!singkut || !bangko) {
    throw new Error("Branches not found!");
  }

  console.log(`Singkut ID: ${singkut.id}`);
  console.log(`Bangko ID: ${bangko.id}`);

  // 2. Define the 9 Canonical Classes
  const canonicalClasses = [
    // --- SINGKUT (3 Classes) ---
    {
      className: "CLASS A",
      branchId: singkut.id,
      days: "Sabtu & Ahad",
      time: "09:00 - 10:00",
      teacherName: "Febrianti Dewi, S.Pd",
      room: "Ruang A1",
      levelName: "Level 1: Penjumlahan & Pengurangan Angka Satuan",
      maxCapacity: 20,
      programType: "MATEMATIKA",
      status: "ACTIVE"
    },
    {
      className: "CLASS B",
      branchId: singkut.id,
      days: "Sabtu & Ahad",
      time: "14:00 - 15:30",
      teacherName: "Febrianti Dewi, S.Pd",
      room: "Ruang A2",
      levelName: "Level 1: Penjumlahan & Pengurangan Angka Satuan",
      maxCapacity: 20,
      programType: "MATEMATIKA",
      status: "ACTIVE"
    },
    {
      className: "CLASS C",
      branchId: singkut.id,
      days: "Kamis & Jumat",
      time: "13:30 - 14:30",
      teacherName: "Febrianti Dewi, S.Pd",
      room: "Ruang A1",
      levelName: "Level Dasar: Pengenalan Simbol Jari",
      maxCapacity: 15,
      programType: "MATEMATIKA",
      status: "ACTIVE"
    },

    // --- TABIR TIMUR / BANGKO (6 Classes) ---
    {
      className: "KELAS A1",
      branchId: bangko.id,
      days: "Senin & Rabu",
      time: "13:30 - 14:30",
      teacherName: "Dewi Safitri, S.H",
      room: "Ruang A1",
      levelName: "Level 1: Penjumlahan & Pengurangan Angka Satuan",
      maxCapacity: 20,
      programType: "MATEMATIKA",
      status: "ACTIVE"
    },
    {
      className: "KELAS A2",
      branchId: bangko.id,
      days: "Selasa & Kamis",
      time: "14:00 - 15:30",
      teacherName: "Uswatun Khasanah",
      room: "Ruang A2",
      levelName: "Level Dasar: Pengenalan Simbol Jari",
      maxCapacity: 15,
      programType: "MATEMATIKA",
      status: "ACTIVE"
    },
    {
      className: "KELAS B",
      branchId: bangko.id,
      days: "Jumat & Minggu",
      time: "14:00 - 15:30",
      teacherName: "Dewi Safitri, S.H",
      room: "Ruang B",
      levelName: "Level 1: Penjumlahan & Pengurangan Angka Satuan",
      maxCapacity: 25,
      programType: "MATEMATIKA",
      status: "ACTIVE"
    },
    {
      className: "KELAS C",
      branchId: bangko.id,
      days: "Sabtu & Minggu",
      time: "14:00 - 15:30",
      teacherName: "Uswatun Khasanah",
      room: "Ruang C",
      levelName: "Level Dasar: Pengenalan Simbol Jari",
      maxCapacity: 20,
      programType: "MATEMATIKA",
      status: "ACTIVE"
    },
    {
      className: "KELAS D",
      branchId: bangko.id,
      days: "Sabtu & Ahad",
      time: "14:00 - 15:30",
      teacherName: "Lailatus Istianah ",
      room: "Ruang D",
      levelName: "Level Dasar: Pengenalan Simbol Jari",
      maxCapacity: 15,
      programType: "MATEMATIKA",
      status: "ACTIVE"
    },
    {
      className: "bee",
      branchId: bangko.id,
      days: "Rabu & Jumat",
      time: "14:00 - 15:30",
      teacherName: "Dewi Safitri, S.H.",
      room: "Ruang Baca",
      levelName: "Level 1: Pra-Membaca & Pengenalan Huruf",
      maxCapacity: 12,
      programType: "MEMBACA",
      status: "ACTIVE"
    }
  ];

  // 3. Upsert canonical classes
  const classMap = {}; // key: branchId_className -> Class record
  for (const cData of canonicalClasses) {
    let cls = await prisma.class.findFirst({
      where: {
        branchId: cData.branchId,
        className: cData.className
      }
    });

    if (cls) {
      cls = await prisma.class.update({
        where: { id: cls.id },
        data: cData
      });
      console.log(`✅ Updated canonical class: "${cls.className}" (${cls.branchId === singkut.id ? 'Singkut' : 'Bangko'}) -> ${cls.id}`);
    } else {
      cls = await prisma.class.create({
        data: cData
      });
      console.log(`✨ Created canonical class: "${cls.className}" (${cls.branchId === singkut.id ? 'Singkut' : 'Bangko'}) -> ${cls.id}`);
    }
    classMap[`${cls.branchId}_${cls.className}`] = cls;
  }

  // 4. Update Students className & link to Canonical Class
  const students = await prisma.student.findMany({
    include: { branch: true }
  });

  console.log(`\nProcessing ${students.length} students...`);

  // Mapping rules:
  // Singkut:
  //   "Kelas A" / "CLASS A" -> "CLASS A"
  //   "Kelas B" / "CLASS B" -> "CLASS B"
  //   "CLASS C" -> "CLASS C"
  // Bangko:
  //   "KELAS A1" / "CLASS A1" -> "KELAS A1"
  //   "KELAS A2" / "Kelas A2" -> "KELAS A2"
  //   "KELAS B" / "CLASS B" -> "KELAS B"
  //   "KELAS C" / "CLASS C" -> "KELAS C"
  //   "Kelas D" / "KELAS D" -> "KELAS D"
  //   "bee" -> "bee"
  //   "Alumni" -> "Alumni"

  let updatedStudents = 0;
  for (const s of students) {
    let newClassName = s.className;
    if (s.branchId === singkut.id) {
      if (s.className === 'Kelas A' || s.className === 'CLASS A') newClassName = 'CLASS A';
      else if (s.className === 'Kelas B' || s.className === 'CLASS B') newClassName = 'CLASS B';
      else if (s.className === 'CLASS C') newClassName = 'CLASS C';
    } else if (s.branchId === bangko.id) {
      if (s.className === 'KELAS A1' || s.className === 'CLASS A1') newClassName = 'KELAS A1';
      else if (s.className === 'KELAS A2' || s.className === 'Kelas A2') newClassName = 'KELAS A2';
      else if (s.className === 'KELAS B' || s.className === 'CLASS B') newClassName = 'KELAS B';
      else if (s.className === 'KELAS C' || s.className === 'CLASS C') newClassName = 'KELAS C';
      else if (s.className === 'Kelas D' || s.className === 'KELAS D') newClassName = 'KELAS D';
      else if (s.className === 'bee') newClassName = 'bee';
      else if (s.className === 'Alumni') newClassName = 'Alumni';
    }

    if (newClassName !== s.className) {
      await prisma.student.update({
        where: { id: s.id },
        data: { className: newClassName }
      });
      updatedStudents++;
    }
  }
  console.log(`✅ Standardized className for ${updatedStudents} students.`);

  // 5. Clean & recreate ClassEnrollments
  console.log("\nRecreating ClassEnrollments for all students...");
  await prisma.classEnrollment.deleteMany({}); // clean old messy enrollments

  let enrolledCount = 0;
  for (const s of students) {
    let targetClassName = s.className;
    if (s.branchId === singkut.id) {
      if (s.className === 'Kelas A' || s.className === 'CLASS A') targetClassName = 'CLASS A';
      else if (s.className === 'Kelas B' || s.className === 'CLASS B') targetClassName = 'CLASS B';
      else if (s.className === 'CLASS C') targetClassName = 'CLASS C';
    } else if (s.branchId === bangko.id) {
      if (s.className === 'KELAS A1' || s.className === 'CLASS A1') targetClassName = 'KELAS A1';
      else if (s.className === 'KELAS A2' || s.className === 'Kelas A2') targetClassName = 'KELAS A2';
      else if (s.className === 'KELAS B' || s.className === 'CLASS B') targetClassName = 'KELAS B';
      else if (s.className === 'KELAS C' || s.className === 'CLASS C') targetClassName = 'KELAS C';
      else if (s.className === 'Kelas D' || s.className === 'KELAS D') targetClassName = 'KELAS D';
      else if (s.className === 'bee') targetClassName = 'bee';
    }

    const targetClass = classMap[`${s.branchId}_${targetClassName}`];
    if (targetClass) {
      await prisma.classEnrollment.create({
        data: {
          studentId: s.id,
          classId: targetClass.id,
          status: 'ACTIVE'
        }
      });
      enrolledCount++;
    }
  }
  console.log(`✅ Created ${enrolledCount} active ClassEnrollments!`);

  // 6. Delete obsolete classes from database
  const canonicalIds = Object.values(classMap).map(c => c.id);
  const obsoleteClasses = await prisma.class.findMany({
    where: { id: { notIn: canonicalIds } }
  });

  console.log(`\nFound ${obsoleteClasses.length} obsolete classes to delete:`);
  for (const obs of obsoleteClasses) {
    console.log(`- Deleting obsolete class: "${obs.className}" (${obs.branchId === singkut.id ? 'Singkut' : 'Bangko'}) [${obs.id}]`);
    // Delete any remaining references if any
    await prisma.classEnrollment.deleteMany({ where: { classId: obs.id } });
    await prisma.attendance.updateMany({ where: { classId: obs.id }, data: { classId: null } });
    await prisma.class.delete({ where: { id: obs.id } });
  }

  // 7. Update StudentGrades className to match canonical names
  console.log("\nStandardizing StudentGrades className...");
  const singkutA = await prisma.studentGrade.updateMany({
    where: { branchId: singkut.id, className: 'Kelas A' },
    data: { className: 'CLASS A' }
  });
  const singkutB = await prisma.studentGrade.updateMany({
    where: { branchId: singkut.id, className: 'Kelas B' },
    data: { className: 'CLASS B' }
  });
  const bangkoA1 = await prisma.studentGrade.updateMany({
    where: { branchId: bangko.id, className: 'CLASS A1' },
    data: { className: 'KELAS A1' }
  });
  const bangkoA2 = await prisma.studentGrade.updateMany({
    where: { branchId: bangko.id, className: 'Kelas A2' },
    data: { className: 'KELAS A2' }
  });
  const bangkoB = await prisma.studentGrade.updateMany({
    where: { branchId: bangko.id, className: 'CLASS B' },
    data: { className: 'KELAS B' }
  });
  const bangkoC = await prisma.studentGrade.updateMany({
    where: { branchId: bangko.id, className: 'CLASS C' },
    data: { className: 'KELAS C' }
  });
  const bangkoD = await prisma.studentGrade.updateMany({
    where: { branchId: bangko.id, className: 'Kelas D' },
    data: { className: 'KELAS D' }
  });

  console.log(`Updated grades:
  - Singkut Kelas A -> CLASS A: ${singkutA.count}
  - Singkut Kelas B -> CLASS B: ${singkutB.count}
  - Bangko CLASS A1 -> KELAS A1: ${bangkoA1.count}
  - Bangko Kelas A2 -> KELAS A2: ${bangkoA2.count}
  - Bangko CLASS B -> KELAS B: ${bangkoB.count}
  - Bangko CLASS C -> KELAS C: ${bangkoC.count}
  - Bangko Kelas D -> KELAS D: ${bangkoD.count}`);

  // 8. Update TeacherJournals className
  await prisma.teacherJournal.updateMany({
    where: { branchId: singkut.id, className: 'Kelas A' },
    data: { className: 'CLASS A' }
  });
  await prisma.teacherJournal.updateMany({
    where: { branchId: singkut.id, className: 'Kelas B' },
    data: { className: 'CLASS B' }
  });

  // 9. Verify Final Counts
  console.log("\n=== FINAL VERIFICATION ===");
  const finalClasses = await prisma.class.findMany({
    include: {
      branch: true,
      _count: { select: { enrollments: true } }
    },
    orderBy: [{ branchId: 'asc' }, { className: 'asc' }]
  });

  for (const c of finalClasses) {
    console.log(`[${c.branch.branchName}] ${c.className}: ${c._count.enrollments} enrolled (Max: ${c.maxCapacity}) | Teacher: ${c.teacherName}`);
  }

  const finalGrades = await prisma.studentGrade.groupBy({
    by: ['branchId', 'className'],
    _count: { id: true }
  });
  console.log("\nGrades breakdown:");
  for (const g of finalGrades) {
    const bName = g.branchId === singkut.id ? 'Singkut' : 'Bangko';
    console.log(`[${bName}] ${g.className}: ${g._count.id} grades`);
  }

  console.log("\n🎉 MIGRATION COMPLETED SUCCESSFULLY!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
