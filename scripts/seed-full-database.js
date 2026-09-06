const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Memulai Seeding Komprehensif 17 Tabel PostgreSQL...");

  // 1. CABANG (branches)
  console.log("📍 [1/17] Seeding Branches...");
  const singkut = await prisma.branch.upsert({
    where: { branchCode: "SKT" },
    update: {
      branchName: "Singkut",
      address: "Sungai Gedang, Kec. Singkut, Kab. Sarolangun, Jambi",
      phone: "0812-7949-8907",
      status: "ACTIVE",
    },
    create: {
      branchCode: "SKT",
      branchName: "Singkut",
      address: "Sungai Gedang, Kec. Singkut, Kab. Sarolangun, Jambi",
      phone: "0812-7949-8907",
      status: "ACTIVE",
    },
  });

  const bangko = await prisma.branch.upsert({
    where: { branchCode: "BGK" },
    update: {
      branchName: "Bangko",
      address: "Jl. Merak / Kenari, Kec. Bangko, Kab. Merangin, Jambi",
      phone: "0813-7972-0841",
      status: "ACTIVE",
    },
    create: {
      branchCode: "BGK",
      branchName: "Bangko",
      address: "Jl. Merak / Kenari, Kec. Bangko, Kab. Merangin, Jambi",
      phone: "0813-7972-0841",
      status: "ACTIVE",
    },
  });

  // 2. TINGKATAN KURIKULUM (levels)
  console.log("📚 [2/17] Seeding Levels & Kurikulum...");
  const levelsData = [
    {
      levelName: "Level Dasar: Pengenalan Simbol Jari",
      shortDesc: "Pengenalan simbol jari bilangan satuan dan puluhan (0-99)",
      targetAge: "Usia 4 - 6 Tahun",
      learningGoals: "Peserta didik mampu mengenal, membaca, dan membentuk simbol jari bilangan 0-99 menggunakan tangan kanan dan kiri.",
      competencies: "KD D.1 Menguasai simbol jari 0-9. KD D.2 Menguasai puluhan 10-90. KD D.3 Membaca 0-99.",
      learningMaterials: "1. Pengenalan simbol 0-9 tangan kanan\n2. Puluhan tangan kiri\n3. Flashcard simbol\n4. Senam motorik jari",
      indicators: JSON.stringify([
        "Mempraktikkan simbol jari satuan 0-9",
        "Membaca simbol puluhan tangan kiri",
        "Membentuk formasi angka acak dalam 3 detik",
      ]),
      orderIndex: 1,
      defaultSppPrice: 100000,
      bookPrice: 50000,
    },
    {
      levelName: "Level 1: Penjumlahan & Pengurangan Angka Satuan",
      shortDesc: "Gerak motorik buka tutup jari langsung tanpa rumus",
      targetAge: "Usia 6 - 8 Tahun",
      learningGoals: "Melakukan operasi penjumlahan dan pengurangan satuan secara reflek dan cepat.",
      competencies: "KD 1.1 Penjumlahan satuan langsung. KD 1.2 Pengurangan satuan langsung. KD 1.3 Berhitung cepat berantai 3 baris.",
      learningMaterials: "1. Aturan jari naik (+)\n2. Aturan jari turun (-)\n3. Mencongak refleks\n4. Kuis 1 menit 10 soal",
      indicators: JSON.stringify([
        "Operasi jari jempol (nilai 5) refleks",
        "Pengurangan tanpa ragu < 3 detik",
        "Akurasi kuis 100%",
      ]),
      orderIndex: 2,
      defaultSppPrice: 100000,
      bookPrice: 50000,
    },
    {
      levelName: "Level 2: Kombinasi Rumus Teman Kecil",
      shortDesc: "Formula teman kecil (angka 5) dan kombinasi puluhan",
      targetAge: "Usia 8 - 10 Tahun",
      learningGoals: "Memahami konsep teman kecil dan menyelesaikan penjumlahan/pengurangan ketika jari tidak mencukupi.",
      competencies: "KD 2.1 Teman kecil tambah (+4=+5-1, dst). KD 2.2 Teman kecil kurang (-4=-5+1, dst).",
      learningMaterials: "1. Pasangan teman kecil (1&4, 2&3)\n2. Gerakan kombinasi jempol dan telunjuk\n3. Soal cerita kontekstual",
      indicators: JSON.stringify([
        "Menyebut pasangan teman kecil spontan",
        "Mengoperasikan rumus tanpa jeda",
      ]),
      orderIndex: 3,
      defaultSppPrice: 120000,
      bookPrice: 60000,
    },
    {
      levelName: "Level 3: Mahir & Olimpiade",
      shortDesc: "Perkalian dan pembagian cepat jari serta operasi campuran",
      targetAge: "Usia 10 - 12 Tahun",
      learningGoals: "Menguasai perkalian dan pembagian jari tangan refleks serta persiapan olimpiade matematika.",
      competencies: "KD 3.1 Perkalian jari 6-10. KD 3.2 Pembagian jari cepat. KD 3.3 Hitung berantai 5 baris.",
      learningMaterials: "1. Rumus perkalian formasi jari\n2. Pembagian cepat\n3. Latihan olimpiade",
      indicators: JSON.stringify([
        "Perkalian 1-100 tanpa kertas cakar",
        "Kecepatan mencongak < 2 detik",
      ]),
      orderIndex: 4,
      defaultSppPrice: 150000,
      bookPrice: 75000,
    },
  ];

  const levelsMap = {};
  for (const lvl of levelsData) {
    let ex = await prisma.level.findFirst({ where: { levelName: lvl.levelName } });
    if (!ex) {
      ex = await prisma.level.create({ data: lvl });
    } else {
      ex = await prisma.level.update({ where: { id: ex.id }, data: lvl });
    }
    levelsMap[lvl.orderIndex] = ex;
  }

  // 3. PENGGUNA & ADMIN (users)
  console.log("👤 [3/17] Seeding Users & Admins...");
  const tutor = await prisma.user.upsert({
    where: { email: "tutor1.mathfingers@gmail.com" },
    update: { branchId: singkut.id, fullName: "Febrianti Dewi, S.Pd", phone: "0812-7949-8907" },
    create: {
      fullName: "Febrianti Dewi, S.Pd",
      email: "tutor1.mathfingers@gmail.com",
      passwordHash: await bcrypt.hash("password123", 10),
      phone: "0812-7949-8907",
      role: "TUTOR",
      status: "ACTIVE",
      branchId: singkut.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "singkut.mathfingers@gmail.com" },
    update: { branchId: singkut.id },
    create: {
      fullName: "Admin Singkut",
      email: "singkut.mathfingers@gmail.com",
      passwordHash: await bcrypt.hash("password123", 10),
      phone: "0812-7949-8907",
      role: "BRANCH_ADMIN",
      status: "ACTIVE",
      branchId: singkut.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "bangko.mathfingers@gmail.com" },
    update: { branchId: bangko.id },
    create: {
      fullName: "Admin Bangko",
      email: "bangko.mathfingers@gmail.com",
      passwordHash: await bcrypt.hash("password123", 10),
      phone: "0813-7972-0841",
      role: "BRANCH_ADMIN",
      status: "ACTIVE",
      branchId: bangko.id,
    },
  });

  // 4. KELAS (classes)
  console.log("🏫 [4/17] Seeding Classes...");
  const classesData = [
    {
      className: "Kelas A",
      branchId: singkut.id,
      days: "Senin & Kamis",
      time: "14:00 - 15:30 WIB",
      teacherName: "Febrianti Dewi, S.Pd",
      room: "Ruang Ceria - Lt. 1",
      levelName: "Level Dasar",
      enrolledCount: 8,
      maxCapacity: 15,
      status: "ACTIVE",
    },
    {
      className: "Kelas B",
      branchId: singkut.id,
      days: "Selasa & Jumat",
      time: "14:00 - 15:30 WIB",
      teacherName: "Febrianti Dewi, S.Pd",
      room: "Ruang Pintar - Lt. 1",
      levelName: "Level 1: Dasar",
      enrolledCount: 7,
      maxCapacity: 15,
      status: "ACTIVE",
    },
    {
      className: "CLASS C",
      branchId: bangko.id,
      days: "Rabu & Sabtu",
      time: "13:30 - 15:00 WIB",
      teacherName: "Wahyudin Hafiz, S.Pd",
      room: "Ruang Merak - Lt. 2",
      levelName: "Level Dasar",
      enrolledCount: 10,
      maxCapacity: 15,
      status: "ACTIVE",
    },
    {
      className: "Kelas A2",
      branchId: bangko.id,
      days: "Sabtu & Ahad",
      time: "09:00 - 10:30 WIB",
      teacherName: "Wahyudin Hafiz, S.Pd",
      room: "Ruang Kenari - Lt. 1",
      levelName: "Level 2: Terampil",
      enrolledCount: 9,
      maxCapacity: 15,
      status: "ACTIVE",
    },
  ];

  for (const c of classesData) {
    const ex = await prisma.class.findFirst({
      where: { className: c.className, branchId: c.branchId },
    });
    if (!ex) {
      await prisma.class.create({ data: c });
    }
  }

  // 5. SISWA (students)
  console.log("🎓 [5/17] Seeding Students...");
  const studentsList = [
    {
      studentCode: "79000",
      qrIdentifier: "MF-QR-79000",
      studentName: "Aishwa Rahma Annida",
      gender: "P",
      birthPlace: "Lahat",
      birthDate: "2018-01-03",
      address: "Sungai Gedang, Singkut",
      schoolOrigin: "SDN 1 Singkut",
      gradeLevel: "Kelas 4",
      className: "Kelas A",
      parentName: "Vetika",
      parentWhatsapp: "081279498907",
      branchId: singkut.id,
      currentLevelId: levelsMap[1].id,
    },
    {
      studentCode: "91212",
      qrIdentifier: "MF-QR-91212",
      studentName: "Ajeng Cahyra Naifasha",
      gender: "P",
      birthPlace: "Merangin",
      birthDate: "2018-05-03",
      address: "Jalan Kenari, Bangko",
      schoolOrigin: "SDN 2 Bangko",
      gradeLevel: "Kelas 2",
      className: "CLASS C",
      parentName: "Eni",
      parentWhatsapp: "08139602155",
      branchId: bangko.id,
      currentLevelId: levelsMap[1].id,
    },
    {
      studentCode: "78564",
      qrIdentifier: "MF-QR-78564",
      studentName: "Alesha Rafani Marta",
      gender: "P",
      birthPlace: "Padang Jantung",
      birthDate: "2016-09-06",
      address: "Jalan Merak, Bangko",
      schoolOrigin: "SD IT Bangko",
      gradeLevel: "Kelas 4",
      className: "Kelas A2",
      parentName: "Mala Noftobela",
      parentWhatsapp: "081379720841",
      branchId: bangko.id,
      currentLevelId: levelsMap[1].id,
    },
    {
      studentCode: "17055",
      qrIdentifier: "MF-QR-17055",
      studentName: "Anandira Dyah Asmara Wati",
      gender: "P",
      birthPlace: "Merangin",
      birthDate: "2018-11-18",
      address: "Jl Merpati, Bangko",
      schoolOrigin: "SDN 4 Merangin",
      gradeLevel: "Kelas 2",
      className: "CLASS C",
      parentName: "Agustina Wati",
      parentWhatsapp: "085837162339",
      branchId: bangko.id,
      currentLevelId: levelsMap[1].id,
    },
    {
      studentCode: "95452",
      qrIdentifier: "MF-QR-95452",
      studentName: "Ananta Virya",
      gender: "P",
      birthPlace: "Merangin",
      birthDate: "2017-08-13",
      address: "Jl Kutilang, Bangko",
      schoolOrigin: "SD Pertiwi",
      gradeLevel: "Kelas 3",
      className: "CLASS C",
      parentName: "Sudar",
      parentWhatsapp: "085382485578",
      branchId: bangko.id,
      currentLevelId: levelsMap[2].id,
    },
    {
      studentCode: "29797",
      qrIdentifier: "MF-QR-29797",
      studentName: "Aqila Fahmida",
      gender: "P",
      birthPlace: "Merangin",
      birthDate: "2015-12-12",
      address: "Jl Merak, Bangko",
      schoolOrigin: "SDN 1 Bangko",
      gradeLevel: "Kelas 5",
      className: "Kelas A2",
      parentName: "Maryono",
      parentWhatsapp: "08136398294",
      branchId: bangko.id,
      currentLevelId: levelsMap[2].id,
    },
    {
      studentCode: "88692",
      qrIdentifier: "MF-QR-88692",
      studentName: "Arasely Naura Shada",
      gender: "P",
      birthPlace: "Merangin",
      birthDate: "2017-03-01",
      address: "Jalan Enggang, Bangko",
      schoolOrigin: "SDN 3 Merangin",
      gradeLevel: "Kelas 4",
      className: "Kelas A2",
      parentName: "Reni Martuti",
      parentWhatsapp: "081368208100",
      branchId: bangko.id,
      currentLevelId: levelsMap[1].id,
    },
    {
      studentCode: "61022",
      qrIdentifier: "MF-QR-61022",
      studentName: "Bagas Pratama Putra",
      gender: "L",
      birthPlace: "Sarolangun",
      birthDate: "2018-02-14",
      address: "Desa Pasar Singkut",
      schoolOrigin: "SDN 2 Singkut",
      gradeLevel: "Kelas 3",
      className: "Kelas B",
      parentName: "Bambang Irawan",
      parentWhatsapp: "082188443321",
      branchId: singkut.id,
      currentLevelId: levelsMap[1].id,
    },
    {
      studentCode: "33918",
      qrIdentifier: "MF-QR-33918",
      studentName: "Calista Azkadina",
      gender: "P",
      birthPlace: "Singkut",
      birthDate: "2017-10-25",
      address: "Jl. Poros Singkut 1",
      schoolOrigin: "SD IT Singkut",
      gradeLevel: "Kelas 4",
      className: "Kelas A",
      parentName: "Dina Marlina",
      parentWhatsapp: "085299881144",
      branchId: singkut.id,
      currentLevelId: levelsMap[2].id,
    },
  ];

  const studentsMap = {};
  for (const s of studentsList) {
    const student = await prisma.student.upsert({
      where: { studentCode: s.studentCode },
      update: s,
      create: s,
    });
    studentsMap[s.studentCode] = student;
  }

  // 6. PRESENSI (attendances)
  console.log("📋 [6/17] Seeding Attendances...");
  const s1 = studentsMap["79000"];
  const s2 = studentsMap["91212"];
  const s8 = studentsMap["61022"];

  await prisma.attendance.upsert({
    where: {
      studentId_attendanceDate: {
        studentId: s1.id,
        attendanceDate: new Date("2026-09-06T00:00:00.000Z"),
      },
    },
    update: {},
    create: {
      studentId: s1.id,
      branchId: s1.branchId,
      tutorId: tutor.id,
      attendanceDate: new Date("2026-09-06T00:00:00.000Z"),
      method: "QR_SCAN",
      status: "HADIR",
      notes: "Scan Kartu QR Siswa - Hadir tepat waktu",
    },
  });

  // 7. JURNAL GURU (teacher_journals)
  console.log("📖 [7/17] Seeding Teacher Journals...");
  const journalsData = [
    {
      studentId: s1.id,
      branchId: s1.branchId,
      tutorId: tutor.id,
      studentName: s1.studentName,
      className: "Kelas A",
      teacherName: "Febrianti Dewi, S.Pd",
      topic: "Pengenalan Lambang Bilangan Jari 1-9",
      content: "Alhamdulillah ananda antusias mempraktikkan jari jempol sebagai angka 5 dan lancar membentuk simbol 1 sampai 9.",
      journalDate: new Date("2026-09-06"),
      refCode: "#345812",
    },
    {
      studentId: s2.id,
      branchId: s2.branchId,
      tutorId: tutor.id,
      studentName: s2.studentName,
      className: "CLASS C",
      teacherName: "Wahyudin Hafiz, S.Pd",
      topic: "Penjumlahan Langsung Jari Naik",
      content: "Ananda sudah sangat paham aturan jari naik dan mampu menjawab kuis 1 menit dengan nilai sempurna.",
      journalDate: new Date("2026-09-05"),
      refCode: "#2144b6",
    },
  ];

  for (const j of journalsData) {
    const ex = await prisma.teacherJournal.findFirst({ where: { refCode: j.refCode } });
    if (!ex) await prisma.teacherJournal.create({ data: j });
  }

  // 8. INPUT NILAI (student_grades)
  console.log("📝 [8/17] Seeding Student Grades...");
  const gradesData = [
    {
      studentId: s1.id,
      branchId: s1.branchId,
      className: "Kelas A",
      topic: "Kuis Refleks Jari Satuan 1-9",
      examDate: new Date("2026-09-06"),
      score: 95.0,
      isJoined: true,
      notes: "Sangat cepat dan akurat",
    },
    {
      studentId: s8.id,
      branchId: s8.branchId,
      className: "Kelas B",
      topic: "Kuis Penjumlahan Langsung",
      examDate: new Date("2026-09-06"),
      score: 90.0,
      isJoined: true,
      notes: "Peningkatan pesat",
    },
    {
      studentId: s2.id,
      branchId: s2.branchId,
      className: "CLASS C",
      topic: "Kuis Formasi Puluhan Jari Kiri",
      examDate: new Date("2026-09-05"),
      score: 88.0,
      isJoined: true,
      notes: "Perlu pengulangan angka 70-80",
    },
  ];

  for (const g of gradesData) {
    const ex = await prisma.studentGrade.findFirst({
      where: { studentId: g.studentId, topic: g.topic },
    });
    if (!ex) await prisma.studentGrade.create({ data: g });
  }

  // 9. KEAKTIFAN & SIKAP (student_behaviors)
  console.log("🌟 [9/17] Seeding Student Behaviors...");
  const behaviorsData = [
    {
      studentId: s1.id,
      branchId: s1.branchId,
      sessionTopic: "Latihan Kombinasi Ceria",
      behaviorDate: new Date("2026-09-06"),
      focus: "Sangat Baik",
      participation: "Sangat Aktif",
      attitude: "Sopan & Tertib",
      notes: "Suka membantu teman di sebelahnya",
    },
    {
      studentId: s8.id,
      branchId: s8.branchId,
      sessionTopic: "Berhitung Cepat 10 Menit",
      behaviorDate: new Date("2026-09-06"),
      focus: "Baik",
      participation: "Aktif",
      attitude: "Sopan & Tertib",
      notes: "Semangat tinggi",
    },
  ];

  for (const b of behaviorsData) {
    const ex = await prisma.studentBehavior.findFirst({
      where: { studentId: b.studentId, sessionTopic: b.sessionTopic },
    });
    if (!ex) await prisma.studentBehavior.create({ data: b });
  }

  // 10. TAGIHAN SPP (invoices)
  console.log("💰 [10/17] Seeding Invoices...");
  const inv1 = await prisma.invoice.upsert({
    where: { invoiceNumber: "INV/MF/2608/5138" },
    update: { period: "September 2026" },
    create: {
      invoiceNumber: "INV/MF/2608/5138",
      studentId: s1.id,
      branchId: s1.branchId,
      type: "SPP",
      period: "September 2026",
      amount: 100000,
      dueDate: new Date("2026-09-10"),
      status: "UNPAID",
    },
  });

  const inv2 = await prisma.invoice.upsert({
    where: { invoiceNumber: "INV/MF/2608/6455" },
    update: { period: "September 2026", paidMethod: "Tunai" },
    create: {
      invoiceNumber: "INV/MF/2608/6455",
      studentId: s2.id,
      branchId: s2.branchId,
      type: "SPP",
      period: "September 2026",
      amount: 100000,
      dueDate: new Date("2026-09-05"),
      status: "PAID",
      paymentMethod: "MANUAL_CASH",
      paidMethod: "Tunai",
      paidAt: new Date("2026-09-05"),
    },
  });

  // 11. MUTASI KAS (cash_mutations)
  console.log("💳 [11/17] Seeding Cash Mutations...");
  const mut1 = await prisma.cashMutation.findFirst({ where: { invoiceId: inv2.id } });
  if (!mut1) {
    await prisma.cashMutation.create({
      data: {
        invoiceId: inv2.id,
        studentName: s2.studentName,
        period: "September 2026",
        method: "TUNAI",
        description: "Pelunasan Penuh SPP",
        amount: 100000,
        mutationDate: new Date("2026-09-05"),
      },
    });
  }

  // 12. ARUS KEUANGAN (cash_transactions)
  console.log("📊 [12/17] Seeding Cash Transactions...");
  const txData = [
    {
      branchId: singkut.id,
      type: "INCOME",
      category: "SPP",
      title: "Penerimaan SPP Bulan September",
      amount: 3250000,
      sourceOrRecipient: "Wali Murid Singkut",
      transactionDate: new Date("2026-09-05"),
      notes: "Setoran tunai via admin cabang",
    },
    {
      branchId: bangko.id,
      type: "INCOME",
      category: "SPP",
      title: "Penerimaan SPP Bulan September",
      amount: 4355000,
      sourceOrRecipient: "Wali Murid Bangko",
      transactionDate: new Date("2026-09-05"),
      notes: "Setoran tunai & transfer",
    },
    {
      branchId: singkut.id,
      type: "EXPENSE",
      category: "Cetak Buku",
      title: "Penggandaan Buku Modul Latihan",
      amount: 350000,
      sourceOrRecipient: "Percetakan Mandiri",
      transactionDate: new Date("2026-09-02"),
      notes: "Cetak 25 eks Modul Level 1",
    },
  ];

  for (const t of txData) {
    const ex = await prisma.cashTransaction.findFirst({
      where: { title: t.title, branchId: t.branchId },
    });
    if (!ex) await prisma.cashTransaction.create({ data: t });
  }

  // 13. WEBSITE HERO (website_hero)
  console.log("🌐 [13/17] Seeding Website Hero Config...");
  const heroExists = await prisma.websiteHero.findFirst();
  if (!heroExists) {
    await prisma.websiteHero.create({
      data: {
        tagline: "Bimbingan Belajar Jaritmatika No. 1 di Sarolangun & Merangin",
        headline: "Bimbel Berhitung Cepat Jaritmatika Math Fingers",
        subheadline: "Mengoptimalkan kecerdasan otak kanan & kiri anak melalui formasi 10 jari tangan tanpa sempoa dan tanpa kalkulator. Belajar asyik, cepat, berhitung akurat, dan percaya diri!",
        promoBanner: "🎉 PROMO SPESIAL: GRATIS Kelas Percobaan (Trial Class) & Diskon Pendaftaran 50% Bulan Ini!",
        promoActive: true,
        whatsappNumber: "6281279498907",
        whatsappGreeting: "Halo Admin Math Fingers, saya ingin info pendaftaran les Jaritmatika dan jadwal Trial Class gratis untuk anak saya.",
        targetDiscount: "50% OFF",
      },
    });
  }

  // 14. WEBSITE PROGRAMS (website_programs)
  console.log("🎯 [14/17] Seeding Website Programs...");
  const programsData = [
    {
      levelTitle: "Level Pra-Dasar (TK/PAUD)",
      targetAge: "Usia 4 - 6 Tahun",
      description: "Pengenalan simbol jari tangan bilangan 0–99 dengan metode visual games dan kartu edukasi yang menyenangkan.",
      monthlyFee: 100000,
      registrationFee: 150000,
      benefits: JSON.stringify([
        "Pengenalan 10 jari ceria",
        "Stimulasi motorik halus anak",
        "Flashcard Simbol Eksklusif",
        "Sertifikat Tingkat",
      ]),
      popular: false,
      orderIndex: 1,
    },
    {
      levelTitle: "Level 1: Dasar",
      targetAge: "Usia 6 - 8 Tahun (SD Kelas 1 - 2)",
      description: "Penjumlahan & pengurangan angka satuan langsung tanpa rumus rumit. Menumbuhkan kecintaan berhitung sejak dini.",
      monthlyFee: 100000,
      registrationFee: 150000,
      benefits: JSON.stringify([
        "Operasi tambah/kurang satuan",
        "Kecepatan hitung < 3 detik",
        "Buku Modul Latihan Jari",
        "Laporan Rapor Digital Berkala",
      ]),
      popular: true,
      orderIndex: 2,
    },
    {
      levelTitle: "Level 2: Terampil",
      targetAge: "Usia 8 - 10 Tahun (SD Kelas 3 - 4)",
      description: "Formula Teman Kecil (angka 5) dan Teman Besar (angka 10). Mampu menyelesaikan hitungan puluhan dan ratusan secara spontan.",
      monthlyFee: 120000,
      registrationFee: 150000,
      benefits: JSON.stringify([
        "Rumus Kombinasi Teman Jari",
        "Hitungan 2 - 3 digit cepat",
        "Uji Kecepatan Tiap Bulan",
        "Kartu QR Presensi Otomatis",
      ]),
      popular: false,
      orderIndex: 3,
    },
    {
      levelTitle: "Level 3: Mahir & Olimpiade",
      targetAge: "Usia 10 - 12 Tahun (SD Kelas 5 - 6)",
      description: "Perkalian dan pembagian kilat jari, operasi campuran cepat berantai, serta persiapan kompetisi & olimpiade matematika.",
      monthlyFee: 150000,
      registrationFee: 150000,
      benefits: JSON.stringify([
        "Perkalian & Pembagian Jari",
        "Teknik Mencongak Refleks",
        "Mentoring Uji Kompetensi",
        "Sertifikat Kelulusan Resmi",
      ]),
      popular: false,
      orderIndex: 4,
    },
  ];

  for (const p of programsData) {
    const ex = await prisma.websiteProgram.findFirst({ where: { levelTitle: p.levelTitle } });
    if (!ex) await prisma.websiteProgram.create({ data: p });
  }

  // 15. WEBSITE TESTIMONIALS (website_testimonials)
  console.log("💬 [15/17] Seeding Website Testimonials...");
  const testiData = [
    {
      parentName: "Bunda Rini Astuti",
      studentName: "Aishwa (7 thn)",
      branch: "Cabang Singkut",
      rating: 5,
      comment: "Luar biasa! Dulu anak saya takut dan menangis kalau PR matematika. Baru 2 bulan di Math Fingers, sekarang berhitung 1-99 refleks pakai jari tanpa kertas cakar!",
      isActive: true,
    },
    {
      parentName: "Ayah Hendra Pratama",
      studentName: "Bagas (8 thn)",
      branch: "Cabang Singkut",
      rating: 5,
      comment: "Metode jaritmatikanya sangat praktis. Sistem presensi QR di HP sangat transparan, ada laporan jurnal harian guru yang masuk ke WhatsApp kami.",
      isActive: true,
    },
    {
      parentName: "Ibu Desi Ratnasari",
      studentName: "Ajeng (6 thn)",
      branch: "Cabang Bangko",
      rating: 5,
      comment: "Tutornya ramah dan telaten mengajar anak usia dini. Metode jari tangannya bikin anak saya ketagihan berhitung setiap hari di rumah!",
      isActive: true,
    },
  ];

  for (const t of testiData) {
    const ex = await prisma.websiteTestimonial.findFirst({ where: { studentName: t.studentName } });
    if (!ex) await prisma.websiteTestimonial.create({ data: t });
  }

  // 16. WEBSITE PARTNERS (website_partners)
  console.log("🤝 [16/17] Seeding Website Partners...");
  const partnersData = [
    { name: "SD Negeri 01 Singkut", category: "Sekolah Dasar Mitra", logoText: "SDN 01 SKT", isActive: true, orderIndex: 1 },
    { name: "SD IT Al-Fatih Sarolangun", category: "Sekolah Islam Terpadu", logoText: "SDIT AL-FATIH", isActive: true, orderIndex: 2 },
    { name: "TK Pertiwi Bangko", category: "PAUD / TK Binaan", logoText: "TK PERTIWI", isActive: true, orderIndex: 3 },
    { name: "SD Negeri 02 Bangko", category: "Sekolah Dasar Mitra", logoText: "SDN 02 BGK", isActive: true, orderIndex: 4 },
    { name: "Komunitas Ibu Cerdas Merangin", category: "Komunitas Parenting", logoText: "KIC MERANGIN", isActive: true, orderIndex: 5 },
  ];

  for (const pt of partnersData) {
    const ex = await prisma.websitePartner.findFirst({ where: { name: pt.name } });
    if (!ex) await prisma.websitePartner.create({ data: pt });
  }

  // 17. WEBSITE LEADS (website_leads)
  console.log("📩 [17/17] Seeding Website Leads...");
  const leadsData = [
    {
      studentName: "Muhammad Rayhan",
      studentAge: "6 Tahun (SD Kelas 1)",
      parentName: "Bunda Sri Wahyuni",
      phone: "0812-7889-1122",
      branch: "Singkut",
      status: "Baru",
      notes: "Berminat jadwal hari Sabtu pagi",
    },
    {
      studentName: "Nafisha Salsabila",
      studentAge: "8 Tahun (SD Kelas 3)",
      parentName: "Bapak Rudi Hartono",
      phone: "0852-6677-8899",
      branch: "Bangko",
      status: "Trial Terjadwal",
      notes: "Trial Class tanggal 12 September 2026 jam 14:00",
    },
  ];

  for (const l of leadsData) {
    const ex = await prisma.websiteLead.findFirst({ where: { phone: l.phone } });
    if (!ex) await prisma.websiteLead.create({ data: l });
  }

  console.log("\n🎉🎉🎉 SEEDING 17 TABEL SELESAI DENGAN SUKSES DI POSTGRESQL! 🎉🎉🎉");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
