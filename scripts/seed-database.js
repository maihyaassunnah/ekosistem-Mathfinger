const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai seeding database PostgreSQL Ekosistem Mathfingers...");

  // 1. SEED BRANCHES
  console.log("📍 Seeding Cabang...");
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

  console.log(`✅ Cabang dibuat: ${singkut.branchName} (${singkut.id}) & ${bangko.branchName} (${bangko.id})`);

  // 2. SEED LEVELS
  console.log("📚 Seeding Tingkatan Kurikulum...");
  const levelsData = [
    {
      levelName: "Level Dasar: Pengenalan Simbol Jari",
      description: "Pengenalan simbol jari bilangan 0-99 menggunakan tangan kanan dan tangan kiri.",
      orderIndex: 1,
      defaultSppPrice: 100000,
      bookPrice: 50000,
    },
    {
      levelName: "Level 1: Penjumlahan & Pengurangan Angka Satuan",
      description: "Operasi penjumlahan & pengurangan langsung tanpa rumus dengan motorik jari tangan.",
      orderIndex: 2,
      defaultSppPrice: 100000,
      bookPrice: 50000,
    },
    {
      levelName: "Level 2: Kombinasi Rumus Teman Kecil",
      description: "Formula teman kecil (angka 5) dan teman besar (angka 10).",
      orderIndex: 3,
      defaultSppPrice: 120000,
      bookPrice: 60000,
    },
    {
      levelName: "Level 3: Mahir & Olimpiade",
      description: "Perkalian dan pembagian cepat jari serta operasi campuran berantai.",
      orderIndex: 4,
      defaultSppPrice: 150000,
      bookPrice: 75000,
    },
  ];

  const createdLevels = [];
  for (const lvl of levelsData) {
    let existing = await prisma.level.findFirst({
      where: { levelName: lvl.levelName },
    });
    if (!existing) {
      existing = await prisma.level.create({ data: lvl });
    }
    createdLevels.push(existing);
  }
  console.log(`✅ ${createdLevels.length} Level kurikulum berhasil dibuat.`);

  const levelDasar = createdLevels[0];
  const levelSatu = createdLevels[1];

  // 3. SEED USERS / ADMINS
  console.log("👤 Seeding Akun Pengguna / Admin...");
  const tutor = await prisma.user.upsert({
    where: { email: "tutor1.mathfingers@gmail.com" },
    update: { branchId: singkut.id },
    create: {
      fullName: "Febrianti Dewi, S.Pd",
      email: "tutor1.mathfingers@gmail.com",
      passwordHash: "password123",
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
      passwordHash: "password123",
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
      passwordHash: "password123",
      role: "BRANCH_ADMIN",
      status: "ACTIVE",
      branchId: bangko.id,
    },
  });

  // Link existing Google users to Pusat (Super Admin)
  await prisma.user.updateMany({
    where: { email: { in: ["wahyudinhafiz123@gmail.com", "ma.ihyaassunnah@gmail.com"] } },
    data: { role: "SUPER_ADMIN", status: "ACTIVE" },
  });

  // 4. SEED STUDENTS
  console.log("🎓 Seeding Data Siswa...");
  const studentsList = [
    {
      studentCode: "79000",
      qrIdentifier: "MF-QR-79000",
      studentName: "Aishwa Rahma Annida",
      parentName: "Vetika",
      parentWhatsapp: "081279498907",
      branchId: singkut.id,
      currentLevelId: levelDasar.id,
    },
    {
      studentCode: "91212",
      qrIdentifier: "MF-QR-91212",
      studentName: "Ajeng Cahyra Naifasha",
      parentName: "Eni",
      parentWhatsapp: "08139602155",
      branchId: bangko.id,
      currentLevelId: levelDasar.id,
    },
    {
      studentCode: "78564",
      qrIdentifier: "MF-QR-78564",
      studentName: "Alesha Rafani Marta",
      parentName: "Mala Noftobela",
      parentWhatsapp: "081379720841",
      branchId: bangko.id,
      currentLevelId: levelDasar.id,
    },
    {
      studentCode: "17055",
      qrIdentifier: "MF-QR-17055",
      studentName: "Anandira Dyah Asmara Wati",
      parentName: "Agustina Wati",
      parentWhatsapp: "085837162339",
      branchId: bangko.id,
      currentLevelId: levelDasar.id,
    },
    {
      studentCode: "95452",
      qrIdentifier: "MF-QR-95452",
      studentName: "Ananta Virya",
      parentName: "Sudar",
      parentWhatsapp: "085382485578",
      branchId: bangko.id,
      currentLevelId: levelSatu.id,
    },
    {
      studentCode: "29797",
      qrIdentifier: "MF-QR-29797",
      studentName: "Aqila Fahmida",
      parentName: "Maryono",
      parentWhatsapp: "08136398294",
      branchId: bangko.id,
      currentLevelId: levelSatu.id,
    },
    {
      studentCode: "88692",
      qrIdentifier: "MF-QR-88692",
      studentName: "Arasely Naura Shada",
      parentName: "Reni Martuti",
      parentWhatsapp: "081368208100",
      branchId: bangko.id,
      currentLevelId: levelDasar.id,
    },
    {
      studentCode: "61022",
      qrIdentifier: "MF-QR-61022",
      studentName: "Bagas Pratama Putra",
      parentName: "Bambang Irawan",
      parentWhatsapp: "082188443321",
      branchId: singkut.id,
      currentLevelId: levelDasar.id,
    },
    {
      studentCode: "33918",
      qrIdentifier: "MF-QR-33918",
      studentName: "Calista Azkadina",
      parentName: "Dina Marlina",
      parentWhatsapp: "085299881144",
      branchId: singkut.id,
      currentLevelId: levelSatu.id,
    },
  ];

  const createdStudents = [];
  for (const s of studentsList) {
    const student = await prisma.student.upsert({
      where: { studentCode: s.studentCode },
      update: s,
      create: s,
    });
    createdStudents.push(student);
  }
  console.log(`✅ ${createdStudents.length} Siswa berhasil dimasukkan ke database.`);

  // 5. SEED INVOICES (TAGIHAN SPP)
  console.log("💰 Seeding Tagihan SPP...");
  const s1 = createdStudents[0];
  const s2 = createdStudents[1];

  await prisma.invoice.upsert({
    where: { invoiceNumber: "INV/MF/2608/5138" },
    update: {},
    create: {
      invoiceNumber: "INV/MF/2608/5138",
      studentId: s1.id,
      branchId: s1.branchId,
      type: "SPP",
      amount: 100000,
      dueDate: new Date("2026-09-10"),
      status: "UNPAID",
    },
  });

  await prisma.invoice.upsert({
    where: { invoiceNumber: "INV/MF/2608/6455" },
    update: {},
    create: {
      invoiceNumber: "INV/MF/2608/6455",
      studentId: s2.id,
      branchId: s2.branchId,
      type: "SPP",
      amount: 100000,
      dueDate: new Date("2026-09-05"),
      status: "PAID",
      paymentMethod: "MANUAL_CASH",
      paidAt: new Date("2026-09-05"),
    },
  });
  console.log("✅ Tagihan SPP berhasil dibuat.");

  // 6. SEED ATTENDANCES (PRESENSI)
  console.log("📋 Seeding Riwayat Presensi...");
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
  console.log("✅ Presensi berhasil dibuat.");

  console.log("\n🎉 SEMUA DATA BERHASIL DISINKRONISASI KE POSTGRESQL!");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
