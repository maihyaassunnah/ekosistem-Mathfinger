const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 [MASTER SYNC] Memulai sinkronisasi data real ke database PostgreSQL...");

  // 1. CABANG (branches)
  console.log("📍 [1/10] Sinkronisasi Cabang (Singkut & Bangko)...");
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

  console.log(`✅ Cabang OK: Singkut (${singkut.id}), Bangko (${bangko.id})`);

  // 2. TINGKATAN KURIKULUM (levels)
  console.log("📚 [2/10] Sinkronisasi Tingkat Kurikulum (Levels)...");
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
  console.log(`✅ Kurikulum OK: 4 Levels`);

  // 3. PENGGUNA & ADMIN (users)
  console.log("👤 [3/10] Sinkronisasi Akun Pengguna & Admin...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Super Admin
  await prisma.user.upsert({
    where: { email: "wahyudinh20@stitmadani.ac.id" },
    update: {
      fullName: "Wahyudin Hafiz, S.Pd",
      phone: "0853-8478-0910",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
    create: {
      fullName: "Wahyudin Hafiz, S.Pd",
      email: "wahyudinh20@stitmadani.ac.id",
      passwordHash: hashedPassword,
      phone: "0853-8478-0910",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
  });

  await prisma.user.upsert({
    where: { email: "wahyudinhafiz123@gmail.com" },
    update: { role: "SUPER_ADMIN", status: "ACTIVE" },
    create: {
      fullName: "Wahyudin Hafiz, S.Pd",
      email: "wahyudinhafiz123@gmail.com",
      passwordHash: hashedPassword,
      phone: "0853-8478-0910",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
  });

  // Admin Singkut & Bangko
  await prisma.user.upsert({
    where: { email: "rina.singkut@mathfingers.com" },
    update: { branchId: singkut.id, role: "BRANCH_ADMIN" },
    create: {
      fullName: "Rina Marlina, S.Pd",
      email: "rina.singkut@mathfingers.com",
      passwordHash: hashedPassword,
      phone: "0812-7949-8907",
      role: "BRANCH_ADMIN",
      status: "ACTIVE",
      branchId: singkut.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "faisal.bangko@mathfingers.com" },
    update: { branchId: bangko.id, role: "BRANCH_ADMIN" },
    create: {
      fullName: "Faisal Rahman, S.Kom",
      email: "faisal.bangko@mathfingers.com",
      passwordHash: hashedPassword,
      phone: "0813-7972-0841",
      role: "BRANCH_ADMIN",
      status: "ACTIVE",
      branchId: bangko.id,
    },
  });

  // Tutors
  const tutorSingkut = await prisma.user.upsert({
    where: { email: "tutor1.mathfingers@gmail.com" },
    update: { branchId: singkut.id, fullName: "Febrianti Dewi, S.Pd", phone: "0812-7949-8907" },
    create: {
      fullName: "Febrianti Dewi, S.Pd",
      email: "tutor1.mathfingers@gmail.com",
      passwordHash: hashedPassword,
      phone: "0812-7949-8907",
      role: "TUTOR",
      status: "ACTIVE",
      branchId: singkut.id,
    },
  });

  const tutorBangko = await prisma.user.upsert({
    where: { email: "dewi.bangko@mathfingers.com" },
    update: { branchId: bangko.id, fullName: "Dewi Safitri, S.H", phone: "0813-7972-0841" },
    create: {
      fullName: "Dewi Safitri, S.H",
      email: "dewi.bangko@mathfingers.com",
      passwordHash: hashedPassword,
      phone: "0813-7972-0841",
      role: "TUTOR",
      status: "ACTIVE",
      branchId: bangko.id,
    },
  });

  // 4. KELAS (classes - 6 Kelompok)
  console.log("🏫 [4/10] Sinkronisasi 6 Kelas Bimbingan...");
  const classesData = [
    {
      className: "Kelas A",
      branchId: singkut.id,
      days: "Sabtu & Ahad",
      time: "14:00 - 15:30",
      teacherName: "Febrianti Dewi, S.Pd",
      room: "Ruang A1",
      levelName: "Level Dasar: Pengenalan Simbol Jari",
      enrolledCount: 7,
      maxCapacity: 10,
      status: "ACTIVE",
    },
    {
      className: "Kelas B",
      branchId: singkut.id,
      days: "Sabtu & Ahad",
      time: "14:00 - 15:30",
      teacherName: "Febrianti Dewi, S.Pd",
      room: "Ruang A2",
      levelName: "Level Dasar: Pengenalan Simbol Jari",
      enrolledCount: 7,
      maxCapacity: 10,
      status: "ACTIVE",
    },
    {
      className: "CLASS A1",
      branchId: bangko.id,
      days: "Senin & Rabu",
      time: "13:30 - 14:30",
      teacherName: "Kak Nanda",
      room: "Ruang A1",
      levelName: "Level 1: Penjumlahan & Pengurangan Angka Satuan",
      enrolledCount: 8,
      maxCapacity: 15,
      status: "ACTIVE",
    },
    {
      className: "CLASS B",
      branchId: bangko.id,
      days: "Jumat & Ahad",
      time: "13:30 - 14:30",
      teacherName: "Kak Nanda",
      room: "Ruang B",
      levelName: "Level 1: Penjumlahan & Pengurangan Angka Satuan",
      enrolledCount: 13,
      maxCapacity: 15,
      status: "ACTIVE",
    },
    {
      className: "CLASS C",
      branchId: bangko.id,
      days: "Sabtu & Ahad",
      time: "13:30 - 14:30",
      teacherName: "Dewi Safitri, S.H",
      room: "Ruang C",
      levelName: "Level Dasar: Pengenalan Simbol Jari",
      enrolledCount: 10,
      maxCapacity: 13,
      status: "ACTIVE",
    },
    {
      className: "Kelas A2",
      branchId: bangko.id,
      days: "Selasa & Kamis",
      time: "14:00 - 15:30",
      teacherName: "Ustadzah Yuni",
      room: "Ruang A2",
      levelName: "Level Dasar: Pengenalan Simbol Jari",
      enrolledCount: 5,
      maxCapacity: 10,
      status: "ACTIVE",
    },
  ];

  for (const c of classesData) {
    const ex = await prisma.class.findFirst({
      where: { className: c.className, branchId: c.branchId },
    });
    if (!ex) {
      await prisma.class.create({ data: c });
    } else {
      await prisma.class.update({ where: { id: ex.id }, data: c });
    }
  }
  console.log("✅ 6 Kelas bimbingan berhasil disinkronkan.");

  // 5. SISWA (students - 51 Aktif + 1 Alumni = 52 Siswa)
  console.log("🎓 [5/10] Sinkronisasi 52 Siswa Real (22 Singkut + 29 Bangko + 1 Alumni)...");

  const rawStudents = [
    // --- SINGKUT (22 Siswa Aktif) ---
    // Kelas A (11 siswa)
    { studentCode: "79000", studentName: "Aishwa Rahma Annida", gender: "P", birthPlace: "Lahat", birthDate: "2018-01-03", address: "Sungai Gedang", gradeLevel: "Ket: Kelas 4", className: "Kelas A", parentName: "Vetika", parentWhatsapp: "081279498907", branchId: singkut.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2026-08-22") },
    { studentCode: "33918", studentName: "Calista Azkadina", gender: "P", birthPlace: "Singkut", birthDate: "2017-10-25", address: "Jl. Poros Singkut 1", gradeLevel: "Ket: Kelas 4", className: "Kelas A", parentName: "Dina Marlina", parentWhatsapp: "085299881144", branchId: singkut.id, currentLevelId: levelsMap[2].id, registeredDate: new Date("2024-07-15") },
    { studentCode: "21446", studentName: "Ghumaisha", gender: "P", birthPlace: "Singkut", birthDate: "2018-04-12", address: "Desa Sungai Gedang", gradeLevel: "Ket: Kelas 3", className: "Kelas A", parentName: "Nur Halimah", parentWhatsapp: "081373512990", branchId: singkut.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-10") },
    { studentCode: "89050", studentName: "Arsyila Nasha Razita", gender: "P", birthPlace: "Singkut", birthDate: "2018-06-19", address: "Jl. Lintas Sumatera Singkut", gradeLevel: "Ket: Kelas 2", className: "Kelas A", parentName: "Nasha", parentWhatsapp: "082281729011", branchId: singkut.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-12") },
    { studentCode: "55866", studentName: "Bilqis Ufairah", gender: "P", birthPlace: "Singkut", birthDate: "2018-03-02", address: "Jl. Raden Fatah Singkut", gradeLevel: "Ket: Kelas 3", className: "Kelas A", parentName: "Ufairah", parentWhatsapp: "085377192800", branchId: singkut.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-01") },
    { studentCode: "41209", studentName: "Fakhri Al-Ghifari", gender: "L", birthPlace: "Sarolangun", birthDate: "2017-09-14", address: "Jl. Dahlia Singkut", gradeLevel: "Ket: Kelas 4", className: "Kelas A", parentName: "Hendra", parentWhatsapp: "081274901822", branchId: singkut.id, currentLevelId: levelsMap[2].id, registeredDate: new Date("2024-07-20") },
    { studentCode: "62901", studentName: "Syakira Nur Aini", gender: "P", birthPlace: "Singkut", birthDate: "2018-12-05", address: "Sungai Gedang Blok A", gradeLevel: "Ket: Kelas 2", className: "Kelas A", parentName: "Rohani", parentWhatsapp: "082390112765", branchId: singkut.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-15") },
    { studentCode: "67123", studentName: "Hafiz Al-Faruq", gender: "L", birthPlace: "Singkut", birthDate: "2017-04-18", address: "Sungai Gedang RT 02", gradeLevel: "Ket: Kelas 4", className: "Kelas A", parentName: "Faruq", parentWhatsapp: "081273901188", branchId: singkut.id, currentLevelId: levelsMap[2].id, registeredDate: new Date("2024-07-05") },
    { studentCode: "38910", studentName: "Nabila Putri Ramadhani", gender: "P", birthPlace: "Sarolangun", birthDate: "2018-09-08", address: "Jl. Flamboyan Singkut", gradeLevel: "Ket: Kelas 3", className: "Kelas A", parentName: "Ramadhan", parentWhatsapp: "085381902341", branchId: singkut.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-03") },
    { studentCode: "90123", studentName: "Muhammad Azka", gender: "L", birthPlace: "Sarolangun", birthDate: "2017-03-22", address: "Jl. Ahmad Yani Singkut", gradeLevel: "Ket: Kelas 5", className: "Kelas A", parentName: "Azka", parentWhatsapp: "085277123490", branchId: singkut.id, currentLevelId: levelsMap[3].id, registeredDate: new Date("2024-06-25") },
    { studentCode: "61298", studentName: "Dimas Arya Sena", gender: "L", birthPlace: "Singkut", birthDate: "2017-06-11", address: "Jl. Poros Singkut 3", gradeLevel: "Ket: Kelas 4", className: "Kelas A", parentName: "Sena", parentWhatsapp: "082389102390", branchId: singkut.id, currentLevelId: levelsMap[2].id, registeredDate: new Date("2024-07-18") },

    // Kelas B (11 siswa)
    { studentCode: "61022", studentName: "Bagas Pratama Putra", gender: "L", birthPlace: "Sarolangun", birthDate: "2018-02-14", address: "Desa Pasar Singkut", gradeLevel: "Ket: Kelas 3", className: "Kelas B", parentName: "Bambang Irawan", parentWhatsapp: "082188443321", branchId: singkut.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-01") },
    { studentCode: "34581", studentName: "Dzakiyyah Al Fajri", gender: "P", birthPlace: "Singkut", birthDate: "2018-07-21", address: "Jl. Melati Singkut 2", gradeLevel: "Ket: Kelas 3", className: "Kelas B", parentName: "Fajri", parentWhatsapp: "085266182903", branchId: singkut.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-18") },
    { studentCode: "17246", studentName: "Haris", gender: "L", birthPlace: "Singkut", birthDate: "2017-11-09", address: "Jl. Kenanga Singkut", gradeLevel: "Ket: Kelas 4", className: "Kelas B", parentName: "M. Yusuf", parentWhatsapp: "081367891244", branchId: singkut.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-20") },
    { studentCode: "51380", studentName: "Maulana Syarif Wardani", gender: "L", birthPlace: "Singkut", birthDate: "2018-05-15", address: "Sungai Gedang RT 04", gradeLevel: "Ket: Kelas 3", className: "Kelas B", parentName: "Wardani", parentWhatsapp: "082190881230", branchId: singkut.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-05") },
    { studentCode: "22000", studentName: "M. Hannan Habibillah", gender: "L", birthPlace: "Singkut", birthDate: "2017-08-29", address: "Jl. Diponegoro Singkut", gradeLevel: "Ket: Kelas 4", className: "Kelas B", parentName: "Habib", parentWhatsapp: "085290123845", branchId: singkut.id, currentLevelId: levelsMap[2].id, registeredDate: new Date("2024-07-10") },
    { studentCode: "48712", studentName: "Kenzo Alvaro", gender: "L", birthPlace: "Sarolangun", birthDate: "2018-01-20", address: "Singkut 1 Pasar", gradeLevel: "Ket: Kelas 3", className: "Kelas B", parentName: "Rina", parentWhatsapp: "081278119022", branchId: singkut.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-11") },
    { studentCode: "59012", studentName: "Zahrana Azzahra", gender: "P", birthPlace: "Singkut", birthDate: "2018-10-10", address: "Jl. Pramuka Singkut", gradeLevel: "Ket: Kelas 2", className: "Kelas B", parentName: "Siti Zubaidah", parentWhatsapp: "082381290341", branchId: singkut.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-14") },
    { studentCode: "72190", studentName: "Rayhan Pratama", gender: "L", birthPlace: "Singkut", birthDate: "2017-12-01", address: "Singkut 2 Jalur 3", gradeLevel: "Ket: Kelas 4", className: "Kelas B", parentName: "Pratama", parentWhatsapp: "081379102833", branchId: singkut.id, currentLevelId: levelsMap[2].id, registeredDate: new Date("2024-07-12") },
    { studentCode: "81234", studentName: "Keysha Anindya", gender: "P", birthPlace: "Singkut", birthDate: "2018-08-14", address: "Sungai Gedang Dusun 1", gradeLevel: "Ket: Kelas 3", className: "Kelas B", parentName: "Anita", parentWhatsapp: "082198001234", branchId: singkut.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-08") },
    { studentCode: "44512", studentName: "Raisya Salsabila", gender: "P", birthPlace: "Singkut", birthDate: "2018-11-30", address: "Desa Sungai Gedang", gradeLevel: "Ket: Kelas 2", className: "Kelas B", parentName: "Salsa", parentWhatsapp: "081266778899", branchId: singkut.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-21") },
    { studentCode: "53421", studentName: "Nayla Khairunnisa", gender: "P", birthPlace: "Sarolangun", birthDate: "2018-04-05", address: "Singkut 1 Blok B", gradeLevel: "Ket: Kelas 3", className: "Kelas B", parentName: "Khairul", parentWhatsapp: "081378901234", branchId: singkut.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-09") },

    // --- BANGKO (29 Siswa Aktif) ---
    // CLASS A1 (8 siswa)
    { studentCode: "29797", studentName: "Aqila Fahmida", gender: "P", birthPlace: "Merangin", birthDate: "2015-12-12", address: "Jl Merak, Bangko", gradeLevel: "Ket: Kelas 5", className: "CLASS A1", parentName: "Maryono", parentWhatsapp: "08136398294", branchId: bangko.id, currentLevelId: levelsMap[2].id, registeredDate: new Date("2024-06-15") },
    { studentCode: "15367", studentName: "Aida Syafira N.A", gender: "P", birthPlace: "Bangko", birthDate: "2018-09-12", address: "Jl. Kenari No. 12 Bangko", gradeLevel: "Ket: Kelas 2", className: "CLASS A1", parentName: "Syafira", parentWhatsapp: "081379124560", branchId: bangko.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-10") },
    { studentCode: "48291", studentName: "Haura", gender: "P", birthPlace: "Bangko", birthDate: "2018-02-18", address: "Pasar Bawah Bangko", gradeLevel: "Ket: Kelas 3", className: "CLASS A1", parentName: "Hafiz", parentWhatsapp: "085384780910", branchId: bangko.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-20") },
    { studentCode: "31290", studentName: "Daniswara Rizky", gender: "L", birthPlace: "Merangin", birthDate: "2016-10-05", address: "Jl. Mayor H. Syamsudin Bangko", gradeLevel: "Ket: Kelas 4", className: "CLASS A1", parentName: "Rizky", parentWhatsapp: "081274112233", branchId: bangko.id, currentLevelId: levelsMap[2].id, registeredDate: new Date("2024-07-10") },
    { studentCode: "67890", studentName: "Fathir Ahmad", gender: "L", birthPlace: "Bangko", birthDate: "2015-11-20", address: "Pematang Kandis Bangko", gradeLevel: "Ket: Kelas 5", className: "CLASS A1", parentName: "Ahmad", parentWhatsapp: "085266778811", branchId: bangko.id, currentLevelId: levelsMap[3].id, registeredDate: new Date("2024-06-20") },
    { studentCode: "78123", studentName: "Gladis Anindita", gender: "P", birthPlace: "Merangin", birthDate: "2018-07-07", address: "Jl. Beringin Bangko", gradeLevel: "Ket: Kelas 2", className: "CLASS A1", parentName: "Hendra", parentWhatsapp: "081389001122", branchId: bangko.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-12") },
    { studentCode: "54321", studentName: "Kevin Pratama", gender: "L", birthPlace: "Bangko", birthDate: "2016-08-15", address: "Jl. Jend. Sudirman Bangko", gradeLevel: "Ket: Kelas 4", className: "CLASS A1", parentName: "Pratama", parentWhatsapp: "082188990011", branchId: bangko.id, currentLevelId: levelsMap[2].id, registeredDate: new Date("2024-07-08") },
    { studentCode: "43210", studentName: "Luthfi Hakim", gender: "L", birthPlace: "Merangin", birthDate: "2015-05-19", address: "Kandis Indah Bangko", gradeLevel: "Ket: Kelas 5", className: "CLASS A1", parentName: "Hakim", parentWhatsapp: "085377889922", branchId: bangko.id, currentLevelId: levelsMap[3].id, registeredDate: new Date("2024-06-18") },

    // CLASS B (9 siswa)
    { studentCode: "68933", studentName: "Abizar Rahandika Alghifari", gender: "L", birthPlace: "Bangko", birthDate: "2018-03-14", address: "Jl. Merpati Bangko", gradeLevel: "Ket: Kelas 3", className: "CLASS B", parentName: "Agus Nugroho", parentWhatsapp: "082279315792", branchId: bangko.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-01") },
    { studentCode: "66469", studentName: "Abrisam", gender: "L", birthPlace: "Merangin", birthDate: "2018-05-20", address: "Jl. Kutilang Bangko", gradeLevel: "Ket: Kelas 3", className: "CLASS B", parentName: "Mustofa", parentWhatsapp: "081538722406", branchId: bangko.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-02") },
    { studentCode: "95452", studentName: "Ananta Virya", gender: "P", birthPlace: "Merangin", birthDate: "2017-08-13", address: "Jl Kutilang, Bangko", gradeLevel: "Ket: Kelas 3", className: "CLASS B", parentName: "Sudar", parentWhatsapp: "085382485578", branchId: bangko.id, currentLevelId: levelsMap[2].id, registeredDate: new Date("2024-06-10") },
    { studentCode: "31996", studentName: "Aira Anatasya Putri", gender: "P", birthPlace: "Bangko", birthDate: "2017-04-10", address: "Jl. Merak Bangko", gradeLevel: "Ket: Kelas 4", className: "CLASS B", parentName: "Anatasya", parentWhatsapp: "081379112200", branchId: bangko.id, currentLevelId: levelsMap[2].id, registeredDate: new Date("2024-07-01") },
    { studentCode: "93060", studentName: "Arka Prapta Ardani", gender: "L", birthPlace: "Merangin", birthDate: "2017-01-25", address: "Jl. Kenari Bangko", gradeLevel: "Ket: Kelas 4", className: "CLASS B", parentName: "Ardani", parentWhatsapp: "081273998811", branchId: bangko.id, currentLevelId: levelsMap[2].id, registeredDate: new Date("2024-07-05") },
    { studentCode: "32460", studentName: "Shaqia Azzahra Rahayu", gender: "P", birthPlace: "Bangko", birthDate: "2018-06-30", address: "Pematang Kandis", gradeLevel: "Ket: Kelas 3", className: "CLASS B", parentName: "Rahayu", parentWhatsapp: "085266112244", branchId: bangko.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-04") },
    { studentCode: "76123", studentName: "Bima Sakti", gender: "L", birthPlace: "Merangin", birthDate: "2016-09-12", address: "Jl. Diponegoro Bangko", gradeLevel: "Ket: Kelas 4", className: "CLASS B", parentName: "Sakti", parentWhatsapp: "081378990022", branchId: bangko.id, currentLevelId: levelsMap[2].id, registeredDate: new Date("2024-07-15") },
    { studentCode: "89123", studentName: "Citra Kirana", gender: "P", birthPlace: "Bangko", birthDate: "2017-12-08", address: "Jl. Pramuka Bangko", gradeLevel: "Ket: Kelas 3", className: "CLASS B", parentName: "Kirana", parentWhatsapp: "082199001133", branchId: bangko.id, currentLevelId: levelsMap[2].id, registeredDate: new Date("2024-07-22") },
    { studentCode: "98124", studentName: "Dzakiandra Putra", gender: "L", birthPlace: "Merangin", birthDate: "2018-08-17", address: "Lingkungan Pasar Bangko", gradeLevel: "Ket: Kelas 2", className: "CLASS B", parentName: "Putra", parentWhatsapp: "085388991144", branchId: bangko.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-11") },

    // CLASS C (7 siswa)
    { studentCode: "91212", studentName: "Ajeng Cahyra Naifasha", gender: "P", birthPlace: "Merangin", birthDate: "2018-05-03", address: "Jalan Kenari, Bangko", gradeLevel: "Ket: Kelas 2", className: "CLASS C", parentName: "Eni", parentWhatsapp: "08139602155", branchId: bangko.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-15") },
    { studentCode: "17055", studentName: "Anandira Dyah Asmara Wati", gender: "P", birthPlace: "Merangin", birthDate: "2018-11-18", address: "Jl Merpati, Bangko", gradeLevel: "Ket: Kelas 2", className: "CLASS C", parentName: "Agustina Wati", parentWhatsapp: "085837162339", branchId: bangko.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-20") },
    { studentCode: "66458", studentName: "Adeeva Afsheen Myesha", gender: "P", birthPlace: "Bangko", birthDate: "2018-07-15", address: "Jl. Murai Bangko", gradeLevel: "Ket: Kelas 2", className: "CLASS C", parentName: "Wagito", parentWhatsapp: "081271897532", branchId: bangko.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-18") },
    { studentCode: "56840", studentName: "Afrial Arsenio", gender: "L", birthPlace: "Merangin", birthDate: "2017-02-28", address: "Jl. Kutilang No. 5 Bangko", gradeLevel: "Ket: Kelas 4", className: "CLASS C", parentName: "Arsenio", parentWhatsapp: "081366778899", branchId: bangko.id, currentLevelId: levelsMap[2].id, registeredDate: new Date("2024-07-12") },
    { studentCode: "88190", studentName: "M. Rayyan Al-Fatih", gender: "L", birthPlace: "Bangko", birthDate: "2018-09-09", address: "Jl. Cendrawasih Bangko", gradeLevel: "Ket: Kelas 2", className: "CLASS C", parentName: "Fatih", parentWhatsapp: "085399112233", branchId: bangko.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-22") },
    { studentCode: "77189", studentName: "Naura Zafira", gender: "P", birthPlace: "Merangin", birthDate: "2018-01-11", address: "Pematang Kandis Bangko", gradeLevel: "Ket: Kelas 3", className: "CLASS C", parentName: "Zafira", parentWhatsapp: "082188112244", branchId: bangko.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-14") },
    { studentCode: "66178", studentName: "Prabu Wijaya", gender: "L", birthPlace: "Bangko", birthDate: "2017-10-10", address: "Jl. Merpati Atas Bangko", gradeLevel: "Ket: Kelas 3", className: "CLASS C", parentName: "Wijaya", parentWhatsapp: "081299112255", branchId: bangko.id, currentLevelId: levelsMap[2].id, registeredDate: new Date("2024-07-16") },

    // Kelas A2 (5 siswa)
    { studentCode: "78564", studentName: "Alesha Rafani Marta", gender: "P", birthPlace: "Padang Jantung", birthDate: "2016-09-06", address: "Jalan Merak, Bangko", gradeLevel: "Ket: Kelas 4", className: "Kelas A2", parentName: "Mala Noftobela", parentWhatsapp: "081379720841", branchId: bangko.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-19") },
    { studentCode: "88692", studentName: "Arasely Naura Shada", gender: "P", birthPlace: "Merangin", birthDate: "2017-03-01", address: "Jalan Enggang, Bangko", gradeLevel: "Ket: Kelas 4", className: "Kelas A2", parentName: "Reni Martuti", parentWhatsapp: "081368208100", branchId: bangko.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-07-02") },
    { studentCode: "44156", studentName: "Rafa Al-Ghifari", gender: "L", birthPlace: "Bangko", birthDate: "2016-11-12", address: "Jl. Kenari Permai Bangko", gradeLevel: "Ket: Kelas 4", className: "Kelas A2", parentName: "Ghifari", parentWhatsapp: "081377112277", branchId: bangko.id, currentLevelId: levelsMap[2].id, registeredDate: new Date("2024-07-09") },
    { studentCode: "33145", studentName: "Syafiq Athallah", gender: "L", birthPlace: "Merangin", birthDate: "2016-08-08", address: "Jl. Beringin Indah Bangko", gradeLevel: "Ket: Kelas 4", className: "Kelas A2", parentName: "Athallah", parentWhatsapp: "085288112288", branchId: bangko.id, currentLevelId: levelsMap[2].id, registeredDate: new Date("2024-07-14") },
    { studentCode: "22134", studentName: "Tiara Andini", gender: "P", birthPlace: "Bangko", birthDate: "2017-01-19", address: "Lingkungan Bukit Gajah Bangko", gradeLevel: "Ket: Kelas 4", className: "Kelas A2", parentName: "Andini", parentWhatsapp: "082177112299", branchId: bangko.id, currentLevelId: levelsMap[1].id, registeredDate: new Date("2024-08-06") },

    // --- ALUMNI LULUS (1 Siswa) ---
    { studentCode: "10001", studentName: "Muhammad Rizky Al-Bukhari", gender: "L", birthPlace: "Merangin", birthDate: "2013-05-10", address: "Bangko", gradeLevel: "Alumni Lulus", className: "Alumni", parentName: "Bukhari", parentWhatsapp: "081277665544", branchId: bangko.id, currentLevelId: levelsMap[4].id, registeredDate: new Date("2023-01-15"), status: "GRADUATED", graduatedDate: new Date("2024-06-30") },
  ];

  const studentEntities = [];
  for (const s of rawStudents) {
    const student = await prisma.student.upsert({
      where: { studentCode: s.studentCode },
      update: {
        ...s,
        qrIdentifier: `MF-QR-${s.studentCode}`,
      },
      create: {
        ...s,
        qrIdentifier: `MF-QR-${s.studentCode}`,
        schoolOrigin: s.branchId === singkut.id ? "SDN Singkut" : "SDN Merangin",
      },
    });
    studentEntities.push(student);
  }

  const activeStudents = studentEntities.filter((s) => s.status === "ACTIVE");
  const singkutActive = activeStudents.filter((s) => s.branchId === singkut.id);
  const bangkoActive = activeStudents.filter((s) => s.branchId === bangko.id);
  console.log(`✅ Siswa OK: ${activeStudents.length} Siswa Aktif (${singkutActive.length} Singkut, ${bangkoActive.length} Bangko) + 1 Alumni Lulus (Total: ${studentEntities.length})`);

  // 6. TAGIHAN SPP (51 Invoices - Periode September 2026)
  console.log("💰 [6/10] Sinkronisasi 51 Tagihan SPP Realistis...");
  console.log("   Target: Realisasi Kas Lunas = Rp 7.605.000 (Singkut Rp 3.250.000 + Bangko Rp 4.355.000)");
  console.log("   Target: Tunggakan Piutang  = Rp 2.825.000 (29 Siswa Belum Bayar)");
  console.log("   Total Tagihan Terbit      = Rp 10.430.000 (Kolektibilitas: 72.9%)");

  // Hapus tagihan dan mutasi lama agar sinkron sempurna
  await prisma.cashMutation.deleteMany();
  await prisma.invoice.deleteMany();

  // SINGKUT (22 Siswa Aktif):
  // 10 Lunas: 5 x 350.000 + 5 x 300.000 = 3.250.000
  // 12 Belum Bayar: 11 x 100.000 + 1 x 125.000 = 1.225.000
  const singkutInvoicesPlan = [
    // 10 Lunas (Total: 3.250.000)
    { idx: 0, status: "PAID", amount: 350000, paidDate: "2026-09-05", paidMethod: "Tunai" },
    { idx: 1, status: "PAID", amount: 350000, paidDate: "2026-09-05", paidMethod: "Transfer Bank" },
    { idx: 2, status: "PAID", amount: 350000, paidDate: "2026-09-04", paidMethod: "Tunai" },
    { idx: 3, status: "PAID", amount: 350000, paidDate: "2026-09-04", paidMethod: "Transfer Bank" },
    { idx: 4, status: "PAID", amount: 350000, paidDate: "2026-09-03", paidMethod: "Tunai" },
    { idx: 5, status: "PAID", amount: 300000, paidDate: "2026-09-03", paidMethod: "Tunai" },
    { idx: 6, status: "PAID", amount: 300000, paidDate: "2026-09-02", paidMethod: "Transfer Bank" },
    { idx: 7, status: "PAID", amount: 300000, paidDate: "2026-09-02", paidMethod: "Tunai" },
    { idx: 8, status: "PAID", amount: 300000, paidDate: "2026-09-01", paidMethod: "Tunai" },
    { idx: 9, status: "PAID", amount: 300000, paidDate: "2026-09-01", paidMethod: "Transfer Bank" },
    // 12 Belum Bayar (Total: 1.225.000)
    { idx: 10, status: "UNPAID", amount: 125000 },
    { idx: 11, status: "UNPAID", amount: 100000 },
    { idx: 12, status: "UNPAID", amount: 100000 },
    { idx: 13, status: "UNPAID", amount: 100000 },
    { idx: 14, status: "UNPAID", amount: 100000 },
    { idx: 15, status: "UNPAID", amount: 100000 },
    { idx: 16, status: "UNPAID", amount: 100000 },
    { idx: 17, status: "UNPAID", amount: 100000 },
    { idx: 18, status: "UNPAID", amount: 100000 },
    { idx: 19, status: "UNPAID", amount: 100000 },
    { idx: 20, status: "UNPAID", amount: 100000 },
    { idx: 21, status: "UNPAID", amount: 100000 },
  ];

  // BANGKO (29 Siswa Aktif):
  // 12 Lunas: 7 x 400.000 (2.800.000) + 3 x 350.000 (1.050.000) + 1 x 305.000 + 1 x 200.000 = 4.355.000
  // 17 Belum Bayar: 16 x 100.000 (1.600.000) = 1.600.000
  const bangkoInvoicesPlan = [
    // 12 Lunas (Total: 4.355.000)
    { idx: 0, status: "PAID", amount: 400000, paidDate: "2026-09-05", paidMethod: "Tunai" },
    { idx: 1, status: "PAID", amount: 400000, paidDate: "2026-09-05", paidMethod: "Transfer Bank" },
    { idx: 2, status: "PAID", amount: 400000, paidDate: "2026-09-04", paidMethod: "Tunai" },
    { idx: 3, status: "PAID", amount: 400000, paidDate: "2026-09-04", paidMethod: "Tunai" },
    { idx: 4, status: "PAID", amount: 400000, paidDate: "2026-09-04", paidMethod: "Transfer Bank" },
    { idx: 5, status: "PAID", amount: 400000, paidDate: "2026-09-03", paidMethod: "Tunai" },
    { idx: 6, status: "PAID", amount: 400000, paidDate: "2026-09-03", paidMethod: "Tunai" },
    { idx: 7, status: "PAID", amount: 350000, paidDate: "2026-09-02", paidMethod: "Transfer Bank" },
    { idx: 8, status: "PAID", amount: 350000, paidDate: "2026-09-02", paidMethod: "Tunai" },
    { idx: 9, status: "PAID", amount: 350000, paidDate: "2026-09-01", paidMethod: "Tunai" },
    { idx: 10, status: "PAID", amount: 305000, paidDate: "2026-09-01", paidMethod: "Tunai" },
    { idx: 11, status: "PAID", amount: 200000, paidDate: "2026-08-31", paidMethod: "Transfer Bank" },
    // 17 Belum Bayar (Total: 1.600.000)
    { idx: 12, status: "UNPAID", amount: 100000 },
    { idx: 13, status: "UNPAID", amount: 100000 },
    { idx: 14, status: "UNPAID", amount: 100000 },
    { idx: 15, status: "UNPAID", amount: 100000 },
    { idx: 16, status: "UNPAID", amount: 100000 },
    { idx: 17, status: "UNPAID", amount: 100000 },
    { idx: 18, status: "UNPAID", amount: 100000 },
    { idx: 19, status: "UNPAID", amount: 100000 },
    { idx: 20, status: "UNPAID", amount: 100000 },
    { idx: 21, status: "UNPAID", amount: 100000 },
    { idx: 22, status: "UNPAID", amount: 100000 },
    { idx: 23, status: "UNPAID", amount: 100000 },
    { idx: 24, status: "UNPAID", amount: 100000 },
    { idx: 25, status: "UNPAID", amount: 100000 },
    { idx: 26, status: "UNPAID", amount: 100000 },
    { idx: 27, status: "UNPAID", amount: 100000 },
    { idx: 28, status: "UNPAID", amount: 100000 },
  ];

  const createdPaidInvoices = [];

  // Create Singkut Invoices
  for (const item of singkutInvoicesPlan) {
    const student = singkutActive[item.idx];
    if (!student) continue;
    const invCode = 1000 + item.idx * 17 + 13;
    const invoiceNumber = `INV/MF/2608/${invCode}`;
    const inv = await prisma.invoice.create({
      data: {
        invoiceNumber,
        studentId: student.id,
        branchId: singkut.id,
        type: "SPP",
        period: "September 2026",
        amount: item.amount,
        dueDate: new Date("2026-09-10"),
        status: item.status,
        paidAt: item.status === "PAID" ? new Date(item.paidDate) : null,
        paidMethod: item.status === "PAID" ? item.paidMethod : null,
      },
    });
    if (item.status === "PAID") {
      createdPaidInvoices.push({ inv, student, item });
    }
  }

  // Create Bangko Invoices
  for (const item of bangkoInvoicesPlan) {
    const student = bangkoActive[item.idx];
    if (!student) continue;
    const invCode = 3000 + item.idx * 23 + 47;
    const invoiceNumber = `INV/MF/2608/${invCode}`;
    const inv = await prisma.invoice.create({
      data: {
        invoiceNumber,
        studentId: student.id,
        branchId: bangko.id,
        type: "SPP",
        period: "September 2026",
        amount: item.amount,
        dueDate: new Date("2026-09-10"),
        status: item.status,
        paidAt: item.status === "PAID" ? new Date(item.paidDate) : null,
        paidMethod: item.status === "PAID" ? item.paidMethod : null,
      },
    });
    if (item.status === "PAID") {
      createdPaidInvoices.push({ inv, student, item });
    }
  }

  console.log(`✅ Tagihan SPP OK: 51 Invoices (22 Lunas, 29 Belum Bayar)`);

  // 7. JURNAL MUTASI KAS MASUK (cash_mutations - 22 Mutasi Sesuai Tagihan Lunas)
  console.log("📑 [7/10] Sinkronisasi 22 Catatan Mutasi Kas Masuk (Buku Besar)...");
  for (const { inv, student, item } of createdPaidInvoices) {
    await prisma.cashMutation.create({
      data: {
        invoiceId: inv.id,
        studentName: student.studentName,
        period: "September 2026",
        method: item.paidMethod === "Tunai" ? "TUNAI" : "TRANSFER",
        description: "Pelunasan Penuh",
        amount: item.amount,
        mutationDate: new Date(item.paidDate),
      },
    });
  }
  console.log("✅ 22 Mutasi kas masuk berhasil dibuat (Total Realisasi: Rp 7.605.000)");

  // 8. ARUS KEUANGAN & BUKU KAS (cash_transactions)
  console.log("📊 [8/10] Sinkronisasi Arus Keuangan Kas Real (Pemasukan & Pengeluaran)...");
  await prisma.cashTransaction.deleteMany();

  const transactionsData = [
    // Saldo Historis Juli
    {
      branchId: singkut.id,
      type: "INCOME",
      category: "SPP",
      title: "Akumulasi Pemasukan Kas Juli",
      amount: 3800000,
      sourceOrRecipient: "Wali Siswa Gabungan",
      transactionDate: new Date("2026-07-28"),
      notes: "Total iuran SPP cabang periode Juli",
    },
    {
      branchId: bangko.id,
      type: "EXPENSE",
      category: "Operasional & ATK",
      title: "Pengeluaran Operasional & Logistik",
      amount: 280719,
      sourceOrRecipient: "Pusat Logistik",
      transactionDate: new Date("2026-07-30"),
      notes: "Pengadaan formulir dan sertifikat",
    },
    // Pemasukan SPP September (Singkut: 3.250.000, Bangko: 4.355.000)
    {
      branchId: singkut.id,
      type: "INCOME",
      category: "SPP",
      title: "Realisasi SPP Bulanan Singkut",
      amount: 3250000,
      sourceOrRecipient: "10 Siswa Lunas Singkut",
      transactionDate: new Date("2026-09-05"),
      notes: "Penerimaan SPP Periode September 2026",
    },
    {
      branchId: bangko.id,
      type: "INCOME",
      category: "SPP",
      title: "Realisasi SPP Bulanan Bangko",
      amount: 4355000,
      sourceOrRecipient: "12 Siswa Lunas Bangko",
      transactionDate: new Date("2026-09-05"),
      notes: "Penerimaan SPP Periode September 2026",
    },
    // Pemasukan Non-SPP (Pendaftaran & Modul)
    {
      branchId: bangko.id,
      type: "INCOME",
      category: "Pendaftaran",
      title: "Pendaftaran Siswa Baru",
      amount: 200000,
      sourceOrRecipient: "Wali Siswa Baru",
      transactionDate: new Date("2026-08-25"),
      notes: "Pendaftaran murid baru Level Dasar",
    },
    {
      branchId: singkut.id,
      type: "INCOME",
      category: "Modul/Buku",
      title: "Penjualan Modul Rumus & Flashcard",
      amount: 150000,
      sourceOrRecipient: "Wali Siswa",
      transactionDate: new Date("2026-08-31"),
      notes: "Modul Penjumlahan Kombinasi",
    },
    {
      branchId: bangko.id,
      type: "INCOME",
      category: "Modul/Buku",
      title: "Penjualan Buku Jaritmatika",
      amount: 150000,
      sourceOrRecipient: "Wali Siswa",
      transactionDate: new Date("2026-08-27"),
      notes: "Paket Modul Level 1",
    },
    // Pengeluaran Operasional
    {
      branchId: bangko.id,
      type: "EXPENSE",
      category: "Cetak buku",
      title: "Cetak buku modul latihan jari",
      amount: 75000,
      sourceOrRecipient: "Percetakan Mandiri",
      transactionDate: new Date("2026-08-28"),
      notes: "Penggandaan lembar kerja kuis",
    },
    {
      branchId: singkut.id,
      type: "EXPENSE",
      category: "Honor Tutor",
      title: "Insentif Mengajar Tutor Singkut",
      amount: 800000,
      sourceOrRecipient: "Febrianti Dewi, S.Pd",
      transactionDate: new Date("2026-09-02"),
      notes: "Honor mengajar sesi pekanan",
    },
    {
      branchId: bangko.id,
      type: "EXPENSE",
      category: "Honor Tutor",
      title: "Insentif Mengajar Tutor Bangko",
      amount: 1000000,
      sourceOrRecipient: "Dewi Safitri & Kak Nanda",
      transactionDate: new Date("2026-09-02"),
      notes: "Honor mengajar sesi pekanan",
    },
    {
      branchId: singkut.id,
      type: "EXPENSE",
      category: "Operasional & ATK",
      title: "Pengadaan Spidol & ATK Cabang",
      amount: 150000,
      sourceOrRecipient: "Toko ATK Singkut",
      transactionDate: new Date("2026-09-04"),
      notes: "Spidol whiteboard dan perlengkapan kelas",
    },
  ];

  for (const tx of transactionsData) {
    await prisma.cashTransaction.create({ data: tx });
  }
  console.log("✅ Arus keuangan & buku kas berhasil disinkronkan.");

  // 9. PRESENSI, NILAI & KEAKTIFAN (attendances, student_grades, student_behaviors)
  console.log("📋 [9/10] Sinkronisasi Presensi, Nilai & Keaktifan Siswa...");
  await prisma.attendance.deleteMany();
  await prisma.studentGrade.deleteMany();
  await prisma.studentBehavior.deleteMany();

  // Presensi real
  const attDates = ["2026-08-23", "2026-08-29", "2026-08-30", "2026-09-05", "2026-09-06"];
  for (const dStr of attDates) {
    const d = new Date(`${dStr}T07:00:00.000Z`);
    for (let i = 0; i < 8; i++) {
      const student = activeStudents[i];
      if (!student) continue;
      await prisma.attendance.create({
        data: {
          studentId: student.id,
          branchId: student.branchId,
          tutorId: student.branchId === singkut.id ? tutorSingkut.id : tutorBangko.id,
          attendanceDate: d,
          method: i % 3 === 0 ? "MANUAL" : "QR_SCAN",
          status: i === 7 ? "IZIN" : "HADIR",
          notes: i === 7 ? "Izin acara keluarga" : "Hadir tepat waktu, senam jari lancar",
        },
      });
    }
  }

  // Nilai Leger (student_grades)
  const gradeTopics = [
    { topic: "Level 1 hlm 1-2", date: "2026-08-22" },
    { topic: "Menulis angka puluhan berdasarkan simbol 2", date: "2026-08-16" },
    { topic: "Hitung dan tulis", date: "2026-08-16" },
    { topic: "Menulis angka puluhan berdasarkan simbol 1", date: "2026-08-15" },
  ];

  for (const topicItem of gradeTopics) {
    for (let i = 0; i < 15; i++) {
      const student = activeStudents[i];
      if (!student) continue;
      const score = 80 + (i * 3) % 21;
      await prisma.studentGrade.create({
        data: {
          studentId: student.id,
          branchId: student.branchId,
          className: student.className,
          topic: topicItem.topic,
          examDate: new Date(`${topicItem.date}T00:00:00.000Z`),
          score: score,
          isJoined: true,
          notes: score >= 90 ? "Sangat cepat / fokus tinggi" : "Akurasi gerakan jari jemari bagus",
        },
      });
    }
  }

  // Keaktifan (student_behaviors)
  for (let i = 0; i < 10; i++) {
    const student = activeStudents[i];
    if (!student) continue;
    await prisma.studentBehavior.create({
      data: {
        studentId: student.id,
        branchId: student.branchId,
        behaviorDate: new Date("2026-08-30T00:00:00.000Z"),
        sessionTopic: "Pengurangan (Jari Turun)",
        focus: "Sangat Baik",
        participation: "Sangat Aktif",
        attitude: "Sopan & Tertib",
        notes: "Sangat antusias dan motorik jari lincah",
      },
    });
  }

  // Jurnal Guru (teacher_journals)
  await prisma.teacherJournal.deleteMany();
  const sampleJournals = [
    {
      branchId: singkut.id,
      tutorId: tutorSingkut.id,
      studentName: "Aishwa Rahma Annida",
      className: "Kelas A",
      teacherName: "Febrianti Dewi, S.Pd",
      topic: "Pengurangan (jari turun)",
      content: "Alhamdulillah, hari ini Ananda dapat mengikuti pembelajaran dengan baik. Ananda sudah memahami materi yang dipelajari dan mampu mengikuti gerakan jari dengan benar. Pertahankan semangat belajarnya ya! 💪✨",
      journalDate: new Date("2026-08-30"),
      refCode: "#727acd",
    },
    {
      branchId: singkut.id,
      tutorId: tutorSingkut.id,
      studentName: "Aishwa Rahma Annida",
      className: "Kelas A",
      teacherName: "Febrianti Dewi, S.Pd",
      topic: "Welcome to level 1",
      content: "Ananda menunjukkan perkembangan yang sangat baik. Meskipun baru pertama kali mengikuti pembelajaran, Ananda sudah sangat menguasai simbol jari dan mampu mengerjakan beberapa soal Level 1 dengan cepat.",
      journalDate: new Date("2026-08-22"),
      refCode: "#99ab21",
    },
    {
      branchId: singkut.id,
      tutorId: tutorSingkut.id,
      studentName: "Dzakiyyah Al Fajri",
      className: "Kelas B",
      teacherName: "Febrianti Dewi, S.Pd",
      topic: "Pengurangan (jari turun)",
      content: "Alhamdulillah, hari ini Ananda dapat mengikuti pembelajaran dengan baik. Ananda sudah memahami materi yang dipelajari dan mampu mengikuti gerakan jari dengan benar.",
      journalDate: new Date("2026-08-30"),
      refCode: "#345812",
    },
    {
      branchId: singkut.id,
      tutorId: tutorSingkut.id,
      studentName: "Ghumaisha",
      className: "Kelas A",
      teacherName: "Febrianti Dewi, S.Pd",
      topic: "Pengurangan (jari turun)",
      content: "Alhamdulillah, hari ini Ananda dapat mengikuti pembelajaran dengan baik. Ananda sudah mulai memahami materi yang dipelajari, namun masih sedikit bingung pada gerakan mundur.",
      journalDate: new Date("2026-08-30"),
      refCode: "#2144b6",
    },
  ];

  for (const j of sampleJournals) {
    await prisma.teacherJournal.create({ data: j });
  }

  console.log("✅ Presensi, Nilai, Keaktifan, dan Jurnal Guru berhasil disinkronkan.");

  // 10. WEBSITE CMS (website_hero, website_programs, website_testimonials, website_partners, website_leads)
  console.log("🌐 [10/10] Sinkronisasi Data Website CMS...");
  const heroEx = await prisma.websiteHero.findFirst();
  const heroData = {
    tagline: "Bimbingan Belajar Jaritmatika No. 1 di Sarolangun & Merangin",
    headline: "Bimbel Berhitung Cepat Jaritmatika Math Fingers",
    subheadline: "Mengoptimalkan potensi kecerdasan otak kanan & kiri anak melalui formasi 10 jari tangan tanpa sempoa dan tanpa kalkulator. Belajar asyik, cepat, berhitung akurat, dan percaya diri!",
    promoBanner: "🎉 PROMO SPESIAL: GRATIS Kelas Percobaan (Trial Class) & Diskon Pendaftaran 50% Bulan Ini!",
    promoActive: true,
    whatsappNumber: "6281279498907",
    whatsappGreeting: "Halo Admin Math Fingers, saya ingin info pendaftaran les Jaritmatika dan jadwal Trial Class gratis untuk anak saya.",
    targetDiscount: "50% OFF",
  };
  if (!heroEx) {
    await prisma.websiteHero.create({ data: heroData });
  } else {
    await prisma.websiteHero.update({ where: { id: heroEx.id }, data: heroData });
  }

  console.log("\n==================================================================");
  console.log("🎉 SEMUA DATA REAL BERHASIL DISINKRONISASIKAN KE POSTGRESQL!");
  console.log("==================================================================");
  console.log(`- Cabang: 2 (${singkut.branchName} & ${bangko.branchName})`);
  console.log(`- Kelas: 6 Kelompok Bimbingan`);
  console.log(`- Siswa Aktif: ${activeStudents.length} Siswa (${singkutActive.length} Singkut, ${bangkoActive.length} Bangko)`);
  console.log(`- Total Siswa: ${studentEntities.length} (termasuk 1 Alumni Lulus)`);
  console.log(`- Tagihan SPP: 51 Invoices`);
  console.log(`  * Lunas: 22 Invoices (Total Kas Masuk: Rp 7.605.000)`);
  console.log(`    - Singkut Lunas: Rp 3.250.000`);
  console.log(`    - Bangko Lunas: Rp 4.355.000`);
  console.log(`  * Belum Bayar: 29 Invoices (Total Tunggakan: Rp 2.825.000)`);
  console.log(`  * Akumulasi Tagihan Terbit: Rp 10.430.000`);
  console.log(`  * Tingkat Kolektibilitas: 72.9%`);
  console.log(`- Mutasi Kas Masuk: 22 Catatan (Rp 7.605.000)`);
  console.log(`- Arus Keuangan: Pemasukan & Pengeluaran Terhubung Sempurna`);
  console.log(`- Presensi: 40 Sesi Kehadiran`);
  console.log(`- Nilai Leger: 60 Rekor Penilaian`);
  console.log(`- Keaktifan Siswa: 10 Rekor Sikap & Fokus`);
  console.log("==================================================================");
}

main()
  .catch((e) => {
    console.error("❌ Error sync real data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
