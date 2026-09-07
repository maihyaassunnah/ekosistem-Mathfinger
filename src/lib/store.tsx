"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { StudentItem, BranchItem, STUDENTS_DATA, BRANCHES_DATA } from "./mock-data";

export interface ClassItem {
  id: string;
  name: string;
  branch: "Singkut" | "Bangko";
  days: string;
  time: string;
  teacher: string;
  room: string;
  level: string;
  enrolledCount: number;
  maxCapacity: number;
  programType?: "MATEMATIKA" | "MEMBACA";
}

export interface BranchAdminItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  branchName: "Singkut" | "Bangko" | "Semua Cabang (Pusat)";
  role: "Super Admin" | "Admin Cabang" | "Asisten Cabang";
  status: "Aktif" | "Nonaktif";
  createdAt: string;
  password?: string;
  avatarUrl?: string;
}

export interface BehaviorItem {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  sessionTopic: string;
  focus: string;
  participation: string;
  attitude: string;
  note: string;
}

export interface JournalItem {
  id: string;
  studentName: string;
  className: string;
  branch: "Singkut" | "Bangko";
  topic: string;
  content: string;
  teacher: string;
  date: string;
  refCode: string;
}

export interface AttendanceItem {
  id?: string;
  studentId: string;
  studentName?: string;
  studentCode?: string;
  className?: string;
  branch?: "Singkut" | "Bangko";
  date: string;
  time?: string;
  status: "HADIR" | "IZIN" | "SAKIT" | "ABSEN";
  method?: "QR_SCAN" | "MANUAL";
  note?: string;
}

export interface GradeItem {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  topic: string;
  examDate: string;
  score: number;
  note: string;
  isJoined: boolean;
}

export interface CurriculumModule {
  id: string;
  orderIndex: number;
  levelTitle: string;
  shortDesc: string;
  learningGoals: string;
  competencies: string;
  learningMaterials: string;
  indicators: string[];
}

export interface InvoiceItem {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  branch?: string;
  period: string;
  dueDate: string;
  amount: number;
  status: "LUNAS" | "BELUM BAYAR";
  paidDate?: string;
  paidMethod?: string;
}

export interface CashMutationItem {
  id: string;
  date: string;
  invoiceNo: string;
  studentName: string;
  period: string;
  method: "CICILAN" | "TUNAI" | "TRANSFER";
  description: string;
  amount: number;
}

export interface CashTransactionItem {
  id: string;
  date: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  title: string;
  amount: number;
  branch: "Singkut" | "Bangko";
  sourceOrRecipient: string;
  notes?: string;
  programType?: "MATEMATIKA" | "MEMBACA";
}

export interface LandingHeroConfig {
  tagline: string;
  headline: string;
  subheadline: string;
  promoBanner: string;
  promoActive: boolean;
  whatsappNumber: string;
  whatsappGreeting: string;
  targetDiscount: string;
}

export interface LandingProgramItem {
  id: string;
  levelTitle: string;
  targetAge: string;
  description: string;
  monthlyFee: number;
  registrationFee: number;
  benefits: string[];
  popular?: boolean;
}

export interface LandingTestimonialItem {
  id: string;
  parentName: string;
  studentName: string;
  branch: string;
  rating: number;
  comment: string;
}

export interface LandingLeadItem {
  id: string;
  studentName: string;
  studentAge: string;
  parentName: string;
  phone: string;
  branch: "Singkut" | "Bangko";
  createdAt: string;
  status: "Baru" | "Dihubungi" | "Trial Terjadwal" | "Terdaftar";
  notes?: string;
}

export interface LandingPartnerItem {
  id: string;
  name: string;
  category: string;
  logoText: string;
  logoUrl?: string;
  website?: string;
  active: boolean;
}

interface AppStoreContextType {
  // Students
  students: StudentItem[];
  addStudent: (student: Omit<StudentItem, "id" | "index">) => Promise<StudentItem | null> | void;
  updateStudent: (id: string, updated: Partial<StudentItem>) => void;
  deleteStudent: (id: string) => void;

  // Classes
  classes: ClassItem[];
  addClass: (cls: Omit<ClassItem, "id" | "enrolledCount">) => void;
  updateClass: (id: string, updated: Partial<ClassItem>) => void;
  deleteClass: (id: string) => void;

  // Branches
  branches: BranchItem[];
  addBranch: (branch: Omit<BranchItem, "id" | "activeStudents" | "adminCount" | "monthlyRevenue">) => void;
  updateBranch: (id: string, updated: Partial<BranchItem>) => void;
  deleteBranch: (id: string) => void;
  refreshData: () => Promise<void>;

  // Branch Admins
  branchAdmins: BranchAdminItem[];
  addBranchAdmin: (admin: Omit<BranchAdminItem, "id" | "createdAt">) => void;
  updateBranchAdmin: (id: string, updated: Partial<BranchAdminItem>) => void;
  deleteBranchAdmin: (id: string) => void;

  // Attendances
  attendances: Record<string, AttendanceItem>;
  setAttendance: (
    studentId: string,
    date: string,
    status: "HADIR" | "IZIN" | "SAKIT" | "ABSEN",
    note?: string,
    time?: string,
    method?: "QR_SCAN" | "MANUAL"
  ) => void;
  batchSetAttendance: (date: string, status: "HADIR" | "IZIN" | "SAKIT" | "ABSEN") => void;
  addAttendanceRecord: (record: AttendanceItem) => void;
  updateAttendanceRecord: (key: string, updated: Partial<AttendanceItem>) => void;
  deleteAttendanceRecord: (key: string) => void;

  // Journals
  journals: JournalItem[];
  addJournal: (journal: Omit<JournalItem, "id" | "refCode">) => void;
  deleteJournal: (id: string) => void;

  // Grades / Nilai
  grades: GradeItem[];
  saveGrades: (newGrades: GradeItem[]) => void;
  updateSingleGrade: (grade: {
    id?: string;
    studentId: string;
    studentName?: string;
    className?: string;
    topic: string;
    examDate: string;
    score: number;
    note?: string;
    isJoined?: boolean;
  }) => Promise<void>;
  deleteGradeSession: (topic: string, examDate: string) => Promise<void>;
  renameGradeSession: (oldTopic: string, oldExamDate: string, newTopic: string, newExamDate: string) => Promise<void>;
  deleteSingleGrade: (id: string) => Promise<void>;

  // Behavior / Sikap & Keaktifan
  behaviors: BehaviorItem[];
  addBehavior: (behavior: Omit<BehaviorItem, "id">) => void;
  saveStudentKeaktifan: (behavior: {
    id?: string;
    studentId: string;
    studentName?: string;
    date?: string;
    sessionTopic?: string;
    focus?: string;
    participation?: string;
    attitude?: string;
    note?: string;
  }) => Promise<void>;
  deleteBehavior: (id: string) => Promise<void>;

  // Curriculum
  curriculumModules: CurriculumModule[];
  addCurriculumModule: (mod: Omit<CurriculumModule, "id" | "orderIndex">) => void;
  updateCurriculumModule: (id: string, mod: Partial<CurriculumModule>) => void;
  deleteCurriculumModule: (id: string) => void;
  resetCurriculumModules: () => void;

  // Invoices & SPP
  invoices: InvoiceItem[];
  addInvoice: (inv: Omit<InvoiceItem, "id" | "invoiceNo">) => void;
  updateInvoiceStatus: (id: string, status: "LUNAS" | "BELUM BAYAR", paidDate?: string, paidMethod?: string) => void;
  deleteInvoice: (id: string) => void;

  // Cash Mutations / Buku Besar
  cashMutations: CashMutationItem[];
  addCashMutation: (mut: Omit<CashMutationItem, "id">) => void;

  // Arus Keuangan & Buku Kas (Ledger)
  transactions: CashTransactionItem[];
  addTransaction: (tx: Omit<CashTransactionItem, "id">) => void;
  deleteTransaction: (id: string) => void;

  // Website & Landing Page CMS
  landingHero: LandingHeroConfig;
  updateLandingHero: (hero: Partial<LandingHeroConfig>) => void;
  landingPrograms: LandingProgramItem[];
  addLandingProgram: (prog: Omit<LandingProgramItem, "id">) => void;
  updateLandingProgram: (id: string, prog: Partial<LandingProgramItem>) => void;
  deleteLandingProgram: (id: string) => void;
  landingTestimonials: LandingTestimonialItem[];
  addLandingTestimonial: (testi: Omit<LandingTestimonialItem, "id">) => void;
  deleteLandingTestimonial: (id: string) => void;
  landingLeads: LandingLeadItem[];
  addLandingLead: (lead: Omit<LandingLeadItem, "id" | "createdAt" | "status">) => void;
  updateLandingLeadStatus: (id: string, status: LandingLeadItem["status"]) => void;
  deleteLandingLead: (id: string) => void;
  landingPartners: LandingPartnerItem[];
  addLandingPartner: (partner: Omit<LandingPartnerItem, "id">) => void;
  updateLandingPartner: (id: string, partner: Partial<LandingPartnerItem>) => void;
  deleteLandingPartner: (id: string) => void;
}

const AppStoreContext = createContext<AppStoreContextType | null>(null);

const INITIAL_CLASSES: ClassItem[] = [
  {
    id: "cls-1",
    name: "Kelas B",
    branch: "Singkut",
    days: "Sabtu & Ahad",
    time: "14:00 - 15:30",
    teacher: "Febrianti Dewi, S.Pd",
    room: "Ruang A2",
    level: "Level Dasar: Pengenalan Simbol Jari",
    enrolledCount: 7,
    maxCapacity: 10,
  },
  {
    id: "cls-2",
    name: "CLASS C",
    branch: "Bangko",
    days: "Sabtu & Ahad",
    time: "13:30 - 14:30",
    teacher: "Dewi Safitri, S.H",
    room: "Ruang C",
    level: "Level Dasar: Pengenalan Simbol Jari",
    enrolledCount: 10,
    maxCapacity: 13,
  },
  {
    id: "cls-3",
    name: "Kelas A",
    branch: "Singkut",
    days: "Sabtu & Ahad",
    time: "14:00 - 15:30",
    teacher: "Febrianti Dewi, S.Pd",
    room: "Ruang A1",
    level: "Level Dasar: Pengenalan Simbol Jari",
    enrolledCount: 7,
    maxCapacity: 10,
  },
  {
    id: "cls-4",
    name: "CLASS B",
    branch: "Bangko",
    days: "Jumat & Ahad",
    time: "13:30 - 14:30",
    teacher: "Kak Nanda",
    room: "Ruang B",
    level: "Level 1: Penjumlahan & Pengurangan Angka Satuan",
    enrolledCount: 13,
    maxCapacity: 15,
  },
  {
    id: "cls-5",
    name: "Kelas A2",
    branch: "Bangko",
    days: "Selasa & Kamis",
    time: "14:00 - 15:30",
    teacher: "Ustadzah Yuni",
    room: "Ruang A2",
    level: "Level Dasar: Pengenalan Simbol Jari",
    enrolledCount: 5,
    maxCapacity: 10,
  },
  {
    id: "cls-6",
    name: "CLASS A1",
    branch: "Bangko",
    days: "Senin & Rabu",
    time: "13:30 - 14:30",
    teacher: "Kak Nanda",
    room: "Ruang A1",
    level: "Level 1: Penjumlahan & Pengurangan Angka Satuan",
    enrolledCount: 8,
    maxCapacity: 15,
    programType: "MATEMATIKA",
  },
  {
    id: "cls-m1",
    name: "Kelas Membaca 1",
    branch: "Singkut",
    days: "Senin & Rabu",
    time: "15:30 - 16:30",
    teacher: "Ustadzah Aisyah",
    room: "Ruang Baca 1",
    level: "Level 1: Pengenalan Huruf & Bunyi Vokal/Konsonan",
    enrolledCount: 2,
    maxCapacity: 8,
    programType: "MEMBACA",
  },
  {
    id: "cls-m2",
    name: "Kelas Membaca 2",
    branch: "Singkut",
    days: "Selasa & Kamis",
    time: "15:30 - 16:30",
    teacher: "Febrianti Dewi, S.Pd",
    room: "Ruang Baca 2",
    level: "Level 3: Membaca Kata Sederhana 2 Suku Kata",
    enrolledCount: 1,
    maxCapacity: 8,
    programType: "MEMBACA",
  },
];

const INITIAL_ADMINS: BranchAdminItem[] = [
  {
    id: "adm-super",
    fullName: "Wahyudin Hafiz, S.Pd",
    email: "wahyudinh20@stitmadani.ac.id",
    phone: "0853-8478-0910",
    branchName: "Semua Cabang (Pusat)",
    role: "Super Admin",
    status: "Aktif",
    createdAt: "2024-01-01",
    password: "password123",
  },
  {
    id: "adm-1",
    fullName: "Rina Marlina, S.Pd",
    email: "rina.singkut@mathfingers.com",
    phone: "0812-7949-8907",
    branchName: "Singkut",
    role: "Admin Cabang",
    status: "Aktif",
    createdAt: "2024-05-10",
    password: "password123",
  },
  {
    id: "adm-2",
    fullName: "Faisal Rahman, S.Kom",
    email: "faisal.bangko@mathfingers.com",
    phone: "0813-7972-0841",
    branchName: "Bangko",
    role: "Admin Cabang",
    status: "Aktif",
    createdAt: "2024-06-15",
    password: "password123",
  },
];

export const INITIAL_GRADES: GradeItem[] = [
  // Aishwa Rahma Annida (s-1) - from User Screenshot 2
  {
    id: "g-aishwa-1",
    studentId: "s-1",
    studentName: "Aishwa Rahma Annida",
    className: "Kelas A",
    topic: "Level 1 hlm 1-2",
    examDate: "2026-08-22",
    score: 95,
    note: "Sangat cepat / fokus tinggi",
    isJoined: true,
  },
  {
    id: "g-aishwa-2",
    studentId: "s-1",
    studentName: "Aishwa Rahma Annida",
    className: "Kelas A",
    topic: "Menulis angka puluhan berdasarkan simbol 2",
    examDate: "2026-08-16",
    score: 90,
    note: "Akurasi gerakan jari jemari bagus",
    isJoined: true,
  },
  {
    id: "g-aishwa-3",
    studentId: "s-1",
    studentName: "Aishwa Rahma Annida",
    className: "Kelas A",
    topic: "Hitung dan tulis",
    examDate: "2026-08-16",
    score: 88,
    note: "Menyelesaikan 15 soal tepat waktu",
    isJoined: true,
  },
  {
    id: "g-aishwa-4",
    studentId: "s-1",
    studentName: "Aishwa Rahma Annida",
    className: "Kelas A",
    topic: "Menulis angka puluhan berdasarkan simbol 1",
    examDate: "2026-08-15",
    score: 92,
    note: "Sangat antusias",
    isJoined: true,
  },
  // Alesha Rafani Marta (s-3)
  {
    id: "g-alesha-1",
    studentId: "s-3",
    studentName: "Alesha Rafani Marta",
    className: "Kelas A2",
    topic: "Level 1 hlm 1-2",
    examDate: "2026-08-22",
    score: 85,
    note: "Refleks jari baik",
    isJoined: true,
  },
  {
    id: "g-alesha-2",
    studentId: "s-3",
    studentName: "Alesha Rafani Marta",
    className: "Kelas A2",
    topic: "Hitung dan tulis",
    examDate: "2026-08-16",
    score: 82,
    note: "Fokus terjaga",
    isJoined: true,
  },
  // Anandira Dyah Asmara Wati (s-4)
  {
    id: "g-anandira-1",
    studentId: "s-4",
    studentName: "Anandira Dyah Asmara Wati",
    className: "CLASS C",
    topic: "Level 1 hlm 1-2",
    examDate: "2026-08-22",
    score: 100,
    note: "Sangat cepat / fokus tinggi",
    isJoined: true,
  },
  {
    id: "g-anandira-2",
    studentId: "s-4",
    studentName: "Anandira Dyah Asmara Wati",
    className: "CLASS C",
    topic: "Hitung dan tulis",
    examDate: "2026-08-16",
    score: 96,
    note: "Sempurna",
    isJoined: true,
  },
  // Bagas Pratama Putra (s-8)
  {
    id: "g-bagas-1",
    studentId: "s-8",
    studentName: "Bagas Pratama Putra",
    className: "Kelas B",
    topic: "Level 1 hlm 1-2",
    examDate: "2026-08-22",
    score: 80,
    note: "Meningkat",
    isJoined: true,
  },
];

export const INITIAL_BEHAVIORS: BehaviorItem[] = [
  {
    id: "beh-1",
    studentId: "s-1",
    studentName: "Aishwa Rahma Annida",
    date: "2026-08-30",
    sessionTopic: "Pengurangan (Jari Turun)",
    focus: "A",
    participation: "A",
    attitude: "A",
    note: "-",
  },
  {
    id: "beh-2",
    studentId: "s-1",
    studentName: "Aishwa Rahma Annida",
    date: "2026-08-28",
    sessionTopic: "Simbol Jari",
    focus: "A",
    participation: "A",
    attitude: "A",
    note: "-",
  },
];

const INITIAL_JOURNALS: JournalItem[] = [
  {
    id: "j-1",
    studentName: "Aishwa Rahma Annida",
    className: "Kelas A",
    branch: "Singkut",
    topic: "Pengurangan (jari turun)",
    content: "Alhamdulillah, hari ini Ananda dapat mengikuti pembelajaran dengan baik. Ananda sudah memahami materi yang dipelajari dan mampu mengikuti gerakan jari dengan benar. Pertahankan semangat belajarnya ya! 💪✨",
    teacher: "Febrianti Dewi, S.Pd",
    date: "2026-08-30",
    refCode: "#727acd",
  },
  {
    id: "j-welcome-1",
    studentName: "Aishwa Rahma Annida",
    className: "Kelas A",
    branch: "Singkut",
    topic: "Welcome to level 1",
    content: "Ananda menunjukkan perkembangan yang sangat baik. Meskipun baru pertama kali mengikuti pembelajaran, Ananda sudah sangat menguasai simbol jari dan mampu mengerjakan beberapa soal Level 1 dengan cepat. InsyaAllah, pada pertemuan berikutnya Ananda sudah siap mengikuti pembelajaran Level 1 bersama teman-teman.",
    teacher: "Febrianti Dewi, S.Pd",
    date: "2026-08-22",
    refCode: "#99ab21",
  },
  {
    id: "j-2",
    studentName: "Dzakiyyah Al Fajri",
    className: "Kelas B",
    branch: "Singkut",
    topic: "Pengurangan (jari turun)",
    content: "Alhamdulillah, hari ini Ananda dapat mengikuti pembelajaran dengan baik. Ananda sudah memahami materi yang dipelajari dan mampu mengikuti gerakan jari dengan benar. Pertahankan semangat belajarnya ya! 💪✨",
    teacher: "Febrianti Dewi, S.Pd",
    date: "2026-08-30",
    refCode: "#345812",
  },
  {
    id: "j-3",
    studentName: "Ghumaisha",
    className: "Kelas A",
    branch: "Singkut",
    topic: "Pengurangan (jari turun)",
    content: "Alhamdulillah, hari ini Ananda dapat mengikuti pembelajaran dengan baik. Ananda sudah mulai memahami materi yang dipelajari, namun masih sedikit bingung pada gerakan mundur yang melibatkan perpindahan kelompok jari. Yuk, terus latihan agar Ananda semakin terbiasa dan gerakannya semakin lancar. ✌️✨",
    teacher: "Febrianti Dewi, S.Pd",
    date: "2026-08-30",
    refCode: "#2144b6",
  },
  {
    id: "j-4",
    studentName: "Haris",
    className: "Kelas B",
    branch: "Singkut",
    topic: "Pengurangan (jari turun)",
    content: "Alhamdulillah, hari ini Ananda dapat mengikuti pembelajaran dengan baik. Ananda sudah memahami materi yang dipelajari dan mampu mengikuti gerakan jari dengan benar. Pertahankan semangat belajarnya ya! 💪✨",
    teacher: "Febrianti Dewi, S.Pd",
    date: "2026-08-30",
    refCode: "#17d246",
  },
];

const INITIAL_CURRICULUM: CurriculumModule[] = [
  {
    id: "cur-1",
    orderIndex: 1,
    levelTitle: "Level Dasar: Pengenalan Simbol Jari",
    shortDesc: "1. Pengenalan simbol jari bilangan satuan (...",
    learningGoals:
      "Peserta didik mampu mengenal, membaca, dan membentuk simbol jari bilangan 0--99 menggunakan tangan kanan dan tangan kiri sebagai dasar pembelajaran metode Math Finger.",
    competencies:
      "KD D.1 Menguasai simbol jari bilangan satuan (0-9) menggunakan tangan kanan. KD D.2 Menguasai simbol jari bilangan puluhan menggunakan tangan kiri. KD D.3 Membaca dan membentuk simbol jari bilangan 0-99 secara tepat.",
    learningMaterials:
      "1. Pengenalan simbol jari bilangan satuan (0-9) pada tangan kanan.\n2. Pengenalan simbol jari bilangan puluhan pada tangan kiri.\n3. Membaca simbol jari menjadi bilangan 0-99.\n4. Membentuk simbol jari sesuai angka yang diberikan.\n5. Latihan pengenalan simbol melalui permainan edukatif kartu simbol (flash card), dan latihan visual.",
    indicators: [
      "IPK D.1.1 Mempraktikkan simbol jari bilangan satuan (0-9) menggunakan tangan kanan dengan benar.",
      "IPK D.2.1 Mempraktikkan simbol jari bilangan puluhan menggunakan tangan kiri dengan benar.",
      "IPK D.3.1 Membaca simbol jari menjadi bilangan 0--99 secara tepat.",
      "IPK D.3.2 Membentuk simbol jari sesuai angka yang diberikan secara cepat dan akurat.",
    ],
  },
  {
    id: "cur-2",
    orderIndex: 2,
    levelTitle: "Level 1: Penjumlahan & Pengurangan Angka Satuan",
    shortDesc: "2. Gerak motorik buka tutup jari langsung tanpa rumus...",
    learningGoals:
      "Peserta didik mampu melakukan operasi penjumlahan dan pengurangan angka satuan secara cepat dan tepat menggunakan gerakan tangan kanan langsung tanpa rumus.",
    competencies:
      "KD 1.1 Menjumlahkan angka satuan 1-9 secara langsung.\nKD 1.2 Mengurangkan angka satuan 1-9 secara langsung.\nKD 1.3 Menghitung rangkaian operasi gabungan minimal 3 baris.",
    learningMaterials:
      "1. Aturan jari naik untuk penjumlahan.\n2. Aturan jari turun untuk pengurangan.\n3. Senam jari dan ritme berhitung teratur.\n4. Latihan kecepatan kuis 1 menit.",
    indicators: [
      "IPK 1.1.1 Mengoperasikan jari jempol (nilai 5) secara reflek.",
      "IPK 1.2.1 Mengurangkan angka satuan tanpa ragu dalam 3 detik.",
      "IPK 1.3.1 Menyelesaikan lembar kuis 10 soal akurat 100%.",
    ],
  },
  {
    id: "cur-3",
    orderIndex: 3,
    levelTitle: "Level 2: Kombinasi Rumus Teman Kecil (+4 s/d +1)",
    shortDesc: "3. Formula teman kecil berbasis kombinasi angka 5...",
    learningGoals:
      "Peserta didik memahami konsep teman kecil angka 5 dan mampu memecahkan hitungan ketika jari satuan tidak mencukupi.",
    competencies:
      "KD 2.1 Menerapkan rumus teman kecil penjumlahan (+4=+5-1, +3=+5-2, +2=+5-3, +1=+5-4).\nKD 2.2 Menerapkan rumus teman kecil pengurangan (-4=-5+1, -3=-5+2, -2=-5+3, -1=-5+4).",
    learningMaterials:
      "1. Pengenalan pasangan teman kecil (1&4, 2&3).\n2. Gerakan jempol turun jari telunjuk ikut turun (+).\n3. Gerakan jempol naik jari lain ikut naik (-).\n4. Soal cerita kontekstual.",
    indicators: [
      "IPK 2.1.1 Menyebutkan pasangan teman kecil secara spontan.",
      "IPK 2.2.1 Mempraktekkan rumus kombinasi 5 tanpa jeda berpikir.",
    ],
  },
];

const INITIAL_INVOICES: InvoiceItem[] = [
  {
    id: "inv-1",
    invoiceNo: "INV/MF/2608/5138",
    studentId: "s-10",
    studentName: "Maulana Syarif Wardani",
    period: "September 2026",
    dueDate: "2026-09-06",
    amount: 100000,
    status: "BELUM BAYAR",
  },
  {
    id: "inv-2",
    invoiceNo: "INV/MF/2608/6455",
    studentId: "s-1",
    studentName: "Abizar Rahandika Alghifari",
    period: "September 2026",
    dueDate: "2026-09-05",
    amount: 100000,
    status: "LUNAS",
    paidDate: "2026-09-05",
    paidMethod: "Tunai",
  },
  {
    id: "inv-3",
    invoiceNo: "INV/MF/2608/8905",
    studentId: "s-4",
    studentName: "Arsyila Nasha Razita",
    period: "September 2026",
    dueDate: "2026-09-05",
    amount: 100000,
    status: "BELUM BAYAR",
  },
  {
    id: "inv-4",
    invoiceNo: "INV/MF/2608/9306",
    studentId: "s-3",
    studentName: "Arka Prapta Ardani",
    period: "September 2026",
    dueDate: "2026-09-05",
    amount: 100000,
    status: "LUNAS",
    paidDate: "2026-09-04",
    paidMethod: "Tunai",
  },
  {
    id: "inv-5",
    invoiceNo: "INV/MF/2608/2200",
    studentId: "s-8",
    studentName: "M. Hannan Habibillah",
    period: "September 2026",
    dueDate: "2026-09-05",
    amount: 100000,
    status: "LUNAS",
    paidDate: "2026-09-04",
    paidMethod: "Tunai",
  },
  {
    id: "inv-m1",
    invoiceNo: "INV/MB/2609/001",
    studentId: "read-st-1",
    studentName: "Fathan Al Ghifari",
    period: "September 2026",
    dueDate: "2026-09-10",
    amount: 150000,
    status: "BELUM BAYAR",
  },
  {
    id: "inv-m2",
    invoiceNo: "INV/MB/2609/002",
    studentId: "read-st-2",
    studentName: "Aisyah Zahira",
    period: "September 2026",
    dueDate: "2026-09-10",
    amount: 150000,
    status: "LUNAS",
    paidDate: "2026-09-02",
    paidMethod: "Transfer Bank",
  },
];

const INITIAL_MUTATIONS: CashMutationItem[] = [
  {
    id: "mut-1",
    date: "2026-09-05",
    invoiceNo: "INV/MF/2608/6455",
    studentName: "Abizar Rahandika Alghifari",
    period: "September 2026",
    method: "CICILAN",
    description: "Pelunasan Penuh",
    amount: 100000,
  },
  {
    id: "mut-2",
    date: "2026-09-04",
    invoiceNo: "INV/MF/2608/9306",
    studentName: "Arka Prapta Ardani",
    period: "September 2026",
    method: "CICILAN",
    description: "Pelunasan Penuh",
    amount: 100000,
  },
  {
    id: "mut-3",
    date: "2026-09-04",
    invoiceNo: "INV/MF/2608/2200",
    studentName: "M. Hannan Habibillah",
    period: "September 2026",
    method: "CICILAN",
    description: "Pelunasan Penuh",
    amount: 100000,
  },
  {
    id: "mut-4",
    date: "2026-09-04",
    invoiceNo: "INV/MF/2608/4355",
    studentName: "Abrisam",
    period: "September 2026",
    method: "CICILAN",
    description: "Pelunasan Penuh",
    amount: 100000,
  },
  {
    id: "mut-5",
    date: "2026-09-04",
    invoiceNo: "INV/MF/2608/7415",
    studentName: "Aira Anatasya Putri",
    period: "September 2026",
    method: "CICILAN",
    description: "Pelunasan Penuh",
    amount: 100000,
  },
  {
    id: "mut-6",
    date: "2026-09-04",
    invoiceNo: "INV/MF/2608/3246",
    studentName: "Shaqia Azzahra Rahayu",
    period: "September 2026",
    method: "CICILAN",
    description: "Pelunasan Penuh",
    amount: 100000,
  },
];

const INITIAL_TRANSACTIONS: CashTransactionItem[] = [
  // Historical balance before August (yields starting balance 3.519.281)
  {
    id: "tx-h1",
    date: "2026-07-28",
    type: "INCOME",
    category: "SPP",
    title: "Akumulasi Pemasukan Kas Juli",
    amount: 3800000,
    branch: "Singkut",
    sourceOrRecipient: "Wali Siswa Gabungan",
    notes: "Total iuran SPP cabang",
  },
  {
    id: "tx-h2",
    date: "2026-07-30",
    type: "EXPENSE",
    category: "Operasional & ATK",
    title: "Pengeluaran Operasional & Logistik",
    amount: 280719,
    branch: "Bangko",
    sourceOrRecipient: "Pusat Logistik",
    notes: "Pengadaan formulir dan sertifikat",
  },
  // Bulan Ini (Agustus/September - Total Pemasukan: 1.100.000, Total Pengeluaran: 75.000)
  {
    id: "tx-1",
    date: "2026-08-25",
    type: "INCOME",
    category: "Pendaftaran",
    title: "Pendaftaran Siswa Baru",
    amount: 200000,
    branch: "Bangko",
    sourceOrRecipient: "ELH tagor",
    notes: "Pendaftaran murid baru Level Dasar",
  },
  {
    id: "tx-2",
    date: "2026-08-26",
    type: "INCOME",
    category: "SPP",
    title: "SPP Bulanan Siswa",
    amount: 150000,
    branch: "Singkut",
    sourceOrRecipient: "Abizar Rahandika",
    notes: "Iuran SPP Periode Berjalan",
  },
  {
    id: "tx-3",
    date: "2026-08-27",
    type: "INCOME",
    category: "Modul/Buku",
    title: "Penjualan Buku Jaritmatika",
    amount: 150000,
    branch: "Bangko",
    sourceOrRecipient: "Arka Prapta",
    notes: "Paket Modul Level 1",
  },
  {
    id: "tx-4",
    date: "2026-08-28",
    type: "INCOME",
    category: "SPP",
    title: "SPP Bulanan Siswa",
    amount: 150000,
    branch: "Singkut",
    sourceOrRecipient: "Abrisam",
    notes: "Iuran SPP Periode Berjalan",
  },
  {
    id: "tx-5",
    date: "2026-08-28",
    type: "EXPENSE",
    category: "Cetak buku",
    title: "Cetak buku modul latihan jari",
    amount: 75000,
    branch: "Bangko",
    sourceOrRecipient: "Percetakan Mandiri",
    notes: "Penggandaan lembar kerja kuis",
  },
  {
    id: "tx-6",
    date: "2026-08-29",
    type: "INCOME",
    category: "SPP",
    title: "SPP Bulanan Siswa",
    amount: 150000,
    branch: "Singkut",
    sourceOrRecipient: "M. Hannan Habibillah",
    notes: "Iuran SPP Periode Berjalan",
  },
  {
    id: "tx-7",
    date: "2026-08-30",
    type: "INCOME",
    category: "SPP",
    title: "SPP Bulanan Siswa",
    amount: 150000,
    branch: "Bangko",
    sourceOrRecipient: "Shaqia Azzahra",
    notes: "Iuran SPP Periode Berjalan",
  },
  {
    id: "tx-8",
    date: "2026-08-31",
    type: "INCOME",
    category: "Modul/Buku",
    title: "Penjualan Modul Rumus",
    amount: 150000,
    branch: "Singkut",
    sourceOrRecipient: "Aira Anatasya",
    notes: "Modul Penjumlahan Kombinasi",
    programType: "MATEMATIKA",
  },
  {
    id: "tx-m1",
    date: "2026-08-26",
    type: "INCOME",
    category: "SPP",
    title: "SPP Bulanan Les Membaca",
    amount: 150000,
    branch: "Singkut",
    sourceOrRecipient: "Fathan Al Ghifari",
    notes: "Iuran SPP Les Membaca Periode Berjalan",
    programType: "MEMBACA",
  },
  {
    id: "tx-m2",
    date: "2026-08-28",
    type: "INCOME",
    category: "Modul/Buku",
    title: "Buku Paket Membaca Level 1",
    amount: 125000,
    branch: "Singkut",
    sourceOrRecipient: "Aisyah Zahira",
    notes: "Modul Membaca Fonik & Suku Kata",
    programType: "MEMBACA",
  },
  {
    id: "tx-m3",
    date: "2026-08-29",
    type: "EXPENSE",
    category: "Operasional & ATK",
    title: "Flashcard Huruf & Kata",
    amount: 60000,
    branch: "Singkut",
    sourceOrRecipient: "Toko Media Edukasi",
    notes: "Alat peraga kartu baca",
    programType: "MEMBACA",
  },
];

const INITIAL_LANDING_HERO: LandingHeroConfig = {
  tagline: "Bimbingan Belajar Jaritmatika No. 1 di Sarolangun & Merangin",
  headline: "Bimbel Berhitung Cepat Jaritmatika Math Fingers",
  subheadline:
    "Mengoptimalkan potensi kecerdasan otak kanan & kiri anak melalui formasi 10 jari tangan tanpa sempoa dan tanpa kalkulator. Belajar asyik, cepat, berhitung akurat, dan percaya diri!",
  promoBanner: "🎉 PROMO SPESIAL: GRATIS Kelas Percobaan (Trial Class) & Diskon Pendaftaran 50% Bulan Ini!",
  promoActive: true,
  whatsappNumber: "6281279498907",
  whatsappGreeting: "Halo Admin Math Fingers, saya ingin info pendaftaran les Jaritmatika dan jadwal Trial Class gratis untuk anak saya.",
  targetDiscount: "50% OFF",
};

const INITIAL_LANDING_PROGRAMS: LandingProgramItem[] = [
  {
    id: "prog-1",
    levelTitle: "Level Pra-Dasar (TK/PAUD)",
    targetAge: "Usia 4 - 6 Tahun",
    description: "Pengenalan simbol jari tangan bilangan 0–99 dengan metode visual games dan kartu edukasi yang menyenangkan.",
    monthlyFee: 100000,
    registrationFee: 150000,
    benefits: [
      "Pengenalan 10 jari ceria",
      "Stimulasi motorik halus anak",
      "Flashcard Simbol Eksklusif",
      "Sertifikat Tingkat",
    ],
    popular: false,
  },
  {
    id: "prog-2",
    levelTitle: "Level 1: Dasar",
    targetAge: "Usia 6 - 8 Tahun (SD Kelas 1 - 2)",
    description: "Penjumlahan & pengurangan angka satuan langsung tanpa rumus rumit. Menumbuhkan kecintaan berhitung sejak dini.",
    monthlyFee: 100000,
    registrationFee: 150000,
    benefits: [
      "Operasi tambah/kurang satuan",
      "Kecepatan hitung < 3 detik",
      "Buku Modul Latihan Jari",
      "Laporan Rapor Digital Berkala",
    ],
    popular: true,
  },
  {
    id: "prog-3",
    levelTitle: "Level 2: Terampil",
    targetAge: "Usia 8 - 10 Tahun (SD Kelas 3 - 4)",
    description: "Formula Teman Kecil (angka 5) dan Teman Besar (angka 10). Mampu menyelesaikan hitungan puluhan dan ratusan secara spontan.",
    monthlyFee: 120000,
    registrationFee: 150000,
    benefits: [
      "Rumus Kombinasi Teman Jari",
      "Hitungan 2 - 3 digit cepat",
      "Uji Kecepatan Tiap Bulan",
      "Kartu QR Presensi Otomatis",
    ],
    popular: false,
  },
  {
    id: "prog-4",
    levelTitle: "Level 3: Mahir & Olimpiade",
    targetAge: "Usia 10 - 12 Tahun (SD Kelas 5 - 6)",
    description: "Perkalian dan pembagian kilat jari, operasi campuran cepat berantai, serta persiapan kompetisi & olimpiade matematika.",
    monthlyFee: 150000,
    registrationFee: 150000,
    benefits: [
      "Perkalian & Pembagian Jari",
      "Teknik Mencongak Refleks",
      "Mentoring Uji Kompetensi",
      "Sertifikat Kelulusan Resmi",
    ],
    popular: false,
  },
];

const INITIAL_LANDING_TESTIMONIALS: LandingTestimonialItem[] = [
  {
    id: "testi-1",
    parentName: "Bunda Rini Astuti",
    studentName: "Aishwa (7 thn)",
    branch: "Cabang Singkut",
    rating: 5,
    comment:
      "Alhamdulillah setelah les di Math Fingers, Aishwa sekarang berhitung tambah kurang cepat sekali tanpa perlu pensil & kertas. Nilai ulangan matematika di sekolah melonjak drastis dan jadi percaya diri!",
  },
  {
    id: "testi-2",
    parentName: "Ayah Hendra Wijaya",
    studentName: "Abizar (8 thn)",
    branch: "Cabang Bangko",
    rating: 5,
    comment:
      "Tutor di Math Fingers sangat sabar dan metodenya menyenangkan untuk anak. Anak saya jadi tidak takut lagi sama pelajaran matematika, malah selalu antusias waktu hari les tiba.",
  },
  {
    id: "testi-3",
    parentName: "Bunda Dewi Sartika",
    studentName: "Haris (6 thn)",
    branch: "Cabang Singkut",
    rating: 5,
    comment:
      "Sangat terbantu dengan sistem presensi QR dan laporan perkembangan berkala di WhatsApp. Orang tua jadi tahu persis sudah sampai level mana penguasaan jari anak.",
  },
];

const INITIAL_LANDING_LEADS: LandingLeadItem[] = [
  {
    id: "lead-1",
    studentName: "Kenzo Alvaro",
    studentAge: "7 Tahun (Kelas 2 SD)",
    parentName: "Ibu Maya",
    phone: "081234567890",
    branch: "Singkut",
    createdAt: "2026-09-05",
    status: "Trial Terjadwal",
    notes: "Ingin coba trial hari Sabtu jam 14.00",
  },
  {
    id: "lead-2",
    studentName: "Nafisa Salsabila",
    studentAge: "5 Tahun (TK B)",
    parentName: "Bapak Rudi",
    phone: "082187654321",
    branch: "Bangko",
    createdAt: "2026-09-06",
    status: "Baru",
    notes: "Tanya program Level Pra-Dasar",
  },
];

export const INITIAL_LANDING_PARTNERS: LandingPartnerItem[] = [
  {
    id: "part-1",
    name: "SDIT Permata Hati Singkut",
    category: "Sekolah Dasar Mitra",
    logoText: "SDIT PH",
    website: "https://instagram.com",
    active: true,
  },
  {
    id: "part-2",
    name: "TK Pertiwi Bangko",
    category: "PAUD & TK Binaan",
    logoText: "TK PERTIWI",
    website: "https://instagram.com",
    active: true,
  },
  {
    id: "part-3",
    name: "Komunitas Jaritmatika Indonesia",
    category: "Asosiasi Edukasi",
    logoText: "KJI PUSAT",
    website: "https://instagram.com",
    active: true,
  },
  {
    id: "part-4",
    name: "Yayasan Insan Cita Sarolangun",
    category: "Yayasan Pendidikan",
    logoText: "YIC",
    website: "https://instagram.com",
    active: true,
  },
  {
    id: "part-5",
    name: "Pusat Kreativitas Anak Mandiri",
    category: "Lembaga Pendidikan Anak",
    logoText: "PKAM",
    website: "https://instagram.com",
    active: true,
  },
  {
    id: "part-6",
    name: "SD Negeri 01 Pasar Atas Bangko",
    category: "Sekolah Dasar Binaan",
    logoText: "SDN 01",
    website: "https://instagram.com",
    active: true,
  },
  {
    id: "part-7",
    name: "Gerakan Numerasi Ceria Merangin",
    category: "Komunitas Belajar",
    logoText: "GNC MERANGIN",
    website: "https://instagram.com",
    active: true,
  },
];

export const INITIAL_ATTENDANCES: Record<string, AttendanceItem> = {
  // Sesi Minggu Lalu: 2026-08-23
  "s-1_2026-08-23": {
    id: "att-101",
    studentId: "s-1",
    studentName: "Aishwa Rahma Annida",
    studentCode: "79000",
    className: "Kelas A",
    branch: "Singkut",
    date: "2026-08-23",
    time: "13:58 WIB",
    status: "HADIR",
    method: "QR_SCAN",
    note: "Hadir tepat waktu, senam jari lancar",
  },
  "s-2_2026-08-23": {
    id: "att-102",
    studentId: "s-2",
    studentName: "Ajeng Cahyra Naifasha",
    studentCode: "91212",
    className: "CLASS C",
    branch: "Bangko",
    date: "2026-08-23",
    time: "13:30 WIB",
    status: "HADIR",
    method: "QR_SCAN",
    note: "Antusias kuis simbol jari",
  },
  "s-3_2026-08-23": {
    id: "att-103",
    studentId: "s-3",
    studentName: "Alesha Rafani Marta",
    studentCode: "78564",
    className: "Kelas A2",
    branch: "Bangko",
    date: "2026-08-23",
    time: "14:02 WIB",
    status: "HADIR",
    method: "QR_SCAN",
    note: "Latihan jari 1-99",
  },
  "s-4_2026-08-23": {
    id: "att-104",
    studentId: "s-4",
    studentName: "Anandira Dyah Asmara",
    studentCode: "17055",
    className: "CLASS C",
    branch: "Bangko",
    date: "2026-08-23",
    time: "-",
    status: "IZIN",
    method: "MANUAL",
    note: "Izin acara keluarga di luar kota",
  },
  "s-8_2026-08-23": {
    id: "att-105",
    studentId: "s-8",
    studentName: "Bagas Pratama Putra",
    studentCode: "61022",
    className: "Kelas B",
    branch: "Singkut",
    date: "2026-08-23",
    time: "14:05 WIB",
    status: "HADIR",
    method: "QR_SCAN",
    note: "Fokus berhitung cepat",
  },

  // Sesi 2026-08-29 (Sabtu)
  "s-1_2026-08-29": {
    id: "att-106",
    studentId: "s-1",
    studentName: "Aishwa Rahma Annida",
    studentCode: "79000",
    className: "Kelas A",
    branch: "Singkut",
    date: "2026-08-29",
    time: "13:55 WIB",
    status: "HADIR",
    method: "QR_SCAN",
    note: "Menyelesaikan lembar kuis tepat waktu",
  },
  "s-5_2026-08-29": {
    id: "att-107",
    studentId: "s-5",
    studentName: "Ananta Virya",
    studentCode: "95452",
    className: "CLASS B",
    branch: "Bangko",
    date: "2026-08-29",
    time: "13:28 WIB",
    status: "HADIR",
    method: "QR_SCAN",
    note: "Lancar tambah kurang 2 digit",
  },
  "s-6_2026-08-29": {
    id: "att-108",
    studentId: "s-6",
    studentName: "Aqila Fahmida",
    studentCode: "29797",
    className: "CLASS A1",
    branch: "Bangko",
    date: "2026-08-29",
    time: "-",
    status: "SAKIT",
    method: "MANUAL",
    note: "Izin sakit demam",
  },
  "s-7_2026-08-29": {
    id: "att-109",
    studentId: "s-7",
    studentName: "Arasely Naura Shada",
    studentCode: "88692",
    className: "Kelas A2",
    branch: "Bangko",
    date: "2026-08-29",
    time: "14:00 WIB",
    status: "HADIR",
    method: "QR_SCAN",
    note: "Hadir tepat waktu",
  },

  // Sesi 2026-08-30 (Ahad)
  "s-1_2026-08-30": {
    id: "att-110",
    studentId: "s-1",
    studentName: "Aishwa Rahma Annida",
    studentCode: "79000",
    className: "Kelas A",
    branch: "Singkut",
    date: "2026-08-30",
    time: "14:01 WIB",
    status: "HADIR",
    method: "QR_SCAN",
    note: "Aktif bertanya dan gerak jari sangat lincah",
  },
  "s-2_2026-08-30": {
    id: "att-111",
    studentId: "s-2",
    studentName: "Ajeng Cahyra Naifasha",
    studentCode: "91212",
    className: "CLASS C",
    branch: "Bangko",
    date: "2026-08-30",
    time: "13:35 WIB",
    status: "HADIR",
    method: "QR_SCAN",
    note: "Hadir tepat waktu",
  },
  "s-8_2026-08-30": {
    id: "att-112",
    studentId: "s-8",
    studentName: "Bagas Pratama Putra",
    studentCode: "61022",
    className: "Kelas B",
    branch: "Singkut",
    date: "2026-08-30",
    time: "-",
    status: "ABSEN",
    method: "MANUAL",
    note: "Tanpa keterangan",
  },
  "s-9_2026-08-30": {
    id: "att-113",
    studentId: "s-9",
    studentName: "Bilqis Ufairah",
    studentCode: "55866",
    className: "Kelas A",
    branch: "Singkut",
    date: "2026-08-30",
    time: "14:00 WIB",
    status: "HADIR",
    method: "QR_SCAN",
    note: "Mengikuti instruksi tutor dengan baik",
  },

  // Sesi Kemarin: 2026-09-05 (Sabtu)
  "s-1_2026-09-05": {
    id: "att-114",
    studentId: "s-1",
    studentName: "Aishwa Rahma Annida",
    studentCode: "79000",
    className: "Kelas A",
    branch: "Singkut",
    date: "2026-09-05",
    time: "13:57 WIB",
    status: "HADIR",
    method: "QR_SCAN",
    note: "Juara 1 kuis kecepatan berhitung",
  },
  "s-2_2026-09-05": {
    id: "att-115",
    studentId: "s-2",
    studentName: "Ajeng Cahyra Naifasha",
    studentCode: "91212",
    className: "CLASS C",
    branch: "Bangko",
    date: "2026-09-05",
    time: "13:30 WIB",
    status: "HADIR",
    method: "QR_SCAN",
    note: "Sangat antusias",
  },
  "s-3_2026-09-05": {
    id: "att-116",
    studentId: "s-3",
    studentName: "Alesha Rafani Marta",
    studentCode: "78564",
    className: "Kelas A2",
    branch: "Bangko",
    date: "2026-09-05",
    time: "14:05 WIB",
    status: "HADIR",
    method: "QR_SCAN",
    note: "Latihan rutin",
  },
  "s-5_2026-09-05": {
    id: "att-117",
    studentId: "s-5",
    studentName: "Ananta Virya",
    studentCode: "95452",
    className: "CLASS B",
    branch: "Bangko",
    date: "2026-09-05",
    time: "13:32 WIB",
    status: "HADIR",
    method: "QR_SCAN",
    note: "Kemajuan pesat",
  },
  "s-8_2026-09-05": {
    id: "att-118",
    studentId: "s-8",
    studentName: "Bagas Pratama Putra",
    studentCode: "61022",
    className: "Kelas B",
    branch: "Singkut",
    date: "2026-09-05",
    time: "14:02 WIB",
    status: "HADIR",
    method: "QR_SCAN",
    note: "Hadir tepat waktu",
  },

  // Sesi Hari Ini: 2026-09-06 (Ahad)
  "s-1_2026-09-06": {
    id: "att-119",
    studentId: "s-1",
    studentName: "Aishwa Rahma Annida",
    studentCode: "79000",
    className: "Kelas A",
    branch: "Singkut",
    date: "2026-09-06",
    time: "13:58 WIB",
    status: "HADIR",
    method: "QR_SCAN",
    note: "Scan kartu ID QR di gerbang bimbel",
  },
  "s-2_2026-09-06": {
    id: "att-120",
    studentId: "s-2",
    studentName: "Ajeng Cahyra Naifasha",
    studentCode: "91212",
    className: "CLASS C",
    branch: "Bangko",
    date: "2026-09-06",
    time: "13:31 WIB",
    status: "HADIR",
    method: "QR_SCAN",
    note: "Scan kartu ID QR",
  },
  "s-8_2026-09-06": {
    id: "att-121",
    studentId: "s-8",
    studentName: "Bagas Pratama Putra",
    studentCode: "61022",
    className: "Kelas B",
    branch: "Singkut",
    date: "2026-09-06",
    time: "14:00 WIB",
    status: "HADIR",
    method: "QR_SCAN",
    note: "Scan kartu ID QR",
  },
};

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<StudentItem[]>(STUDENTS_DATA);
  const [classes, setClasses] = useState<ClassItem[]>(INITIAL_CLASSES);
  const [branches, setBranches] = useState<BranchItem[]>(BRANCHES_DATA);
  const [branchAdmins, setBranchAdmins] = useState<BranchAdminItem[]>(INITIAL_ADMINS);
  const [journals, setJournals] = useState<JournalItem[]>(INITIAL_JOURNALS);
  const [attendances, setAttendances] = useState<Record<string, AttendanceItem>>(INITIAL_ATTENDANCES);
  const [grades, setGrades] = useState<GradeItem[]>(INITIAL_GRADES);
  const [behaviors, setBehaviors] = useState<BehaviorItem[]>(INITIAL_BEHAVIORS);
  const [curriculumModules, setCurriculumModules] = useState<CurriculumModule[]>(INITIAL_CURRICULUM);
  const [invoices, setInvoices] = useState<InvoiceItem[]>(INITIAL_INVOICES);
  const [cashMutations, setCashMutations] = useState<CashMutationItem[]>(INITIAL_MUTATIONS);
  const [transactions, setTransactions] = useState<CashTransactionItem[]>(INITIAL_TRANSACTIONS);
  const [landingHero, setLandingHero] = useState<LandingHeroConfig>(INITIAL_LANDING_HERO);
  const [landingPrograms, setLandingPrograms] = useState<LandingProgramItem[]>(INITIAL_LANDING_PROGRAMS);
  const [landingTestimonials, setLandingTestimonials] = useState<LandingTestimonialItem[]>(INITIAL_LANDING_TESTIMONIALS);
  const [landingLeads, setLandingLeads] = useState<LandingLeadItem[]>(INITIAL_LANDING_LEADS);
  const [landingPartners, setLandingPartners] = useState<LandingPartnerItem[]>(INITIAL_LANDING_PARTNERS);

  // Save to LocalStorage helper
  const save = useCallback((key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, []);

  // Realtime Data Fetcher from PostgreSQL
  const fetchAllLiveData = useCallback(async () => {
    try {
      const results = await Promise.allSettled([
        fetch("/api/students", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
        fetch("/api/branches", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
        fetch("/api/admins", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
        fetch("/api/classes", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
        fetch("/api/journals", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
        fetch("/api/grades", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
        fetch("/api/behaviors", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
        fetch("/api/curriculums", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
        fetch("/api/invoices", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
        fetch("/api/mutations", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
        fetch("/api/attendances", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
        fetch("/api/transactions", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
        fetch("/api/website/hero", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
        fetch("/api/website/programs", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
        fetch("/api/website/testimonials", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
        fetch("/api/website/leads", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
        fetch("/api/website/partners", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
      ]);

      const [
        studentsRes,
        branchesRes,
        adminsRes,
        classesRes,
        journalsRes,
        gradesRes,
        behaviorsRes,
        curriculumsRes,
        invoicesRes,
        mutationsRes,
        attendancesRes,
        transactionsRes,
        heroRes,
        programsRes,
        testimonialsRes,
        leadsRes,
        partnersRes,
      ] = results.map((res) => (res.status === "fulfilled" ? res.value : null));

      if (Array.isArray(studentsRes) && studentsRes.length > 0) {
        setStudents((prev) => {
          const pendingTemps = prev.filter((s) => s.id.startsWith("s-"));
          const serverIds = new Set(studentsRes.map((s) => s.id));
          const uniquePending = pendingTemps.filter((s) => !serverIds.has(s.id));
          const merged = [...uniquePending, ...studentsRes];
          save("mf_students", merged);
          return merged;
        });
      }
      if (Array.isArray(branchesRes) && branchesRes.length > 0) {
        setBranches(branchesRes);
        save("mf_branches", branchesRes);
      }
      if (Array.isArray(adminsRes) && adminsRes.length > 0) {
        setBranchAdmins(adminsRes);
        save("mf_branchAdmins", adminsRes);
      }
      if (Array.isArray(classesRes) && classesRes.length > 0) {
        setClasses(classesRes);
        save("mf_classes", classesRes);
      }
      if (Array.isArray(journalsRes) && journalsRes.length > 0) {
        setJournals(journalsRes);
        save("mf_journals", journalsRes);
      }
      if (Array.isArray(gradesRes) && gradesRes.length > 0) {
        setGrades(gradesRes);
        save("mf_grades", gradesRes);
      }
      if (Array.isArray(behaviorsRes) && behaviorsRes.length > 0) {
        setBehaviors(behaviorsRes);
        save("mf_behaviors", behaviorsRes);
      }
      if (Array.isArray(curriculumsRes) && curriculumsRes.length > 0) {
        setCurriculumModules(curriculumsRes);
        save("mf_curriculum", curriculumsRes);
      }
      if (Array.isArray(invoicesRes) && invoicesRes.length > 0) {
        setInvoices(invoicesRes);
        save("mf_invoices", invoicesRes);
      }
      if (Array.isArray(mutationsRes) && mutationsRes.length > 0) {
        setCashMutations(mutationsRes);
        save("mf_mutations", mutationsRes);
      }
      if (Array.isArray(attendancesRes) && attendancesRes.length > 0) {
        const map: Record<string, AttendanceItem> = {};
        attendancesRes.forEach((att: any) => {
          const dateStr = att.attendanceDate ? att.attendanceDate.split("T")[0] : "";
          const key = `${att.studentId}_${dateStr}`;
          map[key] = {
            id: att.id,
            studentId: att.studentId,
            studentName: att.student?.studentName || "Siswa",
            studentCode: att.student?.studentCode || "",
            className: att.student?.className || "",
            branch: att.branch?.branchName || "Singkut",
            date: dateStr,
            time: "14:00 WIB",
            status: att.status || "HADIR",
            method: att.method || "MANUAL",
            note: att.notes || "",
          };
        });
        setAttendances((prev) => ({ ...prev, ...map }));
        save("mf_attendances", map);
      }
      if (Array.isArray(transactionsRes) && transactionsRes.length > 0) {
        setTransactions(transactionsRes);
        save("mf_transactions", transactionsRes);
      }
      if (heroRes && heroRes.headline) {
        setLandingHero(heroRes);
        save("mf_landing_hero", heroRes);
      }
      if (Array.isArray(programsRes) && programsRes.length > 0) {
        setLandingPrograms(programsRes);
        save("mf_landing_programs", programsRes);
      }
      if (Array.isArray(testimonialsRes) && testimonialsRes.length > 0) {
        setLandingTestimonials(testimonialsRes);
        save("mf_landing_testi", testimonialsRes);
      }
      if (Array.isArray(leadsRes) && leadsRes.length > 0) {
        setLandingLeads(leadsRes);
        save("mf_landing_leads", leadsRes);
      }
      if (Array.isArray(partnersRes) && partnersRes.length > 0) {
        setLandingPartners(partnersRes);
        save("mf_landing_partners", partnersRes);
      }
    } catch (err) {
      console.warn("Error synchronizing live PostgreSQL data:", err);
    }
  }, [save]);

  // Initial Load from LocalStorage and Realtime PostgreSQL Sync
  useEffect(() => {
    try {
      const CURRENT_DATA_VERSION = "mf_live_sync_v2";
      if (localStorage.getItem("mf_data_version") !== CURRENT_DATA_VERSION) {
        localStorage.removeItem("mf_students");
        localStorage.removeItem("mf_classes");
        localStorage.removeItem("mf_branches");
        localStorage.removeItem("mf_invoices");
        localStorage.removeItem("mf_mutations");
        localStorage.setItem("mf_data_version", CURRENT_DATA_VERSION);
      }

      const savedStudents = localStorage.getItem("mf_students");
      if (savedStudents) setStudents(JSON.parse(savedStudents));

      const savedClasses = localStorage.getItem("mf_classes");
      if (savedClasses) setClasses(JSON.parse(savedClasses));

      const savedBranches = localStorage.getItem("mf_branches");
      if (savedBranches) setBranches(JSON.parse(savedBranches));

      const savedAdmins = localStorage.getItem("mf_branchAdmins");
      if (savedAdmins) setBranchAdmins(JSON.parse(savedAdmins));

      const savedJournals = localStorage.getItem("mf_journals");
      if (savedJournals) setJournals(JSON.parse(savedJournals));

      const savedAttendances = localStorage.getItem("mf_attendances");
      if (savedAttendances) {
        const parsed = JSON.parse(savedAttendances);
        if (Object.keys(parsed).length > 0) setAttendances(parsed);
      }

      const savedGrades = localStorage.getItem("mf_grades");
      if (savedGrades) {
        const parsed = JSON.parse(savedGrades);
        if (Array.isArray(parsed) && parsed.length > 0) setGrades(parsed);
      }

      const savedBehaviors = localStorage.getItem("mf_behaviors");
      if (savedBehaviors) {
        const parsed = JSON.parse(savedBehaviors);
        if (Array.isArray(parsed) && parsed.length > 0) setBehaviors(parsed);
      }

      const savedCurriculum = localStorage.getItem("mf_curriculum");
      if (savedCurriculum) setCurriculumModules(JSON.parse(savedCurriculum));

      const savedInvoices = localStorage.getItem("mf_invoices");
      if (savedInvoices) setInvoices(JSON.parse(savedInvoices));

      const savedMutations = localStorage.getItem("mf_mutations");
      if (savedMutations) setCashMutations(JSON.parse(savedMutations));

      const savedTransactions = localStorage.getItem("mf_transactions");
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));

      const savedLandingHero = localStorage.getItem("mf_landing_hero");
      if (savedLandingHero) setLandingHero(JSON.parse(savedLandingHero));

      const savedLandingPrograms = localStorage.getItem("mf_landing_programs");
      if (savedLandingPrograms) setLandingPrograms(JSON.parse(savedLandingPrograms));

      const savedLandingTesti = localStorage.getItem("mf_landing_testi");
      if (savedLandingTesti) setLandingTestimonials(JSON.parse(savedLandingTesti));

      const savedLandingLeads = localStorage.getItem("mf_landing_leads");
      if (savedLandingLeads) setLandingLeads(JSON.parse(savedLandingLeads));

      const savedLandingPartners = localStorage.getItem("mf_landing_partners");
      if (savedLandingPartners) setLandingPartners(JSON.parse(savedLandingPartners));
    } catch {
      // ignore
    }

    // 1. Fetch live data immediately from PostgreSQL
    fetchAllLiveData();

    // 2. Re-fetch live data whenever window / tab gains focus
    const handleRevalidate = () => {
      fetchAllLiveData();
    };
    window.addEventListener("focus", handleRevalidate);
    document.addEventListener("visibilitychange", handleRevalidate);

    // 3. Real-time background sync every 12 seconds
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchAllLiveData();
      }
    }, 12000);

    return () => {
      window.removeEventListener("focus", handleRevalidate);
      document.removeEventListener("visibilitychange", handleRevalidate);
      clearInterval(interval);
    };
  }, [fetchAllLiveData]);

  // Student CRUD
  const addStudent = async (st: Omit<StudentItem, "id" | "index">): Promise<StudentItem | null> => {
    const tempId = `s-${Date.now()}`;
    const newSt: StudentItem = {
      ...st,
      id: tempId,
      index: students.length + 1,
    };
    setStudents((prev) => {
      const updated = [newSt, ...prev];
      save("mf_students", updated);
      return updated;
    });

    // Synchronize to PostgreSQL database
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(st),
      });
      if (res.ok) {
        const created = await res.json();
        if (created && created.id) {
          setStudents((prev) => {
            const updated = prev.map((s) =>
              s.id === tempId
                ? {
                    ...s,
                    id: created.id,
                    studentCode: created.studentCode,
                    programType: created.programType || (st as any).programType,
                  }
                : s
            );
            save("mf_students", updated);
            return updated;
          });
          return created;
        }
      } else {
        const err = await res.json().catch(() => ({}));
        console.warn("Sinkronisasi student ke database server tertunda:", err);
      }
    } catch (err) {
      console.warn("Sinkronisasi student ke database tersimpan di penyimpanan lokal:", err);
    }
    return newSt;
  };

  const updateStudent = (id: string, updated: Partial<StudentItem>) => {
    setStudents((prev) => {
      const updatedList = prev.map((s) => (s.id === id ? { ...s, ...updated } : s));
      save("mf_students", updatedList);
      return updatedList;
    });

    fetch("/api/students", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updated }),
    }).catch((err) => console.error("Error updating student in PostgreSQL:", err));
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      save("mf_students", filtered);
      return filtered;
    });

    fetch(`/api/students?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch((err) => console.error("Error deleting student in PostgreSQL:", err));
  };

  // Class CRUD
  const addClass = (cls: Omit<ClassItem, "id" | "enrolledCount">) => {
    const tempId = `cls-${Date.now()}`;
    const newCls: ClassItem = {
      ...cls,
      id: tempId,
      enrolledCount: 0,
    };
    setClasses((prev) => {
      const updated = [newCls, ...prev];
      save("mf_classes", updated);
      return updated;
    });

    fetch("/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cls),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((created) => {
        if (created && created.id) {
          setClasses((prev) =>
            prev.map((c) => (c.id === tempId ? { ...c, id: created.id } : c))
          );
        }
      })
      .catch((err) => console.error("Error saving class to PostgreSQL:", err));
  };

  const updateClass = (id: string, updated: Partial<ClassItem>) => {
    setClasses((prev) => {
      const updatedList = prev.map((c) => (c.id === id ? { ...c, ...updated } : c));
      save("mf_classes", updatedList);
      return updatedList;
    });

    fetch("/api/classes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updated }),
    }).catch((err) => console.error("Error updating class in PostgreSQL:", err));
  };

  const deleteClass = (id: string) => {
    setClasses((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      save("mf_classes", filtered);
      return filtered;
    });

    fetch(`/api/classes?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch((err) => console.error("Error deleting class in PostgreSQL:", err));
  };

  // Branch CRUD
  const addBranch = (br: Omit<BranchItem, "id" | "activeStudents" | "adminCount" | "monthlyRevenue">) => {
    const tempId = `br-${Date.now()}`;
    const newBr: BranchItem = {
      ...br,
      id: tempId,
      activeStudents: 0,
      adminCount: 0,
      monthlyRevenue: 0,
    };
    setBranches((prev) => {
      const updated = [...prev, newBr];
      save("mf_branches", updated);
      return updated;
    });

    fetch("/api/branches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(br),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((created) => {
        if (created && created.id) {
          setBranches((prev) =>
            prev.map((b) => (b.id === tempId ? { ...b, ...created, id: created.id } : b))
          );
        }
        fetchAllLiveData();
      })
      .catch((err) => console.error("Error saving branch to PostgreSQL:", err));
  };

  const updateBranch = (id: string, updated: Partial<BranchItem>) => {
    let oldName = "";
    setBranches((prev) => {
      const existing = prev.find((b) => b.id === id);
      if (existing) oldName = existing.name;
      const updatedList = prev.map((b) => (b.id === id ? { ...b, ...updated } : b));
      save("mf_branches", updatedList);
      return updatedList;
    });

    // Automatically cascade branch name change to associated students, classes, invoices, admins, finances, journals, etc.
    if (updated.name && oldName && updated.name !== oldName) {
      const newName = updated.name;
      setStudents((prev) => {
        const list = prev.map((s) => (s.branch === oldName ? { ...s, branch: newName as any } : s));
        save("mf_students", list);
        return list;
      });
      setClasses((prev) => {
        const list = prev.map((c) => (c.branch === oldName ? { ...c, branch: newName as any } : c));
        save("mf_classes", list);
        return list;
      });
      setInvoices((prev) => {
        const list = prev.map((inv) => (inv.branch === oldName ? { ...inv, branch: newName as any } : inv));
        save("mf_invoices", list);
        return list;
      });
      setBranchAdmins((prev) => {
        const list = prev.map((a) => {
          if (a.branchName === oldName || a.branchName === `Cabang ${oldName}`) {
            return { ...a, branchName: newName as any };
          }
          return a;
        });
        save("mf_branchAdmins", list);
        return list;
      });
      setTransactions((prev) => {
        const list = prev.map((t) => (t.branch === oldName ? { ...t, branch: newName as any } : t));
        save("mf_transactions", list);
        return list;
      });
      setJournals((prev) => {
        const list = prev.map((j) => (j.branch === oldName ? { ...j, branch: newName as any } : j));
        save("mf_journals", list);
        return list;
      });
      setAttendances((prev) => {
        const updatedAtt: Record<string, AttendanceItem> = {};
        Object.entries(prev).forEach(([key, val]) => {
          updatedAtt[key] = val.branch === oldName ? { ...val, branch: newName as any } : val;
        });
        save("mf_attendances", updatedAtt);
        return updatedAtt;
      });
      setLandingLeads((prev) => {
        const list = prev.map((l) => (l.branch === oldName ? { ...l, branch: newName as any } : l));
        save("mf_landing_leads", list);
        return list;
      });
      setLandingTestimonials((prev) => {
        const list = prev.map((t) => (t.branch.includes(oldName) ? { ...t, branch: `Cabang ${newName}` } : t));
        save("mf_landing_testi", list);
        return list;
      });
    }

    fetch("/api/branches", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updated }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((saved) => {
        if (saved && saved.id) {
          setBranches((prev) => prev.map((b) => (b.id === id ? { ...b, ...saved } : b)));
        }
        fetchAllLiveData();
      })
      .catch((err) => console.error("Error updating branch in PostgreSQL:", err));
  };

  const deleteBranch = (id: string) => {
    setBranches((prev) => {
      const filtered = prev.filter((b) => b.id !== id);
      save("mf_branches", filtered);
      return filtered;
    });

    fetch(`/api/branches?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    })
      .then(() => fetchAllLiveData())
      .catch((err) => console.error("Error deleting branch in PostgreSQL:", err));
  };

  // Branch Admin CRUD
  const addBranchAdmin = (ad: Omit<BranchAdminItem, "id" | "createdAt">) => {
    const tempId = `adm-${Date.now()}`;
    const newAd: BranchAdminItem = {
      ...ad,
      id: tempId,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setBranchAdmins((prev) => {
      const updated = [newAd, ...prev];
      save("mf_branchAdmins", updated);
      return updated;
    });

    fetch("/api/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ad),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((created) => {
        if (created && created.id) {
          setBranchAdmins((prev) =>
            prev.map((a) => (a.id === tempId ? { ...a, id: created.id } : a))
          );
        }
      })
      .catch((err) => console.error("Error saving admin to PostgreSQL:", err));
  };

  const updateBranchAdmin = (id: string, updated: Partial<BranchAdminItem>) => {
    setBranchAdmins((prev) => {
      const updatedList = prev.map((a) => (a.id === id ? { ...a, ...updated } : a));
      save("mf_branchAdmins", updatedList);
      return updatedList;
    });

    fetch("/api/admins", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updated }),
    }).catch((err) => console.error("Error updating admin in PostgreSQL:", err));
  };

  const deleteBranchAdmin = (id: string) => {
    setBranchAdmins((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      save("mf_branchAdmins", filtered);
      return filtered;
    });

    fetch(`/api/admins?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch((err) => console.error("Error deleting admin from PostgreSQL:", err));
  };

  // Attendance
  const setAttendance = (
    studentId: string,
    date: string,
    status: "HADIR" | "IZIN" | "SAKIT" | "ABSEN",
    note: string = "",
    time?: string,
    method?: "QR_SCAN" | "MANUAL"
  ) => {
    setAttendances((prev) => {
      const key = `${studentId}_${date}`;
      const st = students.find((s) => s.id === studentId);
      const currentTime =
        time ||
        new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
      const next = {
        ...prev,
        [key]: {
          id: prev[key]?.id || `att-${Date.now()}-${studentId}`,
          studentId,
          studentName: st?.name || prev[key]?.studentName || "Siswa",
          studentCode: st?.studentCode || prev[key]?.studentCode || "-",
          className: st?.className || prev[key]?.className || "-",
          branch: st?.branch || prev[key]?.branch || "Singkut",
          date,
          time: prev[key]?.time || currentTime,
          status,
          method: method || prev[key]?.method || "MANUAL",
          note: note !== undefined ? note : (prev[key]?.note || ""),
        },
      };
      save("mf_attendances", next);
      return next;
    });
  };

  const batchSetAttendance = (date: string, status: "HADIR" | "IZIN" | "SAKIT" | "ABSEN") => {
    setAttendances((prev) => {
      const next = { ...prev };
      const currentTime =
        new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
      students.forEach((s) => {
        const key = `${s.id}_${date}`;
        next[key] = {
          id: prev[key]?.id || `att-${Date.now()}-${s.id}`,
          studentId: s.id,
          studentName: s.name,
          studentCode: s.studentCode,
          className: s.className,
          branch: s.branch,
          date,
          time: prev[key]?.time || currentTime,
          status,
          method: prev[key]?.method || "MANUAL",
          note: prev[key]?.note || "",
        };
      });
      save("mf_attendances", next);
      return next;
    });
  };

  const addAttendanceRecord = (record: AttendanceItem) => {
    setAttendances((prev) => {
      const key = `${record.studentId}_${record.date}`;
      const next = {
        ...prev,
        [key]: {
          ...record,
          id: record.id || `att-${Date.now()}`,
        },
      };
      save("mf_attendances", next);
      return next;
    });
  };

  const updateAttendanceRecord = (key: string, updated: Partial<AttendanceItem>) => {
    setAttendances((prev) => {
      if (!prev[key]) return prev;
      const next = {
        ...prev,
        [key]: {
          ...prev[key],
          ...updated,
        },
      };
      save("mf_attendances", next);
      return next;
    });
  };

  const deleteAttendanceRecord = (key: string) => {
    setAttendances((prev) => {
      const next = { ...prev };
      delete next[key];
      save("mf_attendances", next);
      return next;
    });
  };

  // Journals
  const addJournal = (j: Omit<JournalItem, "id" | "refCode">) => {
    const tempId = `j-${Date.now()}`;
    const newJ: JournalItem = {
      ...j,
      id: tempId,
      refCode: `#${Math.random().toString(16).substring(2, 8)}`,
    };
    setJournals((prev) => {
      const updated = [newJ, ...prev];
      save("mf_journals", updated);
      return updated;
    });

    fetch("/api/journals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(j),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((created) => {
        if (created && created.id) {
          setJournals((prev) =>
            prev.map((item) => (item.id === tempId ? { ...item, id: created.id, refCode: created.refCode } : item))
          );
        }
      })
      .catch((err) => console.error("Error saving journal to PostgreSQL:", err));
  };

  const deleteJournal = (id: string) => {
    setJournals((prev) => {
      const filtered = prev.filter((j) => j.id !== id);
      save("mf_journals", filtered);
      return filtered;
    });

    fetch(`/api/journals?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch((err) => console.error("Error deleting journal from PostgreSQL:", err));
  };

  // Grades / Nilai
  const saveGrades = (newGrades: GradeItem[]) => {
    setGrades((prev) => {
      const filtered = prev.filter((g) => !newGrades.some((ng) => ng.id === g.id));
      const updated = [...newGrades, ...filtered];
      save("mf_grades", updated);
      return updated;
    });

    fetch("/api/grades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGrades),
    }).catch((err) => console.error("Error saving grades to PostgreSQL:", err));
  };

  const updateSingleGrade = async (grade: {
    id?: string;
    studentId: string;
    studentName?: string;
    className?: string;
    topic: string;
    examDate: string;
    score: number;
    note?: string;
    isJoined?: boolean;
  }) => {
    setGrades((prev) => {
      const idx = prev.findIndex(
        (g) =>
          (grade.id && g.id === grade.id) ||
          (g.studentId === grade.studentId && g.topic === grade.topic && g.examDate === grade.examDate)
      );
      let updated: GradeItem[];
      if (idx >= 0) {
        const item = { ...prev[idx], ...grade, score: Number(grade.score) };
        updated = [...prev];
        updated[idx] = item;
      } else {
        const newG: GradeItem = {
          id: grade.id || `gr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          studentId: grade.studentId,
          studentName: grade.studentName || "Siswa",
          className: grade.className || "Kelas Reguler",
          topic: grade.topic,
          examDate: grade.examDate,
          score: Number(grade.score),
          note: grade.note || "",
          isJoined: grade.isJoined !== undefined ? grade.isJoined : true,
        };
        updated = [newG, ...prev];
      }
      save("mf_grades", updated);
      return updated;
    });

    try {
      const res = await fetch("/api/grades", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(grade),
      });
      if (res.ok) {
        const saved = await res.json();
        if (saved && saved.id) {
          setGrades((prev) => {
            const next = prev.map((g) =>
              (grade.id && g.id === grade.id) ||
              (g.studentId === saved.studentId && g.topic === saved.topic && g.examDate === saved.examDate)
                ? { ...g, ...saved }
                : g
            );
            save("mf_grades", next);
            return next;
          });
        }
      }
    } catch (err) {
      console.error("Error updating grade in PostgreSQL:", err);
    }
  };

  const deleteGradeSession = async (topic: string, examDate: string) => {
    setGrades((prev) => {
      const filtered = prev.filter((g) => !(g.topic === topic && g.examDate === examDate));
      save("mf_grades", filtered);
      return filtered;
    });

    try {
      await fetch(`/api/grades?topic=${encodeURIComponent(topic)}&examDate=${encodeURIComponent(examDate)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Error deleting grade session:", err);
    }
  };

  const renameGradeSession = async (
    oldTopic: string,
    oldExamDate: string,
    newTopic: string,
    newExamDate: string
  ) => {
    setGrades((prev) => {
      const updated = prev.map((g) =>
        g.topic === oldTopic && g.examDate === oldExamDate
          ? { ...g, topic: newTopic, examDate: newExamDate }
          : g
      );
      save("mf_grades", updated);
      return updated;
    });

    try {
      await fetch("/api/grades", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldTopic, oldExamDate, newTopic, newExamDate }),
      });
    } catch (err) {
      console.error("Error renaming grade session:", err);
    }
  };

  const deleteSingleGrade = async (id: string) => {
    setGrades((prev) => {
      const filtered = prev.filter((g) => g.id !== id);
      save("mf_grades", filtered);
      return filtered;
    });

    try {
      await fetch(`/api/grades?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch (err) {
      console.error("Error deleting single grade:", err);
    }
  };

  // Behaviors / Sikap & Keaktifan
  const addBehavior = (b: Omit<BehaviorItem, "id">) => {
    setBehaviors((prev) => {
      const newB: BehaviorItem = {
        ...b,
        id: `beh-${Date.now()}`,
      };
      const updated = [newB, ...prev];
      save("mf_behaviors", updated);
      return updated;
    });
  };

  const saveStudentKeaktifan = async (b: {
    id?: string;
    studentId: string;
    studentName?: string;
    date?: string;
    sessionTopic?: string;
    focus?: string;
    participation?: string;
    attitude?: string;
    note?: string;
  }) => {
    const tempId = b.id || `beh-${Date.now()}`;
    const today = b.date || new Date().toISOString().split("T")[0];

    setBehaviors((prev) => {
      const existingIdx = prev.findIndex(
        (item) => (b.id && item.id === b.id) || item.studentId === b.studentId
      );
      let updated: BehaviorItem[];
      if (existingIdx >= 0) {
        const item: BehaviorItem = {
          ...prev[existingIdx],
          ...b,
          id: prev[existingIdx].id,
          date: today,
          sessionTopic: b.sessionTopic || prev[existingIdx].sessionTopic || "Observasi Keaktifan",
          focus: b.focus || prev[existingIdx].focus || "Sangat Tinggi",
          participation: b.participation || prev[existingIdx].participation || "95%",
          attitude: b.attitude || prev[existingIdx].attitude || "1.8s",
          note: b.note !== undefined ? b.note : prev[existingIdx].note || "",
        };
        updated = [...prev];
        updated[existingIdx] = item;
      } else {
        const newB: BehaviorItem = {
          id: tempId,
          studentId: b.studentId,
          studentName: b.studentName || "Siswa",
          date: today,
          sessionTopic: b.sessionTopic || "Observasi Keaktifan",
          focus: b.focus || "Sangat Tinggi",
          participation: b.participation || "95%",
          attitude: b.attitude || "1.8s",
          note: b.note || "",
        };
        updated = [newB, ...prev];
      }
      save("mf_behaviors", updated);
      return updated;
    });

    try {
      const res = await fetch("/api/behaviors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(b),
      });
      if (res.ok) {
        const saved = await res.json();
        if (saved && saved.id) {
          setBehaviors((prev) => {
            const next = prev.map((item) =>
              item.studentId === saved.studentId ? { ...item, ...saved } : item
            );
            save("mf_behaviors", next);
            return next;
          });
        }
      }
    } catch (err) {
      console.error("Error saving keaktifan to PostgreSQL:", err);
    }
  };

  const deleteBehavior = async (id: string) => {
    setBehaviors((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      save("mf_behaviors", filtered);
      return filtered;
    });

    try {
      await fetch(`/api/behaviors?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch (err) {
      console.error("Error deleting behavior:", err);
    }
  };

  // Curriculum Modules
  const addCurriculumModule = (mod: Omit<CurriculumModule, "id" | "orderIndex">) => {
    const tempId = `cur-${Date.now()}`;
    const newMod: CurriculumModule = {
      ...mod,
      id: tempId,
      orderIndex: curriculumModules.length + 1,
    };
    setCurriculumModules((prev) => {
      const updated = [...prev, newMod];
      save("mf_curriculum", updated);
      return updated;
    });

    fetch("/api/curriculums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mod),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((created) => {
        if (created && created.id) {
          setCurriculumModules((prev) =>
            prev.map((c) => (c.id === tempId ? { ...c, id: created.id } : c))
          );
        }
      })
      .catch((err) => console.error("Error saving curriculum to PostgreSQL:", err));
  };

  const updateCurriculumModule = (id: string, mod: Partial<CurriculumModule>) => {
    setCurriculumModules((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, ...mod } : m));
      save("mf_curriculum", updated);
      return updated;
    });

    fetch("/api/curriculums", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...mod }),
    }).catch((err) => console.error("Error updating curriculum in PostgreSQL:", err));
  };

  const deleteCurriculumModule = (id: string) => {
    setCurriculumModules((prev) => {
      const filtered = prev.filter((m) => m.id !== id);
      save("mf_curriculum", filtered);
      return filtered;
    });

    fetch(`/api/curriculums?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch((err) => console.error("Error deleting curriculum from PostgreSQL:", err));
  };

  const resetCurriculumModules = () => {
    setCurriculumModules([]);
    save("mf_curriculum", []);
  };

  // Invoices & SPP
  const addInvoice = (inv: Omit<InvoiceItem, "id" | "invoiceNo">) => {
    const tempId = `inv-${Date.now()}`;
    const code = Math.floor(1000 + Math.random() * 9000);
    const newInv: InvoiceItem = {
      ...inv,
      id: tempId,
      invoiceNo: `INV/MF/2608/${code}`,
    };
    setInvoices((prev) => {
      const updated = [newInv, ...prev];
      save("mf_invoices", updated);
      return updated;
    });

    fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inv),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((created) => {
        if (created && created.id) {
          setInvoices((prev) =>
            prev.map((i) => (i.id === tempId ? { ...i, id: created.id, invoiceNo: created.invoiceNo } : i))
          );
        }
      })
      .catch((err) => console.error("Error saving invoice to PostgreSQL:", err));
  };

  const updateInvoiceStatus = (
    id: string,
    status: "LUNAS" | "BELUM BAYAR",
    paidDate?: string,
    paidMethod?: string
  ) => {
    let targetInv: InvoiceItem | undefined;
    setInvoices((prev) => {
      const updated = prev.map((inv) => {
        if (inv.id === id) {
          targetInv = {
            ...inv,
            status,
            paidDate: status === "LUNAS" ? paidDate || new Date().toISOString().split("T")[0] : undefined,
            paidMethod: status === "LUNAS" ? paidMethod || "Tunai" : undefined,
          };
          return targetInv;
        }
        return inv;
      });
      save("mf_invoices", updated);
      return updated;
    });

    if (status === "LUNAS") {
      setCashMutations((prev) => {
        const inv = targetInv || invoices.find((i) => i.id === id);
        if (!inv) return prev;
        const exists = prev.some((m) => m.invoiceNo === inv.invoiceNo);
        if (exists) return prev;
        const newMut: CashMutationItem = {
          id: `mut-${Date.now()}`,
          date: paidDate || new Date().toISOString().split("T")[0],
          invoiceNo: inv.invoiceNo,
          studentName: inv.studentName,
          period: inv.period,
          method: paidMethod?.toUpperCase().includes("TRANSFER") ? "TRANSFER" : "TUNAI",
          description: "Pelunasan Penuh",
          amount: inv.amount,
        };
        const next = [newMut, ...prev];
        save("mf_mutations", next);
        return next;
      });
    } else {
      setCashMutations((prev) => {
        const inv = invoices.find((i) => i.id === id);
        if (!inv) return prev;
        const filtered = prev.filter((m) => m.invoiceNo !== inv.invoiceNo);
        save("mf_mutations", filtered);
        return filtered;
      });
    }

    fetch("/api/invoices", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, paidDate, paidMethod }),
    }).catch((err) => console.error("Error updating invoice in PostgreSQL:", err));
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => {
      const filtered = prev.filter((inv) => inv.id !== id);
      save("mf_invoices", filtered);
      return filtered;
    });

    fetch(`/api/invoices?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch((err) => console.error("Error deleting invoice from PostgreSQL:", err));
  };

  // Cash Mutations
  const addCashMutation = (mut: Omit<CashMutationItem, "id">) => {
    const tempId = `mut-${Date.now()}`;
    const newMut: CashMutationItem = {
      ...mut,
      id: tempId,
    };
    setCashMutations((prev) => {
      const updated = [newMut, ...prev];
      save("mf_mutations", updated);
      return updated;
    });

    fetch("/api/mutations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mut),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((created) => {
        if (created && created.id) {
          setCashMutations((prev) =>
            prev.map((m) => (m.id === tempId ? { ...m, id: created.id } : m))
          );
        }
      })
      .catch((err) => console.error("Error saving cash mutation to PostgreSQL:", err));
  };

  // Arus Keuangan & Buku Kas
  const addTransaction = (tx: Omit<CashTransactionItem, "id">) => {
    const tempId = `tx-${Date.now()}`;
    const newTx: CashTransactionItem = {
      ...tx,
      id: tempId,
    };
    setTransactions((prev) => {
      const updated = [newTx, ...prev];
      save("mf_transactions", updated);
      return updated;
    });

    fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tx),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((created) => {
        if (created && created.id) {
          setTransactions((prev) =>
            prev.map((t) => (t.id === tempId ? { ...t, id: created.id } : t))
          );
        }
      })
      .catch((err) => console.error("Error saving transaction to PostgreSQL:", err));
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      save("mf_transactions", filtered);
      return filtered;
    });

    fetch(`/api/transactions?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch((err) => console.error("Error deleting transaction from PostgreSQL:", err));
  };

  // Landing Hero
  const updateLandingHero = (hero: Partial<LandingHeroConfig>) => {
    setLandingHero((prev) => {
      const updated = { ...prev, ...hero };
      save("mf_landing_hero", updated);
      return updated;
    });

    fetch("/api/website/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hero),
    }).catch((err) => console.error("Error updating website hero in PostgreSQL:", err));
  };

  // Landing Programs
  const addLandingProgram = (prog: Omit<LandingProgramItem, "id">) => {
    const tempId = `prog-${Date.now()}`;
    const newProg: LandingProgramItem = {
      ...prog,
      id: tempId,
    };
    setLandingPrograms((prev) => {
      const updated = [...prev, newProg];
      save("mf_landing_programs", updated);
      return updated;
    });

    fetch("/api/website/programs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prog),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((created) => {
        if (created && created.id) {
          setLandingPrograms((prev) =>
            prev.map((p) => (p.id === tempId ? { ...p, id: created.id } : p))
          );
        }
      })
      .catch((err) => console.error("Error saving website program to PostgreSQL:", err));
  };

  const updateLandingProgram = (id: string, prog: Partial<LandingProgramItem>) => {
    setLandingPrograms((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...prog } : p));
      save("mf_landing_programs", updated);
      return updated;
    });

    fetch("/api/website/programs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...prog }),
    }).catch((err) => console.error("Error updating website program in PostgreSQL:", err));
  };

  const deleteLandingProgram = (id: string) => {
    setLandingPrograms((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      save("mf_landing_programs", filtered);
      return filtered;
    });

    fetch(`/api/website/programs?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch((err) => console.error("Error deleting website program from PostgreSQL:", err));
  };

  // Landing Testimonials
  const addLandingTestimonial = (testi: Omit<LandingTestimonialItem, "id">) => {
    const tempId = `testi-${Date.now()}`;
    const newTesti: LandingTestimonialItem = {
      ...testi,
      id: tempId,
    };
    setLandingTestimonials((prev) => {
      const updated = [newTesti, ...prev];
      save("mf_landing_testi", updated);
      return updated;
    });

    fetch("/api/website/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testi),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((created) => {
        if (created && created.id) {
          setLandingTestimonials((prev) =>
            prev.map((t) => (t.id === tempId ? { ...t, id: created.id } : t))
          );
        }
      })
      .catch((err) => console.error("Error saving website testimonial to PostgreSQL:", err));
  };

  const deleteLandingTestimonial = (id: string) => {
    setLandingTestimonials((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      save("mf_landing_testi", filtered);
      return filtered;
    });

    fetch(`/api/website/testimonials?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch((err) => console.error("Error deleting website testimonial from PostgreSQL:", err));
  };

  // Landing Leads
  const addLandingLead = (lead: Omit<LandingLeadItem, "id" | "createdAt" | "status">) => {
    const tempId = `lead-${Date.now()}`;
    const newLead: LandingLeadItem = {
      ...lead,
      id: tempId,
      createdAt: new Date().toISOString().split("T")[0],
      status: "Baru",
    };
    setLandingLeads((prev) => {
      const updated = [newLead, ...prev];
      save("mf_landing_leads", updated);
      return updated;
    });

    fetch("/api/website/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((created) => {
        if (created && created.id) {
          setLandingLeads((prev) =>
            prev.map((l) => (l.id === tempId ? { ...l, id: created.id } : l))
          );
        }
      })
      .catch((err) => console.error("Error saving website lead to PostgreSQL:", err));
  };

  const updateLandingLeadStatus = (id: string, status: LandingLeadItem["status"]) => {
    setLandingLeads((prev) => {
      const updated = prev.map((l) => (l.id === id ? { ...l, status } : l));
      save("mf_landing_leads", updated);
      return updated;
    });

    fetch("/api/website/leads", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    }).catch((err) => console.error("Error updating website lead in PostgreSQL:", err));
  };

  const deleteLandingLead = (id: string) => {
    setLandingLeads((prev) => {
      const filtered = prev.filter((l) => l.id !== id);
      save("mf_landing_leads", filtered);
      return filtered;
    });

    fetch(`/api/website/leads?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch((err) => console.error("Error deleting website lead from PostgreSQL:", err));
  };

  // Landing Partners CRUD
  const addLandingPartner = (partner: Omit<LandingPartnerItem, "id">) => {
    const tempId = `part-${Date.now()}`;
    const newPartner: LandingPartnerItem = {
      ...partner,
      id: tempId,
    };
    setLandingPartners((prev) => {
      const updated = [...prev, newPartner];
      save("mf_landing_partners", updated);
      return updated;
    });

    fetch("/api/website/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partner),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((created) => {
        if (created && created.id) {
          setLandingPartners((prev) =>
            prev.map((p) => (p.id === tempId ? { ...p, id: created.id } : p))
          );
        }
      })
      .catch((err) => console.error("Error saving website partner to PostgreSQL:", err));
  };

  const updateLandingPartner = (id: string, partner: Partial<LandingPartnerItem>) => {
    setLandingPartners((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...partner } : p));
      save("mf_landing_partners", updated);
      return updated;
    });

    fetch("/api/website/partners", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...partner }),
    }).catch((err) => console.error("Error updating website partner in PostgreSQL:", err));
  };

  const deleteLandingPartner = (id: string) => {
    setLandingPartners((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      save("mf_landing_partners", filtered);
      return filtered;
    });

    fetch(`/api/website/partners?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch((err) => console.error("Error deleting website partner from PostgreSQL:", err));
  };

  return (
    <AppStoreContext.Provider
      value={{
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        classes,
        addClass,
        updateClass,
        deleteClass,
        branches,
        addBranch,
        updateBranch,
        deleteBranch,
        refreshData: fetchAllLiveData,
        branchAdmins,
        addBranchAdmin,
        updateBranchAdmin,
        deleteBranchAdmin,
        attendances,
        setAttendance,
        batchSetAttendance,
        addAttendanceRecord,
        updateAttendanceRecord,
        deleteAttendanceRecord,
        journals,
        addJournal,
        deleteJournal,
        grades,
        saveGrades,
        updateSingleGrade,
        deleteGradeSession,
        renameGradeSession,
        deleteSingleGrade,
        behaviors,
        addBehavior,
        saveStudentKeaktifan,
        deleteBehavior,
        curriculumModules,
        addCurriculumModule,
        updateCurriculumModule,
        deleteCurriculumModule,
        resetCurriculumModules,
        invoices,
        addInvoice,
        updateInvoiceStatus,
        deleteInvoice,
        cashMutations,
        addCashMutation,
        transactions,
        addTransaction,
        deleteTransaction,
        landingHero,
        updateLandingHero,
        landingPrograms,
        addLandingProgram,
        updateLandingProgram,
        deleteLandingProgram,
        landingTestimonials,
        addLandingTestimonial,
        deleteLandingTestimonial,
        landingLeads,
        addLandingLead,
        updateLandingLeadStatus,
        deleteLandingLead,
        landingPartners,
        addLandingPartner,
        updateLandingPartner,
        deleteLandingPartner,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) {
    throw new Error("useAppStore must be used within an AppStoreProvider");
  }
  return ctx;
}
