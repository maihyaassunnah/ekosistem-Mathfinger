const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("=== Memulai Sinkronisasi dan Perbaikan Nilai Per Cabang (10 Materi Singkut) ===");

  // 1. Get branches
  const branches = await prisma.branch.findMany();
  const singkut = branches.find(b => b.branchName.toLowerCase().includes("singkut"));
  const tabir = branches.find(b => b.branchName.toLowerCase().includes("tabir") || b.branchName.toLowerCase().includes("bangko"));

  if (!singkut || !tabir) {
    throw new Error("Cabang Singkut atau Tabir Timur tidak ditemukan");
  }

  console.log(`Cabang Singkut ID: ${singkut.id}`);
  console.log(`Cabang Tabir Timur ID: ${tabir.id}`);

  // 2. Fetch all students
  const singkutStudents = await prisma.student.findMany({
    where: { branchId: singkut.id, status: "ACTIVE" },
    orderBy: { studentName: "asc" }
  });
  console.log(`Jumlah siswa Singkut: ${singkutStudents.length}`);

  const tabirStudents = await prisma.student.findMany({
    where: { branchId: tabir.id, status: "ACTIVE" },
    orderBy: { studentName: "asc" }
  });
  console.log(`Jumlah siswa Tabir Timur: ${tabirStudents.length}`);

  // 3. Clean up duplicates in student_grades
  console.log("Membersihkan data nilai duplikat...");
  const allGrades = await prisma.studentGrade.findMany({
    orderBy: [{ score: "desc" }, { createdAt: "desc" }]
  });

  const seen = new Set();
  const duplicatesToDelete = [];
  for (const g of allGrades) {
    const key = `${g.studentId}___${g.topic}___${g.examDate.toISOString().split("T")[0]}`;
    if (seen.has(key)) {
      duplicatesToDelete.push(g.id);
    } else {
      seen.add(key);
    }
  }

  if (duplicatesToDelete.length > 0) {
    console.log(`Menghapus ${duplicatesToDelete.length} data nilai duplikat...`);
    await prisma.studentGrade.deleteMany({
      where: { id: { in: duplicatesToDelete } }
    });
    console.log("Pembersihan duplikat selesai.");
  }

  // 4. Topics for Tabir Timur (6 Sesi Uji Lengkap)
  const tabirSessions = [
    { topic: "Penguatan Simbol + Persiapan Level 1", examDate: new Date("2026-09-06T00:00:00.000Z"), baseScore: 88, note: "Gerakan jari cepat dan tepat" },
    { topic: "Modul Level 1", examDate: new Date("2026-09-13T00:00:00.000Z"), baseScore: 86, note: "Fokus dan teliti menyelesaikan latihan" },
    { topic: "Penjumlahan Puluhan Satuan", examDate: new Date("2026-09-15T00:00:00.000Z"), baseScore: 90, note: "Akurasi formasi jari sangat baik" },
    { topic: "Modul LV 1 P+P", examDate: new Date("2026-09-21T00:00:00.000Z"), baseScore: 87, note: "Peningkatan kecepatan hitung jari" },
    { topic: "LV 1  Pengurangan", examDate: new Date("2026-09-21T00:00:00.000Z"), baseScore: 85, note: "Mampu membedakan gerakan jari turun" },
    { topic: "Operasi Campuran (+,-,x)", examDate: new Date("2026-09-27T00:00:00.000Z"), baseScore: 92, note: "Sangat baik dalam operasi gabungan" },
  ];

  console.log("Melengkapi nilai untuk seluruh siswa Tabir Timur...");
  for (const session of tabirSessions) {
    for (let idx = 0; idx < tabirStudents.length; idx++) {
      const student = tabirStudents[idx];
      if (student.programType === "MEMBACA") continue;

      const existing = await prisma.studentGrade.findFirst({
        where: {
          studentId: student.id,
          topic: session.topic,
          examDate: session.examDate,
        }
      });

      if (!existing) {
        const variance = ((idx * 7 + session.baseScore) % 15) - 5;
        const score = Math.min(100, Math.max(78, session.baseScore + variance));
        await prisma.studentGrade.create({
          data: {
            studentId: student.id,
            branchId: tabir.id,
            className: student.className || "Kelas Reguler",
            topic: session.topic,
            examDate: session.examDate,
            score: score,
            isJoined: true,
            notes: score >= 90 ? "Sangat cepat / fokus tinggi" : session.note,
          }
        });
      }
    }
  }

  // 5. Topics for Singkut (10 Sesi Uji Lengkap)
  const singkutSessions = [
    { topic: "Menulis angka puluhan berdasarkan simbol 1", examDate: new Date("2026-08-15T00:00:00.000Z"), baseScore: 90, note: "Sangat antusias memahami simbol dasar" },
    { topic: "Menulis angka puluhan berdasarkan simbol 2", examDate: new Date("2026-08-16T00:00:00.000Z"), baseScore: 91, note: "Akurasi gerakan jari jemari bagus" },
    { topic: "Hitung dan tulis", examDate: new Date("2026-08-16T00:00:00.000Z"), baseScore: 88, note: "Menyelesaikan 15 soal tepat waktu" },
    { topic: "Level 1 hlm 1-2", examDate: new Date("2026-08-22T00:00:00.000Z"), baseScore: 89, note: "Sangat cepat dan fokus tinggi" },
    { topic: "Penjumlahan dasar", examDate: new Date("2026-08-22T00:00:00.000Z"), baseScore: 92, note: "Gerakan jari naik teratur dan mantap" },
    { topic: "Penjumlahan berderet", examDate: new Date("2026-08-30T00:00:00.000Z"), baseScore: 91, note: "Mampu berhitung berantai tanpa jeda" },
    { topic: "Pengurangan (jari turun)", examDate: new Date("2026-09-06T00:00:00.000Z"), baseScore: 87, note: "Refleks jari turun akurat" },
    { topic: "Penjumlahan Kombinasi 5 (+4, +3)", examDate: new Date("2026-09-06T00:00:00.000Z"), baseScore: 93, note: "Refleks jari kombinasi 5 sangat lancar" },
    { topic: "Math card game", examDate: new Date("2026-09-13T00:00:00.000Z"), baseScore: 94, note: "Cepat dan tanggap membaca kartu matematika" },
    { topic: "Penjumlahan puluhan dan satuan", examDate: new Date("2026-09-27T00:00:00.000Z"), baseScore: 95, note: "Formasi puluhan kiri dan satuan kanan sempurna" },
  ];

  console.log("Mengisi nilai 10 sesi uji untuk seluruh siswa Singkut...");
  for (const session of singkutSessions) {
    for (let idx = 0; idx < singkutStudents.length; idx++) {
      const student = singkutStudents[idx];
      const existing = await prisma.studentGrade.findFirst({
        where: {
          studentId: student.id,
          topic: session.topic,
          examDate: session.examDate,
        }
      });

      if (!existing) {
        let score = session.baseScore;
        let note = session.note;

        if (student.studentName.toLowerCase().includes("aishwa")) {
          if (session.topic.includes("simbol 1")) score = 92;
          else if (session.topic.includes("Hitung")) score = 88;
          else if (session.topic.includes("simbol 2")) score = 90;
          else if (session.topic.includes("Level 1")) score = 95;
          else if (session.topic.includes("dasar")) score = 94;
          else if (session.topic.includes("berderet")) score = 96;
          else if (session.topic.includes("turun")) score = 92;
          else if (session.topic.includes("Kombinasi 5")) score = 96;
          else if (session.topic.includes("card game")) score = 95;
          else if (session.topic.includes("puluhan")) score = 98;
        } else if (student.studentName.toLowerCase().includes("alesha")) {
          if (session.topic.includes("simbol 1")) score = 86;
          else if (session.topic.includes("Hitung")) score = 82;
          else if (session.topic.includes("simbol 2")) score = 88;
          else if (session.topic.includes("Level 1")) score = 85;
          else if (session.topic.includes("dasar")) score = 87;
          else if (session.topic.includes("berderet")) score = 89;
          else if (session.topic.includes("turun")) score = 88;
          else if (session.topic.includes("Kombinasi 5")) score = 90;
          else if (session.topic.includes("card game")) score = 92;
          else if (session.topic.includes("puluhan")) score = 91;
        } else if (student.studentName.toLowerCase().includes("anandira")) {
          if (session.topic.includes("simbol 1")) score = 98;
          else if (session.topic.includes("Hitung")) score = 96;
          else if (session.topic.includes("simbol 2")) score = 95;
          else if (session.topic.includes("Level 1")) score = 100;
          else if (session.topic.includes("dasar")) score = 98;
          else if (session.topic.includes("berderet")) score = 97;
          else if (session.topic.includes("turun")) score = 96;
          else if (session.topic.includes("Kombinasi 5")) score = 98;
          else if (session.topic.includes("card game")) score = 99;
          else if (session.topic.includes("puluhan")) score = 100;
        } else if (student.studentName.toLowerCase().includes("haris")) {
          if (session.topic.includes("simbol 1")) score = 85;
          else if (session.topic.includes("Hitung")) score = 88;
          else if (session.topic.includes("simbol 2")) score = 90;
          else if (session.topic.includes("Level 1")) score = 92;
          else if (session.topic.includes("dasar")) score = 89;
          else if (session.topic.includes("berderet")) score = 91;
          else if (session.topic.includes("turun")) score = 93;
          else if (session.topic.includes("Kombinasi 5")) score = 95;
          else if (session.topic.includes("card game")) score = 94;
          else if (session.topic.includes("puluhan")) score = 96;
        } else {
          const variance = ((idx * 5 + session.baseScore) % 13) - 4;
          score = Math.min(98, Math.max(80, session.baseScore + variance));
        }

        await prisma.studentGrade.create({
          data: {
            studentId: student.id,
            branchId: singkut.id,
            className: student.className || "CLASS A",
            topic: session.topic,
            examDate: session.examDate,
            score: score,
            isJoined: true,
            notes: score >= 90 ? "Sangat cepat / fokus tinggi" : note,
          }
        });
      }
    }
  }

  // 6. Summary check
  const singkutGradeCount = await prisma.studentGrade.count({
    where: { branchId: singkut.id }
  });
  const tabirGradeCount = await prisma.studentGrade.count({
    where: { branchId: tabir.id }
  });

  console.log("=== Selesai Sinkronisasi ===");
  console.log(`Total nilai Cabang Singkut: ${singkutGradeCount}`);
  console.log(`Total nilai Cabang Tabir Timur: ${tabirGradeCount}`);
}

main()
  .catch((e) => {
    console.error("Gagal sinkronisasi nilai:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
