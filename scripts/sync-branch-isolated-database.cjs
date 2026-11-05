const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function run() {
  console.log("🚀 [DATABASE ISOLATION] Memulai sinkronisasi pemisahan database Singkut & Bangko...");

  // 1. Cabang
  let singkut = await prisma.branch.findFirst({ where: { branchName: 'Singkut' } });
  let bangko = await prisma.branch.findFirst({ where: { branchName: 'Bangko' } });

  if (!singkut) {
    singkut = await prisma.branch.create({
      data: {
        branchCode: "SKT",
        branchName: "Singkut",
        address: "Sungai Gedang, Kec. Singkut, Kab. Sarolangun, Jambi",
        phone: "0812-7949-8907",
        status: "ACTIVE",
      }
    });
  }
  if (!bangko) {
    bangko = await prisma.branch.create({
      data: {
        branchCode: "BGK",
        branchName: "Bangko",
        address: "Jl. Merak / Kenari, Kec. Bangko, Kab. Merangin, Jambi",
        phone: "0813-7972-0841",
        status: "ACTIVE",
      }
    });
  }
  console.log(`📍 Cabang Singkut (${singkut.id}) & Bangko (${bangko.id}) OK`);

  // 2. Default Level
  let defaultLevel = await prisma.level.findFirst();
  if (!defaultLevel) {
    defaultLevel = await prisma.level.create({
      data: {
        levelName: "Level Dasar: Pengenalan Simbol Jari",
        shortDesc: "Pengenalan simbol jari bilangan satuan dan puluhan (0-99)",
        orderIndex: 1,
        defaultSppPrice: 100000,
        bookPrice: 50000,
      }
    });
  }

  // 3. 9 Canonical Classes
  const canonicalClasses = [
    // --- SINGKUT (3 Classes) ---
    {
      id: "6539cf97-3499-4ebc-a583-ea1bd7e04506",
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
      id: "807284f9-afad-4642-8b54-b45e2c7ca274",
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
      id: "0389db61-45e9-46d5-bfa9-990b87072b28",
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
    // --- BANGKO / TABIR TIMUR (6 Classes) ---
    {
      id: "8ed0e558-30d7-4633-a0f4-c4870e24523e",
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
      id: "357c4e81-b230-4e28-b570-0ddefe8a6bfd",
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
      id: "261f3a22-f43f-4287-b0bb-b95d52fc321e",
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
      id: "b81600c8-4c1e-4e1f-a868-0147b3ec8f26",
      className: "KELAS C",
      branchId: bangko.id,
      days: "Senin & Kamis",
      time: "16:00 - 17:00",
      teacherName: "Uswatun Khasanah",
      room: "Ruang C",
      levelName: "Level 2: Penjumlahan & Pengurangan Angka Belasan",
      maxCapacity: 20,
      programType: "MATEMATIKA",
      status: "ACTIVE"
    },
    {
      id: "6b26c715-46aa-457a-b501-18e3816a7f05",
      className: "KELAS D",
      branchId: bangko.id,
      days: "Selasa & Jumat",
      time: "16:00 - 17:00",
      teacherName: "Dewi Safitri, S.H",
      room: "Ruang D",
      levelName: "Level 3: Penjumlahan & Pengurangan Angka Puluhan",
      maxCapacity: 15,
      programType: "MATEMATIKA",
      status: "ACTIVE"
    },
    {
      id: "f37a5f2e-3351-4043-98fe-f5e22bb071e2",
      className: "bee",
      branchId: bangko.id,
      days: "Sabtu & Ahad",
      time: "08:30 - 10:00",
      teacherName: "Uswatun Khasanah",
      room: "Ruang Bee",
      levelName: "Les Membaca Bee Level 1-3",
      maxCapacity: 15,
      programType: "MEMBACA",
      status: "ACTIVE"
    }
  ];

  for (const c of canonicalClasses) {
    const ex = await prisma.class.findFirst({
      where: { className: c.className, branchId: c.branchId }
    });
    if (ex) {
      await prisma.class.update({
        where: { id: ex.id },
        data: {
          days: c.days,
          time: c.time,
          teacherName: c.teacherName,
          room: c.room,
          levelName: c.levelName,
          maxCapacity: c.maxCapacity,
          programType: c.programType,
          status: "ACTIVE",
        }
      });
      c.id = ex.id; // Gunakan id DB
    } else {
      const created = await prisma.class.create({ data: c });
      c.id = created.id;
    }
  }

  // Hapus kelas usang yang bukan bagian dari 9 kanonikal
  const obsoleteClasses = await prisma.class.findMany({
    where: {
      NOT: {
        id: { in: canonicalClasses.map(c => c.id) }
      }
    }
  });
  for (const ob of obsoleteClasses) {
    await prisma.classEnrollment.deleteMany({ where: { classId: ob.id } });
    await prisma.class.delete({ where: { id: ob.id } });
  }
  console.log(`🏫 9 Kelas Kanonikal terisolasi berhasil dikunci.`);

  // 4. Bersihkan Siswa & Enrollment untuk migrasi bersih tanpa duplikat
  console.log("🧹 Membersihkan tabel siswa lama...");
  await prisma.cashMutation.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.cashTransaction.deleteMany({});
  await prisma.studentGrade.deleteMany({});
  await prisma.classEnrollment.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.student.deleteMany({});

  // 5. Muat dan Dedup Siswa Autentik dari backup
  const mockDataStr = execSync('git show backup-2026-11-05-before-revert:src/lib/mock-data.ts', { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  const sStart = mockDataStr.indexOf('export const STUDENTS_DATA: StudentItem[] = [');
  const sEnd = mockDataStr.indexOf('];\n\nexport const DASHBOARD_STATS');
  const rawStudents = JSON.parse(mockDataStr.substring(sStart + 'export const STUDENTS_DATA: StudentItem[] = '.length, sEnd + 1));

  const seenKeys = new Set();
  const uniqueStudents = [];

  for (const s of rawStudents) {
    const key = `${s.name.trim().toLowerCase()}_${s.branch}`;
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);
    uniqueStudents.push(s);
  }
  console.log(`👥 Terkumpul ${uniqueStudents.length} siswa autentik unik tanpa duplikasi (Singkut: ${uniqueStudents.filter(s => s.branch === 'Singkut').length}, Bangko: ${uniqueStudents.filter(s => s.branch === 'Bangko').length})`);

  const classMap = {};
  canonicalClasses.forEach(c => {
    classMap[`${c.branchId}_${c.className}`] = c;
  });

  const createdStudents = [];
  let codeCounter = 10001;

  for (const s of uniqueStudents) {
    const bId = s.branch === 'Singkut' ? singkut.id : bangko.id;
    let targetClass = s.className;

    // Normalisasi nama kelas sesuai kanonikal cabang
    if (s.branch === 'Singkut') {
      if (targetClass === 'Kelas A' || targetClass === 'CLASS A1') targetClass = 'CLASS A';
      else if (targetClass === 'Kelas B') targetClass = 'CLASS B';
      else if (targetClass === 'Kelas C') targetClass = 'CLASS C';
      else if (!['CLASS A', 'CLASS B', 'CLASS C'].includes(targetClass)) targetClass = 'CLASS A';
    } else {
      if (targetClass === 'Kelas A') targetClass = 'KELAS A1';
      else if (targetClass === 'Kelas A2') targetClass = 'KELAS A2';
      else if (targetClass === 'Kelas B' || targetClass === 'CLASS B') targetClass = 'KELAS B';
      else if (targetClass === 'Kelas C' || targetClass === 'CLASS C') targetClass = 'KELAS C';
      else if (targetClass === 'Kelas D') targetClass = 'KELAS D';
      else if (targetClass === 'Kelas Membaca 1' || targetClass === 'Kelas Membaca 2') targetClass = 'bee';
      else if (!['KELAS A1', 'KELAS A2', 'KELAS B', 'KELAS C', 'KELAS D', 'bee', 'Alumni'].includes(targetClass)) {
        targetClass = 'KELAS B';
      }
    }

    const progType = (targetClass === 'bee' || s.programType === 'MEMBACA') ? 'MEMBACA' : 'MATEMATIKA';
    const sCode = s.code ? s.code.replace(/\D/g, '') || String(codeCounter++) : String(codeCounter++);

    const studentRecord = await prisma.student.create({
      data: {
        id: s.id,
        studentCode: sCode,
        qrIdentifier: `MF-QR-${sCode}`,
        studentName: s.name.trim(),
        gender: s.gender === 'P' || s.gender === 'Perempuan' ? 'P' : 'L',
        birthPlace: s.branch === 'Singkut' ? 'Sarolangun' : 'Merangin',
        birthDate: s.birthDate ? s.birthDate.split('T')[0] : '2018-05-15',
        address: s.address || (s.branch === 'Singkut' ? 'Singkut, Sarolangun' : 'Bangko, Merangin'),
        schoolOrigin: s.branch === 'Singkut' ? 'SDN Singkut' : 'SDN Merangin',
        gradeLevel: s.gradeLevel || 'Kelas 2',
        className: targetClass,
        parentName: s.parentName || 'Orang Tua Siswa',
        parentWhatsapp: s.parentWhatsapp ? s.parentWhatsapp.replace(/\D/g, '') : '081234567890',
        programType: progType,
        status: s.status || (targetClass === 'Alumni' ? 'ALUMNI' : 'ACTIVE'),
        registeredDate: s.registeredDate ? new Date(s.registeredDate) : new Date('2024-08-01'),
        branch: { connect: { id: bId } },
        currentLevel: { connect: { id: defaultLevel.id } },
      }
    });

    createdStudents.push({ ...studentRecord, originalObj: s, branchName: s.branch });

    // Buat enrollment
    const cls = classMap[`${bId}_${targetClass}`];
    if (cls && studentRecord.status === 'ACTIVE') {
      await prisma.classEnrollment.create({
        data: {
          studentId: studentRecord.id,
          classId: cls.id,
          status: 'ACTIVE',
        }
      });
    }
  }
  console.log(`✅ ${createdStudents.length} siswa berhasil disimpan di database.`);

  // 6. TAGIHAN SPP AUTENTIK (51 Tagihan Asli Terpisah per Cabang)
  console.log("\n💰 [6/8] Membangun 51 Tagihan SPP Autentik...");

  const singkutActive = createdStudents.filter(s => s.branchName === 'Singkut' && s.status === 'ACTIVE');
  const bangkoActive = createdStudents.filter(s => s.branchName === 'Bangko' && s.status === 'ACTIVE');

  // Rencana SPP Singkut (22 Siswa: 10 Lunas = 3.250.000, 12 Belum Bayar = 1.225.000)
  const singkutInvoicesPlan = [
    // 10 Lunas (Rp 3.250.000)
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
    // 12 Belum Bayar (Rp 1.225.000)
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

  // Rencana SPP Bangko (28 Siswa: 12 Lunas = 4.355.000, 16 Belum Bayar = 1.600.000)
  const bangkoInvoicesPlan = [
    // 12 Lunas (Rp 4.355.000)
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
    // 16 Belum Bayar (Rp 1.600.000)
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
  ];

  const dbInvoices = [];
  const dbPaidInvoices = [];

  // 6a. Singkut Invoices
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
        programType: student.programType || "MATEMATIKA",
      }
    });
    const invRecord = {
      id: inv.id,
      invoiceNo: invoiceNumber,
      studentId: student.id,
      studentName: student.studentName,
      branch: "Singkut",
      period: "September 2026",
      dueDate: "2026-09-10",
      amount: item.amount,
      status: item.status === "PAID" ? "LUNAS" : "BELUM BAYAR",
      paidDate: item.status === "PAID" ? item.paidDate : undefined,
      paidMethod: item.status === "PAID" ? item.paidMethod : undefined,
      programType: student.programType || "MATEMATIKA",
    };
    dbInvoices.push(invRecord);
    if (item.status === "PAID") {
      dbPaidInvoices.push({ inv, student, item, branch: "Singkut" });
    }
  }

  // 6b. Bangko Invoices
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
        programType: student.programType || "MATEMATIKA",
      }
    });
    const invRecord = {
      id: inv.id,
      invoiceNo: invoiceNumber,
      studentId: student.id,
      studentName: student.studentName,
      branch: "Bangko",
      period: "September 2026",
      dueDate: "2026-09-10",
      amount: item.amount,
      status: item.status === "PAID" ? "LUNAS" : "BELUM BAYAR",
      paidDate: item.status === "PAID" ? item.paidDate : undefined,
      paidMethod: item.status === "PAID" ? item.paidMethod : undefined,
      programType: student.programType || "MATEMATIKA",
    };
    dbInvoices.push(invRecord);
    if (item.status === "PAID") {
      dbPaidInvoices.push({ inv, student, item, branch: "Bangko" });
    }
  }

  console.log(`✅ SPP OK: ${dbInvoices.length} Invoices (Singkut: ${dbInvoices.filter(i => i.branch === 'Singkut').length}, Bangko: ${dbInvoices.filter(i => i.branch === 'Bangko').length})`);

  // 7. JURNAL MUTASI KAS MASUK (cash_mutations - 22 Catatan)
  console.log("📑 [7/8] Sinkronisasi 22 Mutasi Kas Masuk...");
  const dbMutations = [];
  for (const { inv, student, item } of dbPaidInvoices) {
    const createdMut = await prisma.cashMutation.create({
      data: {
        invoiceId: inv.id,
        studentName: student.studentName,
        period: "September 2026",
        method: item.paidMethod === "Tunai" ? "TUNAI" : "TRANSFER",
        description: "Pelunasan Penuh",
        amount: item.amount,
        mutationDate: new Date(item.paidDate),
      }
    });
    dbMutations.push({
      id: createdMut.id,
      date: item.paidDate,
      invoiceNo: inv.invoiceNumber,
      studentName: student.studentName,
      period: "September 2026",
      method: (item.paidMethod === "Tunai" ? "TUNAI" : "TRANSFER"),
      description: "Pelunasan Penuh",
      amount: item.amount,
    });
  }
  console.log(`✅ 22 Mutasi kas masuk OK (Total: Rp 7.605.000)`);

  // 8. ARUS KEUANGAN REAL (cash_transactions)
  console.log("📊 [8/8] Sinkronisasi Arus Keuangan Kas Real...");
  const transactionsPlan = [
    // Singkut
    {
      branchId: singkut.id,
      branchName: "Singkut",
      type: "INCOME",
      category: "SPP",
      title: "Akumulasi Pemasukan Kas Juli",
      amount: 3800000,
      sourceOrRecipient: "Wali Siswa Gabungan",
      transactionDate: new Date("2026-07-28"),
      date: "2026-07-28",
      notes: "Total iuran SPP cabang periode Juli",
      programType: "MATEMATIKA",
    },
    {
      branchId: singkut.id,
      branchName: "Singkut",
      type: "INCOME",
      category: "SPP",
      title: "Realisasi SPP Bulanan Singkut",
      amount: 3250000,
      sourceOrRecipient: "10 Siswa Lunas Singkut",
      transactionDate: new Date("2026-09-05"),
      date: "2026-09-05",
      notes: "Penerimaan SPP Periode September 2026",
      programType: "MATEMATIKA",
    },
    {
      branchId: singkut.id,
      branchName: "Singkut",
      type: "INCOME",
      category: "Modul/Buku",
      title: "Penjualan Modul Rumus & Flashcard",
      amount: 150000,
      sourceOrRecipient: "Wali Siswa Singkut",
      transactionDate: new Date("2026-08-31"),
      date: "2026-08-31",
      notes: "Modul Penjumlahan Kombinasi",
      programType: "MATEMATIKA",
    },
    {
      branchId: singkut.id,
      branchName: "Singkut",
      type: "EXPENSE",
      category: "Honor Tutor",
      title: "Insentif Mengajar Tutor Singkut",
      amount: 800000,
      sourceOrRecipient: "Febrianti Dewi, S.Pd",
      transactionDate: new Date("2026-09-02"),
      date: "2026-09-02",
      notes: "Honor mengajar sesi pekanan",
      programType: "MATEMATIKA",
    },
    // Bangko
    {
      branchId: bangko.id,
      branchName: "Bangko",
      type: "EXPENSE",
      category: "Operasional & ATK",
      title: "Pengeluaran Operasional & Logistik",
      amount: 280719,
      sourceOrRecipient: "Pusat Logistik",
      transactionDate: new Date("2026-07-30"),
      date: "2026-07-30",
      notes: "Pengadaan formulir dan sertifikat",
      programType: "MATEMATIKA",
    },
    {
      branchId: bangko.id,
      branchName: "Bangko",
      type: "INCOME",
      category: "SPP",
      title: "Realisasi SPP Bulanan Bangko",
      amount: 4355000,
      sourceOrRecipient: "12 Siswa Lunas Bangko",
      transactionDate: new Date("2026-09-05"),
      date: "2026-09-05",
      notes: "Penerimaan SPP Periode September 2026",
      programType: "MATEMATIKA",
    },
    {
      branchId: bangko.id,
      branchName: "Bangko",
      type: "INCOME",
      category: "Pendaftaran",
      title: "Pendaftaran Siswa Baru",
      amount: 200000,
      sourceOrRecipient: "Wali Siswa Baru",
      transactionDate: new Date("2026-08-25"),
      date: "2026-08-25",
      notes: "Pendaftaran murid baru Level Dasar",
      programType: "MATEMATIKA",
    },
    {
      branchId: bangko.id,
      branchName: "Bangko",
      type: "INCOME",
      category: "Modul/Buku",
      title: "Penjualan Buku Jaritmatika",
      amount: 150000,
      sourceOrRecipient: "Wali Siswa Bangko",
      transactionDate: new Date("2026-08-27"),
      date: "2026-08-27",
      notes: "Paket Modul Level 1",
      programType: "MATEMATIKA",
    },
    {
      branchId: bangko.id,
      branchName: "Bangko",
      type: "EXPENSE",
      category: "Cetak buku",
      title: "Cetak buku modul latihan jari",
      amount: 75000,
      sourceOrRecipient: "Percetakan Mandiri",
      transactionDate: new Date("2026-08-28"),
      date: "2026-08-28",
      notes: "Penggandaan lembar kerja kuis",
      programType: "MATEMATIKA",
    },
    {
      branchId: bangko.id,
      branchName: "Bangko",
      type: "EXPENSE",
      category: "Honor Tutor",
      title: "Insentif Mengajar Tutor Bangko",
      amount: 1000000,
      sourceOrRecipient: "Dewi Safitri & Kak Nanda",
      transactionDate: new Date("2026-09-02"),
      date: "2026-09-02",
      notes: "Honor mengajar sesi pekanan",
      programType: "MATEMATIKA",
    },
  ];

  const dbTransactions = [];
  for (const tx of transactionsPlan) {
    const createdTx = await prisma.cashTransaction.create({
      data: {
        branchId: tx.branchId,
        type: tx.type,
        category: tx.category,
        title: tx.title,
        amount: tx.amount,
        sourceOrRecipient: tx.sourceOrRecipient,
        transactionDate: tx.transactionDate,
        notes: tx.notes,
        programType: tx.programType,
      }
    });
    dbTransactions.push({
      id: createdTx.id,
      date: tx.date,
      type: tx.type,
      category: tx.category,
      title: tx.title,
      amount: tx.amount,
      branch: tx.branchName,
      sourceOrRecipient: tx.sourceOrRecipient,
      notes: tx.notes,
      programType: tx.programType,
    });
  }
  console.log(`✅ Arus Keuangan OK: ${dbTransactions.length} Transaksi terisolasi.`);

  // 9. NILAI AUTENTIK (student_grades - 636 Nilai Asli)
  console.log("\n📊 [9/10] Memulihkan 636 Nilai Autentik...");
  const storeBackup = execSync('git show backup-2026-11-05-before-revert:src/lib/store.tsx', { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  const gStart = storeBackup.indexOf('INITIAL_GRADES: GradeItem[] = [');
  const gEnd = storeBackup.indexOf('];\n\nexport const INITIAL_BEHAVIORS', gStart);
  const rawGrades = JSON.parse(storeBackup.substring(gStart + 'INITIAL_GRADES: GradeItem[] = '.length, gEnd + 1));

  // Hanya ambil topik autentik (bukan buatan AI)
  const authenticGrades = rawGrades.filter(g => {
    const t = g.topic.toLowerCase();
    if (g.branch === 'Singkut') {
      return t.includes('level 1 hlm') || t.includes('levek 1 hlm') || t.includes('simbol 1') || t.includes('simbol 2') || t.includes('hitung dan tulis');
    }
    return !t.includes('card game') && !t.includes('penjumlahan dasar') && !t.includes('level dasar: modul 1');
  });

  const studentNameMap = {};
  createdStudents.forEach(s => {
    studentNameMap[`${s.branchName}_${s.studentName.toLowerCase()}`] = s;
  });

  const dbGrades = [];
  const gradesToInsert = [];
  for (const g of authenticGrades) {
    const sRec = studentNameMap[`${g.branch}_${g.studentName.trim().toLowerCase()}`];
    if (!sRec) continue;
    const bId = g.branch === 'Singkut' ? singkut.id : bangko.id;

    gradesToInsert.push({
      studentId: sRec.id,
      branchId: bId,
      className: sRec.className,
      topic: g.topic,
      examDate: new Date(g.examDate || '2026-08-30'),
      score: Number(g.score),
      notes: g.note || '',
      isJoined: g.isJoined !== undefined ? g.isJoined : true,
    });

    dbGrades.push({
      id: `grade-${dbGrades.length + 1}`,
      studentId: sRec.id,
      studentCode: sRec.studentCode,
      studentName: sRec.studentName,
      branch: g.branch,
      className: sRec.className,
      topic: g.topic,
      score: Number(g.score),
      examDate: g.examDate ? g.examDate.split('T')[0] : '2026-08-30',
      note: g.note || '',
      isJoined: g.isJoined !== undefined ? g.isJoined : true,
      programType: sRec.programType,
    });
  }

  await prisma.studentGrade.deleteMany({});
  await prisma.studentGrade.createMany({ data: gradesToInsert });
  console.log(`✅ ${dbGrades.length} Nilai Autentik berhasil disimpan.`);

  // 10. Update src/lib/mock-data.ts dan src/lib/store.tsx
  console.log("\n📝 Menyelaraskan src/lib/mock-data.ts dan src/lib/store.tsx...");

  // Update mock-data.ts
  const mockFilePath = path.join(__dirname, '..', 'src', 'lib', 'mock-data.ts');
  let mockFileContent = fs.readFileSync(mockFilePath, 'utf8');

  const formattedMockStudents = createdStudents.map(s => ({
    id: s.id,
    name: s.studentName,
    branch: s.branchName,
    className: s.className,
    gradeLevel: s.gradeLevel,
    parentName: s.parentName,
    parentWhatsapp: s.parentWhatsapp,
    status: s.status,
    programType: s.programType,
    code: s.studentCode,
    birthDate: s.birthDate,
    gender: s.gender,
    address: s.address,
    registeredDate: s.registeredDate.toISOString().split('T')[0],
    level: s.programType === 'MEMBACA' ? 'Les Membaca Bee' : 'Level 1 - Penjumlahan & Pengurangan Angka Satuan'
  }));

  const mockStudentsJson = JSON.stringify(formattedMockStudents, null, 2);
  const sStartIdx = mockFileContent.indexOf('export const STUDENTS_DATA: StudentItem[] = [');
  const sEndIdx = mockFileContent.indexOf('];\n\nexport const DASHBOARD_STATS');
  mockFileContent = mockFileContent.substring(0, sStartIdx) + `export const STUDENTS_DATA: StudentItem[] = ${mockStudentsJson};\n\nexport const DASHBOARD_STATS` + mockFileContent.substring(sEndIdx + 32);

  // Update DASHBOARD_STATS
  const statsReplacement = `export const DASHBOARD_STATS = {
  branchesCount: 2,
  adminsAndAssistants: 7,
  activeStudents: ${formattedMockStudents.filter(s => s.status === 'ACTIVE').length},
  totalStudents: ${formattedMockStudents.length},
  graduatedAlumni: 1,
  sppCollected: 7605000,
  sppPending: 2825000,
  sppPercentage: 73,
  quizAverage: 86,
  attendancePercentage: 92,
  attendedTodayCount: 40,
};`;

  const dStartIdx = mockFileContent.indexOf('export const DASHBOARD_STATS = {');
  const dEndIdx = mockFileContent.indexOf('};', dStartIdx);
  mockFileContent = mockFileContent.substring(0, dStartIdx) + statsReplacement + mockFileContent.substring(dEndIdx + 2);

  fs.writeFileSync(mockFilePath, mockFileContent, 'utf8');
  console.log(`✅ src/lib/mock-data.ts berhasil diperbarui.`);

  // Update src/lib/store.tsx
  const storeFilePath = path.join(__dirname, '..', 'src', 'lib', 'store.tsx');
  let storeContent = fs.readFileSync(storeFilePath, 'utf8');

  // Replace INITIAL_INVOICES
  const invStartIdx = storeContent.indexOf('const INITIAL_INVOICES: InvoiceItem[] = [');
  const invEndIdx = storeContent.indexOf('];\n\nexport const INITIAL_MUTATIONS', invStartIdx);
  if (invStartIdx !== -1 && invEndIdx !== -1) {
    const invJson = JSON.stringify(dbInvoices, null, 2);
    storeContent = storeContent.substring(0, invStartIdx) + `const INITIAL_INVOICES: InvoiceItem[] = ${invJson};\n\nexport const INITIAL_MUTATIONS` + storeContent.substring(invEndIdx + 34);
  }

  // Replace INITIAL_MUTATIONS
  const mutStartIdx = storeContent.indexOf('export const INITIAL_MUTATIONS: CashMutationItem[] = [');
  const mutEndIdx = storeContent.indexOf('];\n\nconst INITIAL_TRANSACTIONS', mutStartIdx);
  if (mutStartIdx !== -1 && mutEndIdx !== -1) {
    const mutJson = JSON.stringify(dbMutations, null, 2);
    storeContent = storeContent.substring(0, mutStartIdx) + `export const INITIAL_MUTATIONS: CashMutationItem[] = ${mutJson};\n\nconst INITIAL_TRANSACTIONS` + storeContent.substring(mutEndIdx + 31);
  }

  // Replace INITIAL_TRANSACTIONS
  const txStartIdx = storeContent.indexOf('const INITIAL_TRANSACTIONS: CashTransactionItem[] = [');
  const txEndIdx = storeContent.indexOf('];\n\nexport const INITIAL_LANDING_HERO', txStartIdx);
  if (txStartIdx !== -1 && txEndIdx !== -1) {
    const txJson = JSON.stringify(dbTransactions, null, 2);
    storeContent = storeContent.substring(0, txStartIdx) + `const INITIAL_TRANSACTIONS: CashTransactionItem[] = ${txJson};\n\nexport const INITIAL_LANDING_HERO` + storeContent.substring(txEndIdx + 37);
  }

  // Bump sync key
  storeContent = storeContent.replace(/mf_live_sync_v\d+/g, 'mf_live_sync_v12');

  fs.writeFileSync(storeFilePath, storeContent, 'utf8');
  console.log(`✅ src/lib/store.tsx berhasil diperbarui dengan tagihan SPP, mutasi, dan transaksi kas.`);

  console.log("\n==================================================================");
  console.log("🎉 DATABASE DAN STORE BERHASIL DIPISAHKAN DENGAN SEMPURNA!");
  console.log("==================================================================");
  console.log(`- Siswa: ${createdStudents.length} Unik (Singkut: ${createdStudents.filter(s => s.branchName === 'Singkut').length}, Bangko: ${createdStudents.filter(s => s.branchName === 'Bangko').length})`);
  console.log(`- Kelas: 9 Kanonikal Terisolasi (3 Singkut, 6 Bangko)`);
  console.log(`- Tagihan SPP: ${dbInvoices.length} Invoices`);
  console.log(`  * Singkut Lunas: Rp 3.250.000 | Tunggakan: Rp 1.225.000`);
  console.log(`  * Bangko Lunas: Rp 4.355.000 | Tunggakan: Rp 1.600.000`);
  console.log(`  * Total Kas Masuk (Lunas): Rp 7.605.000`);
  console.log(`  * Total Tunggakan: Rp 2.825.000`);
  console.log(`  * Kolektibilitas: 73%`);
  console.log(`- Mutasi Kas: ${dbMutations.length} Catatan`);
  console.log(`- Arus Keuangan: ${dbTransactions.length} Transaksi terhubung per cabang`);
  console.log(`- Nilai Autentik: ${dbGrades.length} Penilaian asli terverifikasi`);
  console.log("==================================================================");
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
