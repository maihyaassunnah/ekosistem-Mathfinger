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
  role: "Super Admin" | "Admin Cabang" | "Asisten Cabang" | "Tutor";
  status: "Aktif" | "Nonaktif";
  createdAt: string;
  password?: string;
  avatarUrl?: string;
  ttl?: string;
  address?: string;
  lastEducation?: string;
  gender?: string;
}

export interface BehaviorItem {
  id: string;
  studentId: string;
  studentName: string;
  branch?: string;
  date: string;
  sessionTopic: string;
  focus: string;
  participation: string;
  attitude: string;
  note: string;
}

export interface JournalItem {
  id: string;
  studentId?: string;
  studentName: string;
  className: string;
  branch: "Singkut" | "Bangko";
  topic: string;
  content: string;
  teacher: string;
  date: string;
  refCode: string;
  programType?: "MATEMATIKA" | "MEMBACA";
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
  programType?: "MATEMATIKA" | "MEMBACA";
}

export interface GradeItem {
  id: string;
  studentId: string;
  studentCode?: string;
  studentName: string;
  className: string;
  branch?: string;
  branchId?: string;
  topic: string;
  examDate: string;
  score: number;
  note: string;
  isJoined: boolean;
  programType?: "MATEMATIKA" | "MEMBACA";
}

export const normalizeBranchName = (b?: string | null): string => {
  if (!b) return "";
  const lower = b.toLowerCase().trim();
  if (lower === "bangko" || lower.includes("tabir")) return "Tabir Timur";
  if (lower.includes("singkut")) return "Singkut";
  return b.trim();
};

export const isBranchMatch = (
  studentOrItemBranch?: string | null,
  targetBranch?: string | null
): boolean => {
  if (!targetBranch || targetBranch === "ALL") return true;
  if (!studentOrItemBranch) return false;
  return normalizeBranchName(studentOrItemBranch) === normalizeBranchName(targetBranch);
};

export interface CurriculumModule {
  id: string;
  orderIndex: number;
  levelTitle: string;
  shortDesc: string;
  learningGoals: string;
  competencies: string;
  learningMaterials: string;
  indicators: string[];
  branch?: string;
  branchId?: string;
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
  programType?: "MATEMATIKA" | "MEMBACA";
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
  // Media & Section Fields
  heroImage?: string;
  videoUrl?: string;
  aboutTitle?: string;
  aboutDesc1?: string;
  aboutDesc2?: string;
  aboutImage?: string;
  teacherBadgeText?: string;
  teacherBadgeDesc?: string;
  programsBgImage?: string;
  curriculumTitle?: string;
  curriculumDesc?: string;
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
  avatarUrl?: string;
  title?: string;
  role?: string;
  storyNumber?: string;
}

export interface LandingNewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  author: string;
  image: string;
  summary: string;
  content?: string;
  orderIndex?: number;
  isActive?: boolean;
}

export interface LandingEventItem {
  id: string;
  day: string;
  month: string;
  title: string;
  time: string;
  location: string;
  desc: string;
  orderIndex?: number;
  isActive?: boolean;
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

export interface LevelProgressionConfig {
  id: string;
  levelNumber: number;
  name: string;
  description?: string;
  branch?: string;
}

export interface StudentLevelRecord {
  id: string;
  studentId: string;
  levelId: string;
  passedDate: string;
  notes?: string;
  updatedAt?: string;
}

interface AppStoreContextType {
  // Students
  students: StudentItem[];
  addStudent: (student: Omit<StudentItem, "id" | "index">) => Promise<StudentItem | null> | void;
  updateStudent: (id: string, updated: Partial<StudentItem>) => Promise<void> | void;
  deleteStudent: (id: string) => void;

  // Classes
  classes: ClassItem[];
  addClass: (cls: Omit<ClassItem, "id" | "enrolledCount">) => void;
  updateClass: (id: string, updated: Partial<ClassItem>) => void;
  deleteClass: (id: string) => void;
  enrollStudentInClass: (studentId: string, classId: string) => Promise<boolean>;
  unenrollStudentFromClass: (studentId: string, classId: string) => Promise<boolean>;

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
    method?: "QR_SCAN" | "MANUAL",
    programType?: "MATEMATIKA" | "MEMBACA"
  ) => void;
  batchSetAttendance: (
    date: string,
    status: "HADIR" | "IZIN" | "SAKIT" | "ABSEN",
    targetStudentIds?: string[],
    programType?: "MATEMATIKA" | "MEMBACA"
  ) => void;
  addAttendanceRecord: (record: AttendanceItem) => void;
  updateAttendanceRecord: (key: string, updated: Partial<AttendanceItem>) => void;
  deleteAttendanceRecord: (key: string) => void;

  // Journals
  journals: JournalItem[];
  addJournal: (journal: Omit<JournalItem, "id" | "refCode">) => void;
  addJournalsBulk: (journalsList: Omit<JournalItem, "id" | "refCode">[]) => Promise<void>;
  deleteJournal: (id: string) => void;

  // Grades / Nilai
  grades: GradeItem[];
  saveGrades: (newGrades: GradeItem[]) => void;
  updateSingleGrade: (grade: {
    id?: string;
    studentId: string;
    studentName?: string;
    className?: string;
    branch?: string;
    topic: string;
    examDate: string;
    score: number;
    note?: string;
    isJoined?: boolean;
    programType?: "MATEMATIKA" | "MEMBACA";
  }) => Promise<void>;
  deleteGradeSession: (topic: string, examDate: string, branch?: string) => Promise<void>;
  renameGradeSession: (oldTopic: string, oldExamDate: string, newTopic: string, newExamDate: string, branch?: string) => Promise<void>;
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
  deleteCurriculumModule: (id: string, branch?: string) => void;
  resetCurriculumModules: (branch?: string) => void;

  // Invoices & SPP
  invoices: InvoiceItem[];
  addInvoice: (inv: Omit<InvoiceItem, "id" | "invoiceNo">) => void;
  addInvoicesBulk: (invs: Omit<InvoiceItem, "id" | "invoiceNo">[]) => Promise<void>;
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
  updateLandingTestimonial: (id: string, testi: Partial<LandingTestimonialItem>) => void;
  deleteLandingTestimonial: (id: string) => void;
  landingNews: LandingNewsItem[];
  addLandingNews: (item: Omit<LandingNewsItem, "id">) => void;
  updateLandingNews: (id: string, item: Partial<LandingNewsItem>) => void;
  deleteLandingNews: (id: string) => void;
  landingEvents: LandingEventItem[];
  addLandingEvent: (item: Omit<LandingEventItem, "id">) => void;
  updateLandingEvent: (id: string, item: Partial<LandingEventItem>) => void;
  deleteLandingEvent: (id: string) => void;
  landingLeads: LandingLeadItem[];
  addLandingLead: (lead: Omit<LandingLeadItem, "id" | "createdAt" | "status">) => void;
  updateLandingLeadStatus: (id: string, status: LandingLeadItem["status"]) => void;
  deleteLandingLead: (id: string) => void;
  landingPartners: LandingPartnerItem[];
  addLandingPartner: (partner: Omit<LandingPartnerItem, "id">) => void;
  updateLandingPartner: (id: string, partner: Partial<LandingPartnerItem>) => void;
  deleteLandingPartner: (id: string) => void;

  // Level Progression Matrix (Kenaikan Level)
  levelColumns: LevelProgressionConfig[];
  studentLevelRecords: StudentLevelRecord[];
  addLevelColumn: (name: string, description?: string, branch?: string) => void;
  updateLevelColumn: (id: string, name: string, description?: string, branch?: string) => void;
  deleteLevelColumn: (id: string) => void;
  setStudentLevelRecord: (studentId: string, levelId: string, passedDate: string, notes?: string) => Promise<void>;
  deleteStudentLevelRecord: (studentId: string, levelId: string) => Promise<void>;
  batchUpdateStudentLevelRecords: (studentId: string, records: { levelId: string; passedDate: string; notes?: string }[]) => Promise<void>;
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

const INITIAL_ADMINS: BranchAdminItem[] = [];

export const INITIAL_GRADES: GradeItem[] = [
  {
    "id": "b08ef2ee-595e-48f3-b10a-9f2348c91eaa",
    "studentId": "15de4d83-1d1b-4042-9bb4-9fdc65db1d3c",
    "studentCode": "67123",
    "studentName": "Hafiz Al-Faruq",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d82653a3-8e23-4321-9a99-1faed27a9eed",
    "studentId": "1d157032-9563-4b12-933f-f45078bd1646",
    "studentCode": "38910",
    "studentName": "Nabila Putri Ramadhani",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 83,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "aab6f2b5-5874-4df1-9fe8-170fc4db043a",
    "studentId": "20f9a9ba-13c7-4650-a900-61abd09ea07a",
    "studentCode": "22000",
    "studentName": "M. Hannan Habibillah",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4f083f5a-dd6d-44cb-89a8-b880a27b2bf5",
    "studentId": "2643a6e6-fcc0-4c9f-81b1-db1d116e37cd",
    "studentCode": "89050",
    "studentName": "Arsyila Nasha Razita",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 89,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "045ba593-0403-4c57-ba9d-eef0f212170e",
    "studentId": "296a8d0a-9549-4f1a-b529-76eb203d8407",
    "studentCode": "24265",
    "studentName": "Rayendra Azzan Pramana",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "1d6b125f-631e-4b8a-8124-0b6725e0e293",
    "studentId": "2ca10889-b780-4660-8022-c1b1a23d5ce2",
    "studentCode": "97375",
    "studentName": "Dzakiyyah Al Fajri ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6ee6c535-6e94-4454-a8e3-f942ecc1d81f",
    "studentId": "352a42af-0c46-4373-9ac4-69a5282da28c",
    "studentCode": "21446",
    "studentName": "Ghumaisha",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 86,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d5bd06a8-c9ea-43b3-bbb1-b5e9cbf71893",
    "studentId": "3d378546-ea52-4a13-8235-8ca01bf9c218",
    "studentCode": "53421",
    "studentName": "Nayla Khairunnisa",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 87,
    "note": "Sangat antusias memahami simbol dasar",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ac736c13-4d01-4a1e-b349-e2f18070b392",
    "studentId": "48721968-d3f2-4319-92be-7a5e972c106b",
    "studentCode": "55866",
    "studentName": "Bilqis Ufairah",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3de61fa4-8293-40c7-9c42-1ccdf97b2e5e",
    "studentId": "5a5302cf-3115-45c1-ae89-20208f8bd5f5",
    "studentCode": "81234",
    "studentName": "Keysha Anindya",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3ac27c77-bfb1-4cbf-ad1e-e9e3b3bf3589",
    "studentId": "5f779113-fdc7-4393-8537-b28f76db27a9",
    "studentCode": "44512",
    "studentName": "Raisya Salsabila",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "bb233d5b-fc8e-4df5-87ec-3ef0732e3171",
    "studentId": "64dd1749-efcb-40c0-97e6-a30d772e50e0",
    "studentCode": "72190",
    "studentName": "Rayhan Pratama",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 89,
    "note": "Sangat antusias memahami simbol dasar",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0e9b5a1d-d951-40b8-84bc-51fe94668630",
    "studentId": "657f7d55-4398-4d8e-a44d-1f6eb84a61c0",
    "studentCode": "30400",
    "studentName": "Shofiyah ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 86,
    "note": "Sangat antusias memahami simbol dasar",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "948e3b15-fe3b-4c4d-bbb0-aba200727342",
    "studentId": "6f029f4e-d64a-4e54-a105-915d6be1e055",
    "studentCode": "79679",
    "studentName": "Nashwa Zahira Fahrefi ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f117d040-865f-482b-a5e7-bca58617753e",
    "studentId": "700c0ee2-035a-4a13-bdba-e806864acd95",
    "studentCode": "31144",
    "studentName": "Uwais",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a16e3580-3db7-46ae-af29-01abb8a4ba69",
    "studentId": "7c900a4b-3261-46f2-9990-e54fbc729e3d",
    "studentCode": "38952",
    "studentName": "Kheyra Candra ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 89,
    "note": "Sangat antusias memahami simbol dasar",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "756cf383-a244-481c-85b9-4ce977278d64",
    "studentId": "90d546d9-0f7c-4cdf-8351-5e854cce406c",
    "studentCode": "17246",
    "studentName": "Haris",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "390efa53-4366-4741-976a-f6c79a84f155",
    "studentId": "92d33126-0c86-4472-8a43-01098bf61c00",
    "studentCode": "95701",
    "studentName": "Azila Quira Zulda",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "619272f4-89d5-4b61-a6bd-90ca3e549134",
    "studentId": "96bd8abf-ce5e-42c0-8a3f-4d7549f8a2e9",
    "studentCode": "57782",
    "studentName": "Muwaffaq ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "2edd5561-8487-4550-9494-5b6e1055ed02",
    "studentId": "9c48106c-acd2-4a23-8ac3-543d94de143d",
    "studentCode": "50999",
    "studentName": "Abdan Zulfadli Fahyan",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "17cb72ad-6272-430e-9114-62cbcafbf0e0",
    "studentId": "9d9977fb-1a91-47b4-99df-288cc648d437",
    "studentCode": "55148",
    "studentName": "M. Hafizhan Khairan ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 86,
    "note": "Sangat antusias memahami simbol dasar",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "bdf284c1-50ba-49be-90b1-4f8951916a18",
    "studentId": "a32a3e2b-2898-4a12-a20f-a2cb15c3ca22",
    "studentCode": "10650",
    "studentName": "Aishwa Rahma Annida",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a91baee6-4fc7-438a-92ea-ca1fa6f7682c",
    "studentId": "aa3fff59-d27e-4851-a660-ceaf1d8e9ade",
    "studentCode": "90123",
    "studentName": "Muhammad Azka",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 86,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "eb783def-a1ef-487d-b3ac-5ea5d13fdfa9",
    "studentId": "ac9180e4-fedf-4941-b3c7-ca9cda665d88",
    "studentCode": "79000",
    "studentName": "Aishwa Rahma Annida",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8e9dc4ad-3d3c-4d85-a584-06052493f11c",
    "studentId": "ade8738b-9e7a-4b56-9de7-169e74e714c1",
    "studentCode": "93231",
    "studentName": "Ghumaisha  ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "7bc2c7fa-a3a3-4b27-afd5-128828680a22",
    "studentId": "b42ef79c-f9c9-4972-8f36-525ec014240e",
    "studentCode": "51380",
    "studentName": "Maulana Syarif Wardani",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "65b811f3-fd7f-415f-af64-3167cc13cd5f",
    "studentId": "c1ccae6d-ae43-4bbf-b539-4c1c96c9c16b",
    "studentCode": "41209",
    "studentName": "Fakhri Al-Ghifari",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b1debf9e-4e5d-485f-b2cc-5dff7ad28caa",
    "studentId": "c3dd210c-9220-4055-b57e-5ced60c906c7",
    "studentCode": "48712",
    "studentName": "Kenzo Alvaro",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "341dbd8a-5795-4c5b-9e8b-8a3a54f4efb5",
    "studentId": "c76503ff-a1d9-45ee-815e-35e24c8f7c7c",
    "studentCode": "33918",
    "studentName": "Calista Azkadina",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 83,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "666a88f9-e3b8-46b1-996a-ca9b3cee1083",
    "studentId": "ce034bcc-b39d-4fb6-a751-19dbf3371ab2",
    "studentCode": "59012",
    "studentName": "Zahrana Azzahra",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 88,
    "note": "Sangat antusias memahami simbol dasar",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4dfaad24-d8de-4f9e-b53f-5809a34e491a",
    "studentId": "d5730b58-7251-402b-9059-cc8a9047dc2e",
    "studentCode": "13042",
    "studentName": "Zian Abdi Pratama ",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "12316e1a-7cd4-45f4-a96e-a0ebab819b98",
    "studentId": "dec5e211-a360-4207-83fb-9771011fab2f",
    "studentCode": "10409",
    "studentName": "Sarah ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "9cb373dd-edf1-4a87-af07-bfb9919ce488",
    "studentId": "e02583be-1443-414b-a37c-90e612bcd317",
    "studentCode": "61022",
    "studentName": "Bagas Pratama Putra",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d9ef9952-7d49-4904-8ec8-552ba3231d80",
    "studentId": "e0f01c5d-a021-45d7-9828-102cb091a16d",
    "studentCode": "13846",
    "studentName": "Musyaffa' ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "174d9acc-c653-4451-aee8-18acd9eddb37",
    "studentId": "e8375491-10a6-4a3e-a632-733721808900",
    "studentCode": "68766",
    "studentName": "Kristian Naibaho",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a750ad5d-4f4c-4cda-87b4-9e9d15273592",
    "studentId": "edfa74c0-7a6c-421e-b5a3-142f80563a3c",
    "studentCode": "34581",
    "studentName": "Dzakiyyah Al Fajri",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "38c5704e-ec45-4d0f-8444-b6430378a6f6",
    "studentId": "f20782b9-17ab-40f2-b315-7ad3aadc2739",
    "studentCode": "62901",
    "studentName": "Syakira Nur Aini",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "615b3d5e-71ab-4131-b327-be88d7d2b65b",
    "studentId": "f8916605-5eff-48c0-bd51-8301e015b855",
    "studentCode": "59847",
    "studentName": "Haris ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 85,
    "note": "Sangat antusias memahami simbol dasar",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0bd4303e-f12b-468a-8eda-16e0b4d8a863",
    "studentId": "f9ce8b07-5738-4c29-8ecc-048807666d4c",
    "studentCode": "61298",
    "studentName": "Dimas Arya Sena",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 89,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a721c705-59c4-478e-953e-704124d5a1ef",
    "studentId": "15de4d83-1d1b-4042-9bb4-9fdc65db1d3c",
    "studentCode": "67123",
    "studentName": "Hafiz Al-Faruq",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b937ad65-b40c-4810-960c-1bff3e79c00f",
    "studentId": "15de4d83-1d1b-4042-9bb4-9fdc65db1d3c",
    "studentCode": "67123",
    "studentName": "Hafiz Al-Faruq",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "52d69873-f2f5-483b-9833-ef1653e6921f",
    "studentId": "1d157032-9563-4b12-933f-f45078bd1646",
    "studentCode": "38910",
    "studentName": "Nabila Putri Ramadhani",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 83,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "06c71373-8f9c-40b0-9cf4-1a71a3067d18",
    "studentId": "1d157032-9563-4b12-933f-f45078bd1646",
    "studentCode": "38910",
    "studentName": "Nabila Putri Ramadhani",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 83,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "71264f8c-9481-4e2c-bc1e-79e62d970f32",
    "studentId": "20f9a9ba-13c7-4650-a900-61abd09ea07a",
    "studentCode": "22000",
    "studentName": "M. Hannan Habibillah",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "1a5aceb1-b999-4b81-9dca-14d6a94254ba",
    "studentId": "20f9a9ba-13c7-4650-a900-61abd09ea07a",
    "studentCode": "22000",
    "studentName": "M. Hannan Habibillah",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 87,
    "note": "Menyelesaikan 15 soal tepat waktu",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "285b8142-4825-43b0-b6b0-638f6a2ae622",
    "studentId": "2643a6e6-fcc0-4c9f-81b1-db1d116e37cd",
    "studentCode": "89050",
    "studentName": "Arsyila Nasha Razita",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 89,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e99a5723-f605-4ebc-8ab9-f1eb556f0444",
    "studentId": "2643a6e6-fcc0-4c9f-81b1-db1d116e37cd",
    "studentCode": "89050",
    "studentName": "Arsyila Nasha Razita",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 89,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "12af4412-4d21-4e37-8063-f20f3cf25e36",
    "studentId": "296a8d0a-9549-4f1a-b529-76eb203d8407",
    "studentCode": "24265",
    "studentName": "Rayendra Azzan Pramana",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "1c9bf675-6b56-4474-8a39-4da19ef03c99",
    "studentId": "296a8d0a-9549-4f1a-b529-76eb203d8407",
    "studentCode": "24265",
    "studentName": "Rayendra Azzan Pramana",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ed313902-7168-442c-b492-8d0387b23d29",
    "studentId": "2ca10889-b780-4660-8022-c1b1a23d5ce2",
    "studentCode": "97375",
    "studentName": "Dzakiyyah Al Fajri ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "dcc85abc-ae7e-4c2c-876c-4caa569c4c13",
    "studentId": "2ca10889-b780-4660-8022-c1b1a23d5ce2",
    "studentCode": "97375",
    "studentName": "Dzakiyyah Al Fajri ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "68e6031f-a1e7-4eb6-8212-572bbf102b78",
    "studentId": "352a42af-0c46-4373-9ac4-69a5282da28c",
    "studentCode": "21446",
    "studentName": "Ghumaisha",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 86,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f23cc23d-b5d3-45ac-b96d-10242185d6b9",
    "studentId": "352a42af-0c46-4373-9ac4-69a5282da28c",
    "studentCode": "21446",
    "studentName": "Ghumaisha",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 86,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "495c3b75-023a-4eeb-ba82-cd24fda8381c",
    "studentId": "3d378546-ea52-4a13-8235-8ca01bf9c218",
    "studentCode": "53421",
    "studentName": "Nayla Khairunnisa",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "df333ea0-f7ed-41ff-b156-30733f3449fe",
    "studentId": "3d378546-ea52-4a13-8235-8ca01bf9c218",
    "studentCode": "53421",
    "studentName": "Nayla Khairunnisa",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 89,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "59a8d65a-0d96-415f-8c29-001a1e0a19d7",
    "studentId": "48721968-d3f2-4319-92be-7a5e972c106b",
    "studentCode": "55866",
    "studentName": "Bilqis Ufairah",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e322a773-177b-4b5c-ab8e-04dff61629eb",
    "studentId": "48721968-d3f2-4319-92be-7a5e972c106b",
    "studentCode": "55866",
    "studentName": "Bilqis Ufairah",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "7a324b11-7869-4710-90d0-2189925d6b90",
    "studentId": "5a5302cf-3115-45c1-ae89-20208f8bd5f5",
    "studentCode": "81234",
    "studentName": "Keysha Anindya",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "84f83b4d-a4b0-41d4-a958-b16cd69395ce",
    "studentId": "5a5302cf-3115-45c1-ae89-20208f8bd5f5",
    "studentCode": "81234",
    "studentName": "Keysha Anindya",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ea3ca8d3-d3df-4b83-836c-b2bd6f9a635f",
    "studentId": "5f779113-fdc7-4393-8537-b28f76db27a9",
    "studentCode": "44512",
    "studentName": "Raisya Salsabila",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "502ceff8-25f3-415f-a372-e6ebfedc8081",
    "studentId": "5f779113-fdc7-4393-8537-b28f76db27a9",
    "studentCode": "44512",
    "studentName": "Raisya Salsabila",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 88,
    "note": "Menyelesaikan 15 soal tepat waktu",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "879ebbac-52fb-4b00-8a03-c23b264cdefd",
    "studentId": "64dd1749-efcb-40c0-97e6-a30d772e50e0",
    "studentCode": "72190",
    "studentName": "Rayhan Pratama",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 85,
    "note": "Menyelesaikan 15 soal tepat waktu",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "1b74aeb2-c896-43e2-b15d-c535fad492a3",
    "studentId": "64dd1749-efcb-40c0-97e6-a30d772e50e0",
    "studentCode": "72190",
    "studentName": "Rayhan Pratama",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8b3246b2-783c-4124-84b5-fd2f4eea4519",
    "studentId": "657f7d55-4398-4d8e-a44d-1f6eb84a61c0",
    "studentCode": "30400",
    "studentName": "Shofiyah ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 88,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "130e3596-4057-4311-938e-3247d462551d",
    "studentId": "657f7d55-4398-4d8e-a44d-1f6eb84a61c0",
    "studentCode": "30400",
    "studentName": "Shofiyah ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a9ca80ea-0b2a-44cd-a9bb-90695cb2eb21",
    "studentId": "6f029f4e-d64a-4e54-a105-915d6be1e055",
    "studentCode": "79679",
    "studentName": "Nashwa Zahira Fahrefi ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a8135497-b46b-4592-996c-e5d846b35145",
    "studentId": "6f029f4e-d64a-4e54-a105-915d6be1e055",
    "studentCode": "79679",
    "studentName": "Nashwa Zahira Fahrefi ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4296a3e4-5250-4ae9-8d89-6263ce90c03f",
    "studentId": "700c0ee2-035a-4a13-bdba-e806864acd95",
    "studentCode": "31144",
    "studentName": "Uwais",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c39de2da-f301-4051-ba03-49a050598d40",
    "studentId": "700c0ee2-035a-4a13-bdba-e806864acd95",
    "studentCode": "31144",
    "studentName": "Uwais",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "98f2df2a-aa10-4d44-a7ff-7469e8864247",
    "studentId": "7c900a4b-3261-46f2-9990-e54fbc729e3d",
    "studentCode": "38952",
    "studentName": "Kheyra Candra ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 85,
    "note": "Menyelesaikan 15 soal tepat waktu",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "354f291c-16ed-41bf-882e-7f934500372f",
    "studentId": "7c900a4b-3261-46f2-9990-e54fbc729e3d",
    "studentCode": "38952",
    "studentName": "Kheyra Candra ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "264d433c-2788-423a-88be-0193fcea6908",
    "studentId": "90d546d9-0f7c-4cdf-8351-5e854cce406c",
    "studentCode": "17246",
    "studentName": "Haris",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "bf8302e6-d3f4-4c85-9c15-8f52ddb32f1f",
    "studentId": "90d546d9-0f7c-4cdf-8351-5e854cce406c",
    "studentCode": "17246",
    "studentName": "Haris",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6a4b1a7e-fec5-418b-929e-e6189c357df6",
    "studentId": "92d33126-0c86-4472-8a43-01098bf61c00",
    "studentCode": "95701",
    "studentName": "Azila Quira Zulda",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 88,
    "note": "Menyelesaikan 15 soal tepat waktu",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d311f346-07bb-4dbd-a4a1-18559f4e7f09",
    "studentId": "92d33126-0c86-4472-8a43-01098bf61c00",
    "studentCode": "95701",
    "studentName": "Azila Quira Zulda",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "488dc99a-43f9-4a93-994c-0edc422c0b40",
    "studentId": "96bd8abf-ce5e-42c0-8a3f-4d7549f8a2e9",
    "studentCode": "57782",
    "studentName": "Muwaffaq ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 87,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ec4fc6ff-eb46-42e2-b1b2-202708da1ae6",
    "studentId": "96bd8abf-ce5e-42c0-8a3f-4d7549f8a2e9",
    "studentCode": "57782",
    "studentName": "Muwaffaq ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "459d2da1-fdaf-4c7f-9720-e023188b5d30",
    "studentId": "9c48106c-acd2-4a23-8ac3-543d94de143d",
    "studentCode": "50999",
    "studentName": "Abdan Zulfadli Fahyan",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 87,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c833f9cd-bff1-4128-ad40-51932684ea9d",
    "studentId": "9c48106c-acd2-4a23-8ac3-543d94de143d",
    "studentCode": "50999",
    "studentName": "Abdan Zulfadli Fahyan",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d5fe8435-d6a7-4df7-b58a-9ac30cf5ca81",
    "studentId": "9d9977fb-1a91-47b4-99df-288cc648d437",
    "studentCode": "55148",
    "studentName": "M. Hafizhan Khairan ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "aab4ad0d-e83e-42ae-a705-d999b004ee6a",
    "studentId": "9d9977fb-1a91-47b4-99df-288cc648d437",
    "studentCode": "55148",
    "studentName": "M. Hafizhan Khairan ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 88,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "89fc820c-62fa-4e4d-8d24-15a631bd83eb",
    "studentId": "a32a3e2b-2898-4a12-a20f-a2cb15c3ca22",
    "studentCode": "10650",
    "studentName": "Aishwa Rahma Annida",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 88,
    "note": "Menyelesaikan 15 soal tepat waktu",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f270da30-2be4-4455-98ea-24a0a4b125d5",
    "studentId": "a32a3e2b-2898-4a12-a20f-a2cb15c3ca22",
    "studentCode": "10650",
    "studentName": "Aishwa Rahma Annida",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e62ada49-bb9b-4fbe-ba76-1ec1ed7f572f",
    "studentId": "aa3fff59-d27e-4851-a660-ceaf1d8e9ade",
    "studentCode": "90123",
    "studentName": "Muhammad Azka",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 86,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3a9c3cab-8848-4623-9a20-02f80ebf190e",
    "studentId": "aa3fff59-d27e-4851-a660-ceaf1d8e9ade",
    "studentCode": "90123",
    "studentName": "Muhammad Azka",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 86,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5158ca12-2063-413b-ad30-a20b1a7e394c",
    "studentId": "ac9180e4-fedf-4941-b3c7-ca9cda665d88",
    "studentCode": "79000",
    "studentName": "Aishwa Rahma Annida",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "018ccb55-5d78-4f9f-9c0c-485026d7d074",
    "studentId": "ac9180e4-fedf-4941-b3c7-ca9cda665d88",
    "studentCode": "79000",
    "studentName": "Aishwa Rahma Annida",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "bbba4089-cc10-45d7-b173-1c97915bcad4",
    "studentId": "ade8738b-9e7a-4b56-9de7-169e74e714c1",
    "studentCode": "93231",
    "studentName": "Ghumaisha  ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c00e0760-0209-4bbe-9fe8-227254259ecf",
    "studentId": "ade8738b-9e7a-4b56-9de7-169e74e714c1",
    "studentCode": "93231",
    "studentName": "Ghumaisha  ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 87,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "9be225f7-40ca-4165-9579-5fa44971f81c",
    "studentId": "b42ef79c-f9c9-4972-8f36-525ec014240e",
    "studentCode": "51380",
    "studentName": "Maulana Syarif Wardani",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4bc03afa-a829-459e-be3d-502f2235e8c0",
    "studentId": "b42ef79c-f9c9-4972-8f36-525ec014240e",
    "studentCode": "51380",
    "studentName": "Maulana Syarif Wardani",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "163b316e-e35e-4674-abb2-6447f4faad7c",
    "studentId": "c1ccae6d-ae43-4bbf-b539-4c1c96c9c16b",
    "studentCode": "41209",
    "studentName": "Fakhri Al-Ghifari",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "dc023adf-a3ea-4628-8590-cf2466d4d822",
    "studentId": "c1ccae6d-ae43-4bbf-b539-4c1c96c9c16b",
    "studentCode": "41209",
    "studentName": "Fakhri Al-Ghifari",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ef6b96c1-503e-4538-aab0-b4cc41dab2b2",
    "studentId": "c3dd210c-9220-4055-b57e-5ced60c906c7",
    "studentCode": "48712",
    "studentName": "Kenzo Alvaro",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "189b6d33-5467-40b2-9f07-ff1e6689ebb2",
    "studentId": "c3dd210c-9220-4055-b57e-5ced60c906c7",
    "studentCode": "48712",
    "studentName": "Kenzo Alvaro",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 88,
    "note": "Menyelesaikan 15 soal tepat waktu",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0bcea6e1-2439-4ec1-99be-359abb4d044a",
    "studentId": "c76503ff-a1d9-45ee-815e-35e24c8f7c7c",
    "studentCode": "33918",
    "studentName": "Calista Azkadina",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 83,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "9113a553-3a51-4334-91a6-a5faaaa1aa25",
    "studentId": "c76503ff-a1d9-45ee-815e-35e24c8f7c7c",
    "studentCode": "33918",
    "studentName": "Calista Azkadina",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 83,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "2b5b3e22-efdb-4d69-ad52-83f96f7277ad",
    "studentId": "ce034bcc-b39d-4fb6-a751-19dbf3371ab2",
    "studentCode": "59012",
    "studentName": "Zahrana Azzahra",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f65a8832-25d9-4a98-805c-259e3dc3592b",
    "studentId": "ce034bcc-b39d-4fb6-a751-19dbf3371ab2",
    "studentCode": "59012",
    "studentName": "Zahrana Azzahra",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 84,
    "note": "Menyelesaikan 15 soal tepat waktu",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "21538368-ee89-44e1-8626-db93b6d8beaf",
    "studentId": "d5730b58-7251-402b-9059-cc8a9047dc2e",
    "studentCode": "13042",
    "studentName": "Zian Abdi Pratama ",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 89,
    "note": "Menyelesaikan 15 soal tepat waktu",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "215babb3-691b-42a1-8e09-a57178f8e0c8",
    "studentId": "d5730b58-7251-402b-9059-cc8a9047dc2e",
    "studentCode": "13042",
    "studentName": "Zian Abdi Pratama ",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e50acace-d236-4139-9163-348b4188d7d7",
    "studentId": "dec5e211-a360-4207-83fb-9771011fab2f",
    "studentCode": "10409",
    "studentName": "Sarah ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e6cd81df-caa2-4671-b164-d27442f18710",
    "studentId": "dec5e211-a360-4207-83fb-9771011fab2f",
    "studentCode": "10409",
    "studentName": "Sarah ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8bebc0ba-e0be-4dea-b594-9df6e1ff3379",
    "studentId": "e02583be-1443-414b-a37c-90e612bcd317",
    "studentCode": "61022",
    "studentName": "Bagas Pratama Putra",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "bf7d0d3f-c046-4cd8-b74e-eb404f367dde",
    "studentId": "e02583be-1443-414b-a37c-90e612bcd317",
    "studentCode": "61022",
    "studentName": "Bagas Pratama Putra",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ecbf3daf-06b7-465c-a370-27febd7e0413",
    "studentId": "e0f01c5d-a021-45d7-9828-102cb091a16d",
    "studentCode": "13846",
    "studentName": "Musyaffa' ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 89,
    "note": "Menyelesaikan 15 soal tepat waktu",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "9ee76c12-587c-4ad8-a5c1-1f762852b494",
    "studentId": "e0f01c5d-a021-45d7-9828-102cb091a16d",
    "studentCode": "13846",
    "studentName": "Musyaffa' ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4f99e102-cf2c-4a8c-84f9-e851173fc19a",
    "studentId": "e8375491-10a6-4a3e-a632-733721808900",
    "studentCode": "68766",
    "studentName": "Kristian Naibaho",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ba9aacb1-d784-4c81-aea9-748b68db3be5",
    "studentId": "e8375491-10a6-4a3e-a632-733721808900",
    "studentCode": "68766",
    "studentName": "Kristian Naibaho",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "af03c145-0df0-482c-8921-a76880d7f02a",
    "studentId": "edfa74c0-7a6c-421e-b5a3-142f80563a3c",
    "studentCode": "34581",
    "studentName": "Dzakiyyah Al Fajri",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d0250a9f-c4b9-470c-b796-f8ed778cbf22",
    "studentId": "edfa74c0-7a6c-421e-b5a3-142f80563a3c",
    "studentCode": "34581",
    "studentName": "Dzakiyyah Al Fajri",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a61e9092-f2eb-43b7-9d96-196a7c71d3bc",
    "studentId": "f20782b9-17ab-40f2-b315-7ad3aadc2739",
    "studentCode": "62901",
    "studentName": "Syakira Nur Aini",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "50888680-f12c-4a07-942c-170adb0766f9",
    "studentId": "f20782b9-17ab-40f2-b315-7ad3aadc2739",
    "studentCode": "62901",
    "studentName": "Syakira Nur Aini",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b58bae57-c1a1-4d7f-a56c-7f3007538131",
    "studentId": "f8916605-5eff-48c0-bd51-8301e015b855",
    "studentCode": "59847",
    "studentName": "Haris ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 88,
    "note": "Menyelesaikan 15 soal tepat waktu",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c4954cb8-3c44-475b-b29c-519c06e4730f",
    "studentId": "f8916605-5eff-48c0-bd51-8301e015b855",
    "studentCode": "59847",
    "studentName": "Haris ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "654a012e-d0dc-4b43-a707-67140d60c7d1",
    "studentId": "f9ce8b07-5738-4c29-8ecc-048807666d4c",
    "studentCode": "61298",
    "studentName": "Dimas Arya Sena",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 89,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "7826f57a-cd07-46c7-9597-d4a695d86f5f",
    "studentId": "f9ce8b07-5738-4c29-8ecc-048807666d4c",
    "studentCode": "61298",
    "studentName": "Dimas Arya Sena",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 89,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "614922d5-9ae3-413f-86bb-badc165ffb51",
    "studentId": "15de4d83-1d1b-4042-9bb4-9fdc65db1d3c",
    "studentCode": "67123",
    "studentName": "Hafiz Al-Faruq",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e9dc3053-0b54-4d9e-acb0-9efe2a9e4e47",
    "studentId": "15de4d83-1d1b-4042-9bb4-9fdc65db1d3c",
    "studentCode": "67123",
    "studentName": "Hafiz Al-Faruq",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b5704a73-0ba1-426e-92a8-ac39d12672ed",
    "studentId": "1d157032-9563-4b12-933f-f45078bd1646",
    "studentCode": "38910",
    "studentName": "Nabila Putri Ramadhani",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "88abd04c-9246-4ec0-afa9-6dd8c29cf4b7",
    "studentId": "1d157032-9563-4b12-933f-f45078bd1646",
    "studentCode": "38910",
    "studentName": "Nabila Putri Ramadhani",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 83,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e26f749e-1a66-4748-be42-b0470d3a65d7",
    "studentId": "20f9a9ba-13c7-4650-a900-61abd09ea07a",
    "studentCode": "22000",
    "studentName": "M. Hannan Habibillah",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "fedd5700-3600-43eb-9df4-bbb19bbf10d6",
    "studentId": "20f9a9ba-13c7-4650-a900-61abd09ea07a",
    "studentCode": "22000",
    "studentName": "M. Hannan Habibillah",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 89,
    "note": "Sangat cepat dan fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "64b84da6-72d4-42fb-93da-6048e578573b",
    "studentId": "2643a6e6-fcc0-4c9f-81b1-db1d116e37cd",
    "studentCode": "89050",
    "studentName": "Arsyila Nasha Razita",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 89,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4615aca4-898d-49a3-92c3-8a56d5e659ed",
    "studentId": "2643a6e6-fcc0-4c9f-81b1-db1d116e37cd",
    "studentCode": "89050",
    "studentName": "Arsyila Nasha Razita",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "384b88cf-e0a3-46d4-a98b-8449d1c83b56",
    "studentId": "296a8d0a-9549-4f1a-b529-76eb203d8407",
    "studentCode": "24265",
    "studentName": "Rayendra Azzan Pramana",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "28bcb61b-a9ca-4a98-9ec5-530443e2a0b5",
    "studentId": "296a8d0a-9549-4f1a-b529-76eb203d8407",
    "studentCode": "24265",
    "studentName": "Rayendra Azzan Pramana",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 88,
    "note": "Gerakan jari naik teratur dan mantap",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4882b8e6-fed1-41dd-b3f9-86bb0335e434",
    "studentId": "2ca10889-b780-4660-8022-c1b1a23d5ce2",
    "studentCode": "97375",
    "studentName": "Dzakiyyah Al Fajri ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "623cad0d-756e-42d4-9155-7f1738424cc1",
    "studentId": "2ca10889-b780-4660-8022-c1b1a23d5ce2",
    "studentCode": "97375",
    "studentName": "Dzakiyyah Al Fajri ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "aa347386-cd53-4d85-9dd7-cba134990457",
    "studentId": "352a42af-0c46-4373-9ac4-69a5282da28c",
    "studentCode": "21446",
    "studentName": "Ghumaisha",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 86,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e8dcd007-f1aa-4bd2-b20f-eb94a24a19bb",
    "studentId": "352a42af-0c46-4373-9ac4-69a5282da28c",
    "studentCode": "21446",
    "studentName": "Ghumaisha",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e97b06be-3a8c-403b-a5dd-c3052289ff4c",
    "studentId": "3d378546-ea52-4a13-8235-8ca01bf9c218",
    "studentCode": "53421",
    "studentName": "Nayla Khairunnisa",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 85,
    "note": "Sangat cepat dan fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e1016797-6eca-46ad-bc63-717cc2ab6743",
    "studentId": "3d378546-ea52-4a13-8235-8ca01bf9c218",
    "studentCode": "53421",
    "studentName": "Nayla Khairunnisa",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d554a9d6-a7ea-4093-a3d0-4daea829efa1",
    "studentId": "48721968-d3f2-4319-92be-7a5e972c106b",
    "studentCode": "55866",
    "studentName": "Bilqis Ufairah",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "df54a91b-ab7e-4cb1-9203-8250cd2be9f5",
    "studentId": "48721968-d3f2-4319-92be-7a5e972c106b",
    "studentCode": "55866",
    "studentName": "Bilqis Ufairah",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "13886fe0-e919-403b-9352-935735a2d68b",
    "studentId": "5a5302cf-3115-45c1-ae89-20208f8bd5f5",
    "studentCode": "81234",
    "studentName": "Keysha Anindya",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 88,
    "note": "Gerakan jari naik teratur dan mantap",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "782fa827-b89a-4cb2-9d33-1e420917e51a",
    "studentId": "5a5302cf-3115-45c1-ae89-20208f8bd5f5",
    "studentCode": "81234",
    "studentName": "Keysha Anindya",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c73be5df-ce33-4833-8c5b-44cabd271d3d",
    "studentId": "5f779113-fdc7-4393-8537-b28f76db27a9",
    "studentCode": "44512",
    "studentName": "Raisya Salsabila",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "25594986-73ee-4f80-8373-789ad560cdba",
    "studentId": "5f779113-fdc7-4393-8537-b28f76db27a9",
    "studentCode": "44512",
    "studentName": "Raisya Salsabila",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "67e8aeaa-9f24-4ad5-b832-9010f6dc18f0",
    "studentId": "64dd1749-efcb-40c0-97e6-a30d772e50e0",
    "studentCode": "72190",
    "studentName": "Rayhan Pratama",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "bc0a8c9d-469e-4525-8efc-08e4b7713e50",
    "studentId": "64dd1749-efcb-40c0-97e6-a30d772e50e0",
    "studentCode": "72190",
    "studentName": "Rayhan Pratama",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 87,
    "note": "Sangat cepat dan fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "2ecd7e3d-b5b0-445a-b051-9d98537449e6",
    "studentId": "657f7d55-4398-4d8e-a44d-1f6eb84a61c0",
    "studentCode": "30400",
    "studentName": "Shofiyah ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "37e67307-794e-4349-9e18-371c67ce7d29",
    "studentId": "657f7d55-4398-4d8e-a44d-1f6eb84a61c0",
    "studentCode": "30400",
    "studentName": "Shofiyah ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "09ab1614-3031-4f4a-98f0-4827e8c7f6d1",
    "studentId": "6f029f4e-d64a-4e54-a105-915d6be1e055",
    "studentCode": "79679",
    "studentName": "Nashwa Zahira Fahrefi ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8a649b94-5b1f-4c9c-982e-b0583993f42a",
    "studentId": "6f029f4e-d64a-4e54-a105-915d6be1e055",
    "studentCode": "79679",
    "studentName": "Nashwa Zahira Fahrefi ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3bba79ee-e71b-47ee-b6e8-11a0db5270cb",
    "studentId": "700c0ee2-035a-4a13-bdba-e806864acd95",
    "studentCode": "31144",
    "studentName": "Uwais",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "9ea512c9-c301-4662-afff-3a7e3af26a70",
    "studentId": "700c0ee2-035a-4a13-bdba-e806864acd95",
    "studentCode": "31144",
    "studentName": "Uwais",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "cd9c2e7d-cfd2-46e4-8d71-6689a60d1247",
    "studentId": "7c900a4b-3261-46f2-9990-e54fbc729e3d",
    "studentCode": "38952",
    "studentName": "Kheyra Candra ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "00ec24df-5eef-4875-821f-cc3d4c226950",
    "studentId": "7c900a4b-3261-46f2-9990-e54fbc729e3d",
    "studentCode": "38952",
    "studentName": "Kheyra Candra ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 87,
    "note": "Sangat cepat dan fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e28a32d5-dc25-4a27-ac47-aded8c7f53ee",
    "studentId": "90d546d9-0f7c-4cdf-8351-5e854cce406c",
    "studentCode": "17246",
    "studentName": "Haris",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 89,
    "note": "Gerakan jari naik teratur dan mantap",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "39825038-aa99-4086-8d5d-b5519b9a4a44",
    "studentId": "90d546d9-0f7c-4cdf-8351-5e854cce406c",
    "studentCode": "17246",
    "studentName": "Haris",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0c01305c-5c18-4aba-a3c4-f1efede755a0",
    "studentId": "92d33126-0c86-4472-8a43-01098bf61c00",
    "studentCode": "95701",
    "studentName": "Azila Quira Zulda",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8688639c-9d83-4af4-9c5f-a97ba0486a0f",
    "studentId": "92d33126-0c86-4472-8a43-01098bf61c00",
    "studentCode": "95701",
    "studentName": "Azila Quira Zulda",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "864aa139-123b-4d73-91c2-512e41ab6fdc",
    "studentId": "96bd8abf-ce5e-42c0-8a3f-4d7549f8a2e9",
    "studentCode": "57782",
    "studentName": "Muwaffaq ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "01f12ebf-98f5-4d87-be4e-e8bc27ef0e27",
    "studentId": "96bd8abf-ce5e-42c0-8a3f-4d7549f8a2e9",
    "studentCode": "57782",
    "studentName": "Muwaffaq ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 89,
    "note": "Gerakan jari naik teratur dan mantap",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a2ac2a59-3655-49e1-ab2b-c0c3ce3b2525",
    "studentId": "9c48106c-acd2-4a23-8ac3-543d94de143d",
    "studentCode": "50999",
    "studentName": "Abdan Zulfadli Fahyan",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 89,
    "note": "Gerakan jari naik teratur dan mantap",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "88aac7d4-126f-47a9-951e-ef32784d4c6b",
    "studentId": "9c48106c-acd2-4a23-8ac3-543d94de143d",
    "studentCode": "50999",
    "studentName": "Abdan Zulfadli Fahyan",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b8a2873f-992b-4165-942d-c8c22a2ee683",
    "studentId": "9d9977fb-1a91-47b4-99df-288cc648d437",
    "studentCode": "55148",
    "studentName": "M. Hafizhan Khairan ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "56ed613a-c1a2-4a20-a905-17ea5b7f03c6",
    "studentId": "9d9977fb-1a91-47b4-99df-288cc648d437",
    "studentCode": "55148",
    "studentName": "M. Hafizhan Khairan ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6bc9e07a-b3d9-4585-a520-d3ae30f7a495",
    "studentId": "a32a3e2b-2898-4a12-a20f-a2cb15c3ca22",
    "studentCode": "10650",
    "studentName": "Aishwa Rahma Annida",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "539091b9-dc0e-4445-9487-2cb2e978f6d6",
    "studentId": "a32a3e2b-2898-4a12-a20f-a2cb15c3ca22",
    "studentCode": "10650",
    "studentName": "Aishwa Rahma Annida",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f04a0fc4-7c1a-40bd-bb36-8aae89eee63c",
    "studentId": "aa3fff59-d27e-4851-a660-ceaf1d8e9ade",
    "studentCode": "90123",
    "studentName": "Muhammad Azka",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 86,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a67bd8d6-403a-4e0c-af86-3437abcf8728",
    "studentId": "aa3fff59-d27e-4851-a660-ceaf1d8e9ade",
    "studentCode": "90123",
    "studentName": "Muhammad Azka",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ba3b58c9-3a47-4a0e-9d8a-ebf31e645519",
    "studentId": "ac9180e4-fedf-4941-b3c7-ca9cda665d88",
    "studentCode": "79000",
    "studentName": "Aishwa Rahma Annida",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "63357103-d596-43af-b089-9b0e62032e1a",
    "studentId": "ac9180e4-fedf-4941-b3c7-ca9cda665d88",
    "studentCode": "79000",
    "studentName": "Aishwa Rahma Annida",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "60950c07-78e9-4660-9f32-776caf932808",
    "studentId": "ade8738b-9e7a-4b56-9de7-169e74e714c1",
    "studentCode": "93231",
    "studentName": "Ghumaisha  ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4167722f-60a5-4553-bb36-5c50218ec63e",
    "studentId": "ade8738b-9e7a-4b56-9de7-169e74e714c1",
    "studentCode": "93231",
    "studentName": "Ghumaisha  ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 89,
    "note": "Gerakan jari naik teratur dan mantap",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4611c12b-f2b4-4d8c-a634-26879fb4d71e",
    "studentId": "b42ef79c-f9c9-4972-8f36-525ec014240e",
    "studentCode": "51380",
    "studentName": "Maulana Syarif Wardani",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "7d665486-e6a7-4dd8-a2a7-ecff05ddfb03",
    "studentId": "b42ef79c-f9c9-4972-8f36-525ec014240e",
    "studentCode": "51380",
    "studentName": "Maulana Syarif Wardani",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "2363a27b-99a4-41cb-80ae-89d1558504d2",
    "studentId": "c1ccae6d-ae43-4bbf-b539-4c1c96c9c16b",
    "studentCode": "41209",
    "studentName": "Fakhri Al-Ghifari",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "aaea9c96-122a-4c0f-bc1c-c1d67983bf92",
    "studentId": "c1ccae6d-ae43-4bbf-b539-4c1c96c9c16b",
    "studentCode": "41209",
    "studentName": "Fakhri Al-Ghifari",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f27d2f07-3c5c-40e4-95ab-0d778723d0eb",
    "studentId": "c3dd210c-9220-4055-b57e-5ced60c906c7",
    "studentCode": "48712",
    "studentName": "Kenzo Alvaro",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0c06c70b-a0a1-40f5-bac2-d6fd4af0c164",
    "studentId": "c3dd210c-9220-4055-b57e-5ced60c906c7",
    "studentCode": "48712",
    "studentName": "Kenzo Alvaro",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "dd4ccd5a-e9bb-4e79-a8c2-0bc7a9145811",
    "studentId": "c76503ff-a1d9-45ee-815e-35e24c8f7c7c",
    "studentCode": "33918",
    "studentName": "Calista Azkadina",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 83,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "99ec41e5-b904-4fee-af85-e4045dd5587d",
    "studentId": "c76503ff-a1d9-45ee-815e-35e24c8f7c7c",
    "studentCode": "33918",
    "studentName": "Calista Azkadina",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0bd7bf3b-ddbc-4af0-8085-4f44e034a132",
    "studentId": "ce034bcc-b39d-4fb6-a751-19dbf3371ab2",
    "studentCode": "59012",
    "studentName": "Zahrana Azzahra",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 86,
    "note": "Sangat cepat dan fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d480f383-5fe6-4b58-8b84-114d7234c3f7",
    "studentId": "ce034bcc-b39d-4fb6-a751-19dbf3371ab2",
    "studentCode": "59012",
    "studentName": "Zahrana Azzahra",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d09bf4a4-0096-4a16-85e1-215230138851",
    "studentId": "d5730b58-7251-402b-9059-cc8a9047dc2e",
    "studentCode": "13042",
    "studentName": "Zian Abdi Pratama ",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "457cdcb0-8346-4043-b9d4-401f73ab9554",
    "studentId": "d5730b58-7251-402b-9059-cc8a9047dc2e",
    "studentCode": "13042",
    "studentName": "Zian Abdi Pratama ",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "502dbccb-0a44-4d42-b6bf-53ab5507dbf5",
    "studentId": "dec5e211-a360-4207-83fb-9771011fab2f",
    "studentCode": "10409",
    "studentName": "Sarah ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "109872ae-ea00-4bfd-8b67-0cf3fae503cd",
    "studentId": "dec5e211-a360-4207-83fb-9771011fab2f",
    "studentCode": "10409",
    "studentName": "Sarah ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6c9cddda-d63a-4e4c-b14d-7d4ea87d9c90",
    "studentId": "e02583be-1443-414b-a37c-90e612bcd317",
    "studentCode": "61022",
    "studentName": "Bagas Pratama Putra",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c2b28002-4792-4d20-9e50-af320b2c976d",
    "studentId": "e02583be-1443-414b-a37c-90e612bcd317",
    "studentCode": "61022",
    "studentName": "Bagas Pratama Putra",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 88,
    "note": "Gerakan jari naik teratur dan mantap",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "69a85a3e-4c1e-4ef6-9aaf-7ba9651c691e",
    "studentId": "e0f01c5d-a021-45d7-9828-102cb091a16d",
    "studentCode": "13846",
    "studentName": "Musyaffa' ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "22d12abc-5f70-4496-9664-9fa7e6aac2fb",
    "studentId": "e0f01c5d-a021-45d7-9828-102cb091a16d",
    "studentCode": "13846",
    "studentName": "Musyaffa' ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "34b12c9a-7c97-41bf-86c0-6237d208e186",
    "studentId": "e8375491-10a6-4a3e-a632-733721808900",
    "studentCode": "68766",
    "studentName": "Kristian Naibaho",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ead36416-72ed-4f9a-afce-9fc3e2c774b1",
    "studentId": "e8375491-10a6-4a3e-a632-733721808900",
    "studentCode": "68766",
    "studentName": "Kristian Naibaho",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "eba967f5-0b63-43dd-a8af-245a94f96eaa",
    "studentId": "edfa74c0-7a6c-421e-b5a3-142f80563a3c",
    "studentCode": "34581",
    "studentName": "Dzakiyyah Al Fajri",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a7fd71d7-6aef-4d6c-9606-4835d883b42c",
    "studentId": "edfa74c0-7a6c-421e-b5a3-142f80563a3c",
    "studentCode": "34581",
    "studentName": "Dzakiyyah Al Fajri",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6b96b663-bcd4-4f11-b1ae-d395a4cd8197",
    "studentId": "f20782b9-17ab-40f2-b315-7ad3aadc2739",
    "studentCode": "62901",
    "studentName": "Syakira Nur Aini",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "1ad8b087-fd80-4a7b-b6b0-34a0079a15f7",
    "studentId": "f20782b9-17ab-40f2-b315-7ad3aadc2739",
    "studentCode": "62901",
    "studentName": "Syakira Nur Aini",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ea7a3972-a4d4-4fc9-9997-a9f72c1d94f9",
    "studentId": "f8916605-5eff-48c0-bd51-8301e015b855",
    "studentCode": "59847",
    "studentName": "Haris ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d3733cff-32c1-460a-8b81-cb8d5add5afa",
    "studentId": "f8916605-5eff-48c0-bd51-8301e015b855",
    "studentCode": "59847",
    "studentName": "Haris ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 89,
    "note": "Gerakan jari naik teratur dan mantap",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "dcfda9f5-70fa-4481-bb57-3d0e8b4c1c64",
    "studentId": "f9ce8b07-5738-4c29-8ecc-048807666d4c",
    "studentCode": "61298",
    "studentName": "Dimas Arya Sena",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan dasar",
    "examDate": "2026-08-22",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6f263259-a64d-485e-8632-1f8e45cfd68d",
    "studentId": "f9ce8b07-5738-4c29-8ecc-048807666d4c",
    "studentCode": "61298",
    "studentName": "Dimas Arya Sena",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 89,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "42bc278b-613b-48ba-afe5-3cc253a4eade",
    "studentId": "15de4d83-1d1b-4042-9bb4-9fdc65db1d3c",
    "studentCode": "67123",
    "studentName": "Hafiz Al-Faruq",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b9a8b5a5-7b82-46fa-af76-f6c9b5a266c2",
    "studentId": "1d157032-9563-4b12-933f-f45078bd1646",
    "studentCode": "38910",
    "studentName": "Nabila Putri Ramadhani",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f39b5f67-6d53-42e7-8709-113a424ed048",
    "studentId": "20f9a9ba-13c7-4650-a900-61abd09ea07a",
    "studentCode": "22000",
    "studentName": "M. Hannan Habibillah",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ac6d0021-e4ce-4519-8a9d-28a766db8614",
    "studentId": "2643a6e6-fcc0-4c9f-81b1-db1d116e37cd",
    "studentCode": "89050",
    "studentName": "Arsyila Nasha Razita",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 89,
    "note": "Mampu berhitung berantai tanpa jeda",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "76bc42db-eca5-4eed-a711-e49d17d14e8e",
    "studentId": "296a8d0a-9549-4f1a-b529-76eb203d8407",
    "studentCode": "24265",
    "studentName": "Rayendra Azzan Pramana",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a9d53238-d6cb-4e96-b553-266e7d41a103",
    "studentId": "2ca10889-b780-4660-8022-c1b1a23d5ce2",
    "studentCode": "97375",
    "studentName": "Dzakiyyah Al Fajri ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f51b4418-8a4c-4497-9db0-03173e316956",
    "studentId": "352a42af-0c46-4373-9ac4-69a5282da28c",
    "studentCode": "21446",
    "studentName": "Ghumaisha",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "246caa60-d558-4661-9066-e964688fd545",
    "studentId": "3d378546-ea52-4a13-8235-8ca01bf9c218",
    "studentCode": "53421",
    "studentName": "Nayla Khairunnisa",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 89,
    "note": "Mampu berhitung berantai tanpa jeda",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f5d82d67-4fa9-4024-b10f-e89c54b280ef",
    "studentId": "48721968-d3f2-4319-92be-7a5e972c106b",
    "studentCode": "55866",
    "studentName": "Bilqis Ufairah",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "810c193f-22fe-49fd-a02b-1ed906786c48",
    "studentId": "5a5302cf-3115-45c1-ae89-20208f8bd5f5",
    "studentCode": "81234",
    "studentName": "Keysha Anindya",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "61a37764-cd80-4989-b5a4-83afc9b8d534",
    "studentId": "5f779113-fdc7-4393-8537-b28f76db27a9",
    "studentCode": "44512",
    "studentName": "Raisya Salsabila",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0b35123b-c2b2-44a3-82e3-19738e8d819a",
    "studentId": "64dd1749-efcb-40c0-97e6-a30d772e50e0",
    "studentCode": "72190",
    "studentName": "Rayhan Pratama",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "096dc004-e730-404e-b159-0cc89f360de6",
    "studentId": "657f7d55-4398-4d8e-a44d-1f6eb84a61c0",
    "studentCode": "30400",
    "studentName": "Shofiyah ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 88,
    "note": "Mampu berhitung berantai tanpa jeda",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a5d009b1-6cc2-4156-b64a-48d5c4e81d20",
    "studentId": "6f029f4e-d64a-4e54-a105-915d6be1e055",
    "studentCode": "79679",
    "studentName": "Nashwa Zahira Fahrefi ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "774a5411-99b3-454b-a11e-ad49c2f3c2dc",
    "studentId": "700c0ee2-035a-4a13-bdba-e806864acd95",
    "studentCode": "31144",
    "studentName": "Uwais",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b50a48f5-635b-463c-90bf-836b9b0627e9",
    "studentId": "7c900a4b-3261-46f2-9990-e54fbc729e3d",
    "studentCode": "38952",
    "studentName": "Kheyra Candra ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "47d61c75-4590-4337-91f4-d77aa32dc639",
    "studentId": "90d546d9-0f7c-4cdf-8351-5e854cce406c",
    "studentCode": "17246",
    "studentName": "Haris",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4127ce1e-f9ed-4f3e-8434-021fc4f41e56",
    "studentId": "92d33126-0c86-4472-8a43-01098bf61c00",
    "studentCode": "95701",
    "studentName": "Azila Quira Zulda",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "2b5bdad0-2026-495c-ad86-007bb87b296b",
    "studentId": "96bd8abf-ce5e-42c0-8a3f-4d7549f8a2e9",
    "studentCode": "57782",
    "studentName": "Muwaffaq ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 87,
    "note": "Mampu berhitung berantai tanpa jeda",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "40673257-b11a-43f3-9735-12e4bcaf04b9",
    "studentId": "9c48106c-acd2-4a23-8ac3-543d94de143d",
    "studentCode": "50999",
    "studentName": "Abdan Zulfadli Fahyan",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 87,
    "note": "Mampu berhitung berantai tanpa jeda",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "90672da0-f9ef-4f06-b593-9003fc339699",
    "studentId": "9d9977fb-1a91-47b4-99df-288cc648d437",
    "studentCode": "55148",
    "studentName": "M. Hafizhan Khairan ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 88,
    "note": "Mampu berhitung berantai tanpa jeda",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8f5ec1af-331b-4455-98e4-008f3144675f",
    "studentId": "a32a3e2b-2898-4a12-a20f-a2cb15c3ca22",
    "studentCode": "10650",
    "studentName": "Aishwa Rahma Annida",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "fdb16e6a-196b-4c99-a012-618da619860f",
    "studentId": "aa3fff59-d27e-4851-a660-ceaf1d8e9ade",
    "studentCode": "90123",
    "studentName": "Muhammad Azka",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "45211099-8aec-4cb0-b65d-c37351405eaa",
    "studentId": "ac9180e4-fedf-4941-b3c7-ca9cda665d88",
    "studentCode": "79000",
    "studentName": "Aishwa Rahma Annida",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d294fe05-a740-4bf8-a773-3c5513805276",
    "studentId": "ade8738b-9e7a-4b56-9de7-169e74e714c1",
    "studentCode": "93231",
    "studentName": "Ghumaisha  ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 87,
    "note": "Mampu berhitung berantai tanpa jeda",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "53ddfc8c-18ce-47be-bb67-d7e69f08e89e",
    "studentId": "b42ef79c-f9c9-4972-8f36-525ec014240e",
    "studentCode": "51380",
    "studentName": "Maulana Syarif Wardani",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "21211809-c0d8-4849-84f0-3b1c0bcc40ab",
    "studentId": "c1ccae6d-ae43-4bbf-b539-4c1c96c9c16b",
    "studentCode": "41209",
    "studentName": "Fakhri Al-Ghifari",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ff2bc72e-efdc-45a3-8bb9-a6925cd8643a",
    "studentId": "c3dd210c-9220-4055-b57e-5ced60c906c7",
    "studentCode": "48712",
    "studentName": "Kenzo Alvaro",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d9326ff8-c526-430e-9273-cb6a170c2d69",
    "studentId": "c76503ff-a1d9-45ee-815e-35e24c8f7c7c",
    "studentCode": "33918",
    "studentName": "Calista Azkadina",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5c282513-a2e5-4f54-ad50-92751c4e6244",
    "studentId": "ce034bcc-b39d-4fb6-a751-19dbf3371ab2",
    "studentCode": "59012",
    "studentName": "Zahrana Azzahra",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b8cc6433-ede4-4889-8274-4297320a0551",
    "studentId": "d5730b58-7251-402b-9059-cc8a9047dc2e",
    "studentCode": "13042",
    "studentName": "Zian Abdi Pratama ",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "39104bd9-42b8-414f-b569-e902ef578e8b",
    "studentId": "dec5e211-a360-4207-83fb-9771011fab2f",
    "studentCode": "10409",
    "studentName": "Sarah ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "96893bd2-46e0-4c11-869d-ec954af8a14a",
    "studentId": "e02583be-1443-414b-a37c-90e612bcd317",
    "studentCode": "61022",
    "studentName": "Bagas Pratama Putra",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c45844bf-d85c-4ea3-8fb7-72659f23095b",
    "studentId": "e0f01c5d-a021-45d7-9828-102cb091a16d",
    "studentCode": "13846",
    "studentName": "Musyaffa' ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6c409488-bb79-4c81-858c-89746bb1f6d0",
    "studentId": "e8375491-10a6-4a3e-a632-733721808900",
    "studentCode": "68766",
    "studentName": "Kristian Naibaho",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "02bf807f-3fbf-4e4b-9de7-e01fc92773eb",
    "studentId": "edfa74c0-7a6c-421e-b5a3-142f80563a3c",
    "studentCode": "34581",
    "studentName": "Dzakiyyah Al Fajri",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "48279353-a5ac-4c71-aeef-2f0a4b7fd1e9",
    "studentId": "f20782b9-17ab-40f2-b315-7ad3aadc2739",
    "studentCode": "62901",
    "studentName": "Syakira Nur Aini",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c3e46af8-8cee-43c1-a501-3bddddfa3118",
    "studentId": "f8916605-5eff-48c0-bd51-8301e015b855",
    "studentCode": "59847",
    "studentName": "Haris ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d3f7a3b0-3b52-4058-bcf6-61d2b2ae1dbb",
    "studentId": "f9ce8b07-5738-4c29-8ecc-048807666d4c",
    "studentCode": "61298",
    "studentName": "Dimas Arya Sena",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan berderet",
    "examDate": "2026-08-30",
    "score": 88,
    "note": "Mampu berhitung berantai tanpa jeda",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4157d43a-b84e-46bc-a8cb-eb235de674dd",
    "studentId": "296a8d0a-9549-4f1a-b529-76eb203d8407",
    "studentCode": "24265",
    "studentName": "Rayendra Azzan Pramana",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "levek 1 hlm  30",
    "examDate": "2026-09-05",
    "score": 0,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c69a6c40-781f-441a-bb5d-cee88e355afc",
    "studentId": "2ca10889-b780-4660-8022-c1b1a23d5ce2",
    "studentCode": "97375",
    "studentName": "Dzakiyyah Al Fajri ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "levek 1 hlm  30",
    "examDate": "2026-09-05",
    "score": 100,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "44b24c59-bc47-41fb-a218-2821fcf11891",
    "studentId": "657f7d55-4398-4d8e-a44d-1f6eb84a61c0",
    "studentCode": "30400",
    "studentName": "Shofiyah ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "levek 1 hlm  30",
    "examDate": "2026-09-05",
    "score": 0,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c5ad6126-4419-4d7f-9bbf-6ee52126d3ee",
    "studentId": "96bd8abf-ce5e-42c0-8a3f-4d7549f8a2e9",
    "studentCode": "57782",
    "studentName": "Muwaffaq ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "levek 1 hlm  30",
    "examDate": "2026-09-05",
    "score": 0,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "79f6db30-0a67-42bc-9e44-bce0d4a133cb",
    "studentId": "ade8738b-9e7a-4b56-9de7-169e74e714c1",
    "studentCode": "93231",
    "studentName": "Ghumaisha  ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "levek 1 hlm  30",
    "examDate": "2026-09-05",
    "score": 70,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ff0b65a9-5337-4fa7-95a0-c31a06f44f28",
    "studentId": "e0f01c5d-a021-45d7-9828-102cb091a16d",
    "studentCode": "13846",
    "studentName": "Musyaffa' ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "levek 1 hlm  30",
    "examDate": "2026-09-05",
    "score": 0,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "87200252-63a3-4e57-93cf-4da10dd348a7",
    "studentId": "001f391b-660f-46f6-a82e-d59a0bb45700",
    "studentCode": "86254",
    "studentName": "Raditya Riski Ramadhan ",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "23696ab3-3c35-49b8-bdfb-8a899a8d2784",
    "studentId": "04796f1c-9a95-475e-a8db-b8fd605ae5ad",
    "studentCode": "76123",
    "studentName": "Bima Sakti",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 86,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c716fae9-98cf-450a-9285-faca8e522f7a",
    "studentId": "0f0efef9-eda5-4673-a26b-4007603410a3",
    "studentCode": "83063",
    "studentName": "Nayyara Febi Anjani",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 85,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "51030602-e9e2-47fd-8587-9ae234f08f20",
    "studentId": "10451ac4-1e41-430d-b17d-01de8a19261e",
    "studentCode": "64628",
    "studentName": "Qintara Izatunnisya",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5d3926ed-3024-40e4-a82b-98c108a7035c",
    "studentId": "11a3901e-dae9-4902-a89e-578810a8fbad",
    "studentCode": "98124",
    "studentName": "Dzakiandra Putra",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "2269bbb4-ecbe-4d8a-8fd9-0f75762d2e1f",
    "studentId": "15de4d83-1d1b-4042-9bb4-9fdc65db1d3c",
    "studentCode": "67123",
    "studentName": "Hafiz Al-Faruq",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b5a4991e-fb57-4ca2-986b-559e522a60cc",
    "studentId": "15de4d83-1d1b-4042-9bb4-9fdc65db1d3c",
    "studentCode": "67123",
    "studentName": "Hafiz Al-Faruq",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 84,
    "note": "Refleks jari turun akurat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6ab1f3e0-0cdd-4fa1-b6aa-8b4c406b38d1",
    "studentId": "16d71476-7ec9-483a-a2b0-f1e9de3ade83",
    "studentCode": "65934",
    "studentName": "Rahajeng Ayu Kinanti",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "fa310043-cb5e-47a9-9a3b-77f172b0a403",
    "studentId": "16f42f89-5c09-4b2b-9e8a-d01f7f275727",
    "studentCode": "18032",
    "studentName": "Areasely Naura Shada",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ae10e8ee-e7e1-48ca-bd83-667019d3d3f9",
    "studentId": "17a21047-a092-4964-a396-ea778093f34d",
    "studentCode": "52651",
    "studentName": "Ainan Nuri Sumayah",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 83,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4d061de4-72dd-49d2-b36f-82c4bc2ffe82",
    "studentId": "1d157032-9563-4b12-933f-f45078bd1646",
    "studentCode": "38910",
    "studentName": "Nabila Putri Ramadhani",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "bb3aacb9-5840-486a-8e70-6b1b5317620b",
    "studentId": "1d157032-9563-4b12-933f-f45078bd1646",
    "studentCode": "38910",
    "studentName": "Nabila Putri Ramadhani",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 84,
    "note": "Refleks jari turun akurat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d7694af1-11e2-4c94-8978-5ee7f5343758",
    "studentId": "1e8d5ed6-e5b1-474e-8b64-24633476b6f9",
    "studentCode": "95219",
    "studentName": "Viola Alesha Ganes",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 86,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "74ad559b-3877-49ea-8e68-22f611ac21b3",
    "studentId": "1eecdd5c-da28-4078-a890-b2abe0ebfc9d",
    "studentCode": "49625",
    "studentName": "Amara Alifah Fauziah",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 87,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "84f55d43-9e0e-4882-abac-aceec01fba91",
    "studentId": "20f9a9ba-13c7-4650-a900-61abd09ea07a",
    "studentCode": "22000",
    "studentName": "M. Hannan Habibillah",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 85,
    "note": "Refleks jari turun akurat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "703e13da-6ff0-403c-a060-c4345b16ca76",
    "studentId": "20f9a9ba-13c7-4650-a900-61abd09ea07a",
    "studentCode": "22000",
    "studentName": "M. Hannan Habibillah",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "1ff81b6d-6f8c-45eb-a443-aae9892ec45d",
    "studentId": "216e8e11-446a-46bd-8641-893961f9462f",
    "studentCode": "66787",
    "studentName": "Anindita Keisha Zahra",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8fa110b2-a6ba-45a0-ab52-803622380f56",
    "studentId": "239abe9a-3759-4677-be68-aa5f1ed2796c",
    "studentCode": "66538",
    "studentName": "Ananta Virya",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 85,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8059ddb4-eac2-42bc-a752-e131b7739481",
    "studentId": "256ccdc6-5f78-4ce1-894e-4e6f8ee4800a",
    "studentCode": "33145",
    "studentName": "Syafiq Athallah",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 87,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "27a600da-82c2-4c2d-b048-305c6473e8b1",
    "studentId": "2643a6e6-fcc0-4c9f-81b1-db1d116e37cd",
    "studentCode": "89050",
    "studentName": "Arsyila Nasha Razita",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "7b7a6a3e-ca33-4f97-aaee-e33a8ecbd220",
    "studentId": "2643a6e6-fcc0-4c9f-81b1-db1d116e37cd",
    "studentCode": "89050",
    "studentName": "Arsyila Nasha Razita",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "29fb4de9-cce0-4517-a64e-74a50f96c770",
    "studentId": "296a8d0a-9549-4f1a-b529-76eb203d8407",
    "studentCode": "24265",
    "studentName": "Rayendra Azzan Pramana",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d3786d98-c330-4806-a3bf-0fcf307159d8",
    "studentId": "296a8d0a-9549-4f1a-b529-76eb203d8407",
    "studentCode": "24265",
    "studentName": "Rayendra Azzan Pramana",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "275772fa-ec01-44f8-9c40-72724c53529f",
    "studentId": "2ca10889-b780-4660-8022-c1b1a23d5ce2",
    "studentCode": "97375",
    "studentName": "Dzakiyyah Al Fajri ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "7b09a3ce-5258-4385-bde5-e12abc2c0413",
    "studentId": "2ca10889-b780-4660-8022-c1b1a23d5ce2",
    "studentCode": "97375",
    "studentName": "Dzakiyyah Al Fajri ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 89,
    "note": "Refleks jari kombinasi 5 sangat lancar",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c6fc00f6-e775-4505-b386-a84fe694429f",
    "studentId": "31486b62-e24d-4ded-a892-c9be9a9b68c3",
    "studentCode": "56840",
    "studentName": "Afrial Arsenio",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 85,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b2e9f9f0-1f74-4560-99c6-89a18fa0f076",
    "studentId": "32dad6a6-6729-4aed-a91c-885e1b685e4c",
    "studentCode": "21117",
    "studentName": "Natasya Elfani Alkhomah",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 87,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "59564449-3a57-4fc7-b6cd-acf7f892eae7",
    "studentId": "34f39374-825b-4c3e-8f5d-1e60dd92a722",
    "studentCode": "78700",
    "studentName": "M. Bintang Hisyam Naufal",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 86,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "724c2fed-59af-4643-9215-06bd65a6e1ed",
    "studentId": "352a42af-0c46-4373-9ac4-69a5282da28c",
    "studentCode": "21446",
    "studentName": "Ghumaisha",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 87,
    "note": "Refleks jari turun akurat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f732ee69-f86f-4b53-8ee1-d9f0b9533d38",
    "studentId": "352a42af-0c46-4373-9ac4-69a5282da28c",
    "studentCode": "21446",
    "studentName": "Ghumaisha",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "7817aaf4-2ca3-4e05-b45e-19f79f79a395",
    "studentId": "3989a228-cdd0-456b-aa91-b9be32522cb5",
    "studentCode": "31290",
    "studentName": "Daniswara Rizky",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 85,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "9d7c1c3e-3003-4f67-9ba8-01242ec973eb",
    "studentId": "3d378546-ea52-4a13-8235-8ca01bf9c218",
    "studentCode": "53421",
    "studentName": "Nayla Khairunnisa",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "dc7f139b-909d-492f-b084-1eec57242669",
    "studentId": "3d378546-ea52-4a13-8235-8ca01bf9c218",
    "studentCode": "53421",
    "studentName": "Nayla Khairunnisa",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "de5d4f93-cc36-442e-bba0-2932863ad2f5",
    "studentId": "452fe4ee-e4c6-4e63-a83d-9f0829085e88",
    "studentCode": "65103",
    "studentName": "Najwa Khaira Wilda",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 88,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a675640c-f794-45b8-b4b7-10dd9f1b9a3d",
    "studentId": "48721968-d3f2-4319-92be-7a5e972c106b",
    "studentCode": "55866",
    "studentName": "Bilqis Ufairah",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 83,
    "note": "Refleks jari turun akurat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f584e0c3-00f3-4370-9216-585d9c637dc8",
    "studentId": "48721968-d3f2-4319-92be-7a5e972c106b",
    "studentCode": "55866",
    "studentName": "Bilqis Ufairah",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "53a28c22-9c7b-4b9d-8308-d8a52bdc56f2",
    "studentId": "4964c094-f258-4fcb-94ed-1619344d0377",
    "studentCode": "47440",
    "studentName": "Najwa Alarifah",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0e6c3747-6604-49b7-8464-3f0586cd1a22",
    "studentId": "497ef1bb-d078-42af-a596-85d9d8c60bf0",
    "studentCode": "99133",
    "studentName": "Arsyila Nasha Razita",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c69fc03b-f310-40ca-b5af-d859e8e6693d",
    "studentId": "4c5462b2-a318-45de-8ffd-293df12e4334",
    "studentCode": "40736",
    "studentName": "Aira Anatasya Putri",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "fe77d5c7-e370-464d-8550-381e29ff4ee3",
    "studentId": "4fae6a4c-8c08-4351-bb25-71e9db2e4ecb",
    "studentCode": "17055",
    "studentName": "Anandira Dyah Asmara Wati",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a564662e-c243-45eb-bfb2-6022a5aede72",
    "studentId": "50d53115-8f00-40eb-90b0-1de731665ec4",
    "studentCode": "71940",
    "studentName": "Mahera Aiza Hilya",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f1c3a5b3-d15a-4ee0-946b-3d7f68d69eca",
    "studentId": "51f2f51b-16db-42bc-8e24-c12e01e57977",
    "studentCode": "65815",
    "studentName": "Alesha Rafani Marta",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 88,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f15ae2b2-6c13-4656-9992-be78c629f450",
    "studentId": "5467d797-c061-4a6f-b981-86af0829951d",
    "studentCode": "43210",
    "studentName": "Luthfi Hakim",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "9052df1e-8bd9-4888-91b2-13a26cb9b399",
    "studentId": "55e4f383-8f7f-43aa-ab5b-bf31aaa02b29",
    "studentCode": "77364",
    "studentName": "M. Fahrul Al Khafid",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 85,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "59608ee6-b5f1-4f67-9d3a-529261a19999",
    "studentId": "5831e4e4-ad30-43d7-a4d5-a11dd3b46508",
    "studentCode": "57508",
    "studentName": "Raffasya Abizar Raqilla",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 89,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3388b58c-7c2f-4c8a-9f44-004dc5425d0c",
    "studentId": "58a9b1e8-fe4b-4471-8ddc-05548604fe49",
    "studentCode": "67358",
    "studentName": "Nayla Inara Putri",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "12b10502-09eb-4346-b365-4a9658f0a48e",
    "studentId": "590ba72b-cae9-4773-9863-ac46b48e4eb1",
    "studentCode": "91212",
    "studentName": "Ajeng Cahyra Naifasha",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 89,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "32726d70-e950-4512-ab25-3dc59d96fda0",
    "studentId": "5a5302cf-3115-45c1-ae89-20208f8bd5f5",
    "studentCode": "81234",
    "studentName": "Keysha Anindya",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ca1008df-6775-4eb8-b8d2-2fd7c3872ac6",
    "studentId": "5a5302cf-3115-45c1-ae89-20208f8bd5f5",
    "studentCode": "81234",
    "studentName": "Keysha Anindya",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5272c75a-1655-4a6d-9f7d-6d6846b2a6f7",
    "studentId": "5c74b85c-f840-4649-ab72-e572843d8848",
    "studentCode": "29797",
    "studentName": "Aqila Fahmida",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0444db61-5b0d-4742-be13-f05a00311592",
    "studentId": "5f15914c-65c0-4824-8170-2bc66288ae8d",
    "studentCode": "12232",
    "studentName": "Nathania Azkadina Farzana",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "03f42e56-a815-4c48-9c30-42213742cede",
    "studentId": "5f779113-fdc7-4393-8537-b28f76db27a9",
    "studentCode": "44512",
    "studentName": "Raisya Salsabila",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ece56d30-99e4-4ee8-a626-7dfe1cd1aca9",
    "studentId": "5f779113-fdc7-4393-8537-b28f76db27a9",
    "studentCode": "44512",
    "studentName": "Raisya Salsabila",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 86,
    "note": "Refleks jari turun akurat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "aef3ca6d-19c7-47ae-8b7f-4dbd086816c8",
    "studentId": "64dd1749-efcb-40c0-97e6-a30d772e50e0",
    "studentCode": "72190",
    "studentName": "Rayhan Pratama",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "97bbba47-3a61-40ea-a4f4-0f54e8ebe9ed",
    "studentId": "64dd1749-efcb-40c0-97e6-a30d772e50e0",
    "studentCode": "72190",
    "studentName": "Rayhan Pratama",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 83,
    "note": "Refleks jari turun akurat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "11bd768d-09a0-4dbc-8494-73a970ec7d1c",
    "studentId": "657f7d55-4398-4d8e-a44d-1f6eb84a61c0",
    "studentCode": "30400",
    "studentName": "Shofiyah ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e049ac7e-d746-45c2-a5ae-c405edb29ec1",
    "studentId": "657f7d55-4398-4d8e-a44d-1f6eb84a61c0",
    "studentCode": "30400",
    "studentName": "Shofiyah ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "81b88d40-ec2d-4d57-8d90-19e6a216ad23",
    "studentId": "68d5295b-bde7-4391-bab3-68255dcee983",
    "studentCode": "78123",
    "studentName": "Gladis Anindita",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "67f49e8e-0fbd-4cae-a25e-508bd07786a9",
    "studentId": "68d57e75-a2d2-4251-b6a7-541c3bc9c15d",
    "studentCode": "66458",
    "studentName": "Adeeva Afsheen Myesha",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d64c81a3-7213-49cc-b03f-aad5f6c3e690",
    "studentId": "6c51a4cb-002b-4b1f-a757-d0920e3043d9",
    "studentCode": "86190",
    "studentName": "EL FIRQOTUN AN NAJIYAH",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 84,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "28e12577-56d3-48cf-a084-6e54f591b9e7",
    "studentId": "6c55f895-276b-4955-ab24-223af3c42bea",
    "studentCode": "67890",
    "studentName": "Fathir Ahmad",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d237bbd2-4484-422e-9f40-6f2a18e8abef",
    "studentId": "6d947da3-e268-4b69-ab42-820c9b48132e",
    "studentCode": "70553",
    "studentName": "Shaqia Azzahra Rahayu",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ea1a11ba-e219-4bd5-880e-63d838493979",
    "studentId": "6f029f4e-d64a-4e54-a105-915d6be1e055",
    "studentCode": "79679",
    "studentName": "Nashwa Zahira Fahrefi ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5ddd34b4-05f3-4a8f-ae26-a2b63510b4da",
    "studentId": "6f029f4e-d64a-4e54-a105-915d6be1e055",
    "studentCode": "79679",
    "studentName": "Nashwa Zahira Fahrefi ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 89,
    "note": "Refleks jari turun akurat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3e0e66b0-50a1-438b-b210-3c5b62386d7c",
    "studentId": "700c0ee2-035a-4a13-bdba-e806864acd95",
    "studentCode": "31144",
    "studentName": "Uwais",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 89,
    "note": "Refleks jari kombinasi 5 sangat lancar",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c53870ac-873a-4dc3-8894-168754e99bbe",
    "studentId": "700c0ee2-035a-4a13-bdba-e806864acd95",
    "studentCode": "31144",
    "studentName": "Uwais",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f9136946-185e-4345-af98-7a27b03b4a17",
    "studentId": "7169f097-8bf5-40dd-934e-0f5460261c04",
    "studentCode": "20080",
    "studentName": "M. Hannan Habibillah",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "aed6d0b8-e8a1-4136-b906-472155d486bf",
    "studentId": "7263e6e3-a667-4f35-82e4-90cd8b59b2b8",
    "studentCode": "66469",
    "studentName": "Abrisam",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b853f06a-e1d1-4ff1-9c6b-8b043277bddf",
    "studentId": "746c4af0-24e7-44b9-b255-256bc96cd47d",
    "studentCode": "84072",
    "studentName": "Ajeng Chaira Naifasha",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "04daf4be-5314-4e46-95f7-6612a21ce036",
    "studentId": "75075ab4-09b7-4059-8b60-561f8ea52ebe",
    "studentCode": "11653",
    "studentName": "Zulfan Azhar Raihan",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 84,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f77e5738-2662-494a-b4f3-09b141448f5d",
    "studentId": "7c900a4b-3261-46f2-9990-e54fbc729e3d",
    "studentCode": "38952",
    "studentName": "Kheyra Candra ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 83,
    "note": "Refleks jari turun akurat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "7f0ff3e3-e798-45ec-a8a5-f93dbcc93301",
    "studentId": "7c900a4b-3261-46f2-9990-e54fbc729e3d",
    "studentCode": "38952",
    "studentName": "Kheyra Candra ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "acad7481-eca6-482b-8e0f-c2be35d1968b",
    "studentId": "873cf03f-d94e-41c1-a8d8-44ea933c1d93",
    "studentCode": "93060",
    "studentName": "Arka Prapta Ardani",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "89c0099b-fc9b-432b-b804-31d3e1666903",
    "studentId": "8e4bf798-43a8-4def-ad68-252c3035dd84",
    "studentCode": "43183",
    "studentName": "Habib Fadhil Abidin",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 89,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "63375ea6-ce89-4f06-950e-d5d0e033b3e9",
    "studentId": "8f01e65d-d43c-4d38-8e10-16f48712cffe",
    "studentCode": "14999",
    "studentName": "Adeeva Afsheen Myesha",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 86,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3524518f-dd2b-40d1-89f1-16b48e5f61b6",
    "studentId": "90d546d9-0f7c-4cdf-8351-5e854cce406c",
    "studentCode": "17246",
    "studentName": "Haris",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "1939b364-972f-45fb-a50c-0c5a4b75981e",
    "studentId": "90d546d9-0f7c-4cdf-8351-5e854cce406c",
    "studentCode": "17246",
    "studentName": "Haris",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c330fd0d-f2a5-476b-8160-5e94b770dabd",
    "studentId": "92d33126-0c86-4472-8a43-01098bf61c00",
    "studentCode": "95701",
    "studentName": "Azila Quira Zulda",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "bb702c50-fb9d-41f6-b88b-26e782cd3bdb",
    "studentId": "92d33126-0c86-4472-8a43-01098bf61c00",
    "studentCode": "95701",
    "studentName": "Azila Quira Zulda",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 86,
    "note": "Refleks jari turun akurat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f7885c93-cd07-41e5-a2db-1e6c406ddeed",
    "studentId": "96bd8abf-ce5e-42c0-8a3f-4d7549f8a2e9",
    "studentCode": "57782",
    "studentName": "Muwaffaq ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5b6deecc-9c8e-4031-a76e-13e1fc6dea90",
    "studentId": "96bd8abf-ce5e-42c0-8a3f-4d7549f8a2e9",
    "studentCode": "57782",
    "studentName": "Muwaffaq ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "213ac418-f8b7-489f-92bf-7243aa05c81d",
    "studentId": "981d918a-8b29-4b3f-b7e7-7d0baedae5b6",
    "studentCode": "15367",
    "studentName": "Aida Syafira N.A",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6ba34c7b-ac78-4e57-a092-6c56374358e9",
    "studentId": "98a69eaa-3d7a-4363-9958-755501175aee",
    "studentCode": "11687",
    "studentName": "Yusuf Alfarizky Sugara",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d7f4a98c-49e6-4c07-982a-4535481e687d",
    "studentId": "9997dcfe-ef86-40c4-a197-f1e968484719",
    "studentCode": "70066",
    "studentName": "M. Rafa Raditia",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 84,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "57c3f01e-3336-4782-80e4-1534023ea123",
    "studentId": "9ae2069c-c732-4461-ae86-f18cffca1178",
    "studentCode": "45237",
    "studentName": "Arka Prapdipta Ardani",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 89,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d3d73a71-a118-4665-a821-569a9568a615",
    "studentId": "9c48106c-acd2-4a23-8ac3-543d94de143d",
    "studentCode": "50999",
    "studentName": "Abdan Zulfadli Fahyan",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "7137b89d-bea8-403f-b075-43f53e5b29ca",
    "studentId": "9c48106c-acd2-4a23-8ac3-543d94de143d",
    "studentCode": "50999",
    "studentName": "Abdan Zulfadli Fahyan",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "52a87a67-2376-4ef1-af33-29d7c6f00af8",
    "studentId": "9d9977fb-1a91-47b4-99df-288cc648d437",
    "studentCode": "55148",
    "studentName": "M. Hafizhan Khairan ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "fc46093f-d873-4cb1-af05-1c8908edaa57",
    "studentId": "9d9977fb-1a91-47b4-99df-288cc648d437",
    "studentCode": "55148",
    "studentName": "M. Hafizhan Khairan ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c878d4d4-25c6-437f-a574-4d04beffeed9",
    "studentId": "9e1eea3b-215f-41c6-b662-89e0f7bbac6a",
    "studentCode": "48291",
    "studentName": "Haura",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 88,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "156a5cd8-1b23-4a07-9eab-4f79cd9a4ff0",
    "studentId": "9f60be52-54d6-41df-a0b8-f1de43bbd7f7",
    "studentCode": "74789",
    "studentName": "M. Dhaffa Athallah",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b25fe59f-692f-4acd-8ec2-eeca57596874",
    "studentId": "a32a3e2b-2898-4a12-a20f-a2cb15c3ca22",
    "studentCode": "10650",
    "studentName": "Aishwa Rahma Annida",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6e79e4b4-cea7-4aea-a764-4636e34645c7",
    "studentId": "a32a3e2b-2898-4a12-a20f-a2cb15c3ca22",
    "studentCode": "10650",
    "studentName": "Aishwa Rahma Annida",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "819b0dea-afc5-4e8b-8615-d0117c29e2bd",
    "studentId": "a6c9d744-dcac-4377-b0a0-0d2a140c1257",
    "studentCode": "44156",
    "studentName": "Rafa Al-Ghifari",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5779f996-bb50-4417-93bc-0e4d20225d6f",
    "studentId": "aa3fff59-d27e-4851-a660-ceaf1d8e9ade",
    "studentCode": "90123",
    "studentName": "Muhammad Azka",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "37a37a7b-1a64-4b2f-9513-68c29e9d95af",
    "studentId": "aa3fff59-d27e-4851-a660-ceaf1d8e9ade",
    "studentCode": "90123",
    "studentName": "Muhammad Azka",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "32fb6084-5f05-473b-bb40-7f64c6a02cb5",
    "studentId": "ac9180e4-fedf-4941-b3c7-ca9cda665d88",
    "studentCode": "79000",
    "studentName": "Aishwa Rahma Annida",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "38ccdab8-7cd3-44a9-b3ea-862b078410ab",
    "studentId": "ac9180e4-fedf-4941-b3c7-ca9cda665d88",
    "studentCode": "79000",
    "studentName": "Aishwa Rahma Annida",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "cd370cc7-1abb-4804-a1e9-26c7f373e784",
    "studentId": "ade8738b-9e7a-4b56-9de7-169e74e714c1",
    "studentCode": "93231",
    "studentName": "Ghumaisha  ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "cc71496e-b8b9-43d3-9827-10545bc7fb21",
    "studentId": "ade8738b-9e7a-4b56-9de7-169e74e714c1",
    "studentCode": "93231",
    "studentName": "Ghumaisha  ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "fc5e8991-5121-40b6-9368-ffd1d487c539",
    "studentId": "ae6f604a-c5a1-48a0-a65c-776edc69b777",
    "studentCode": "54321",
    "studentName": "Kevin Pratama",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 87,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "496fc663-2f08-46d1-b020-351811fa4141",
    "studentId": "afff798e-f6eb-4730-883b-cebf7ee93880",
    "studentCode": "41984",
    "studentName": "Asheqa Shaqueena Qotrunada",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 87,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "855c7d44-764c-4492-bb30-779a6db5a256",
    "studentId": "b0655f2e-a8c9-4320-9ad7-1e85f7e120ce",
    "studentCode": "88190",
    "studentName": "M. Rayyan Al-Fatih",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "dbb447ae-a44d-41d0-b573-3b65e25a5e8e",
    "studentId": "b252f9f5-a288-433f-9ad7-ac52dbb7a9a7",
    "studentCode": "52809",
    "studentName": "Anandira Dyah Asmarawati",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 86,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b9b553be-e826-47e3-85f8-e6834e276b19",
    "studentId": "b42ef79c-f9c9-4972-8f36-525ec014240e",
    "studentCode": "51380",
    "studentName": "Maulana Syarif Wardani",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "dbe4c886-edeb-43bf-96e6-5ace38658c4c",
    "studentId": "b42ef79c-f9c9-4972-8f36-525ec014240e",
    "studentCode": "51380",
    "studentName": "Maulana Syarif Wardani",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 89,
    "note": "Refleks jari kombinasi 5 sangat lancar",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e464f0fb-4840-490e-a740-c4d066472d87",
    "studentId": "bb043228-0521-4772-8409-ffb114dea44d",
    "studentCode": "77189",
    "studentName": "Naura Zafira",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 86,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "374571c2-d72b-4609-b0f4-e1fe39949f82",
    "studentId": "beacabdd-33b2-4d0c-a7fa-df2c0b3a0570",
    "studentCode": "23866",
    "studentName": "Hamid Al Irsad",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4ce136e6-0521-42fe-9d12-a4da059b6288",
    "studentId": "c1ccae6d-ae43-4bbf-b539-4c1c96c9c16b",
    "studentCode": "41209",
    "studentName": "Fakhri Al-Ghifari",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "2cc4e9c2-c426-4dcc-b027-a7628c7cc1f8",
    "studentId": "c1ccae6d-ae43-4bbf-b539-4c1c96c9c16b",
    "studentCode": "41209",
    "studentName": "Fakhri Al-Ghifari",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "146a2496-88d2-4302-8f4a-afdb69756c38",
    "studentId": "c3dd210c-9220-4055-b57e-5ced60c906c7",
    "studentCode": "48712",
    "studentName": "Kenzo Alvaro",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 86,
    "note": "Refleks jari turun akurat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d3356f97-e5ed-4cc5-81fd-b90cd5b7e9a1",
    "studentId": "c3dd210c-9220-4055-b57e-5ced60c906c7",
    "studentCode": "48712",
    "studentName": "Kenzo Alvaro",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ab143c53-7ded-46a4-85e0-a1c407355b65",
    "studentId": "c3f5334a-642b-4e05-a980-bbbc4442438b",
    "studentCode": "31996",
    "studentName": "Aira Anatasya Putri",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "43f717c0-7975-4ad3-8a31-8acc0061021b",
    "studentId": "c407aac0-a001-4ce4-8aff-85634e737f3c",
    "studentCode": "86280",
    "studentName": "Arsy Akifa Salsabila",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 88,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "91668587-aadc-49fa-9ca1-3d31d18a48f3",
    "studentId": "c5767e1d-86a4-4fdd-9bb1-f1a64bed4a6f",
    "studentCode": "17366",
    "studentName": "Abizar Rahandika Alghifari",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "7494c3e3-c18e-471c-9518-6629f4fc78fa",
    "studentId": "c76503ff-a1d9-45ee-815e-35e24c8f7c7c",
    "studentCode": "33918",
    "studentName": "Calista Azkadina",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 88,
    "note": "Refleks jari turun akurat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "2606381d-819d-4223-b67c-f460e5e03ade",
    "studentId": "c76503ff-a1d9-45ee-815e-35e24c8f7c7c",
    "studentCode": "33918",
    "studentName": "Calista Azkadina",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e113d49e-9a53-4043-87e0-ed7647de4e67",
    "studentId": "ca9930de-9661-4823-a0e9-29621ef4f208",
    "studentCode": "32460",
    "studentName": "Shaqia Azzahra Rahayu",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 88,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "94d8f550-0e08-4f9c-8c99-8b32941ea1b6",
    "studentId": "cb436508-3a4d-49c9-85c5-636ea9e93e88",
    "studentCode": "89123",
    "studentName": "Citra Kirana",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "196d5d3a-6ae7-4698-939c-434ae840d063",
    "studentId": "ce034bcc-b39d-4fb6-a751-19dbf3371ab2",
    "studentCode": "59012",
    "studentName": "Zahrana Azzahra",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "cd02f5d1-a70a-4eb3-aa69-517dd4db24dd",
    "studentId": "ce034bcc-b39d-4fb6-a751-19dbf3371ab2",
    "studentCode": "59012",
    "studentName": "Zahrana Azzahra",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "da058109-4ada-4993-9a55-de94af07c3b4",
    "studentId": "cea06363-69e7-47b6-9f47-1a7716561f7d",
    "studentCode": "65603",
    "studentName": "Aqila Fahmida",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 83,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5cc756a4-493f-439a-aad1-fd2f5f0f2c9e",
    "studentId": "cf26ab88-2a73-4162-8b55-810b69acb071",
    "studentCode": "35955",
    "studentName": "Abyan Azka Abdillah",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "59b2476a-8d07-4a55-8a7f-deb23c88df45",
    "studentId": "d0eaf62d-32db-4518-9ba9-35183a533bef",
    "studentCode": "88692",
    "studentName": "Arasely Naura Shada",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5b13eda6-13f0-43f8-94ed-45bcaa604364",
    "studentId": "d5730b58-7251-402b-9059-cc8a9047dc2e",
    "studentCode": "13042",
    "studentName": "Zian Abdi Pratama ",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 87,
    "note": "Refleks jari turun akurat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "1502c80f-e010-4ad0-9530-187b46a86ad5",
    "studentId": "d5730b58-7251-402b-9059-cc8a9047dc2e",
    "studentCode": "13042",
    "studentName": "Zian Abdi Pratama ",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d94a2945-0128-4070-9ab0-3005d11af115",
    "studentId": "d59d6d2c-166e-4f78-85f0-f3c346278122",
    "studentCode": "69413",
    "studentName": "Zafran Rafisqi",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "eca6874b-cc7e-4359-b64a-5dc6e0539ea0",
    "studentId": "d6be9a6d-26fa-43ac-a80a-6ee5f30b80b4",
    "studentCode": "95452",
    "studentName": "Ananta Virya",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "cd1caf29-0ac3-4a2b-8d69-ed8402d757db",
    "studentId": "d8340cb1-f138-425b-84ee-080de2586ece",
    "studentCode": "77435",
    "studentName": "Geofanny Gareos  P.K.B",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "1f840b5d-0abe-4500-a9f4-3b84c6b2b520",
    "studentId": "d83505ed-0060-453a-9689-4dbf49f87bb8",
    "studentCode": "81124",
    "studentName": "Abrisam",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 87,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4590522f-e236-405d-aa1c-836a6f953028",
    "studentId": "d8d8fd71-2a09-4ee9-8bab-723d01afcce5",
    "studentCode": "47603",
    "studentName": "Yusuf Syauqy Syahid",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 85,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "67359919-6789-4c3a-ab85-d240a37df0bc",
    "studentId": "db3d66d8-d162-4032-a6df-cb222d521c53",
    "studentCode": "44789",
    "studentName": "Maulana Syarif Wardhani",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 89,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a25c92cb-9246-4fba-89f7-c1f40484eb90",
    "studentId": "dd652c0e-1633-4495-8ff4-16c4cacc3ffc",
    "studentCode": "22134",
    "studentName": "Tiara Andini",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3ff6b884-5316-4b36-ae6f-c96acca7168c",
    "studentId": "dec5e211-a360-4207-83fb-9771011fab2f",
    "studentCode": "10409",
    "studentName": "Sarah ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f2419c42-7bd7-4644-8116-b2b527cae6c4",
    "studentId": "dec5e211-a360-4207-83fb-9771011fab2f",
    "studentCode": "10409",
    "studentName": "Sarah ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 88,
    "note": "Refleks jari turun akurat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "707ffadf-e6eb-43d7-a4e7-ae3c64ed0ac4",
    "studentId": "e02583be-1443-414b-a37c-90e612bcd317",
    "studentCode": "61022",
    "studentName": "Bagas Pratama Putra",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "7d79b304-d81d-4d87-a90c-c1c2357cacad",
    "studentId": "e02583be-1443-414b-a37c-90e612bcd317",
    "studentCode": "61022",
    "studentName": "Bagas Pratama Putra",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ea3634e8-2974-45d0-b841-9c7c34120fec",
    "studentId": "e08d4e8d-5858-4762-af6b-dfe5ff031bb9",
    "studentCode": "78564",
    "studentName": "Alesha Rafani Marta",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d19d63f8-1412-46c8-9475-e38558564f35",
    "studentId": "e0f01c5d-a021-45d7-9828-102cb091a16d",
    "studentCode": "13846",
    "studentName": "Musyaffa' ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "86974f12-c8b3-4ccf-9b3f-7a1de4f664be",
    "studentId": "e0f01c5d-a021-45d7-9828-102cb091a16d",
    "studentCode": "13846",
    "studentName": "Musyaffa' ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 87,
    "note": "Refleks jari turun akurat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a8bb363a-46ea-4daf-9f92-affa1651ac9b",
    "studentId": "e8375491-10a6-4a3e-a632-733721808900",
    "studentCode": "68766",
    "studentName": "Kristian Naibaho",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 88,
    "note": "Refleks jari turun akurat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "bf67bd34-f9eb-42af-acf2-282703e356b5",
    "studentId": "e8375491-10a6-4a3e-a632-733721808900",
    "studentCode": "68766",
    "studentName": "Kristian Naibaho",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ec2dec08-8c5c-4a3a-84fb-427c21a84963",
    "studentId": "edfa74c0-7a6c-421e-b5a3-142f80563a3c",
    "studentCode": "34581",
    "studentName": "Dzakiyyah Al Fajri",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "eda59134-9390-41d9-bba2-1a1c01e0f85e",
    "studentId": "edfa74c0-7a6c-421e-b5a3-142f80563a3c",
    "studentCode": "34581",
    "studentName": "Dzakiyyah Al Fajri",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 85,
    "note": "Refleks jari turun akurat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0b460118-4d16-4fdc-8059-146b5c8f55c4",
    "studentId": "ee84a828-abc0-41c5-9ead-d79ff2056910",
    "studentCode": "96166",
    "studentName": "Ayunda Shela Ferlita ",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "03ad60cc-99ca-4c9e-bf1b-583813c8e55a",
    "studentId": "f20782b9-17ab-40f2-b315-7ad3aadc2739",
    "studentCode": "62901",
    "studentName": "Syakira Nur Aini",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "08017802-bc9f-428a-82c0-636ff370fb73",
    "studentId": "f20782b9-17ab-40f2-b315-7ad3aadc2739",
    "studentCode": "62901",
    "studentName": "Syakira Nur Aini",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 85,
    "note": "Refleks jari turun akurat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8cbc0c25-2312-479e-9ad4-e641ef0d135f",
    "studentId": "f2dcf39c-3131-497a-bce7-996dbeff9d62",
    "studentCode": "68933",
    "studentName": "Abizar Rahandika Alghifari",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 88,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "78dbef81-0a7c-404e-a75a-2c6c3549a575",
    "studentId": "f5269115-d04f-4424-9bbc-ffbf35974aca",
    "studentCode": "79805",
    "studentName": "M. Razka Raffasya",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 83,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f347112b-a671-45c3-9c6b-79902cf4d0a8",
    "studentId": "f552cd7d-a33f-441a-b8f2-f529514df6ed",
    "studentCode": "77599",
    "studentName": "Aida Syafira N.A",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 84,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6457e0c2-498b-44fa-aa5d-abbb2fc41b3b",
    "studentId": "f8916605-5eff-48c0-bd51-8301e015b855",
    "studentCode": "59847",
    "studentName": "Haris ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "cf972e2e-be81-4a5b-8ffe-5f90644f8f59",
    "studentId": "f8916605-5eff-48c0-bd51-8301e015b855",
    "studentCode": "59847",
    "studentName": "Haris ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d30eaa73-6a74-48dd-a46c-4292a7b2f383",
    "studentId": "f9ce8b07-5738-4c29-8ecc-048807666d4c",
    "studentCode": "61298",
    "studentName": "Dimas Arya Sena",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan Kombinasi 5 (+4, +3)",
    "examDate": "2026-09-06",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "053a5582-e4dd-4ce9-8bed-09b72aa892d2",
    "studentId": "f9ce8b07-5738-4c29-8ecc-048807666d4c",
    "studentCode": "61298",
    "studentName": "Dimas Arya Sena",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Pengurangan (jari turun)",
    "examDate": "2026-09-06",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "52a06983-dc17-442b-9181-34a95b4f18c7",
    "studentId": "faf6d016-09db-47f7-88c1-93f2ba67a241",
    "studentCode": "66178",
    "studentName": "Prabu Wijaya",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 84,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "11770eff-6e91-4146-a29d-24690c45dfa2",
    "studentId": "fd6da340-cbd8-44e9-8d93-e97e51cbbe4d",
    "studentCode": "89919",
    "studentName": "Felisha Amara Gina",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 83,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6b5a369a-4ff4-4e3b-b88f-ff25cbbbc91a",
    "studentId": "ffdc0d9b-af62-4250-b6f4-b561bdda627f",
    "studentCode": "80218",
    "studentName": "Nurul Hasna Maulidyah",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d121717c-68b8-4049-8b0d-6ad6807f8f26",
    "studentId": "001f391b-660f-46f6-a82e-d59a0bb45700",
    "studentCode": "86254",
    "studentName": "Raditya Riski Ramadhan ",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 86,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "9f84d06c-39fb-4bb4-b734-1746eeb7c220",
    "studentId": "04796f1c-9a95-475e-a8db-b8fd605ae5ad",
    "studentCode": "76123",
    "studentName": "Bima Sakti",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 82,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "923c8a88-cbf8-41e6-a934-37d7f4ce66c2",
    "studentId": "0f0efef9-eda5-4673-a26b-4007603410a3",
    "studentCode": "83063",
    "studentName": "Nayyara Febi Anjani",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 81,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3f2c4c33-0b68-42eb-8cce-c573f42a8ee1",
    "studentId": "10451ac4-1e41-430d-b17d-01de8a19261e",
    "studentCode": "64628",
    "studentName": "Qintara Izatunnisya",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 87,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "97a3aba6-5961-4f74-baf6-e85f52b9643d",
    "studentId": "11a3901e-dae9-4902-a89e-578810a8fbad",
    "studentCode": "98124",
    "studentName": "Dzakiandra Putra",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 88,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "132b73f8-d36c-49ba-b8e9-50859153b8cf",
    "studentId": "15de4d83-1d1b-4042-9bb4-9fdc65db1d3c",
    "studentCode": "67123",
    "studentName": "Hafiz Al-Faruq",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5ed4edec-cc49-4b6d-981c-6e358a411844",
    "studentId": "16d71476-7ec9-483a-a2b0-f1e9de3ade83",
    "studentCode": "65934",
    "studentName": "Rahajeng Ayu Kinanti",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "67103322-14d6-4bdf-9553-7849e2723645",
    "studentId": "16f42f89-5c09-4b2b-9e8a-d01f7f275727",
    "studentCode": "18032",
    "studentName": "Areasely Naura Shada",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c689926f-5321-4bb4-b884-474714994128",
    "studentId": "17a21047-a092-4964-a396-ea778093f34d",
    "studentCode": "52651",
    "studentName": "Ainan Nuri Sumayah",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f38b8b49-3f6f-42ba-a62d-d0a5bf03e7a6",
    "studentId": "1d157032-9563-4b12-933f-f45078bd1646",
    "studentCode": "38910",
    "studentName": "Nabila Putri Ramadhani",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d762998c-e7cf-421c-9209-6165e474a7cc",
    "studentId": "1e8d5ed6-e5b1-474e-8b64-24633476b6f9",
    "studentCode": "95219",
    "studentName": "Viola Alesha Ganes",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 82,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "54d325eb-528d-47f4-bb1b-a9d8357d5386",
    "studentId": "1eecdd5c-da28-4078-a890-b2abe0ebfc9d",
    "studentCode": "49625",
    "studentName": "Amara Alifah Fauziah",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 83,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3b04254f-1383-4503-a811-2683a8f01af8",
    "studentId": "20f9a9ba-13c7-4650-a900-61abd09ea07a",
    "studentCode": "22000",
    "studentName": "M. Hannan Habibillah",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "88ce6b63-4a2b-4eac-9b57-3e6d2297f43b",
    "studentId": "216e8e11-446a-46bd-8641-893961f9462f",
    "studentCode": "66787",
    "studentName": "Anindita Keisha Zahra",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 88,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "407861f2-b142-48be-a8f1-62116a083a88",
    "studentId": "239abe9a-3759-4677-be68-aa5f1ed2796c",
    "studentCode": "66538",
    "studentName": "Ananta Virya",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 81,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "fa20db09-dd3b-468e-996c-4a90a72f7028",
    "studentId": "256ccdc6-5f78-4ce1-894e-4e6f8ee4800a",
    "studentCode": "33145",
    "studentName": "Syafiq Athallah",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 83,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e2c4f7c1-8f3b-4c36-a102-329fae9a2e09",
    "studentId": "2643a6e6-fcc0-4c9f-81b1-db1d116e37cd",
    "studentCode": "89050",
    "studentName": "Arsyila Nasha Razita",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b0f05b42-353b-4f27-970c-44465807dd1a",
    "studentId": "296a8d0a-9549-4f1a-b529-76eb203d8407",
    "studentCode": "24265",
    "studentName": "Rayendra Azzan Pramana",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a6f8c990-c552-4ea2-9878-896e7a3821f4",
    "studentId": "2ca10889-b780-4660-8022-c1b1a23d5ce2",
    "studentCode": "97375",
    "studentName": "Dzakiyyah Al Fajri ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "617ea25e-0d92-4c20-be77-cb0c00585fd2",
    "studentId": "31486b62-e24d-4ded-a892-c9be9a9b68c3",
    "studentCode": "56840",
    "studentName": "Afrial Arsenio",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 81,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f53b2dfa-165b-4232-a442-c2369acda1f9",
    "studentId": "32dad6a6-6729-4aed-a91c-885e1b685e4c",
    "studentCode": "21117",
    "studentName": "Natasya Elfani Alkhomah",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 83,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a5c65c57-3d73-4d89-8f8a-bb94ba4554ad",
    "studentId": "34f39374-825b-4c3e-8f5d-1e60dd92a722",
    "studentCode": "78700",
    "studentName": "M. Bintang Hisyam Naufal",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 82,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b43521b1-564f-419b-a704-f27bccc6e8ad",
    "studentId": "352a42af-0c46-4373-9ac4-69a5282da28c",
    "studentCode": "21446",
    "studentName": "Ghumaisha",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "cd6019d7-d53e-453f-ac56-7e40ef2120ff",
    "studentId": "3989a228-cdd0-456b-aa91-b9be32522cb5",
    "studentCode": "31290",
    "studentName": "Daniswara Rizky",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 81,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "cafd5d56-a6a5-4e9a-9ec5-3f726c6dc3f2",
    "studentId": "3d378546-ea52-4a13-8235-8ca01bf9c218",
    "studentCode": "53421",
    "studentName": "Nayla Khairunnisa",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "9306cf7e-56be-4703-bb3d-ed717ece259e",
    "studentId": "452fe4ee-e4c6-4e63-a83d-9f0829085e88",
    "studentCode": "65103",
    "studentName": "Najwa Khaira Wilda",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 84,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "dd034251-777b-43cb-97db-e3acdefd5be9",
    "studentId": "48721968-d3f2-4319-92be-7a5e972c106b",
    "studentCode": "55866",
    "studentName": "Bilqis Ufairah",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "dcda8213-9f41-4670-997e-200b5c810a2b",
    "studentId": "4964c094-f258-4fcb-94ed-1619344d0377",
    "studentCode": "47440",
    "studentName": "Najwa Alarifah",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "222acbc1-d713-4030-88f0-55de409d653b",
    "studentId": "497ef1bb-d078-42af-a596-85d9d8c60bf0",
    "studentCode": "99133",
    "studentName": "Arsyila Nasha Razita",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f9155922-c206-4a4a-bb9e-3173373f7c23",
    "studentId": "4c5462b2-a318-45de-8ffd-293df12e4334",
    "studentCode": "40736",
    "studentName": "Aira Anatasya Putri",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "cf3e6a0d-99bb-4ae3-a487-7ffdbb59b50f",
    "studentId": "4fae6a4c-8c08-4351-bb25-71e9db2e4ecb",
    "studentCode": "17055",
    "studentName": "Anandira Dyah Asmara Wati",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "2e9755bb-4829-44ef-90a6-8b50a3c354c7",
    "studentId": "50d53115-8f00-40eb-90b0-1de731665ec4",
    "studentCode": "71940",
    "studentName": "Mahera Aiza Hilya",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 86,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c189adcf-a5b1-4320-bc13-88b7a7d92d86",
    "studentId": "51f2f51b-16db-42bc-8e24-c12e01e57977",
    "studentCode": "65815",
    "studentName": "Alesha Rafani Marta",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 84,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "16598575-c643-4fcb-b767-efe6bf4133e1",
    "studentId": "5467d797-c061-4a6f-b981-86af0829951d",
    "studentCode": "43210",
    "studentName": "Luthfi Hakim",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "19a136d0-8688-4b32-baf9-b23e5ce4f834",
    "studentId": "55e4f383-8f7f-43aa-ab5b-bf31aaa02b29",
    "studentCode": "77364",
    "studentName": "M. Fahrul Al Khafid",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 81,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "99a8885b-e71f-4ced-a39c-74ff9cc2cc6a",
    "studentId": "5831e4e4-ad30-43d7-a4d5-a11dd3b46508",
    "studentCode": "57508",
    "studentName": "Raffasya Abizar Raqilla",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 85,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "1ea525d3-126d-4a71-8f76-efd0985a56b8",
    "studentId": "58a9b1e8-fe4b-4471-8ddc-05548604fe49",
    "studentCode": "67358",
    "studentName": "Nayla Inara Putri",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 89,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "2acd5078-bc2d-48ef-b083-7494b5f7695f",
    "studentId": "590ba72b-cae9-4773-9863-ac46b48e4eb1",
    "studentCode": "91212",
    "studentName": "Ajeng Cahyra Naifasha",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 85,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "37ac541e-128b-4ac3-a3f6-d3135dc4469b",
    "studentId": "5a5302cf-3115-45c1-ae89-20208f8bd5f5",
    "studentCode": "81234",
    "studentName": "Keysha Anindya",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "93a3a3c6-aa8e-4896-bab8-98e5c2f6a6ee",
    "studentId": "5c74b85c-f840-4649-ab72-e572843d8848",
    "studentCode": "29797",
    "studentName": "Aqila Fahmida",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 87,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "1a93e47e-c263-4479-894f-4894366eddd7",
    "studentId": "5f15914c-65c0-4824-8170-2bc66288ae8d",
    "studentCode": "12232",
    "studentName": "Nathania Azkadina Farzana",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4772d304-60de-4599-abf0-3b4cf79965e0",
    "studentId": "5f779113-fdc7-4393-8537-b28f76db27a9",
    "studentCode": "44512",
    "studentName": "Raisya Salsabila",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c3e10903-3873-492c-8201-0561c6e0448b",
    "studentId": "64dd1749-efcb-40c0-97e6-a30d772e50e0",
    "studentCode": "72190",
    "studentName": "Rayhan Pratama",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "25c531ab-ae04-459d-bb02-c0ddd96e5b2d",
    "studentId": "657f7d55-4398-4d8e-a44d-1f6eb84a61c0",
    "studentCode": "30400",
    "studentName": "Shofiyah ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "88a18898-47aa-4a36-9c17-9cccaefeebd4",
    "studentId": "68d5295b-bde7-4391-bab3-68255dcee983",
    "studentCode": "78123",
    "studentName": "Gladis Anindita",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "56b18b0d-9ccc-428a-a31f-f063e14d8f9a",
    "studentId": "68d57e75-a2d2-4251-b6a7-541c3bc9c15d",
    "studentCode": "66458",
    "studentName": "Adeeva Afsheen Myesha",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 89,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "12992312-c562-4a5c-a0cb-39c0494638db",
    "studentId": "6c51a4cb-002b-4b1f-a757-d0920e3043d9",
    "studentCode": "86190",
    "studentName": "EL FIRQOTUN AN NAJIYAH",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a6d0571a-8908-4b21-b7c8-04b1100d1146",
    "studentId": "6c55f895-276b-4955-ab24-223af3c42bea",
    "studentCode": "67890",
    "studentName": "Fathir Ahmad",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 87,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5e1fda7e-0dd7-4ef3-b57f-0a23dfecb33f",
    "studentId": "6d947da3-e268-4b69-ab42-820c9b48132e",
    "studentCode": "70553",
    "studentName": "Shaqia Azzahra Rahayu",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0d093c33-2fa7-4675-9cbd-cd5ceaec5baf",
    "studentId": "6f029f4e-d64a-4e54-a105-915d6be1e055",
    "studentCode": "79679",
    "studentName": "Nashwa Zahira Fahrefi ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "978bd6dd-afe2-4073-a57a-e622704400c6",
    "studentId": "700c0ee2-035a-4a13-bdba-e806864acd95",
    "studentCode": "31144",
    "studentName": "Uwais",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "990ec1ef-4f5d-4ab9-a276-81a6ceb22012",
    "studentId": "7169f097-8bf5-40dd-934e-0f5460261c04",
    "studentCode": "20080",
    "studentName": "M. Hannan Habibillah",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 88,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "16a35a29-a449-479a-9b0e-8d143bcd9fee",
    "studentId": "7263e6e3-a667-4f35-82e4-90cd8b59b2b8",
    "studentCode": "66469",
    "studentName": "Abrisam",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "1b741b13-4af4-497c-9b88-37b38d87c8fb",
    "studentId": "746c4af0-24e7-44b9-b255-256bc96cd47d",
    "studentCode": "84072",
    "studentName": "Ajeng Chaira Naifasha",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c115b291-1d8e-44df-b47c-095625f1af71",
    "studentId": "75075ab4-09b7-4059-8b60-561f8ea52ebe",
    "studentCode": "11653",
    "studentName": "Zulfan Azhar Raihan",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "70302c81-5573-491a-843c-af0f73be329c",
    "studentId": "7c900a4b-3261-46f2-9990-e54fbc729e3d",
    "studentCode": "38952",
    "studentName": "Kheyra Candra ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c1c2cb15-f505-4fe1-83b5-fed615c74458",
    "studentId": "873cf03f-d94e-41c1-a8d8-44ea933c1d93",
    "studentCode": "93060",
    "studentName": "Arka Prapta Ardani",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "daec837d-02a5-471a-b747-1b02b9477bb0",
    "studentId": "8e4bf798-43a8-4def-ad68-252c3035dd84",
    "studentCode": "43183",
    "studentName": "Habib Fadhil Abidin",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 85,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "573b609b-0135-4454-ae97-de7fb0ef7e74",
    "studentId": "8f01e65d-d43c-4d38-8e10-16f48712cffe",
    "studentCode": "14999",
    "studentName": "Adeeva Afsheen Myesha",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 82,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ce8082c8-cdbb-4cc5-81af-dc2a4cbfe36d",
    "studentId": "90d546d9-0f7c-4cdf-8351-5e854cce406c",
    "studentCode": "17246",
    "studentName": "Haris",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3a21310b-1123-4e91-8d33-f95905efd2fe",
    "studentId": "92d33126-0c86-4472-8a43-01098bf61c00",
    "studentCode": "95701",
    "studentName": "Azila Quira Zulda",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c909750d-088f-4187-a77b-be1c91662e3e",
    "studentId": "96bd8abf-ce5e-42c0-8a3f-4d7549f8a2e9",
    "studentCode": "57782",
    "studentName": "Muwaffaq ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b13f369a-7ad6-49e7-9446-7d8f7ffe70aa",
    "studentId": "981d918a-8b29-4b3f-b7e7-7d0baedae5b6",
    "studentCode": "15367",
    "studentName": "Aida Syafira N.A",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 87,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "eda62422-10c7-4e00-8e65-3ebe97de1aab",
    "studentId": "98a69eaa-3d7a-4363-9958-755501175aee",
    "studentCode": "11687",
    "studentName": "Yusuf Alfarizky Sugara",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 89,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "dffbc898-7b46-4dfe-9052-ccebdee6faf4",
    "studentId": "9997dcfe-ef86-40c4-a197-f1e968484719",
    "studentCode": "70066",
    "studentName": "M. Rafa Raditia",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0d763c4e-e38f-4c88-af39-b5cac167ea33",
    "studentId": "9ae2069c-c732-4461-ae86-f18cffca1178",
    "studentCode": "45237",
    "studentName": "Arka Prapdipta Ardani",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 85,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "591ef4ad-c351-4f81-acf9-e79abb6ea33a",
    "studentId": "9c48106c-acd2-4a23-8ac3-543d94de143d",
    "studentCode": "50999",
    "studentName": "Abdan Zulfadli Fahyan",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "bed8b4ca-c2ce-4d32-948f-bbbf997a7cfb",
    "studentId": "9d9977fb-1a91-47b4-99df-288cc648d437",
    "studentCode": "55148",
    "studentName": "M. Hafizhan Khairan ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "df8fe9bf-d7c1-404b-bd40-bc9e33933d1a",
    "studentId": "9e1eea3b-215f-41c6-b662-89e0f7bbac6a",
    "studentCode": "48291",
    "studentName": "Haura",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 84,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "7e196486-bc45-4e28-87b6-3bd595976e82",
    "studentId": "9f60be52-54d6-41df-a0b8-f1de43bbd7f7",
    "studentCode": "74789",
    "studentName": "M. Dhaffa Athallah",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 89,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "380621e3-8a1d-44b5-b12f-2d75aa3e69b7",
    "studentId": "a32a3e2b-2898-4a12-a20f-a2cb15c3ca22",
    "studentCode": "10650",
    "studentName": "Aishwa Rahma Annida",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "2b65152a-35de-4dc3-ae06-57c7eef95aa9",
    "studentId": "a6c9d744-dcac-4377-b0a0-0d2a140c1257",
    "studentCode": "44156",
    "studentName": "Rafa Al-Ghifari",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b27a4d11-e539-40e2-8b08-6e8246b3da9b",
    "studentId": "aa3fff59-d27e-4851-a660-ceaf1d8e9ade",
    "studentCode": "90123",
    "studentName": "Muhammad Azka",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8de554a4-30e1-4604-a1d1-e424f469c7b2",
    "studentId": "ac9180e4-fedf-4941-b3c7-ca9cda665d88",
    "studentCode": "79000",
    "studentName": "Aishwa Rahma Annida",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "fe5c7024-0d54-4706-87f0-03c0511af5af",
    "studentId": "ade8738b-9e7a-4b56-9de7-169e74e714c1",
    "studentCode": "93231",
    "studentName": "Ghumaisha  ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b4b447a0-5fe6-499c-9bec-81afd67471d0",
    "studentId": "ae6f604a-c5a1-48a0-a65c-776edc69b777",
    "studentCode": "54321",
    "studentName": "Kevin Pratama",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 83,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0999df6e-85e5-4c45-8a6f-c2a3f1c5169e",
    "studentId": "afff798e-f6eb-4730-883b-cebf7ee93880",
    "studentCode": "41984",
    "studentName": "Asheqa Shaqueena Qotrunada",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 83,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0e4c2e55-cb95-4640-b5db-2f95717dace0",
    "studentId": "b0655f2e-a8c9-4320-9ad7-1e85f7e120ce",
    "studentCode": "88190",
    "studentName": "M. Rayyan Al-Fatih",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 87,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "34778d86-9419-46f8-909c-ebb957f3c140",
    "studentId": "b252f9f5-a288-433f-9ad7-ac52dbb7a9a7",
    "studentCode": "52809",
    "studentName": "Anandira Dyah Asmarawati",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 82,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d81820e9-5ce0-48b5-9afd-a90586efdb41",
    "studentId": "b42ef79c-f9c9-4972-8f36-525ec014240e",
    "studentCode": "51380",
    "studentName": "Maulana Syarif Wardani",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f4a59dee-054d-44e6-9ca4-b99e2875f2dc",
    "studentId": "bb043228-0521-4772-8409-ffb114dea44d",
    "studentCode": "77189",
    "studentName": "Naura Zafira",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 82,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "66332b6f-a932-4403-8ad5-5343d954e458",
    "studentId": "beacabdd-33b2-4d0c-a7fa-df2c0b3a0570",
    "studentCode": "23866",
    "studentName": "Hamid Al Irsad",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8d93ca59-5f00-4489-a464-34b215ad1379",
    "studentId": "c1ccae6d-ae43-4bbf-b539-4c1c96c9c16b",
    "studentCode": "41209",
    "studentName": "Fakhri Al-Ghifari",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d6d9e68d-bd0a-4bc2-b87c-926b924e129e",
    "studentId": "c3dd210c-9220-4055-b57e-5ced60c906c7",
    "studentCode": "48712",
    "studentName": "Kenzo Alvaro",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "7a9b5667-12c8-4e27-9691-3bbf722bc69b",
    "studentId": "c3f5334a-642b-4e05-a980-bbbc4442438b",
    "studentCode": "31996",
    "studentName": "Aira Anatasya Putri",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 86,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ba91f9fc-b079-4811-9653-b3afeda5469e",
    "studentId": "c407aac0-a001-4ce4-8aff-85634e737f3c",
    "studentCode": "86280",
    "studentName": "Arsy Akifa Salsabila",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 84,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "57b027fe-7b68-42f9-ba02-514b9c4bdc6a",
    "studentId": "c5767e1d-86a4-4fdd-9bb1-f1a64bed4a6f",
    "studentCode": "17366",
    "studentName": "Abizar Rahandika Alghifari",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0f52ad05-46f2-4bcf-ae07-6face779068a",
    "studentId": "c76503ff-a1d9-45ee-815e-35e24c8f7c7c",
    "studentCode": "33918",
    "studentName": "Calista Azkadina",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "73abe8c5-9ee3-44c3-94b7-6489b0fcf944",
    "studentId": "ca9930de-9661-4823-a0e9-29621ef4f208",
    "studentCode": "32460",
    "studentName": "Shaqia Azzahra Rahayu",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 84,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "9c2befb0-b086-410c-a535-dafefe09fe53",
    "studentId": "cb436508-3a4d-49c9-85c5-636ea9e93e88",
    "studentCode": "89123",
    "studentName": "Citra Kirana",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 89,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d05b1205-b4be-47db-a94c-4fdc111657f4",
    "studentId": "ce034bcc-b39d-4fb6-a751-19dbf3371ab2",
    "studentCode": "59012",
    "studentName": "Zahrana Azzahra",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ad164e52-e77a-4865-a937-1b2f4581aa0d",
    "studentId": "cea06363-69e7-47b6-9f47-1a7716561f7d",
    "studentCode": "65603",
    "studentName": "Aqila Fahmida",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "69703f5d-8c05-4242-9022-aee5a0cad51f",
    "studentId": "cf26ab88-2a73-4162-8b55-810b69acb071",
    "studentCode": "35955",
    "studentName": "Abyan Azka Abdillah",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d8f9e1d6-4715-4f31-b2dc-1179653607da",
    "studentId": "d0eaf62d-32db-4518-9ba9-35183a533bef",
    "studentCode": "88692",
    "studentName": "Arasely Naura Shada",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 86,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "66f9ee0c-82db-49f3-9377-3262a5d9ae11",
    "studentId": "d5730b58-7251-402b-9059-cc8a9047dc2e",
    "studentCode": "13042",
    "studentName": "Zian Abdi Pratama ",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4e8110ea-edd2-40d6-859b-1ce46c18aaeb",
    "studentId": "d59d6d2c-166e-4f78-85f0-f3c346278122",
    "studentCode": "69413",
    "studentName": "Zafran Rafisqi",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 88,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "11cfa1b8-c1e2-4ec1-99b0-401b9bca93ca",
    "studentId": "d6be9a6d-26fa-43ac-a80a-6ee5f30b80b4",
    "studentCode": "95452",
    "studentName": "Ananta Virya",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 89,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5a80b527-2d57-4f67-9ad7-98f77470bc5f",
    "studentId": "d8340cb1-f138-425b-84ee-080de2586ece",
    "studentCode": "77435",
    "studentName": "Geofanny Gareos  P.K.B",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 86,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8b1ebc8f-6e60-4291-a6f4-2f44c655e4d4",
    "studentId": "d83505ed-0060-453a-9689-4dbf49f87bb8",
    "studentCode": "81124",
    "studentName": "Abrisam",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 83,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d7709612-cee5-42fb-9823-a0a67ec3c2d5",
    "studentId": "d8d8fd71-2a09-4ee9-8bab-723d01afcce5",
    "studentCode": "47603",
    "studentName": "Yusuf Syauqy Syahid",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 81,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ce3442ea-2aaa-4503-8e41-9aeaed8afdc8",
    "studentId": "db3d66d8-d162-4032-a6df-cb222d521c53",
    "studentCode": "44789",
    "studentName": "Maulana Syarif Wardhani",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 85,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "07fd307c-071f-4ccb-a143-ce719a1f26e0",
    "studentId": "dd652c0e-1633-4495-8ff4-16c4cacc3ffc",
    "studentCode": "22134",
    "studentName": "Tiara Andini",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8058aec8-2e67-470f-a923-603fc32520ed",
    "studentId": "dec5e211-a360-4207-83fb-9771011fab2f",
    "studentCode": "10409",
    "studentName": "Sarah ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4b3a94fc-9990-4146-a45f-849894e5363e",
    "studentId": "e02583be-1443-414b-a37c-90e612bcd317",
    "studentCode": "61022",
    "studentName": "Bagas Pratama Putra",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "36fc3b1a-6034-4ecf-a5d8-9590c5a3f6b2",
    "studentId": "e08d4e8d-5858-4762-af6b-dfe5ff031bb9",
    "studentCode": "78564",
    "studentName": "Alesha Rafani Marta",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f504935e-ab93-47c3-a2c6-8be221805e2c",
    "studentId": "e0f01c5d-a021-45d7-9828-102cb091a16d",
    "studentCode": "13846",
    "studentName": "Musyaffa' ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d7fd0fe4-0ce0-4d44-acd8-bc7944e1cc22",
    "studentId": "e8375491-10a6-4a3e-a632-733721808900",
    "studentCode": "68766",
    "studentName": "Kristian Naibaho",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c9e08ec2-7932-46b9-bcd6-e4501abccdf7",
    "studentId": "edfa74c0-7a6c-421e-b5a3-142f80563a3c",
    "studentCode": "34581",
    "studentName": "Dzakiyyah Al Fajri",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "67fef65f-ef76-4a6b-9a43-f78283efe230",
    "studentId": "ee84a828-abc0-41c5-9ead-d79ff2056910",
    "studentCode": "96166",
    "studentName": "Ayunda Shela Ferlita ",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a642bba5-9a8a-44a5-b7a6-ac2dd53a398f",
    "studentId": "f20782b9-17ab-40f2-b315-7ad3aadc2739",
    "studentCode": "62901",
    "studentName": "Syakira Nur Aini",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "19852b0c-9714-4e24-bcb1-6d33032591ff",
    "studentId": "f2dcf39c-3131-497a-bce7-996dbeff9d62",
    "studentCode": "68933",
    "studentName": "Abizar Rahandika Alghifari",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 84,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "2049952d-e8ae-4a13-ae21-3d52cc5fa3cb",
    "studentId": "f5269115-d04f-4424-9bbc-ffbf35974aca",
    "studentCode": "79805",
    "studentName": "M. Razka Raffasya",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "47164657-ddb0-4e1d-b870-e10a31947280",
    "studentId": "f552cd7d-a33f-441a-b8f2-f529514df6ed",
    "studentCode": "77599",
    "studentName": "Aida Syafira N.A",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c1ea0988-658e-4e0a-b1d1-cde9adb33a64",
    "studentId": "f8916605-5eff-48c0-bd51-8301e015b855",
    "studentCode": "59847",
    "studentName": "Haris ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "9c2dd452-172c-480a-9bf6-6868c5eb800e",
    "studentId": "f9ce8b07-5738-4c29-8ecc-048807666d4c",
    "studentCode": "61298",
    "studentName": "Dimas Arya Sena",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Math card game",
    "examDate": "2026-09-13",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "95a41b39-2ce5-4182-a84b-3c9fa5654405",
    "studentId": "faf6d016-09db-47f7-88c1-93f2ba67a241",
    "studentCode": "66178",
    "studentName": "Prabu Wijaya",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "9deb55d9-4244-4702-a719-c7be7a8088af",
    "studentId": "fd6da340-cbd8-44e9-8d93-e97e51cbbe4d",
    "studentCode": "89919",
    "studentName": "Felisha Amara Gina",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "66f2f849-11a9-41bc-b3c8-2b0e23feeb49",
    "studentId": "ffdc0d9b-af62-4250-b6f4-b561bdda627f",
    "studentCode": "80218",
    "studentName": "Nurul Hasna Maulidyah",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 88,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "83b29244-32e1-410f-81d0-3393dd1388ff",
    "studentId": "001f391b-660f-46f6-a82e-d59a0bb45700",
    "studentCode": "86254",
    "studentName": "Raditya Riski Ramadhan ",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b550b90b-7faa-42ff-a34b-40f766987fac",
    "studentId": "04796f1c-9a95-475e-a8db-b8fd605ae5ad",
    "studentCode": "76123",
    "studentName": "Bima Sakti",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0942b925-d103-4076-b848-5f275f5f3585",
    "studentId": "0f0efef9-eda5-4673-a26b-4007603410a3",
    "studentCode": "83063",
    "studentName": "Nayyara Febi Anjani",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 89,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "38d9c6e6-61ef-47bb-90d3-b9ea7090b6b8",
    "studentId": "10451ac4-1e41-430d-b17d-01de8a19261e",
    "studentCode": "64628",
    "studentName": "Qintara Izatunnisya",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c0dfe997-f6bc-4df3-be5a-15e1c857b00c",
    "studentId": "11a3901e-dae9-4902-a89e-578810a8fbad",
    "studentCode": "98124",
    "studentName": "Dzakiandra Putra",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "cfb8c2bd-72f3-456d-a8c6-764fcd32142a",
    "studentId": "16d71476-7ec9-483a-a2b0-f1e9de3ade83",
    "studentCode": "65934",
    "studentName": "Rahajeng Ayu Kinanti",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 85,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8c8475f4-c4d9-4230-9b93-9850b97cf64c",
    "studentId": "16f42f89-5c09-4b2b-9e8a-d01f7f275727",
    "studentCode": "18032",
    "studentName": "Areasely Naura Shada",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 86,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "76df0856-fc88-4151-8cea-65282c4d3516",
    "studentId": "17a21047-a092-4964-a396-ea778093f34d",
    "studentCode": "52651",
    "studentName": "Ainan Nuri Sumayah",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 87,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "40f9703d-c862-4c9f-a29e-8a0b4d402be0",
    "studentId": "1e8d5ed6-e5b1-474e-8b64-24633476b6f9",
    "studentCode": "95219",
    "studentName": "Viola Alesha Ganes",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "92729b2f-8614-4e78-ac57-3a7541514307",
    "studentId": "1eecdd5c-da28-4078-a890-b2abe0ebfc9d",
    "studentCode": "49625",
    "studentName": "Amara Alifah Fauziah",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "647d32ca-2186-42e7-ac66-9c8cbda26796",
    "studentId": "216e8e11-446a-46bd-8641-893961f9462f",
    "studentCode": "66787",
    "studentName": "Anindita Keisha Zahra",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e7d168ce-de8e-41e3-9402-39db5054f59c",
    "studentId": "239abe9a-3759-4677-be68-aa5f1ed2796c",
    "studentCode": "66538",
    "studentName": "Ananta Virya",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 89,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b83d8643-18d4-4f4e-ac5e-e535128ff2a0",
    "studentId": "256ccdc6-5f78-4ce1-894e-4e6f8ee4800a",
    "studentCode": "33145",
    "studentName": "Syafiq Athallah",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3095af1c-0b9f-4ef3-8c92-9dcb65bf2422",
    "studentId": "31486b62-e24d-4ded-a892-c9be9a9b68c3",
    "studentCode": "56840",
    "studentName": "Afrial Arsenio",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 89,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "fb8cebc2-b61a-45a0-9781-4f80f3ff34b5",
    "studentId": "32dad6a6-6729-4aed-a91c-885e1b685e4c",
    "studentCode": "21117",
    "studentName": "Natasya Elfani Alkhomah",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "46c0389a-e1e8-4285-99b1-74646cda089a",
    "studentId": "34f39374-825b-4c3e-8f5d-1e60dd92a722",
    "studentCode": "78700",
    "studentName": "M. Bintang Hisyam Naufal",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "754b853b-8f62-4a6f-a876-df57ba07325c",
    "studentId": "3989a228-cdd0-456b-aa91-b9be32522cb5",
    "studentCode": "31290",
    "studentName": "Daniswara Rizky",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 89,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "460c2822-aa80-4e24-9083-0d849c62b7d2",
    "studentId": "452fe4ee-e4c6-4e63-a83d-9f0829085e88",
    "studentCode": "65103",
    "studentName": "Najwa Khaira Wilda",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ca38ff19-5dcd-4b03-88ab-ad833fb04f81",
    "studentId": "4964c094-f258-4fcb-94ed-1619344d0377",
    "studentCode": "47440",
    "studentName": "Najwa Alarifah",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 85,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "71655495-de7c-443b-83d0-5c04442136b7",
    "studentId": "497ef1bb-d078-42af-a596-85d9d8c60bf0",
    "studentCode": "99133",
    "studentName": "Arsyila Nasha Razita",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 99,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "283bacb0-a706-4610-92cf-a251e25957c5",
    "studentId": "4c5462b2-a318-45de-8ffd-293df12e4334",
    "studentCode": "40736",
    "studentName": "Aira Anatasya Putri",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 86,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "fc9f74e4-834d-4578-80ab-0c738740072a",
    "studentId": "4fae6a4c-8c08-4351-bb25-71e9db2e4ecb",
    "studentCode": "17055",
    "studentName": "Anandira Dyah Asmara Wati",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "48a963f9-5551-4a3e-b113-51cf5c1fd152",
    "studentId": "50d53115-8f00-40eb-90b0-1de731665ec4",
    "studentCode": "71940",
    "studentName": "Mahera Aiza Hilya",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "05747d30-413e-42f8-b1d2-cad6befb6a98",
    "studentId": "51f2f51b-16db-42bc-8e24-c12e01e57977",
    "studentCode": "65815",
    "studentName": "Alesha Rafani Marta",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "82f19e2d-ed78-4ef3-91a5-cc643eda1e0e",
    "studentId": "5467d797-c061-4a6f-b981-86af0829951d",
    "studentCode": "43210",
    "studentName": "Luthfi Hakim",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e975667d-8a39-483b-9050-13385274b11f",
    "studentId": "55e4f383-8f7f-43aa-ab5b-bf31aaa02b29",
    "studentCode": "77364",
    "studentName": "M. Fahrul Al Khafid",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 89,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8dca7ce2-1226-4357-ac95-592f8a940429",
    "studentId": "5831e4e4-ad30-43d7-a4d5-a11dd3b46508",
    "studentCode": "57508",
    "studentName": "Raffasya Abizar Raqilla",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "2d88e04e-eb10-4d98-b981-f25a1100f3aa",
    "studentId": "58a9b1e8-fe4b-4471-8ddc-05548604fe49",
    "studentCode": "67358",
    "studentName": "Nayla Inara Putri",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "cb0055c4-566f-40cc-901f-3fe9f4c82cb7",
    "studentId": "590ba72b-cae9-4773-9863-ac46b48e4eb1",
    "studentCode": "91212",
    "studentName": "Ajeng Cahyra Naifasha",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b40ad0f1-9f0e-488e-ad9f-e5a6f8895469",
    "studentId": "5c74b85c-f840-4649-ab72-e572843d8848",
    "studentCode": "29797",
    "studentName": "Aqila Fahmida",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c244cc35-4263-4c8d-8cad-99125552dc9b",
    "studentId": "5f15914c-65c0-4824-8170-2bc66288ae8d",
    "studentCode": "12232",
    "studentName": "Nathania Azkadina Farzana",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "bf97b169-e254-40fd-b04e-5bcd884542b0",
    "studentId": "68d5295b-bde7-4391-bab3-68255dcee983",
    "studentCode": "78123",
    "studentName": "Gladis Anindita",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 86,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e8623790-442e-496c-a99f-e1cc5a39323a",
    "studentId": "68d57e75-a2d2-4251-b6a7-541c3bc9c15d",
    "studentCode": "66458",
    "studentName": "Adeeva Afsheen Myesha",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ccbe18a7-4ab7-4bf9-8e52-8fbf6b13be45",
    "studentId": "6c51a4cb-002b-4b1f-a757-d0920e3043d9",
    "studentCode": "86190",
    "studentName": "EL FIRQOTUN AN NAJIYAH",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 88,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "86ed60c6-06fd-4338-8661-cf07c958a99c",
    "studentId": "6c55f895-276b-4955-ab24-223af3c42bea",
    "studentCode": "67890",
    "studentName": "Fathir Ahmad",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "fc35b8e3-94a0-4d06-8089-f10f858f5ab8",
    "studentId": "6d947da3-e268-4b69-ab42-820c9b48132e",
    "studentCode": "70553",
    "studentName": "Shaqia Azzahra Rahayu",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 99,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3d214c52-4340-4030-9ebc-5e6035f3c4e7",
    "studentId": "7169f097-8bf5-40dd-934e-0f5460261c04",
    "studentCode": "20080",
    "studentName": "M. Hannan Habibillah",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "65d45ecd-8037-477d-81a4-caf03d1eaa6f",
    "studentId": "7263e6e3-a667-4f35-82e4-90cd8b59b2b8",
    "studentCode": "66469",
    "studentName": "Abrisam",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 99,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "10dc94b7-d3fc-46fb-a6e3-0ce837520444",
    "studentId": "746c4af0-24e7-44b9-b255-256bc96cd47d",
    "studentCode": "84072",
    "studentName": "Ajeng Chaira Naifasha",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 85,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d40da968-cc89-4a0f-9642-24c73e478fb3",
    "studentId": "75075ab4-09b7-4059-8b60-561f8ea52ebe",
    "studentCode": "11653",
    "studentName": "Zulfan Azhar Raihan",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 88,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "1cd8c886-59cf-4d80-b90f-37cbda9f15f7",
    "studentId": "873cf03f-d94e-41c1-a8d8-44ea933c1d93",
    "studentCode": "93060",
    "studentName": "Arka Prapta Ardani",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 85,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c8f23079-e30a-4a7c-8540-d7484d2fd334",
    "studentId": "8e4bf798-43a8-4def-ad68-252c3035dd84",
    "studentCode": "43183",
    "studentName": "Habib Fadhil Abidin",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "76e7c948-8895-4449-a035-b4445601d7b4",
    "studentId": "8f01e65d-d43c-4d38-8e10-16f48712cffe",
    "studentCode": "14999",
    "studentName": "Adeeva Afsheen Myesha",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "47e61392-2c71-443f-994c-af8f480e82fa",
    "studentId": "981d918a-8b29-4b3f-b7e7-7d0baedae5b6",
    "studentCode": "15367",
    "studentName": "Aida Syafira N.A",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d148d681-d808-43ef-9ff9-435f259ddc7c",
    "studentId": "98a69eaa-3d7a-4363-9958-755501175aee",
    "studentCode": "11687",
    "studentName": "Yusuf Alfarizky Sugara",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "fb49e7df-9c8c-41f9-a36d-dd577c35cc26",
    "studentId": "9997dcfe-ef86-40c4-a197-f1e968484719",
    "studentCode": "70066",
    "studentName": "M. Rafa Raditia",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 88,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "22cc7397-3106-4290-8ba5-69a4b584fbd3",
    "studentId": "9ae2069c-c732-4461-ae86-f18cffca1178",
    "studentCode": "45237",
    "studentName": "Arka Prapdipta Ardani",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "691bb0a6-beeb-463a-a50a-137cf4d742ed",
    "studentId": "9e1eea3b-215f-41c6-b662-89e0f7bbac6a",
    "studentCode": "48291",
    "studentName": "Haura",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0428515a-4500-4296-9400-8afa0c23f981",
    "studentId": "9f60be52-54d6-41df-a0b8-f1de43bbd7f7",
    "studentCode": "74789",
    "studentName": "M. Dhaffa Athallah",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "fa6fe4a6-fd08-497c-9567-606925011386",
    "studentId": "a6c9d744-dcac-4377-b0a0-0d2a140c1257",
    "studentCode": "44156",
    "studentName": "Rafa Al-Ghifari",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 86,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a136e4f4-084d-4587-809b-ffc13e2341a2",
    "studentId": "ae6f604a-c5a1-48a0-a65c-776edc69b777",
    "studentCode": "54321",
    "studentName": "Kevin Pratama",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "80813eee-df47-42d4-bc0e-253bd5d0cd53",
    "studentId": "afff798e-f6eb-4730-883b-cebf7ee93880",
    "studentCode": "41984",
    "studentName": "Asheqa Shaqueena Qotrunada",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "219db727-8cbb-4b3e-bcb9-239fe865d012",
    "studentId": "b0655f2e-a8c9-4320-9ad7-1e85f7e120ce",
    "studentCode": "88190",
    "studentName": "M. Rayyan Al-Fatih",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8d9cbac7-21f6-49c2-95d8-9b9ade4b529c",
    "studentId": "b252f9f5-a288-433f-9ad7-ac52dbb7a9a7",
    "studentCode": "52809",
    "studentName": "Anandira Dyah Asmarawati",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "92b3a580-4d83-452d-87d9-eba3e6a13871",
    "studentId": "bb043228-0521-4772-8409-ffb114dea44d",
    "studentCode": "77189",
    "studentName": "Naura Zafira",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ba6e3b48-9fdf-4976-85d0-cfb25b942b43",
    "studentId": "beacabdd-33b2-4d0c-a7fa-df2c0b3a0570",
    "studentCode": "23866",
    "studentName": "Hamid Al Irsad",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 85,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ccdc070e-1216-472b-ae29-d310f4a0e0ba",
    "studentId": "c3f5334a-642b-4e05-a980-bbbc4442438b",
    "studentCode": "31996",
    "studentName": "Aira Anatasya Putri",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8d9e55f2-abcc-4276-ba66-29fef113ed17",
    "studentId": "c407aac0-a001-4ce4-8aff-85634e737f3c",
    "studentCode": "86280",
    "studentName": "Arsy Akifa Salsabila",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "bf4314ed-9b85-43d6-93a6-c3769a734ed5",
    "studentId": "c5767e1d-86a4-4fdd-9bb1-f1a64bed4a6f",
    "studentCode": "17366",
    "studentName": "Abizar Rahandika Alghifari",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 85,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "95a9fe78-a9b0-4be3-82dd-b045c40bfa02",
    "studentId": "ca9930de-9661-4823-a0e9-29621ef4f208",
    "studentCode": "32460",
    "studentName": "Shaqia Azzahra Rahayu",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0ce29a1b-e8c0-42ec-9d0b-ce84516bfa2d",
    "studentId": "cb436508-3a4d-49c9-85c5-636ea9e93e88",
    "studentCode": "89123",
    "studentName": "Citra Kirana",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "38c25822-07fc-40b6-8bde-eb34c77736ea",
    "studentId": "cea06363-69e7-47b6-9f47-1a7716561f7d",
    "studentCode": "65603",
    "studentName": "Aqila Fahmida",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 87,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "63ba1196-e99b-4eaf-8b5d-a43c3f08aceb",
    "studentId": "cf26ab88-2a73-4162-8b55-810b69acb071",
    "studentCode": "35955",
    "studentName": "Abyan Azka Abdillah",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d8b285f0-de3b-4cf1-9a9e-32189fba04aa",
    "studentId": "d0eaf62d-32db-4518-9ba9-35183a533bef",
    "studentCode": "88692",
    "studentName": "Arasely Naura Shada",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "84971c63-c09f-44e9-8876-01881cdc38cc",
    "studentId": "d59d6d2c-166e-4f78-85f0-f3c346278122",
    "studentCode": "69413",
    "studentName": "Zafran Rafisqi",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "fc6fddfb-9269-4513-b116-3590afeb6d2f",
    "studentId": "d6be9a6d-26fa-43ac-a80a-6ee5f30b80b4",
    "studentCode": "95452",
    "studentName": "Ananta Virya",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4181ba7e-39cf-47bc-98a1-e2945ebc09e2",
    "studentId": "d8340cb1-f138-425b-84ee-080de2586ece",
    "studentCode": "77435",
    "studentName": "Geofanny Gareos  P.K.B",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4244e387-6380-4149-bfde-5ea0dc656de0",
    "studentId": "d83505ed-0060-453a-9689-4dbf49f87bb8",
    "studentCode": "81124",
    "studentName": "Abrisam",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0e1a7a5b-9063-4851-beff-2542a7de77ab",
    "studentId": "d8d8fd71-2a09-4ee9-8bab-723d01afcce5",
    "studentCode": "47603",
    "studentName": "Yusuf Syauqy Syahid",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 89,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4a9e28b1-11ee-4309-88db-8a9cfa89e81f",
    "studentId": "db3d66d8-d162-4032-a6df-cb222d521c53",
    "studentCode": "44789",
    "studentName": "Maulana Syarif Wardhani",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "34592b76-af4a-4f72-9ab4-f2a8f6c2333a",
    "studentId": "dd652c0e-1633-4495-8ff4-16c4cacc3ffc",
    "studentCode": "22134",
    "studentName": "Tiara Andini",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c992e8ce-7efe-41ab-9097-e526fa2c117f",
    "studentId": "e08d4e8d-5858-4762-af6b-dfe5ff031bb9",
    "studentCode": "78564",
    "studentName": "Alesha Rafani Marta",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 99,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "9f9f7bef-15f0-4aa5-8fe8-bdf4b1f6eeaa",
    "studentId": "ee84a828-abc0-41c5-9ead-d79ff2056910",
    "studentCode": "96166",
    "studentName": "Ayunda Shela Ferlita ",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5e3561e9-919f-48db-8dd5-685ebfa61983",
    "studentId": "f2dcf39c-3131-497a-bce7-996dbeff9d62",
    "studentCode": "68933",
    "studentName": "Abizar Rahandika Alghifari",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "fbaf0d7c-6a0d-4176-a13f-d9e6d5b5346a",
    "studentId": "f5269115-d04f-4424-9bbc-ffbf35974aca",
    "studentCode": "79805",
    "studentName": "M. Razka Raffasya",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 87,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "fbc81290-3488-4952-bb52-386fe3bf5f7d",
    "studentId": "f552cd7d-a33f-441a-b8f2-f529514df6ed",
    "studentCode": "77599",
    "studentName": "Aida Syafira N.A",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 88,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "31bdf302-0bf4-4d9e-9de1-fa6e71d272e9",
    "studentId": "faf6d016-09db-47f7-88c1-93f2ba67a241",
    "studentCode": "66178",
    "studentName": "Prabu Wijaya",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 88,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "77f154db-0ae1-45a1-b8bc-4da86131cd4b",
    "studentId": "fd6da340-cbd8-44e9-8d93-e97e51cbbe4d",
    "studentCode": "89919",
    "studentName": "Felisha Amara Gina",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 87,
    "note": "Akurasi formasi jari sangat baik",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "065e90e3-705e-40a2-adf2-01f51bdc449b",
    "studentId": "ffdc0d9b-af62-4250-b6f4-b561bdda627f",
    "studentCode": "80218",
    "studentName": "Nurul Hasna Maulidyah",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f6fe1631-12c6-4f3c-be8b-e428013c9176",
    "studentId": "001f391b-660f-46f6-a82e-d59a0bb45700",
    "studentCode": "86254",
    "studentName": "Raditya Riski Ramadhan ",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 84,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b0f7fe79-f76b-445a-bf72-ae1d6c8dfaa7",
    "studentId": "001f391b-660f-46f6-a82e-d59a0bb45700",
    "studentCode": "86254",
    "studentName": "Raditya Riski Ramadhan ",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 88,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8545ea17-89f7-47c8-8ebf-ff12f94d06b4",
    "studentId": "04796f1c-9a95-475e-a8db-b8fd605ae5ad",
    "studentCode": "76123",
    "studentName": "Bima Sakti",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 84,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6dc6dcd0-17ff-4a8b-b5c8-99ff502aed4c",
    "studentId": "04796f1c-9a95-475e-a8db-b8fd605ae5ad",
    "studentCode": "76123",
    "studentName": "Bima Sakti",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 80,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4005e09c-3431-4318-b15e-342713259e78",
    "studentId": "0f0efef9-eda5-4673-a26b-4007603410a3",
    "studentCode": "83063",
    "studentName": "Nayyara Febi Anjani",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5ffbf90f-9072-46e8-82b4-915acf221af5",
    "studentId": "0f0efef9-eda5-4673-a26b-4007603410a3",
    "studentCode": "83063",
    "studentName": "Nayyara Febi Anjani",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 83,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a70a9663-9381-4396-9770-4c3793da5997",
    "studentId": "10451ac4-1e41-430d-b17d-01de8a19261e",
    "studentCode": "64628",
    "studentName": "Qintara Izatunnisya",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 85,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "74d85866-017c-4388-b665-c8175fc88e70",
    "studentId": "10451ac4-1e41-430d-b17d-01de8a19261e",
    "studentCode": "64628",
    "studentName": "Qintara Izatunnisya",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 89,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "23fd2b2f-1ae0-4146-bb3a-613937273c40",
    "studentId": "11a3901e-dae9-4902-a89e-578810a8fbad",
    "studentCode": "98124",
    "studentName": "Dzakiandra Putra",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "aaf46ab4-1e77-4a7d-be95-ce8bf2503a75",
    "studentId": "11a3901e-dae9-4902-a89e-578810a8fbad",
    "studentCode": "98124",
    "studentName": "Dzakiandra Putra",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 86,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3073f920-2a49-48bd-b1d5-b212a6540c70",
    "studentId": "16d71476-7ec9-483a-a2b0-f1e9de3ade83",
    "studentCode": "65934",
    "studentName": "Rahajeng Ayu Kinanti",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "547ea9f9-dd48-435e-8cf8-50fa9459b40b",
    "studentId": "16d71476-7ec9-483a-a2b0-f1e9de3ade83",
    "studentCode": "65934",
    "studentName": "Rahajeng Ayu Kinanti",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "fc53a239-8f18-434a-959c-ad46ffc05254",
    "studentId": "16f42f89-5c09-4b2b-9e8a-d01f7f275727",
    "studentCode": "18032",
    "studentName": "Areasely Naura Shada",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "08036bb2-03e5-4895-8ad7-f100c7451333",
    "studentId": "16f42f89-5c09-4b2b-9e8a-d01f7f275727",
    "studentCode": "18032",
    "studentName": "Areasely Naura Shada",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "03b7f419-1ae1-4dbf-a16a-461eff3d3c4f",
    "studentId": "17a21047-a092-4964-a396-ea778093f34d",
    "studentCode": "52651",
    "studentName": "Ainan Nuri Sumayah",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e19eef72-9263-4ebb-a161-f3ee57fd4b3f",
    "studentId": "17a21047-a092-4964-a396-ea778093f34d",
    "studentCode": "52651",
    "studentName": "Ainan Nuri Sumayah",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6f69b130-d8f7-432a-ba75-0e7cd8dddad8",
    "studentId": "1e8d5ed6-e5b1-474e-8b64-24633476b6f9",
    "studentCode": "95219",
    "studentName": "Viola Alesha Ganes",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 80,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c7119d2e-5e1b-4fc5-8fea-4533a1b54229",
    "studentId": "1e8d5ed6-e5b1-474e-8b64-24633476b6f9",
    "studentCode": "95219",
    "studentName": "Viola Alesha Ganes",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 84,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "965dd15c-3014-4043-b5e8-23aa3255c912",
    "studentId": "1eecdd5c-da28-4078-a890-b2abe0ebfc9d",
    "studentCode": "49625",
    "studentName": "Amara Alifah Fauziah",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 85,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "63cc6cb3-27ee-4650-9353-3f0bcc027ff2",
    "studentId": "1eecdd5c-da28-4078-a890-b2abe0ebfc9d",
    "studentCode": "49625",
    "studentName": "Amara Alifah Fauziah",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 81,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c53f5410-3851-4660-99fd-cfc8d9eb76c7",
    "studentId": "216e8e11-446a-46bd-8641-893961f9462f",
    "studentCode": "66787",
    "studentName": "Anindita Keisha Zahra",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ec864989-41a3-44d0-b406-d87b2c86bdb5",
    "studentId": "216e8e11-446a-46bd-8641-893961f9462f",
    "studentCode": "66787",
    "studentName": "Anindita Keisha Zahra",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 86,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "195e1b3d-dabc-448c-b8e1-9a2a2b352b31",
    "studentId": "239abe9a-3759-4677-be68-aa5f1ed2796c",
    "studentCode": "66538",
    "studentName": "Ananta Virya",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 83,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3d595242-1cc7-47b2-bba1-a6670c3648f6",
    "studentId": "239abe9a-3759-4677-be68-aa5f1ed2796c",
    "studentCode": "66538",
    "studentName": "Ananta Virya",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "42ae29d9-32f7-4647-b36e-86a9c72d32e8",
    "studentId": "256ccdc6-5f78-4ce1-894e-4e6f8ee4800a",
    "studentCode": "33145",
    "studentName": "Syafiq Athallah",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 81,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "be656e22-ec55-4acd-a06e-177f07578334",
    "studentId": "256ccdc6-5f78-4ce1-894e-4e6f8ee4800a",
    "studentCode": "33145",
    "studentName": "Syafiq Athallah",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 85,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4fa1b343-dce9-4848-95f5-7d15a3c9839f",
    "studentId": "31486b62-e24d-4ded-a892-c9be9a9b68c3",
    "studentCode": "56840",
    "studentName": "Afrial Arsenio",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d33e68bd-ef00-4044-8601-9aa55483eafb",
    "studentId": "31486b62-e24d-4ded-a892-c9be9a9b68c3",
    "studentCode": "56840",
    "studentName": "Afrial Arsenio",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 83,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3ec5e7e0-aeba-40e9-94b4-ba64f27cf4c9",
    "studentId": "32dad6a6-6729-4aed-a91c-885e1b685e4c",
    "studentCode": "21117",
    "studentName": "Natasya Elfani Alkhomah",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 81,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d16058ce-58d4-4b00-99ba-2a03db332ebf",
    "studentId": "32dad6a6-6729-4aed-a91c-885e1b685e4c",
    "studentCode": "21117",
    "studentName": "Natasya Elfani Alkhomah",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 85,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d21717e8-b261-4f2c-9e97-f689c38461e3",
    "studentId": "34f39374-825b-4c3e-8f5d-1e60dd92a722",
    "studentCode": "78700",
    "studentName": "M. Bintang Hisyam Naufal",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 84,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3036aa46-c598-462d-9e07-0ddc2f379dd8",
    "studentId": "34f39374-825b-4c3e-8f5d-1e60dd92a722",
    "studentCode": "78700",
    "studentName": "M. Bintang Hisyam Naufal",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 80,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5ac4590c-27c8-4a62-8754-a56e874e50a7",
    "studentId": "3989a228-cdd0-456b-aa91-b9be32522cb5",
    "studentCode": "31290",
    "studentName": "Daniswara Rizky",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "79c6acae-ce23-47a9-91ae-9ea4b57e1ede",
    "studentId": "3989a228-cdd0-456b-aa91-b9be32522cb5",
    "studentCode": "31290",
    "studentName": "Daniswara Rizky",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 83,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "bd3996cf-cd11-4f9c-972a-d923dd4918e8",
    "studentId": "452fe4ee-e4c6-4e63-a83d-9f0829085e88",
    "studentCode": "65103",
    "studentName": "Najwa Khaira Wilda",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 86,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "cc363b1b-a193-45e6-ae92-32cd3cbb1dfe",
    "studentId": "452fe4ee-e4c6-4e63-a83d-9f0829085e88",
    "studentCode": "65103",
    "studentName": "Najwa Khaira Wilda",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 82,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "aea79dce-ccf2-49f9-9631-020f01265a43",
    "studentId": "4964c094-f258-4fcb-94ed-1619344d0377",
    "studentCode": "47440",
    "studentName": "Najwa Alarifah",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "78531f43-551f-4cf3-87e0-2ecbc706b6ee",
    "studentId": "4964c094-f258-4fcb-94ed-1619344d0377",
    "studentCode": "47440",
    "studentName": "Najwa Alarifah",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e75ce7b7-71f6-40f4-ae52-fa2531e0e88f",
    "studentId": "497ef1bb-d078-42af-a596-85d9d8c60bf0",
    "studentCode": "99133",
    "studentName": "Arsyila Nasha Razita",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 89,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f68ed3ad-633f-404b-915b-00d7e4cf71d3",
    "studentId": "497ef1bb-d078-42af-a596-85d9d8c60bf0",
    "studentCode": "99133",
    "studentName": "Arsyila Nasha Razita",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b10fa09b-5255-4a10-81c3-4b5ef1e4ebb3",
    "studentId": "4c5462b2-a318-45de-8ffd-293df12e4334",
    "studentCode": "40736",
    "studentName": "Aira Anatasya Putri",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8b93dd74-375d-4200-ad5f-f20cfd67cc56",
    "studentId": "4c5462b2-a318-45de-8ffd-293df12e4334",
    "studentCode": "40736",
    "studentName": "Aira Anatasya Putri",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "915af21d-2777-41a4-8c13-a1033cde5555",
    "studentId": "4fae6a4c-8c08-4351-bb25-71e9db2e4ecb",
    "studentCode": "17055",
    "studentName": "Anandira Dyah Asmara Wati",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 88,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "aa583212-fc0a-4a4b-a926-e20c888cd694",
    "studentId": "4fae6a4c-8c08-4351-bb25-71e9db2e4ecb",
    "studentCode": "17055",
    "studentName": "Anandira Dyah Asmara Wati",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f894219e-62c8-42a2-8ebf-f20fbee12d79",
    "studentId": "50d53115-8f00-40eb-90b0-1de731665ec4",
    "studentCode": "71940",
    "studentName": "Mahera Aiza Hilya",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 88,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "38e3cb0e-d245-45a7-ab21-4eacad919542",
    "studentId": "50d53115-8f00-40eb-90b0-1de731665ec4",
    "studentCode": "71940",
    "studentName": "Mahera Aiza Hilya",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 84,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "1337f0ad-6847-4360-8f84-4cd68fbf3cc0",
    "studentId": "51f2f51b-16db-42bc-8e24-c12e01e57977",
    "studentCode": "65815",
    "studentName": "Alesha Rafani Marta",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 86,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "10afc653-7b5f-49b8-90a0-a21563749471",
    "studentId": "51f2f51b-16db-42bc-8e24-c12e01e57977",
    "studentCode": "65815",
    "studentName": "Alesha Rafani Marta",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 82,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "985d6801-9e08-4594-b1d6-5b63aa70d60b",
    "studentId": "5467d797-c061-4a6f-b981-86af0829951d",
    "studentCode": "43210",
    "studentName": "Luthfi Hakim",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 88,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "df2a728e-b690-4427-b666-2b3ba196be2f",
    "studentId": "5467d797-c061-4a6f-b981-86af0829951d",
    "studentCode": "43210",
    "studentName": "Luthfi Hakim",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "7b3f777b-5e15-4985-b3e2-87366bf8a923",
    "studentId": "55e4f383-8f7f-43aa-ab5b-bf31aaa02b29",
    "studentCode": "77364",
    "studentName": "M. Fahrul Al Khafid",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 83,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "df554bb6-8fc8-438c-900d-d6fc6a7cf0b3",
    "studentId": "55e4f383-8f7f-43aa-ab5b-bf31aaa02b29",
    "studentCode": "77364",
    "studentName": "M. Fahrul Al Khafid",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ba4dcf98-9f14-455f-9d3b-943d00fc7d73",
    "studentId": "5831e4e4-ad30-43d7-a4d5-a11dd3b46508",
    "studentCode": "57508",
    "studentName": "Raffasya Abizar Raqilla",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 83,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e15b2469-06a8-42fe-b2aa-11b593a477b5",
    "studentId": "5831e4e4-ad30-43d7-a4d5-a11dd3b46508",
    "studentCode": "57508",
    "studentName": "Raffasya Abizar Raqilla",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 87,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "26d3727b-4250-4fe6-9ac1-e79b1fe33da8",
    "studentId": "58a9b1e8-fe4b-4471-8ddc-05548604fe49",
    "studentCode": "67358",
    "studentName": "Nayla Inara Putri",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6af3da4f-4cbd-490c-8613-96e6f5bb9adf",
    "studentId": "58a9b1e8-fe4b-4471-8ddc-05548604fe49",
    "studentCode": "67358",
    "studentName": "Nayla Inara Putri",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 87,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5bcc0bef-9915-4976-ba31-e37629f92674",
    "studentId": "590ba72b-cae9-4773-9863-ac46b48e4eb1",
    "studentCode": "91212",
    "studentName": "Ajeng Cahyra Naifasha",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 87,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0a4c1eb1-4a4a-4a00-b451-1daa481ed657",
    "studentId": "590ba72b-cae9-4773-9863-ac46b48e4eb1",
    "studentCode": "91212",
    "studentName": "Ajeng Cahyra Naifasha",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 83,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6e56f6bc-1f1e-4bcb-a4df-7261593fbf74",
    "studentId": "5c74b85c-f840-4649-ab72-e572843d8848",
    "studentCode": "29797",
    "studentName": "Aqila Fahmida",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 85,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c305c391-bed5-4dd0-b6c9-9c1379371f12",
    "studentId": "5c74b85c-f840-4649-ab72-e572843d8848",
    "studentCode": "29797",
    "studentName": "Aqila Fahmida",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 89,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f585a832-bd8c-478f-b294-c824138d2f11",
    "studentId": "5f15914c-65c0-4824-8170-2bc66288ae8d",
    "studentCode": "12232",
    "studentName": "Nathania Azkadina Farzana",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "2d436606-98ee-4f59-9cd5-d60d67c6bea3",
    "studentId": "5f15914c-65c0-4824-8170-2bc66288ae8d",
    "studentCode": "12232",
    "studentName": "Nathania Azkadina Farzana",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 88,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "31f975b3-8bf0-493a-9496-81825154d555",
    "studentId": "68d5295b-bde7-4391-bab3-68255dcee983",
    "studentCode": "78123",
    "studentName": "Gladis Anindita",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a4326123-b6c8-488f-adff-8f02134e40c3",
    "studentId": "68d5295b-bde7-4391-bab3-68255dcee983",
    "studentCode": "78123",
    "studentName": "Gladis Anindita",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3cd436ca-588f-423c-b68d-5617bc8696c7",
    "studentId": "68d57e75-a2d2-4251-b6a7-541c3bc9c15d",
    "studentCode": "66458",
    "studentName": "Adeeva Afsheen Myesha",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 87,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "41d2afef-eb95-4207-aa85-ad4348cb3d3f",
    "studentId": "68d57e75-a2d2-4251-b6a7-541c3bc9c15d",
    "studentCode": "66458",
    "studentName": "Adeeva Afsheen Myesha",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b64da51b-2d37-4a44-bbd4-1b06a7ae23e0",
    "studentId": "6c51a4cb-002b-4b1f-a757-d0920e3043d9",
    "studentCode": "86190",
    "studentName": "EL FIRQOTUN AN NAJIYAH",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "946d7cc7-5310-4c9f-bfec-3495d3fe80e6",
    "studentId": "6c51a4cb-002b-4b1f-a757-d0920e3043d9",
    "studentCode": "86190",
    "studentName": "EL FIRQOTUN AN NAJIYAH",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 82,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5f4bfcb6-a015-4b02-b5a9-5046ce32a100",
    "studentId": "6c55f895-276b-4955-ab24-223af3c42bea",
    "studentCode": "67890",
    "studentName": "Fathir Ahmad",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 89,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "79af556f-1b6e-494d-bb67-248254a9aa2c",
    "studentId": "6c55f895-276b-4955-ab24-223af3c42bea",
    "studentCode": "67890",
    "studentName": "Fathir Ahmad",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 85,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c2593a24-4492-48f7-8450-07ecaff9fc16",
    "studentId": "6d947da3-e268-4b69-ab42-820c9b48132e",
    "studentCode": "70553",
    "studentName": "Shaqia Azzahra Rahayu",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8c302633-0ffc-4de7-8861-07110e5a9150",
    "studentId": "6d947da3-e268-4b69-ab42-820c9b48132e",
    "studentCode": "70553",
    "studentName": "Shaqia Azzahra Rahayu",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 89,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8f21d679-f188-41fa-8994-155b47a75747",
    "studentId": "7169f097-8bf5-40dd-934e-0f5460261c04",
    "studentCode": "20080",
    "studentName": "M. Hannan Habibillah",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "66564bd3-192c-4c67-9a63-8d39c782d561",
    "studentId": "7169f097-8bf5-40dd-934e-0f5460261c04",
    "studentCode": "20080",
    "studentName": "M. Hannan Habibillah",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 86,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e1c831c1-c07e-474a-b803-1f766ca6d848",
    "studentId": "7263e6e3-a667-4f35-82e4-90cd8b59b2b8",
    "studentCode": "66469",
    "studentName": "Abrisam",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 89,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "41b005f7-c095-44bc-a9f5-b13dd65355fb",
    "studentId": "7263e6e3-a667-4f35-82e4-90cd8b59b2b8",
    "studentCode": "66469",
    "studentName": "Abrisam",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6f9ba4a8-a40b-4fec-9c6f-958c2be3e3a8",
    "studentId": "746c4af0-24e7-44b9-b255-256bc96cd47d",
    "studentCode": "84072",
    "studentName": "Ajeng Chaira Naifasha",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a90685bf-c8a1-44a3-b45a-d7ccf4ead73b",
    "studentId": "746c4af0-24e7-44b9-b255-256bc96cd47d",
    "studentCode": "84072",
    "studentName": "Ajeng Chaira Naifasha",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d04c5a8e-4cd4-45f0-b4f8-21e0066c3ea1",
    "studentId": "75075ab4-09b7-4059-8b60-561f8ea52ebe",
    "studentCode": "11653",
    "studentName": "Zulfan Azhar Raihan",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d9a50e1b-19e5-4809-9fec-20bc7074b235",
    "studentId": "75075ab4-09b7-4059-8b60-561f8ea52ebe",
    "studentCode": "11653",
    "studentName": "Zulfan Azhar Raihan",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 82,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a726ce93-d6ac-4429-9fe3-d88a2ef309b2",
    "studentId": "873cf03f-d94e-41c1-a8d8-44ea933c1d93",
    "studentCode": "93060",
    "studentName": "Arka Prapta Ardani",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "93dd1d94-497d-4497-ae9a-7858aa3d811c",
    "studentId": "873cf03f-d94e-41c1-a8d8-44ea933c1d93",
    "studentCode": "93060",
    "studentName": "Arka Prapta Ardani",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "9ad72a16-d91d-473e-9622-e7547550a1aa",
    "studentId": "8e4bf798-43a8-4def-ad68-252c3035dd84",
    "studentCode": "43183",
    "studentName": "Habib Fadhil Abidin",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 87,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "353f0220-4533-42f8-b837-17a3cf93591d",
    "studentId": "8e4bf798-43a8-4def-ad68-252c3035dd84",
    "studentCode": "43183",
    "studentName": "Habib Fadhil Abidin",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 83,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8239e868-0616-41eb-b9a5-7b372a3a52c5",
    "studentId": "8f01e65d-d43c-4d38-8e10-16f48712cffe",
    "studentCode": "14999",
    "studentName": "Adeeva Afsheen Myesha",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 84,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8927c533-08af-4a21-a2e3-b20b8e16c435",
    "studentId": "8f01e65d-d43c-4d38-8e10-16f48712cffe",
    "studentCode": "14999",
    "studentName": "Adeeva Afsheen Myesha",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 80,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "93db5c12-15b5-4ec1-a45b-1a76b020d1b5",
    "studentId": "981d918a-8b29-4b3f-b7e7-7d0baedae5b6",
    "studentCode": "15367",
    "studentName": "Aida Syafira N.A",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 89,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b50450ea-b977-4346-8dea-bf0edb019bcd",
    "studentId": "981d918a-8b29-4b3f-b7e7-7d0baedae5b6",
    "studentCode": "15367",
    "studentName": "Aida Syafira N.A",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 85,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5ea100e8-0a09-429e-a892-96b6dd625a20",
    "studentId": "98a69eaa-3d7a-4363-9958-755501175aee",
    "studentCode": "11687",
    "studentName": "Yusuf Alfarizky Sugara",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 87,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3f665f69-1a0b-4366-862e-fb9c6921e378",
    "studentId": "98a69eaa-3d7a-4363-9958-755501175aee",
    "studentCode": "11687",
    "studentName": "Yusuf Alfarizky Sugara",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e87d3ecb-271a-465f-a4df-538fc0340937",
    "studentId": "9997dcfe-ef86-40c4-a197-f1e968484719",
    "studentCode": "70066",
    "studentName": "M. Rafa Raditia",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e98fef6a-3c7a-4c0c-b7ee-752fdd7973e1",
    "studentId": "9997dcfe-ef86-40c4-a197-f1e968484719",
    "studentCode": "70066",
    "studentName": "M. Rafa Raditia",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 82,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6ffa39bb-e9a2-48d9-aa59-27829350e2fe",
    "studentId": "9ae2069c-c732-4461-ae86-f18cffca1178",
    "studentCode": "45237",
    "studentName": "Arka Prapdipta Ardani",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 83,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "fc556fee-ecf8-4fe0-aeba-32ea36f50ae5",
    "studentId": "9ae2069c-c732-4461-ae86-f18cffca1178",
    "studentCode": "45237",
    "studentName": "Arka Prapdipta Ardani",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 87,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "7f77a988-df72-4038-b5e6-295ad2b66373",
    "studentId": "9e1eea3b-215f-41c6-b662-89e0f7bbac6a",
    "studentCode": "48291",
    "studentName": "Haura",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 86,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "780de294-e618-42f5-b8ad-80285f7ca5c2",
    "studentId": "9e1eea3b-215f-41c6-b662-89e0f7bbac6a",
    "studentCode": "48291",
    "studentName": "Haura",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 82,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "dab61061-0272-485b-bd10-e55485daa322",
    "studentId": "9f60be52-54d6-41df-a0b8-f1de43bbd7f7",
    "studentCode": "74789",
    "studentName": "M. Dhaffa Athallah",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c297b2c4-cae8-413b-99a2-adfb4438b79d",
    "studentId": "9f60be52-54d6-41df-a0b8-f1de43bbd7f7",
    "studentCode": "74789",
    "studentName": "M. Dhaffa Athallah",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 87,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "47e2a127-fe30-4729-ad0b-b21e9292cc7a",
    "studentId": "a6c9d744-dcac-4377-b0a0-0d2a140c1257",
    "studentCode": "44156",
    "studentName": "Rafa Al-Ghifari",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "196216f9-4140-4465-b4fb-089e8a28ec44",
    "studentId": "a6c9d744-dcac-4377-b0a0-0d2a140c1257",
    "studentCode": "44156",
    "studentName": "Rafa Al-Ghifari",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a1766c80-5d4d-45e7-b91d-f32bc039b778",
    "studentId": "ae6f604a-c5a1-48a0-a65c-776edc69b777",
    "studentCode": "54321",
    "studentName": "Kevin Pratama",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 81,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f4c4cc89-2e72-44af-a031-1cd455361091",
    "studentId": "ae6f604a-c5a1-48a0-a65c-776edc69b777",
    "studentCode": "54321",
    "studentName": "Kevin Pratama",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 85,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0cd83ff4-90b4-4a3e-bdf2-119506a0df77",
    "studentId": "afff798e-f6eb-4730-883b-cebf7ee93880",
    "studentCode": "41984",
    "studentName": "Asheqa Shaqueena Qotrunada",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 85,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5f87afc8-77b7-48be-aefb-bf3cbc50744a",
    "studentId": "afff798e-f6eb-4730-883b-cebf7ee93880",
    "studentCode": "41984",
    "studentName": "Asheqa Shaqueena Qotrunada",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 81,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0c4f3a8f-4a79-4c66-9d1c-32423d73dbb7",
    "studentId": "b0655f2e-a8c9-4320-9ad7-1e85f7e120ce",
    "studentCode": "88190",
    "studentName": "M. Rayyan Al-Fatih",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 89,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "80c0d67b-1a1f-4ab1-bc3f-c25dd0330d87",
    "studentId": "b0655f2e-a8c9-4320-9ad7-1e85f7e120ce",
    "studentCode": "88190",
    "studentName": "M. Rayyan Al-Fatih",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 85,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "37d477ae-f57c-4efb-871f-e814f6e8263f",
    "studentId": "b252f9f5-a288-433f-9ad7-ac52dbb7a9a7",
    "studentCode": "52809",
    "studentName": "Anandira Dyah Asmarawati",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 84,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "399dfbbb-4a45-4041-8a24-23864057d718",
    "studentId": "b252f9f5-a288-433f-9ad7-ac52dbb7a9a7",
    "studentCode": "52809",
    "studentName": "Anandira Dyah Asmarawati",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 80,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "40a80f36-713b-46b4-b0e1-6bf1e7b97472",
    "studentId": "bb043228-0521-4772-8409-ffb114dea44d",
    "studentCode": "77189",
    "studentName": "Naura Zafira",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 80,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3a510e15-117a-4f53-8d59-d2e6c2dad3ad",
    "studentId": "bb043228-0521-4772-8409-ffb114dea44d",
    "studentCode": "77189",
    "studentName": "Naura Zafira",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 84,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "9be19c5c-a81b-435f-b501-581b27aec85d",
    "studentId": "beacabdd-33b2-4d0c-a7fa-df2c0b3a0570",
    "studentCode": "23866",
    "studentName": "Hamid Al Irsad",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "48df40f8-0e61-48f4-89a9-563d0f0ead1b",
    "studentId": "beacabdd-33b2-4d0c-a7fa-df2c0b3a0570",
    "studentCode": "23866",
    "studentName": "Hamid Al Irsad",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8e0aafdb-8c3f-4772-b3d4-0173c3db06db",
    "studentId": "c3f5334a-642b-4e05-a980-bbbc4442438b",
    "studentCode": "31996",
    "studentName": "Aira Anatasya Putri",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 84,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b41c16cf-7d7a-4c26-b8ac-4bc0c382c2c8",
    "studentId": "c3f5334a-642b-4e05-a980-bbbc4442438b",
    "studentCode": "31996",
    "studentName": "Aira Anatasya Putri",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 88,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "10caa41f-2c54-4572-9be5-468526292459",
    "studentId": "c407aac0-a001-4ce4-8aff-85634e737f3c",
    "studentCode": "86280",
    "studentName": "Arsy Akifa Salsabila",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 86,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6fcd9e83-d69c-4b6c-a901-7672701341ee",
    "studentId": "c407aac0-a001-4ce4-8aff-85634e737f3c",
    "studentCode": "86280",
    "studentName": "Arsy Akifa Salsabila",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 82,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "21556900-fec7-41b8-9541-8f6d9ce1edb9",
    "studentId": "c5767e1d-86a4-4fdd-9bb1-f1a64bed4a6f",
    "studentCode": "17366",
    "studentName": "Abizar Rahandika Alghifari",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b033ac8b-b2d5-486a-a502-950b864c7449",
    "studentId": "c5767e1d-86a4-4fdd-9bb1-f1a64bed4a6f",
    "studentCode": "17366",
    "studentName": "Abizar Rahandika Alghifari",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "997ba3ab-2910-4a9a-bb4a-006ab1c9c6f7",
    "studentId": "ca9930de-9661-4823-a0e9-29621ef4f208",
    "studentCode": "32460",
    "studentName": "Shaqia Azzahra Rahayu",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 82,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a10bf7c6-d245-428f-81ed-1091d7a4ba69",
    "studentId": "ca9930de-9661-4823-a0e9-29621ef4f208",
    "studentCode": "32460",
    "studentName": "Shaqia Azzahra Rahayu",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 86,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "bb8d40f7-4bf2-4697-a297-b91a4488e0d0",
    "studentId": "cb436508-3a4d-49c9-85c5-636ea9e93e88",
    "studentCode": "89123",
    "studentName": "Citra Kirana",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 87,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "239c0dfd-7504-4827-acd3-7ef02f210dc2",
    "studentId": "cb436508-3a4d-49c9-85c5-636ea9e93e88",
    "studentCode": "89123",
    "studentName": "Citra Kirana",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "64d43c1c-8413-4cd4-971d-468df189864a",
    "studentId": "cea06363-69e7-47b6-9f47-1a7716561f7d",
    "studentCode": "65603",
    "studentName": "Aqila Fahmida",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d2a78a98-3e13-4de1-a827-6d5c3b5be7b5",
    "studentId": "cea06363-69e7-47b6-9f47-1a7716561f7d",
    "studentCode": "65603",
    "studentName": "Aqila Fahmida",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a54b60c4-c0fc-4376-b738-e3c2e1027c1f",
    "studentId": "cf26ab88-2a73-4162-8b55-810b69acb071",
    "studentCode": "35955",
    "studentName": "Abyan Azka Abdillah",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "69a57872-0a3c-47f5-8d04-cb2b94519770",
    "studentId": "cf26ab88-2a73-4162-8b55-810b69acb071",
    "studentCode": "35955",
    "studentName": "Abyan Azka Abdillah",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 88,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "11cba2f8-712a-45d4-bf86-8130dc2d0459",
    "studentId": "d0eaf62d-32db-4518-9ba9-35183a533bef",
    "studentCode": "88692",
    "studentName": "Arasely Naura Shada",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 88,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "99b7f59c-e232-4097-8227-96b0af11f2b6",
    "studentId": "d0eaf62d-32db-4518-9ba9-35183a533bef",
    "studentCode": "88692",
    "studentName": "Arasely Naura Shada",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 84,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "317204d2-56cd-45c7-bfbc-ed2515c0747d",
    "studentId": "d59d6d2c-166e-4f78-85f0-f3c346278122",
    "studentCode": "69413",
    "studentName": "Zafran Rafisqi",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 86,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "46b6f761-49c6-45c4-b5d9-e8dc26a921ef",
    "studentId": "d59d6d2c-166e-4f78-85f0-f3c346278122",
    "studentCode": "69413",
    "studentName": "Zafran Rafisqi",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d3d484c7-2de9-4133-8bb3-55f07206e1ac",
    "studentId": "d6be9a6d-26fa-43ac-a80a-6ee5f30b80b4",
    "studentCode": "95452",
    "studentName": "Ananta Virya",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 87,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0a8615c4-5c91-49e6-a00c-68ef421586e6",
    "studentId": "d6be9a6d-26fa-43ac-a80a-6ee5f30b80b4",
    "studentCode": "95452",
    "studentName": "Ananta Virya",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "9411d147-cc2c-48a1-822f-16642961049b",
    "studentId": "d8340cb1-f138-425b-84ee-080de2586ece",
    "studentCode": "77435",
    "studentName": "Geofanny Gareos  P.K.B",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 88,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f892fcc1-bffd-4dde-9093-06d7eeaadb5c",
    "studentId": "d8340cb1-f138-425b-84ee-080de2586ece",
    "studentCode": "77435",
    "studentName": "Geofanny Gareos  P.K.B",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 84,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a22e126c-5bdd-452d-a69f-be94c49c3f81",
    "studentId": "d83505ed-0060-453a-9689-4dbf49f87bb8",
    "studentCode": "81124",
    "studentName": "Abrisam",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 81,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d6afd2f6-0449-44c3-bb9c-6a37fa13883b",
    "studentId": "d83505ed-0060-453a-9689-4dbf49f87bb8",
    "studentCode": "81124",
    "studentName": "Abrisam",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 85,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "21e1ac78-c321-4a40-97c1-a113c9bba344",
    "studentId": "d8d8fd71-2a09-4ee9-8bab-723d01afcce5",
    "studentCode": "47603",
    "studentName": "Yusuf Syauqy Syahid",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 83,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "2ac070f8-e33f-4486-82fe-0bc55ed88ae2",
    "studentId": "d8d8fd71-2a09-4ee9-8bab-723d01afcce5",
    "studentCode": "47603",
    "studentName": "Yusuf Syauqy Syahid",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ec03a0d9-756f-4953-9b7e-268612797133",
    "studentId": "db3d66d8-d162-4032-a6df-cb222d521c53",
    "studentCode": "44789",
    "studentName": "Maulana Syarif Wardhani",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 83,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c134d88f-081e-4bd0-a48d-a0d5c2a327e0",
    "studentId": "db3d66d8-d162-4032-a6df-cb222d521c53",
    "studentCode": "44789",
    "studentName": "Maulana Syarif Wardhani",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 87,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0a11e96d-a736-46f3-aab4-90e6290c1d0a",
    "studentId": "dd652c0e-1633-4495-8ff4-16c4cacc3ffc",
    "studentCode": "22134",
    "studentName": "Tiara Andini",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 88,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d2b6cdf7-b8cd-4b87-9f09-6a0d68b3654d",
    "studentId": "dd652c0e-1633-4495-8ff4-16c4cacc3ffc",
    "studentCode": "22134",
    "studentName": "Tiara Andini",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e2caafa2-c180-4ae6-8ce3-058d318941fa",
    "studentId": "e08d4e8d-5858-4762-af6b-dfe5ff031bb9",
    "studentCode": "78564",
    "studentName": "Alesha Rafani Marta",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 89,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "526d7fdc-be3e-47e2-8867-27881487a90e",
    "studentId": "e08d4e8d-5858-4762-af6b-dfe5ff031bb9",
    "studentCode": "78564",
    "studentName": "Alesha Rafani Marta",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "cd7ace0d-f2de-4f50-94fd-7a481a44f2a2",
    "studentId": "ee84a828-abc0-41c5-9ead-d79ff2056910",
    "studentCode": "96166",
    "studentName": "Ayunda Shela Ferlita ",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 88,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5fc6f937-04f0-42d8-bd06-678357fdc1e2",
    "studentId": "ee84a828-abc0-41c5-9ead-d79ff2056910",
    "studentCode": "96166",
    "studentName": "Ayunda Shela Ferlita ",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5d6c55e4-044d-4b30-937d-7c24bdb7d655",
    "studentId": "f2dcf39c-3131-497a-bce7-996dbeff9d62",
    "studentCode": "68933",
    "studentName": "Abizar Rahandika Alghifari",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 82,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "275c093a-6f70-4618-a1b4-60ebe4e60030",
    "studentId": "f2dcf39c-3131-497a-bce7-996dbeff9d62",
    "studentCode": "68933",
    "studentName": "Abizar Rahandika Alghifari",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 86,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "517ce89b-7455-4787-b74e-dab78dc65c4b",
    "studentId": "f5269115-d04f-4424-9bbc-ffbf35974aca",
    "studentCode": "79805",
    "studentName": "M. Razka Raffasya",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "07d390ed-8902-42ed-81c5-9e9de9fd6ef0",
    "studentId": "f5269115-d04f-4424-9bbc-ffbf35974aca",
    "studentCode": "79805",
    "studentName": "M. Razka Raffasya",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6623ce01-fb8a-44fc-b900-0771ea2c9194",
    "studentId": "f552cd7d-a33f-441a-b8f2-f529514df6ed",
    "studentCode": "77599",
    "studentName": "Aida Syafira N.A",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 82,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "cb8fa904-d08e-46e0-9d49-cbdd70190b89",
    "studentId": "f552cd7d-a33f-441a-b8f2-f529514df6ed",
    "studentCode": "77599",
    "studentName": "Aida Syafira N.A",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d8fd1ca2-27bb-44b4-a1b2-b48d89882420",
    "studentId": "faf6d016-09db-47f7-88c1-93f2ba67a241",
    "studentCode": "66178",
    "studentName": "Prabu Wijaya",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "2113e199-be5a-4bf8-9015-f02ea9b999ec",
    "studentId": "faf6d016-09db-47f7-88c1-93f2ba67a241",
    "studentCode": "66178",
    "studentName": "Prabu Wijaya",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 82,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "bda4dc6c-bb9c-43c4-8a47-f1e52642fb35",
    "studentId": "fd6da340-cbd8-44e9-8d93-e97e51cbbe4d",
    "studentCode": "89919",
    "studentName": "Felisha Amara Gina",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3be25c13-053a-468d-ab1d-4bde1eeff22f",
    "studentId": "fd6da340-cbd8-44e9-8d93-e97e51cbbe4d",
    "studentCode": "89919",
    "studentName": "Felisha Amara Gina",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "7dabef06-8d4a-4097-a43a-e05f958728c9",
    "studentId": "ffdc0d9b-af62-4250-b6f4-b561bdda627f",
    "studentCode": "80218",
    "studentName": "Nurul Hasna Maulidyah",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6863c9fb-baa0-4ca7-8fff-e698d00cfc71",
    "studentId": "ffdc0d9b-af62-4250-b6f4-b561bdda627f",
    "studentCode": "80218",
    "studentName": "Nurul Hasna Maulidyah",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 86,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "49d33926-5ab8-469b-8605-af0b9746e972",
    "studentId": "001f391b-660f-46f6-a82e-d59a0bb45700",
    "studentCode": "86254",
    "studentName": "Raditya Riski Ramadhan ",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "67849f4d-ba3b-4360-8a57-2888da8d697b",
    "studentId": "04796f1c-9a95-475e-a8db-b8fd605ae5ad",
    "studentCode": "76123",
    "studentName": "Bima Sakti",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b8b60eb3-4718-4f43-b947-1bf0f5dae2b2",
    "studentId": "0f0efef9-eda5-4673-a26b-4007603410a3",
    "studentCode": "83063",
    "studentName": "Nayyara Febi Anjani",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "525de294-257c-442b-9c7d-67dceea1e71a",
    "studentId": "10451ac4-1e41-430d-b17d-01de8a19261e",
    "studentCode": "64628",
    "studentName": "Qintara Izatunnisya",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 99,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ce5b9813-8fff-4e19-9d60-133060e748cb",
    "studentId": "11a3901e-dae9-4902-a89e-578810a8fbad",
    "studentCode": "98124",
    "studentName": "Dzakiandra Putra",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 100,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ef419e51-0951-4257-9279-ed069c38f760",
    "studentId": "15de4d83-1d1b-4042-9bb4-9fdc65db1d3c",
    "studentCode": "67123",
    "studentName": "Hafiz Al-Faruq",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "254e9c59-3174-40aa-ac7f-89e3cc9efc7e",
    "studentId": "16d71476-7ec9-483a-a2b0-f1e9de3ade83",
    "studentCode": "65934",
    "studentName": "Rahajeng Ayu Kinanti",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 89,
    "note": "Sangat baik dalam operasi gabungan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "af4f934d-af2e-4bb5-a4d3-785524cae6c2",
    "studentId": "16f42f89-5c09-4b2b-9e8a-d01f7f275727",
    "studentCode": "18032",
    "studentName": "Areasely Naura Shada",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3bf8d821-1c69-4364-8693-b394e36ae92f",
    "studentId": "17a21047-a092-4964-a396-ea778093f34d",
    "studentCode": "52651",
    "studentName": "Ainan Nuri Sumayah",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4eb5acf0-bb99-417c-95cb-86101119d906",
    "studentId": "1d157032-9563-4b12-933f-f45078bd1646",
    "studentCode": "38910",
    "studentName": "Nabila Putri Ramadhani",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6065d3a8-3deb-41e3-884c-31207b5eade6",
    "studentId": "1e8d5ed6-e5b1-474e-8b64-24633476b6f9",
    "studentCode": "95219",
    "studentName": "Viola Alesha Ganes",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ae8cd6fb-97f0-47a4-a54b-06918194db5b",
    "studentId": "1eecdd5c-da28-4078-a890-b2abe0ebfc9d",
    "studentCode": "49625",
    "studentName": "Amara Alifah Fauziah",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "bf18d1f5-bd97-4e13-bf3f-56efa28fdcd5",
    "studentId": "20f9a9ba-13c7-4650-a900-61abd09ea07a",
    "studentCode": "22000",
    "studentName": "M. Hannan Habibillah",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "7cc09c02-0c77-4f57-a086-3e0b6b4c85e5",
    "studentId": "216e8e11-446a-46bd-8641-893961f9462f",
    "studentCode": "66787",
    "studentName": "Anindita Keisha Zahra",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 100,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "cde1d8ee-80db-461e-b59a-62cc27e2ecb5",
    "studentId": "239abe9a-3759-4677-be68-aa5f1ed2796c",
    "studentCode": "66538",
    "studentName": "Ananta Virya",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "be371725-fec6-4c33-a5d4-c91b1bbd3962",
    "studentId": "256ccdc6-5f78-4ce1-894e-4e6f8ee4800a",
    "studentCode": "33145",
    "studentName": "Syafiq Athallah",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "57750dcd-6f8c-4fb2-b046-c06a67ea0c4b",
    "studentId": "2643a6e6-fcc0-4c9f-81b1-db1d116e37cd",
    "studentCode": "89050",
    "studentName": "Arsyila Nasha Razita",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c43f3589-02c7-43b8-826c-ac0c8db78c0b",
    "studentId": "296a8d0a-9549-4f1a-b529-76eb203d8407",
    "studentCode": "24265",
    "studentName": "Rayendra Azzan Pramana",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "dc087b6f-be84-4672-82c1-99acd0ebff09",
    "studentId": "2ca10889-b780-4660-8022-c1b1a23d5ce2",
    "studentCode": "97375",
    "studentName": "Dzakiyyah Al Fajri ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f985259b-fd53-4f5d-823a-faa5f65be142",
    "studentId": "31486b62-e24d-4ded-a892-c9be9a9b68c3",
    "studentCode": "56840",
    "studentName": "Afrial Arsenio",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c38a19be-a69d-4602-99e4-9cf43944d225",
    "studentId": "32dad6a6-6729-4aed-a91c-885e1b685e4c",
    "studentCode": "21117",
    "studentName": "Natasya Elfani Alkhomah",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "01250bc8-348d-4f78-b775-ff0d2daf9f14",
    "studentId": "34f39374-825b-4c3e-8f5d-1e60dd92a722",
    "studentCode": "78700",
    "studentName": "M. Bintang Hisyam Naufal",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4a0a542f-5c51-4569-bad5-faa59187195b",
    "studentId": "352a42af-0c46-4373-9ac4-69a5282da28c",
    "studentCode": "21446",
    "studentName": "Ghumaisha",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c181ffda-a8fc-42a3-83fc-ba3c498dda5b",
    "studentId": "3989a228-cdd0-456b-aa91-b9be32522cb5",
    "studentCode": "31290",
    "studentName": "Daniswara Rizky",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "fd9e075e-273d-40a3-a6c1-919c3a32cf18",
    "studentId": "3d378546-ea52-4a13-8235-8ca01bf9c218",
    "studentCode": "53421",
    "studentName": "Nayla Khairunnisa",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6009389d-6a4c-4220-b012-cd7fe1461ba4",
    "studentId": "452fe4ee-e4c6-4e63-a83d-9f0829085e88",
    "studentCode": "65103",
    "studentName": "Najwa Khaira Wilda",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "315b43d2-8399-464e-ae32-9f76e736bc74",
    "studentId": "48721968-d3f2-4319-92be-7a5e972c106b",
    "studentCode": "55866",
    "studentName": "Bilqis Ufairah",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "62f855f8-536f-4e4f-aafb-7db52124ca4f",
    "studentId": "4964c094-f258-4fcb-94ed-1619344d0377",
    "studentCode": "47440",
    "studentName": "Najwa Alarifah",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 89,
    "note": "Sangat baik dalam operasi gabungan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "79fc0d14-e22e-4ae8-867e-a66be6a2b016",
    "studentId": "497ef1bb-d078-42af-a596-85d9d8c60bf0",
    "studentCode": "99133",
    "studentName": "Arsyila Nasha Razita",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 88,
    "note": "Sangat baik dalam operasi gabungan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0a35589b-eb06-497d-a328-5851c02ae390",
    "studentId": "4c5462b2-a318-45de-8ffd-293df12e4334",
    "studentCode": "40736",
    "studentName": "Aira Anatasya Putri",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "982296bc-ff31-47e9-a322-4584b5afeab5",
    "studentId": "4fae6a4c-8c08-4351-bb25-71e9db2e4ecb",
    "studentCode": "17055",
    "studentName": "Anandira Dyah Asmara Wati",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 87,
    "note": "Sangat baik dalam operasi gabungan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "29db3014-a34f-48e6-b8fa-1b2a205ee202",
    "studentId": "50d53115-8f00-40eb-90b0-1de731665ec4",
    "studentCode": "71940",
    "studentName": "Mahera Aiza Hilya",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3ca10e7d-6875-4d3d-877a-7fc5841d3ecc",
    "studentId": "51f2f51b-16db-42bc-8e24-c12e01e57977",
    "studentCode": "65815",
    "studentName": "Alesha Rafani Marta",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b3b4f02d-5014-4f27-9b2a-fc79eaab3674",
    "studentId": "5467d797-c061-4a6f-b981-86af0829951d",
    "studentCode": "43210",
    "studentName": "Luthfi Hakim",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 87,
    "note": "Sangat baik dalam operasi gabungan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5fb1f74b-b233-4252-8376-047d5cdae834",
    "studentId": "55e4f383-8f7f-43aa-ab5b-bf31aaa02b29",
    "studentCode": "77364",
    "studentName": "M. Fahrul Al Khafid",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "403a3ed2-baea-44eb-95c1-7b4a71426faa",
    "studentId": "5831e4e4-ad30-43d7-a4d5-a11dd3b46508",
    "studentCode": "57508",
    "studentName": "Raffasya Abizar Raqilla",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "66f976c9-375f-4fb4-8aac-2607860c0ff5",
    "studentId": "58a9b1e8-fe4b-4471-8ddc-05548604fe49",
    "studentCode": "67358",
    "studentName": "Nayla Inara Putri",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 100,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "41fe02eb-5616-4448-b718-83807cde3ecd",
    "studentId": "590ba72b-cae9-4773-9863-ac46b48e4eb1",
    "studentCode": "91212",
    "studentName": "Ajeng Cahyra Naifasha",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "150edf0d-82bb-402b-a93f-0bb7bccc6e52",
    "studentId": "5a5302cf-3115-45c1-ae89-20208f8bd5f5",
    "studentCode": "81234",
    "studentName": "Keysha Anindya",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "30864760-776e-4efe-a56e-2d872a542a06",
    "studentId": "5c74b85c-f840-4649-ab72-e572843d8848",
    "studentCode": "29797",
    "studentName": "Aqila Fahmida",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 99,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a640710a-6fc1-4b47-8326-5087a89db11d",
    "studentId": "5f15914c-65c0-4824-8170-2bc66288ae8d",
    "studentCode": "12232",
    "studentName": "Nathania Azkadina Farzana",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 87,
    "note": "Sangat baik dalam operasi gabungan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6319c81e-4d1a-43eb-a1ee-26296af0fcfa",
    "studentId": "5f779113-fdc7-4393-8537-b28f76db27a9",
    "studentCode": "44512",
    "studentName": "Raisya Salsabila",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6c0743d2-95ab-4b21-ba79-ad112ecc8b98",
    "studentId": "64dd1749-efcb-40c0-97e6-a30d772e50e0",
    "studentCode": "72190",
    "studentName": "Rayhan Pratama",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "9bfd9c91-6944-4384-9ab6-17632a8af789",
    "studentId": "657f7d55-4398-4d8e-a44d-1f6eb84a61c0",
    "studentCode": "30400",
    "studentName": "Shofiyah ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f08ae5c6-1787-40c0-854f-78d1b17795c2",
    "studentId": "68d5295b-bde7-4391-bab3-68255dcee983",
    "studentCode": "78123",
    "studentName": "Gladis Anindita",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "2b60615c-bf62-4f86-824e-a568bc9813de",
    "studentId": "68d57e75-a2d2-4251-b6a7-541c3bc9c15d",
    "studentCode": "66458",
    "studentName": "Adeeva Afsheen Myesha",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 100,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a177d094-4a11-4f26-aee3-e4bae209f5b4",
    "studentId": "6c51a4cb-002b-4b1f-a757-d0920e3043d9",
    "studentCode": "86190",
    "studentName": "EL FIRQOTUN AN NAJIYAH",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "680d89a6-285f-4c84-bcfd-6912052d1d0e",
    "studentId": "6c55f895-276b-4955-ab24-223af3c42bea",
    "studentCode": "67890",
    "studentName": "Fathir Ahmad",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 99,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "85932e7c-01ed-4f0e-8b62-7963534a6b2e",
    "studentId": "6d947da3-e268-4b69-ab42-820c9b48132e",
    "studentCode": "70553",
    "studentName": "Shaqia Azzahra Rahayu",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 88,
    "note": "Sangat baik dalam operasi gabungan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5243e5f8-3073-4cbd-8716-c5da173b8ac5",
    "studentId": "6f029f4e-d64a-4e54-a105-915d6be1e055",
    "studentCode": "79679",
    "studentName": "Nashwa Zahira Fahrefi ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a220b785-98e2-43b6-b146-9881d62eb10e",
    "studentId": "700c0ee2-035a-4a13-bdba-e806864acd95",
    "studentCode": "31144",
    "studentName": "Uwais",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f21e8ffe-3797-491a-bede-2335e64dc7b4",
    "studentId": "7169f097-8bf5-40dd-934e-0f5460261c04",
    "studentCode": "20080",
    "studentName": "M. Hannan Habibillah",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 100,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "59294283-748f-489c-91ca-c44f290587ca",
    "studentId": "7263e6e3-a667-4f35-82e4-90cd8b59b2b8",
    "studentCode": "66469",
    "studentName": "Abrisam",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 88,
    "note": "Sangat baik dalam operasi gabungan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "66a2925d-a68d-448d-aeb1-a61cd87be11f",
    "studentId": "746c4af0-24e7-44b9-b255-256bc96cd47d",
    "studentCode": "84072",
    "studentName": "Ajeng Chaira Naifasha",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 89,
    "note": "Sangat baik dalam operasi gabungan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "46561e3d-8115-497a-8ca4-c21595d88a2c",
    "studentId": "75075ab4-09b7-4059-8b60-561f8ea52ebe",
    "studentCode": "11653",
    "studentName": "Zulfan Azhar Raihan",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "2b7acb7d-e1fb-4e59-960b-7e2e6396063f",
    "studentId": "7c900a4b-3261-46f2-9990-e54fbc729e3d",
    "studentCode": "38952",
    "studentName": "Kheyra Candra ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d9490726-f32c-4665-857a-06b583349c32",
    "studentId": "873cf03f-d94e-41c1-a8d8-44ea933c1d93",
    "studentCode": "93060",
    "studentName": "Arka Prapta Ardani",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 89,
    "note": "Sangat baik dalam operasi gabungan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b5c5a8cc-28c2-42ef-b1c4-dbbaa2c037a6",
    "studentId": "8e4bf798-43a8-4def-ad68-252c3035dd84",
    "studentCode": "43183",
    "studentName": "Habib Fadhil Abidin",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "7f06a2eb-22b5-45c4-a28f-48c5a36f6f38",
    "studentId": "8f01e65d-d43c-4d38-8e10-16f48712cffe",
    "studentCode": "14999",
    "studentName": "Adeeva Afsheen Myesha",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "766dd879-9534-42d0-8772-65f17bd8bdce",
    "studentId": "90d546d9-0f7c-4cdf-8351-5e854cce406c",
    "studentCode": "17246",
    "studentName": "Haris",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "53fd363f-5ee9-4589-bd83-0657e9d1b454",
    "studentId": "92d33126-0c86-4472-8a43-01098bf61c00",
    "studentCode": "95701",
    "studentName": "Azila Quira Zulda",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ad3e3bd2-bdf7-40a9-bd84-f58c2a4e045e",
    "studentId": "96bd8abf-ce5e-42c0-8a3f-4d7549f8a2e9",
    "studentCode": "57782",
    "studentName": "Muwaffaq ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6f9f99db-3a1b-4d61-ad8f-82dddf78ddac",
    "studentId": "981d918a-8b29-4b3f-b7e7-7d0baedae5b6",
    "studentCode": "15367",
    "studentName": "Aida Syafira N.A",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 99,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "009687b5-12c8-4a64-b629-7afe8a47b5ef",
    "studentId": "98a69eaa-3d7a-4363-9958-755501175aee",
    "studentCode": "11687",
    "studentName": "Yusuf Alfarizky Sugara",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 100,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "694ce6cf-2474-458d-b525-fb5f12af862e",
    "studentId": "9997dcfe-ef86-40c4-a197-f1e968484719",
    "studentCode": "70066",
    "studentName": "M. Rafa Raditia",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8708bf54-cfd5-4b0c-b835-abb90984ba31",
    "studentId": "9ae2069c-c732-4461-ae86-f18cffca1178",
    "studentCode": "45237",
    "studentName": "Arka Prapdipta Ardani",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "9b4e65d5-ee7a-412f-8d47-b44063240e88",
    "studentId": "9c48106c-acd2-4a23-8ac3-543d94de143d",
    "studentCode": "50999",
    "studentName": "Abdan Zulfadli Fahyan",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4a9e0c5d-e47f-4627-af0d-19ceab15fcf0",
    "studentId": "9d9977fb-1a91-47b4-99df-288cc648d437",
    "studentCode": "55148",
    "studentName": "M. Hafizhan Khairan ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "31de4b34-d2fd-49d2-8364-fe63015a17d9",
    "studentId": "9e1eea3b-215f-41c6-b662-89e0f7bbac6a",
    "studentCode": "48291",
    "studentName": "Haura",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "af789e74-81ba-4f61-a1fa-8326763e0ee9",
    "studentId": "9f60be52-54d6-41df-a0b8-f1de43bbd7f7",
    "studentCode": "74789",
    "studentName": "M. Dhaffa Athallah",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 100,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "96efdd9a-4c6b-4941-ad26-0d03f32ad6fb",
    "studentId": "a32a3e2b-2898-4a12-a20f-a2cb15c3ca22",
    "studentCode": "10650",
    "studentName": "Aishwa Rahma Annida",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "251f5724-bcf7-43c3-a842-8227dfc7c9bc",
    "studentId": "a6c9d744-dcac-4377-b0a0-0d2a140c1257",
    "studentCode": "44156",
    "studentName": "Rafa Al-Ghifari",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f25452eb-a993-44a7-bea3-b6affd01c660",
    "studentId": "aa3fff59-d27e-4851-a660-ceaf1d8e9ade",
    "studentCode": "90123",
    "studentName": "Muhammad Azka",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "06f60804-2f71-43b0-946e-cea6d9493d6c",
    "studentId": "ac9180e4-fedf-4941-b3c7-ca9cda665d88",
    "studentCode": "79000",
    "studentName": "Aishwa Rahma Annida",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "2d644d72-bf9d-4061-b9f4-deb3219905ec",
    "studentId": "ade8738b-9e7a-4b56-9de7-169e74e714c1",
    "studentCode": "93231",
    "studentName": "Ghumaisha  ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "1bda4035-d089-4d4c-8e63-9f01273b541b",
    "studentId": "ae6f604a-c5a1-48a0-a65c-776edc69b777",
    "studentCode": "54321",
    "studentName": "Kevin Pratama",
    "className": "CLASS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "1a37902b-0dcf-44a6-9fec-13cfe3e1caab",
    "studentId": "afff798e-f6eb-4730-883b-cebf7ee93880",
    "studentCode": "41984",
    "studentName": "Asheqa Shaqueena Qotrunada",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c7c62f79-b7e8-4e68-aee8-3925aa5327ab",
    "studentId": "b0655f2e-a8c9-4320-9ad7-1e85f7e120ce",
    "studentCode": "88190",
    "studentName": "M. Rayyan Al-Fatih",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 99,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d8d8ee69-36ba-451c-b849-e8a7a07819f9",
    "studentId": "b252f9f5-a288-433f-9ad7-ac52dbb7a9a7",
    "studentCode": "52809",
    "studentName": "Anandira Dyah Asmarawati",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "606e4cc4-6ee2-4d10-99ef-6b7910f038d1",
    "studentId": "b42ef79c-f9c9-4972-8f36-525ec014240e",
    "studentCode": "51380",
    "studentName": "Maulana Syarif Wardani",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "9be50e77-3231-47ef-a970-e0229bd30c55",
    "studentId": "bb043228-0521-4772-8409-ffb114dea44d",
    "studentCode": "77189",
    "studentName": "Naura Zafira",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "7c47ca4f-aaf9-41ee-9eae-e560b78128d5",
    "studentId": "beacabdd-33b2-4d0c-a7fa-df2c0b3a0570",
    "studentCode": "23866",
    "studentName": "Hamid Al Irsad",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 89,
    "note": "Sangat baik dalam operasi gabungan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "dbcc626b-663f-4f6e-8c9e-d46b4f19791e",
    "studentId": "c1ccae6d-ae43-4bbf-b539-4c1c96c9c16b",
    "studentCode": "41209",
    "studentName": "Fakhri Al-Ghifari",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8ea9c42b-0cba-4c06-88d5-4637a49f39a0",
    "studentId": "c3dd210c-9220-4055-b57e-5ced60c906c7",
    "studentCode": "48712",
    "studentName": "Kenzo Alvaro",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f9edf9e3-31ad-4fa4-9861-e7db571144f0",
    "studentId": "c3f5334a-642b-4e05-a980-bbbc4442438b",
    "studentCode": "31996",
    "studentName": "Aira Anatasya Putri",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "1fbc2d80-5be9-456e-beb4-e1c9a1b5266f",
    "studentId": "c407aac0-a001-4ce4-8aff-85634e737f3c",
    "studentCode": "86280",
    "studentName": "Arsy Akifa Salsabila",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "78100ac3-7b88-416c-b0a7-ec85251a05ba",
    "studentId": "c5767e1d-86a4-4fdd-9bb1-f1a64bed4a6f",
    "studentCode": "17366",
    "studentName": "Abizar Rahandika Alghifari",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 89,
    "note": "Sangat baik dalam operasi gabungan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "cee60122-9df7-48a2-9d5c-ce35973d7f72",
    "studentId": "c76503ff-a1d9-45ee-815e-35e24c8f7c7c",
    "studentCode": "33918",
    "studentName": "Calista Azkadina",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c037f37e-99f3-4465-a176-7f8dba43fbb8",
    "studentId": "ca9930de-9661-4823-a0e9-29621ef4f208",
    "studentCode": "32460",
    "studentName": "Shaqia Azzahra Rahayu",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "1fda90e9-f14c-4fd9-b834-97b5335ca119",
    "studentId": "cb436508-3a4d-49c9-85c5-636ea9e93e88",
    "studentCode": "89123",
    "studentName": "Citra Kirana",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 100,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d6b385d0-9e52-430d-a4d6-b518d83c7404",
    "studentId": "ce034bcc-b39d-4fb6-a751-19dbf3371ab2",
    "studentCode": "59012",
    "studentName": "Zahrana Azzahra",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c4fc00d5-30b8-4635-a24f-44c58d884331",
    "studentId": "cea06363-69e7-47b6-9f47-1a7716561f7d",
    "studentCode": "65603",
    "studentName": "Aqila Fahmida",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "fcf4ceb9-faf5-4169-a129-04cd7e05f6e7",
    "studentId": "cf26ab88-2a73-4162-8b55-810b69acb071",
    "studentCode": "35955",
    "studentName": "Abyan Azka Abdillah",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 87,
    "note": "Sangat baik dalam operasi gabungan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d6de7c42-3699-4656-86cb-d93d42e0de79",
    "studentId": "d0eaf62d-32db-4518-9ba9-35183a533bef",
    "studentCode": "88692",
    "studentName": "Arasely Naura Shada",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e4b6a0b7-84cb-45c6-9fef-8bb47c24d451",
    "studentId": "d5730b58-7251-402b-9059-cc8a9047dc2e",
    "studentCode": "13042",
    "studentName": "Zian Abdi Pratama ",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "71c3bfd3-b75f-4c0a-a3fd-abd8ed368f05",
    "studentId": "d59d6d2c-166e-4f78-85f0-f3c346278122",
    "studentCode": "69413",
    "studentName": "Zafran Rafisqi",
    "className": "Kelas D",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 100,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f9856e91-5eac-457c-a336-3db61de21658",
    "studentId": "d6be9a6d-26fa-43ac-a80a-6ee5f30b80b4",
    "studentCode": "95452",
    "studentName": "Ananta Virya",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 100,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "fed1976d-0c96-4e7e-b300-1bb35f209127",
    "studentId": "d8340cb1-f138-425b-84ee-080de2586ece",
    "studentCode": "77435",
    "studentName": "Geofanny Gareos  P.K.B",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "20e876fd-ffca-4ad7-8071-3b00a48a9322",
    "studentId": "d83505ed-0060-453a-9689-4dbf49f87bb8",
    "studentCode": "81124",
    "studentName": "Abrisam",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "fea4bd13-0ed6-447a-9142-bd94905146c9",
    "studentId": "d8d8fd71-2a09-4ee9-8bab-723d01afcce5",
    "studentCode": "47603",
    "studentName": "Yusuf Syauqy Syahid",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "47e411e4-cec2-4109-91e2-9b2b28ba9a17",
    "studentId": "db3d66d8-d162-4032-a6df-cb222d521c53",
    "studentCode": "44789",
    "studentName": "Maulana Syarif Wardhani",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "dbeae3b7-b9f3-4be0-9ad5-b2d4a5e00e1e",
    "studentId": "dd652c0e-1633-4495-8ff4-16c4cacc3ffc",
    "studentCode": "22134",
    "studentName": "Tiara Andini",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 87,
    "note": "Sangat baik dalam operasi gabungan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "657149b8-abc5-48db-a2c6-1904df322750",
    "studentId": "dec5e211-a360-4207-83fb-9771011fab2f",
    "studentCode": "10409",
    "studentName": "Sarah ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c4f497a7-d250-4da0-9e8c-1ab9a96d8e1f",
    "studentId": "e02583be-1443-414b-a37c-90e612bcd317",
    "studentCode": "61022",
    "studentName": "Bagas Pratama Putra",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c8581f37-3ccd-461c-b755-c5c48fd4a7b3",
    "studentId": "e08d4e8d-5858-4762-af6b-dfe5ff031bb9",
    "studentCode": "78564",
    "studentName": "Alesha Rafani Marta",
    "className": "Kelas A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 88,
    "note": "Sangat baik dalam operasi gabungan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ab94fc56-4ffd-4503-ad7d-56ec3f8e1b80",
    "studentId": "e0f01c5d-a021-45d7-9828-102cb091a16d",
    "studentCode": "13846",
    "studentName": "Musyaffa' ",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e538b899-ade1-426a-a406-a80783d8e45d",
    "studentId": "e8375491-10a6-4a3e-a632-733721808900",
    "studentCode": "68766",
    "studentName": "Kristian Naibaho",
    "className": "CLASS C",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "1076ad02-9fa6-4b50-8337-5948817c4b95",
    "studentId": "edfa74c0-7a6c-421e-b5a3-142f80563a3c",
    "studentCode": "34581",
    "studentName": "Dzakiyyah Al Fajri",
    "className": "Kelas B",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a1810f94-7f4f-4b3f-92cb-2972268cdd44",
    "studentId": "ee84a828-abc0-41c5-9ead-d79ff2056910",
    "studentCode": "96166",
    "studentName": "Ayunda Shela Ferlita ",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 87,
    "note": "Sangat baik dalam operasi gabungan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "47299350-3e87-425a-b154-c9d19c80e40c",
    "studentId": "f20782b9-17ab-40f2-b315-7ad3aadc2739",
    "studentCode": "62901",
    "studentName": "Syakira Nur Aini",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "43d326ee-b1f9-4ec0-b113-36d3c5188da5",
    "studentId": "f2dcf39c-3131-497a-bce7-996dbeff9d62",
    "studentCode": "68933",
    "studentName": "Abizar Rahandika Alghifari",
    "className": "CLASS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "17e562ce-3834-4cea-9b74-861f5ba4cf43",
    "studentId": "f5269115-d04f-4424-9bbc-ffbf35974aca",
    "studentCode": "79805",
    "studentName": "M. Razka Raffasya",
    "className": "KELAS B",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a2218754-2fb3-4435-b4c1-7db138462ad8",
    "studentId": "f552cd7d-a33f-441a-b8f2-f529514df6ed",
    "studentCode": "77599",
    "studentName": "Aida Syafira N.A",
    "className": "KELAS A1",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f0764525-d93d-4320-a13e-22de5ad9bcf0",
    "studentId": "f8916605-5eff-48c0-bd51-8301e015b855",
    "studentCode": "59847",
    "studentName": "Haris ",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "313cbe86-9868-472e-8ad9-0066e2191a49",
    "studentId": "f9ce8b07-5738-4c29-8ecc-048807666d4c",
    "studentCode": "61298",
    "studentName": "Dimas Arya Sena",
    "className": "Kelas A",
    "branch": "Singkut",
    "branchId": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "topic": "Penjumlahan puluhan dan satuan",
    "examDate": "2026-09-27",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "786c0d14-9d99-4078-b0a9-e64e3041871a",
    "studentId": "faf6d016-09db-47f7-88c1-93f2ba67a241",
    "studentCode": "66178",
    "studentName": "Prabu Wijaya",
    "className": "CLASS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c356c781-fd3c-46b3-bf4d-8fe656cd9731",
    "studentId": "fd6da340-cbd8-44e9-8d93-e97e51cbbe4d",
    "studentCode": "89919",
    "studentName": "Felisha Amara Gina",
    "className": "KELAS C",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "42168a97-7c5d-4196-96c1-5776f355eae0",
    "studentId": "ffdc0d9b-af62-4250-b6f4-b561bdda627f",
    "studentCode": "80218",
    "studentName": "Nurul Hasna Maulidyah",
    "className": "KELAS A2",
    "branch": "Tabir Timur",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 100,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  }
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
  // Cabang Singkut
  {
    id: "2407c1b7-5974-486d-a395-71a0acb4b805",
    orderIndex: 1,
    levelTitle: "Level Dasar: Pengenalan Simbol Jari",
    shortDesc: "Pengenalan simbol jari bilangan satuan dan puluhan (0-99)",
    learningGoals:
      "Peserta didik mampu mengenal, membaca, dan membentuk simbol jari bilangan 0-99 menggunakan tangan kanan dan kiri.",
    competencies:
      "KD D.1 Menguasai simbol jari 0-9. KD D.2 Menguasai puluhan 10-90. KD D.3 Membaca 0-99.",
    learningMaterials:
      "1. Pengenalan simbol 0-9 tangan kanan\n2. Puluhan tangan kiri\n3. Flashcard simbol\n4. Senam motorik jari",
    indicators: [
      "Mempraktikkan simbol jari satuan 0-9",
      "Membaca simbol puluhan tangan kiri",
      "Membentuk formasi angka acak dalam 3 detik",
    ],
    branch: "Singkut",
  },
  {
    id: "dd20d512-95ff-47a1-9a4c-781e38dea8c2",
    orderIndex: 2,
    levelTitle: "Level 1: Penjumlahan & Pengurangan Angka Satuan",
    shortDesc: "Gerak motorik buka tutup jari langsung tanpa rumus",
    learningGoals:
      "Melakukan operasi penjumlahan dan pengurangan satuan secara reflek dan cepat.",
    competencies:
      "KD 1.1 Penjumlahan satuan langsung. KD 1.2 Pengurangan satuan langsung. KD 1.3 Berhitung cepat berantai 3 baris.",
    learningMaterials:
      "1. Aturan jari naik (+)\n2. Aturan jari turun (-)\n3. Mencongak refleks\n4. Kuis 1 menit 10 soal",
    indicators: [
      "Operasi jari jempol (nilai 5) refleks",
      "Pengurangan tanpa ragu < 3 detik",
      "Akurasi kuis 100%",
    ],
    branch: "Singkut",
  },
  {
    id: "2db83a59-35f1-4430-85b7-059a86adf521",
    orderIndex: 3,
    levelTitle: "Level 2: Kombinasi Rumus Teman Kecil",
    shortDesc: "Formula teman kecil (angka 5) dan kombinasi puluhan",
    learningGoals:
      "Memahami konsep teman kecil dan menyelesaikan penjumlahan/pengurangan ketika jari tidak mencukupi.",
    competencies:
      "KD 2.1 Teman kecil tambah (+4=+5-1, dst). KD 2.2 Teman kecil kurang (-4=-5+1, dst).",
    learningMaterials:
      "1. Pasangan teman kecil (1&4, 2&3)\n2. Gerakan kombinasi jempol dan telunjuk\n3. Soal cerita kontekstual",
    indicators: [
      "Menyebut pasangan teman kecil spontan",
      "Mengoperasikan rumus tanpa jeda",
    ],
    branch: "Singkut",
  },

  // Cabang Tabir Timur
  {
    id: "tabir-lvl-dasar-init",
    orderIndex: 1,
    levelTitle: "Level Dasar: Pengenalan Simbol Jari",
    shortDesc: "Pengenalan simbol jari bilangan satuan dan puluhan (0-99)",
    learningGoals:
      "Peserta didik mampu mengenal, membaca, dan membentuk simbol jari bilangan 0-99 menggunakan tangan kanan dan kiri.",
    competencies:
      "KD D.1 Menguasai simbol jari 0-9. KD D.2 Menguasai puluhan 10-90. KD D.3 Membaca 0-99.",
    learningMaterials:
      "1. Pengenalan simbol 0-9 tangan kanan\n2. Puluhan tangan kiri\n3. Flashcard simbol\n4. Senam motorik jari",
    indicators: [
      "Mempraktikkan simbol jari satuan 0-9",
      "Membaca simbol puluhan tangan kiri",
      "Membentuk formasi angka acak dalam 3 detik",
    ],
    branch: "Tabir Timur",
  },
  {
    id: "tabir-lvl-1-init",
    orderIndex: 2,
    levelTitle: "Level 1: Penjumlahan dan Pengurangan Dasar",
    shortDesc: "Gerak motorik buka tutup jari langsung tanpa rumus",
    learningGoals:
      "Melakukan operasi penjumlahan dan pengurangan satuan secara reflek dan cepat.",
    competencies:
      "KD 1.1 Penjumlahan satuan langsung. KD 1.2 Pengurangan satuan langsung. KD 1.3 Berhitung cepat berantai 3 baris.",
    learningMaterials:
      "1. Aturan jari naik (+)\n2. Aturan jari turun (-)\n3. Mencongak refleks\n4. Kuis 1 menit 10 soal",
    indicators: [
      "Operasi jari jempol (nilai 5) refleks",
      "Pengurangan tanpa ragu < 3 detik",
      "Akurasi kuis 100%",
    ],
    branch: "Tabir Timur",
  },
  {
    id: "tabir-lvl-2-init",
    orderIndex: 3,
    levelTitle: "Level 2: Kunci Jempol",
    shortDesc: "Formula teman kecil (angka 5) dan kombinasi puluhan",
    learningGoals:
      "Memahami konsep teman kecil dan menyelesaikan penjumlahan/pengurangan ketika jari tidak mencukupi.",
    competencies:
      "KD 2.1 Teman kecil tambah (+4=+5-1, dst). KD 2.2 Teman kecil kurang (-4=-5+1, dst).",
    learningMaterials:
      "1. Pasangan teman kecil (1&4, 2&3)\n2. Gerakan kombinasi jempol dan telunjuk\n3. Soal cerita kontekstual",
    indicators: [
      "Menyebut pasangan teman kecil spontan",
      "Mengoperasikan rumus tanpa jeda",
    ],
    branch: "Tabir Timur",
  },
];

const INITIAL_LEVEL_COLUMNS: LevelProgressionConfig[] = [
  // Cabang Singkut
  { id: "lvl-1", levelNumber: 1, name: "Level 1", description: "Penjumlahan & Pengurangan Satuan Langsung", branch: "Singkut" },
  { id: "lvl-2", levelNumber: 2, name: "Level 2", description: "Kombinasi Rumus Teman Kecil (Basis 5)", branch: "Singkut" },
  { id: "lvl-3", levelNumber: 3, name: "Level 3", description: "Kombinasi Rumus Teman Besar & Campuran", branch: "Singkut" },

  // Cabang Tabir Timur
  { id: "tabir-lvlprog-1", levelNumber: 1, name: "Level 1", description: "Penjumlahan & Pengurangan Satuan Langsung", branch: "Tabir Timur" },
  { id: "tabir-lvlprog-2", levelNumber: 2, name: "Level 2", description: "Kombinasi Rumus Teman Kecil (Basis 5)", branch: "Tabir Timur" },
  { id: "tabir-lvlprog-3", levelNumber: 3, name: "Level 3", description: "Kombinasi Rumus Teman Besar & Campuran", branch: "Tabir Timur" },
];

const INITIAL_STUDENT_LEVEL_RECORDS: StudentLevelRecord[] = [
  { id: "slr-1-1", studentId: "ef8da238-f2e5-47cf-a3d5-7f620e5ec8d8", levelId: "lvl-1", passedDate: "2025-05-10", notes: "Lulus evaluasi jari tangan satuan" },
  { id: "slr-1-2", studentId: "ef8da238-f2e5-47cf-a3d5-7f620e5ec8d8", levelId: "lvl-2", passedDate: "2025-09-14", notes: "Lulus rumus teman kecil" },
  { id: "slr-1-3", studentId: "ef8da238-f2e5-47cf-a3d5-7f620e5ec8d8", levelId: "lvl-3", passedDate: "2026-02-20", notes: "Lulus Level 3 nilai sangat baik" },
  { id: "slr-2-1", studentId: "d4f895ab-5484-4861-a5bf-8a5fffe2027e", levelId: "lvl-1", passedDate: "2025-04-18", notes: "Lulus tes kuis cepat" },
  { id: "slr-2-2", studentId: "d4f895ab-5484-4861-a5bf-8a5fffe2027e", levelId: "lvl-2", passedDate: "2025-10-02", notes: "Lulus rumus teman kecil" },
  { id: "slr-3-1", studentId: "75cba270-36a8-4c8d-8fb2-540192e21245", levelId: "lvl-1", passedDate: "2025-06-12", notes: "Lulus ujian dasar" },
  { id: "slr-4-1", studentId: "e1b5cf3c-5353-4a1a-a1b7-a36746816409", levelId: "lvl-1", passedDate: "2025-05-25", notes: "Lulus nilai sempurna" },
  { id: "slr-4-2", studentId: "e1b5cf3c-5353-4a1a-a1b7-a36746816409", levelId: "lvl-2", passedDate: "2025-11-15", notes: "Lulus Level 2" },
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
  tagline: "Bimbel Berhitung Cepat Jaritmatika No. 1 di Sarolangun & Merangin",
  headline: "SELAMAT DATANG DI MATH FINGERS INDONESIA",
  subheadline:
    "Mengoptimalkan potensi kecerdasan otak kanan dan kiri anak melalui formasi 10 jari tangan tanpa sempoa dan tanpa kalkulator. Belajar asyik, berhitung cepat akurat, dan percaya diri!",
  promoBanner: "🎉 PROMO SPESIAL GELOMBANG BARU: Diskon Biaya Pendaftaran 50% + Modul Belajar & Kartu Digital!",
  promoActive: true,
  whatsappNumber: "6281279498907",
  whatsappGreeting: "Halo Math Fingers, saya ingin info pendaftaran les Jaritmatika dan jadwal Trial Class gratis untuk anak saya.",
  targetDiscount: "50% OFF",
  heroImage: "/images/landing/hero-kids.jpg",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  aboutTitle: "Metode 10 Jari Alami: Kalkulator Pintar yang Selalu Melekat",
  aboutDesc1:
    "Math Fingers hadir memberikan solusi belajar berhitung yang membahagiakan. Melalui formasi 10 jari tangan yang terstandarisasi, anak diajarkan mengolah logika matematika tanpa memerlukan alat bantu sempoa fisik atau kalkulator.",
  aboutDesc2:
    "Metode ini secara aktif melatih sinkronisasi otak kiri (daya logika dan rumus hitung) dengan otak kanan (imajinasi visual gerak jari). Anak tidak lagi menghafal rumus secara mekanis, melainkan memahami konsep angka dengan cepat, tepat, dan gembira.",
  aboutImage: "/images/landing/about-teacher.jpg",
  teacherBadgeText: "8+ Tutor Pengajar",
  teacherBadgeDesc: "Tersertifikasi Nasional & Ramah Anak",
  programsBgImage: "/images/landing/programs-bg.jpg",
  curriculumTitle: "Eksplorasi Program Unggulan Math Fingers",
  curriculumDesc:
    "Setiap anak memiliki ritme belajar unik. Kami menyusun kurikulum berjenjang dari usia 4 hingga 12 tahun yang diuji secara berkala dengan Rapor Kompetensi Digital dan Sertifikat Resmi.",
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
    storyNumber: "01",
    title: "Dari Takut Matematika, Kini Jadi Juara Berhitung di Sekolah",
    parentName: "Bunda Rasyid",
    studentName: "M. Rasyid Al-Fatih",
    role: "Siswa SD IT Al-Madani (Level Dasar)",
    branch: "Cabang Singkut",
    rating: 5,
    comment:
      "Awalnya Rasyid selalu cemas tiap PR berhitung. Setelah 4 bulan di Math Fingers Singkut, jarinya bergerak lincah dan nilai matematikanya naik drastis jadi 95!",
    avatarUrl: "/images/landing/student-story.jpg",
  },
  {
    id: "testi-2",
    storyNumber: "02",
    title: "Metode Jari Tangan Praktis, Ujian Sekolah Tanpa Alat Bantu",
    parentName: "Ayahanda Kayla",
    studentName: "Kayla Putri Azzahra",
    role: "Alumni Level Mahir (SDN 02 Bangko)",
    branch: "Cabang Bangko",
    rating: 5,
    comment:
      "Sangat puas dengan metode Math Fingers. Waktu ujian di sekolah kan dilarang bawa kalkulator atau sempoa, jari tangan Kayla langsung jadi kalkulator kilat yang selalu siap.",
    avatarUrl: "/images/landing/about-teacher.jpg",
  },
  {
    id: "testi-3",
    storyNumber: "03",
    title: "Belajar Membaca Menyenangkan, 3 Bulan Langsung Lancar Tanpa Mengeja",
    parentName: "Mama Rayyan",
    studentName: "Rayyan Danendra (5 Tahun)",
    role: "Kelas Les Membaca Cepat Fonik",
    branch: "Cabang Singkut",
    rating: 5,
    comment:
      "Tutornya luar biasa sabar dan penuh kasih. Rayyan yang tadinya sulit fokus sekarang antusias membaca buku cerita sendiri setiap malam sebelum tidur.",
    avatarUrl: "/images/landing/hero-kids.jpg",
  },
];

const INITIAL_LANDING_NEWS: LandingNewsItem[] = [
  {
    id: "news-1",
    title: "Ujian Kenaikan Level Semester: Puluhan Siswa Raih Nilai Sempurna",
    category: "PRESTASI & SERTIFIKASI",
    date: "15 Sep 2026",
    author: "Tim Akademik Math Fingers",
    image: "/images/landing/student-story.jpg",
    summary:
      "Pemberian piagam penghargaan resmi dan evaluasi rapor kompetensi digital bagi siswa yang menuntaskan level dasar.",
    orderIndex: 1,
    isActive: true,
  },
  {
    id: "news-2",
    title: "Tips Efektif Mendampingi Anak Belajar Matematika di Rumah Tanpa Stres",
    category: "EDUKASI ORANG TUA",
    date: "10 Sep 2026",
    author: "Ustadzah Sri Wahyuni, S.Pd.I",
    image: "/images/landing/about-teacher.jpg",
    summary:
      "Pendekatan positif agar anak tidak trauma angka: gunakan permainan visual dan apresiasi proses belajar jari tangan.",
    orderIndex: 2,
    isActive: true,
  },
  {
    id: "news-3",
    title: "Inovasi Kartu QR Digital: Orang Tua Pantau Absensi & Nilai Siswa Real-time",
    category: "TEKNOLOGI EDUKASI",
    date: "05 Sep 2026",
    author: "Manajemen Sistem",
    image: "/images/landing/programs-bg.jpg",
    summary:
      "Kemudahan integrasi notifikasi presensi otomatis dan riwayat jurnal perkembangan belajar langsung ke WhatsApp wali murid.",
    orderIndex: 3,
    isActive: true,
  },
  {
    id: "news-4",
    title: "Gebyar Milad Math Fingers: Lomba Hitung Cepat dan Pentas Bakat Siswa",
    category: "KEGIATAN & EVENT",
    date: "28 Agu 2026",
    author: "Panitia Milad",
    image: "/images/landing/hero-kids.jpg",
    summary:
      "Kemeriahan lomba ketangkasan 10 jari diikuti oleh ratusan siswa dari Cabang Singkut dan Cabang Bangko.",
    orderIndex: 4,
    isActive: true,
  },
];

const INITIAL_LANDING_EVENTS: LandingEventItem[] = [
  {
    id: "ev-1",
    day: "25",
    month: "SEP",
    title: "Trial Class Gratis Serentak Akhir Pekan",
    time: "14:00 – 16:00 WIB",
    location: "Cabang Singkut & Cabang Bangko",
    desc: "Sesi terbuka bagi orang tua dan ananda untuk mencoba langsung metode jari tangan dan konsultasi kurikulum.",
    orderIndex: 1,
    isActive: true,
  },
  {
    id: "ev-2",
    day: "01",
    month: "OKT",
    title: "Pembukaan Pendaftaran Gelombang Baru (Diskon 50%)",
    time: "08:00 – 17:00 WIB",
    location: "Pendaftaran Online & Kantor Cabang",
    desc: "Dapatkan potongan uang pendaftaran 50% dan bonus modul belajar lengkap serta kartu digital siswa.",
    orderIndex: 2,
    isActive: true,
  },
  {
    id: "ev-3",
    day: "18",
    month: "OKT",
    title: "Lomba Hitung Cepat 10 Jari Antar Siswa Math Fingers",
    time: "09:00 – 12:00 WIB",
    location: "Gedung Serbaguna Cabang Singkut",
    desc: "Ajang uji kecepatan, ketelitian, dan sportivitas berhitung jaritmatika dengan piala serta beasiswa belajar.",
    orderIndex: 3,
    isActive: true,
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
  const [landingNews, setLandingNews] = useState<LandingNewsItem[]>(INITIAL_LANDING_NEWS);
  const [landingEvents, setLandingEvents] = useState<LandingEventItem[]>(INITIAL_LANDING_EVENTS);
  const [landingLeads, setLandingLeads] = useState<LandingLeadItem[]>(INITIAL_LANDING_LEADS);
  const [landingPartners, setLandingPartners] = useState<LandingPartnerItem[]>(INITIAL_LANDING_PARTNERS);
  const [levelColumns, setLevelColumns] = useState<LevelProgressionConfig[]>(INITIAL_LEVEL_COLUMNS);
  const [studentLevelRecords, setStudentLevelRecords] = useState<StudentLevelRecord[]>(INITIAL_STUDENT_LEVEL_RECORDS);

  // Save to LocalStorage helper
  const save = useCallback((key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, []);

  // Realtime Data Fetcher from PostgreSQL (optimized with conditional website loading)
  const fetchAllLiveData = useCallback(async (includeWebsite = false) => {
    try {
      const isWebsiteRoute =
        typeof window !== "undefined" &&
        (window.location.pathname === "/" || window.location.pathname.startsWith("/dashboard/website"));
      const shouldFetchWebsite = includeWebsite || isWebsiteRoute;

      const fetchPromises: Promise<any>[] = [
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
        fetch("/api/level-progress", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
      ];

      if (shouldFetchWebsite) {
        fetchPromises.push(
          fetch("/api/website/hero", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
          fetch("/api/website/programs", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
          fetch("/api/website/testimonials", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
          fetch("/api/website/leads", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
          fetch("/api/website/partners", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
          fetch("/api/website/news", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
          fetch("/api/website/events", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null))
        );
      }

      const results = await Promise.allSettled(fetchPromises);
      const values = results.map((res) => (res.status === "fulfilled" ? res.value : null));

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
        levelProgressRes,
      ] = values;

      const heroRes = shouldFetchWebsite ? values[13] : null;
      const programsRes = shouldFetchWebsite ? values[14] : null;
      const testimonialsRes = shouldFetchWebsite ? values[15] : null;
      const leadsRes = shouldFetchWebsite ? values[16] : null;
      const partnersRes = shouldFetchWebsite ? values[17] : null;
      const newsRes = shouldFetchWebsite ? values[18] : null;
      const eventsRes = shouldFetchWebsite ? values[19] : null;

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
        let financeMap: any = {};
        try {
          const saved = localStorage.getItem("mf_branch_finance_settings");
          if (saved) financeMap = JSON.parse(saved);
        } catch {}

        const enriched = branchesRes.map((b: any) => {
          const custom = financeMap[b.id] || financeMap[b.name] || {};
          const bankName = b.bankName || custom.bankName || (b.name === "Singkut" ? "BCA" : "BRI");
          const accountNumber = b.accountNumber || custom.accountNumber || (b.name === "Singkut" ? "7825-119-021" : "0123-01-002345-50-8");
          const accountHolder = b.accountHolder || custom.accountHolder || `Math Fingers ${b.name}`;
          const adminName = b.adminName || custom.adminName || (b.name === "Singkut" ? "Febrianti Dewi, S.Pd" : "M. Hafiz, S.Pd");
          const signatureUrl = b.signatureUrl || custom.signatureUrl || "";

          financeMap[b.id] = { bankName, accountNumber, accountHolder, adminName, signatureUrl };
          if (b.name) financeMap[b.name] = financeMap[b.id];

          return {
            ...b,
            bankName,
            accountNumber,
            accountHolder,
            adminName,
            signatureUrl,
          };
        });
        setBranches(enriched);
        save("mf_branches", enriched);
        try {
          localStorage.setItem("mf_branch_finance_settings", JSON.stringify(financeMap));
        } catch {}
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
          const dateStr = att.date || (att.attendanceDate ? att.attendanceDate.split("T")[0] : "");
          const key = `${att.studentId}_${dateStr}`;
          map[key] = {
            id: att.id,
            studentId: att.studentId,
            studentName: att.studentName || att.student?.studentName || "Siswa",
            studentCode: att.studentCode || att.student?.studentCode || "-",
            className: att.className || att.student?.className || "-",
            branch: att.branch?.branchName || att.branch || "Singkut",
            date: dateStr,
            time: att.time || "14:00 WIB",
            status: att.status === "ALPHA" ? "ABSEN" : (att.status || "HADIR"),
            method: att.method || "MANUAL",
            programType: att.programType || "MATEMATIKA",
            note: att.note || att.notes || "",
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
      if (Array.isArray(newsRes) && newsRes.length > 0) {
        setLandingNews(newsRes);
        save("mf_landing_news", newsRes);
      }
      if (Array.isArray(eventsRes) && eventsRes.length > 0) {
        setLandingEvents(eventsRes);
        save("mf_landing_events", eventsRes);
      }
      if (levelProgressRes) {
        if (Array.isArray(levelProgressRes.columns) && levelProgressRes.columns.length > 0) {
          setLevelColumns(levelProgressRes.columns);
          save("mf_level_progression_columns", levelProgressRes.columns);
        }
        if (Array.isArray(levelProgressRes.records)) {
          setStudentLevelRecords(levelProgressRes.records);
          save("mf_student_level_records", levelProgressRes.records);
        }
      }
    } catch (err) {
      console.warn("Error synchronizing live PostgreSQL data:", err);
    }
  }, [save]);

  // Initial Load from LocalStorage and Realtime PostgreSQL Sync
  useEffect(() => {
    try {
      const CURRENT_DATA_VERSION = "mf_live_sync_v7";
      if (localStorage.getItem("mf_data_version") !== CURRENT_DATA_VERSION) {
        localStorage.removeItem("mf_students");
        localStorage.removeItem("mf_classes");
        localStorage.removeItem("mf_branches");
        localStorage.removeItem("mf_invoices");
        localStorage.removeItem("mf_mutations");
        localStorage.removeItem("mf_branchAdmins");
        localStorage.removeItem("mf_curriculum");
        localStorage.removeItem("mf_grades");
        localStorage.setItem("mf_data_version", CURRENT_DATA_VERSION);
      }

      const savedStudents = localStorage.getItem("mf_students");
      if (savedStudents) setStudents(JSON.parse(savedStudents));

      const savedClasses = localStorage.getItem("mf_classes");
      if (savedClasses) setClasses(JSON.parse(savedClasses));

      const savedBranches = localStorage.getItem("mf_branches");
      if (savedBranches) {
        try {
          const parsed = JSON.parse(savedBranches);
          const savedFinance = localStorage.getItem("mf_branch_finance_settings");
          const financeMap = savedFinance ? JSON.parse(savedFinance) : {};
          const enriched = parsed.map((b: BranchItem) => {
            const custom = financeMap[b.id] || financeMap[b.name] || {};
            return {
              ...b,
              bankName: b.bankName || custom.bankName || (b.name === "Singkut" ? "BCA" : "BRI"),
              accountNumber: b.accountNumber || custom.accountNumber || (b.name === "Singkut" ? "7825-119-021" : "0123-01-002345-50-8"),
              accountHolder: b.accountHolder || custom.accountHolder || `Math Fingers ${b.name}`,
              adminName: b.adminName || custom.adminName || (b.name === "Singkut" ? "Febrianti Dewi, S.Pd" : "M. Hafiz, S.Pd"),
              signatureUrl: b.signatureUrl || custom.signatureUrl || "",
            };
          });
          setBranches(enriched);
        } catch {
          // ignore
        }
      }

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
      if (savedCurriculum) {
        try {
          const parsed = JSON.parse(savedCurriculum);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const cleanList = parsed.filter(
              (m: any) => !m.id || (!String(m.id).endsWith("-Tabir Timur") && !String(m.id).endsWith("-Singkut"))
            );
            setCurriculumModules(cleanList.length > 0 ? cleanList : INITIAL_CURRICULUM);
          }
        } catch {
          // ignore
        }
      }

      const savedInvoices = localStorage.getItem("mf_invoices");
      if (savedInvoices) setInvoices(JSON.parse(savedInvoices));

      const savedLevelCols = localStorage.getItem("mf_level_progression_columns");
      if (savedLevelCols) {
        try {
          const parsed = JSON.parse(savedLevelCols);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const hasBranch = parsed.some((c: any) => c.branch);
            if (hasBranch) {
              setLevelColumns(parsed);
            } else {
              setLevelColumns(INITIAL_LEVEL_COLUMNS);
            }
          }
        } catch {}
      }

      const savedStudentLevels = localStorage.getItem("mf_student_level_records");
      if (savedStudentLevels) {
        try {
          const parsed = JSON.parse(savedStudentLevels);
          if (Array.isArray(parsed) && parsed.length > 0) setStudentLevelRecords(parsed);
        } catch {}
      }

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

      const savedLandingNews = localStorage.getItem("mf_landing_news");
      if (savedLandingNews) setLandingNews(JSON.parse(savedLandingNews));

      const savedLandingEvents = localStorage.getItem("mf_landing_events");
      if (savedLandingEvents) setLandingEvents(JSON.parse(savedLandingEvents));
    } catch {
      // ignore
    }

    // 1. Fetch live data immediately from PostgreSQL (including website on initial load)
    fetchAllLiveData(true);

    // 2. Re-fetch live data whenever window / tab gains focus (throttled to at most once per 15s)
    let lastRefocusSync = Date.now();
    const handleRevalidate = () => {
      const now = Date.now();
      if (now - lastRefocusSync > 15000 && document.visibilityState === "visible") {
        lastRefocusSync = now;
        fetchAllLiveData(false);
      }
    };
    window.addEventListener("focus", handleRevalidate);
    document.addEventListener("visibilitychange", handleRevalidate);

    // 3. Real-time background sync every 45 seconds (optimized from 12s)
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchAllLiveData(false);
      }
    }, 45000);

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

  const updateStudent = async (id: string, updated: Partial<StudentItem>) => {
    setStudents((prev) => {
      const updatedList = prev.map((s) => (s.id === id ? { ...s, ...updated } : s));
      save("mf_students", updatedList);
      return updatedList;
    });

    try {
      await fetch("/api/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updated }),
      });
    } catch (err) {
      console.error("Error updating student in PostgreSQL:", err);
    }
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

  const enrollStudentInClass = async (studentId: string, classId: string): Promise<boolean> => {
    const targetClass = classes.find((c) => c.id === classId);
    const targetStudent = students.find((s) => s.id === studentId);
    if (!targetClass || !targetStudent) return false;

    // Optimistically update local state
    const currentEnrolled = targetStudent.enrolledClasses || [];
    const alreadyEnrolled = currentEnrolled.some((e) => e.id === classId || e.className === targetClass.name);
    
    if (!alreadyEnrolled) {
      const updatedClassesList = [
        ...currentEnrolled,
        {
          id: targetClass.id,
          className: targetClass.name,
          programType: (targetClass as any).programType,
          days: targetClass.days,
          time: targetClass.time,
        },
      ];
      const combinedNames = updatedClassesList.map((c) => c.className).join(", ");
      
      setStudents((prev) => {
        const updated = prev.map((s) =>
          s.id === studentId
            ? {
                ...s,
                className: combinedNames,
                enrolledClasses: updatedClassesList,
              }
            : s
        );
        save("mf_students", updated);
        return updated;
      });

      setClasses((prev) => {
        const updated = prev.map((c) =>
          c.id === classId ? { ...c, enrolledCount: (c.enrolledCount || 0) + 1 } : c
        );
        save("mf_classes", updated);
        return updated;
      });
    }

    try {
      const res = await fetch("/api/classes/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, classId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.student) {
          setStudents((prev) => {
            const updated = prev.map((s) =>
              s.id === studentId
                ? {
                    ...s,
                    className: data.student.className,
                    enrolledClasses: data.student.enrolledClasses,
                  }
                : s
            );
            save("mf_students", updated);
            return updated;
          });
          if (data.classEnrolledCount !== undefined) {
            setClasses((prev) => {
              const updated = prev.map((c) =>
                c.id === classId ? { ...c, enrolledCount: data.classEnrolledCount } : c
              );
              save("mf_classes", updated);
              return updated;
            });
          }
        }
        return true;
      }
    } catch (err) {
      console.error("Error enrolling student in class:", err);
    }
    return true;
  };

  const unenrollStudentFromClass = async (studentId: string, classId: string): Promise<boolean> => {
    const targetClass = classes.find((c) => c.id === classId);
    const targetStudent = students.find((s) => s.id === studentId);
    if (!targetClass || !targetStudent) return false;

    // Optimistically update local state
    const currentEnrolled = targetStudent.enrolledClasses || [];
    const remainingClasses = currentEnrolled.filter((e) => e.id !== classId && e.className !== targetClass.name);
    const combinedNames = remainingClasses.length > 0 ? remainingClasses.map((c) => c.className).join(", ") : "-";

    setStudents((prev) => {
      const updated = prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              className: combinedNames,
              enrolledClasses: remainingClasses,
            }
          : s
      );
      save("mf_students", updated);
      return updated;
    });

    setClasses((prev) => {
      const updated = prev.map((c) =>
        c.id === classId ? { ...c, enrolledCount: Math.max(0, (c.enrolledCount || 1) - 1) } : c
      );
      save("mf_classes", updated);
      return updated;
    });

    try {
      const res = await fetch("/api/classes/enroll", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, classId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.student) {
          setStudents((prev) => {
            const updated = prev.map((s) =>
              s.id === studentId
                ? {
                    ...s,
                    className: data.student.className,
                    enrolledClasses: data.student.enrolledClasses,
                  }
                : s
            );
            save("mf_students", updated);
            return updated;
          });
          if (data.classEnrolledCount !== undefined) {
            setClasses((prev) => {
              const updated = prev.map((c) =>
                c.id === classId ? { ...c, enrolledCount: data.classEnrolledCount } : c
              );
              save("mf_classes", updated);
              return updated;
            });
          }
        }
        return true;
      }
    } catch (err) {
      console.error("Error unenrolling student from class:", err);
    }
    return true;
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

      try {
        const savedFinance = localStorage.getItem("mf_branch_finance_settings");
        const financeMap = savedFinance ? JSON.parse(savedFinance) : {};
        const bName = updated.name || existing?.name || "";
        const entry = {
          ...(financeMap[id] || {}),
          bankName: updated.bankName !== undefined ? updated.bankName : (existing?.bankName || ""),
          accountNumber: updated.accountNumber !== undefined ? updated.accountNumber : (existing?.accountNumber || ""),
          accountHolder: updated.accountHolder !== undefined ? updated.accountHolder : (existing?.accountHolder || ""),
          adminName: updated.adminName !== undefined ? updated.adminName : (existing?.adminName || ""),
          signatureUrl: updated.signatureUrl !== undefined ? updated.signatureUrl : (existing?.signatureUrl || ""),
        };
        financeMap[id] = entry;
        if (bName) financeMap[bName] = entry;
        localStorage.setItem("mf_branch_finance_settings", JSON.stringify(financeMap));
      } catch (err) {
        console.error("Error saving branch finance settings to localStorage:", err);
      }

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
    method?: "QR_SCAN" | "MANUAL",
    programType?: "MATEMATIKA" | "MEMBACA"
  ) => {
    const st = students.find((s) => s.id === studentId);
    const currentTime =
      time ||
      new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
    const progType = programType || (st as any)?.programType || "MATEMATIKA";

    setAttendances((prev) => {
      const key = `${studentId}_${date}`;
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
          programType: progType,
          note: note !== undefined ? note : (prev[key]?.note || ""),
        },
      };
      save("mf_attendances", next);
      return next;
    });

    // Sync to PostgreSQL DB
    fetch("/api/attendances", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId,
        studentName: st?.name,
        studentCode: st?.studentCode,
        className: st?.className,
        branch: st?.branch,
        date,
        status,
        note: note !== undefined ? note : "",
        time: currentTime,
        method: method || "MANUAL",
        programType: progType,
      }),
    }).catch((err) => console.error("Error syncing attendance to PostgreSQL:", err));
  };

  const batchSetAttendance = (
    date: string,
    status: "HADIR" | "IZIN" | "SAKIT" | "ABSEN",
    targetStudentIds?: string[],
    programType?: "MATEMATIKA" | "MEMBACA"
  ) => {
    const currentTime =
      new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
    const payload: any[] = [];

    const targetList = targetStudentIds && targetStudentIds.length > 0
      ? students.filter((s) => targetStudentIds.includes(s.id))
      : students;

    setAttendances((prev) => {
      const next = { ...prev };
      targetList.forEach((s) => {
        const key = `${s.id}_${date}`;
        const progType = programType || (s as any)?.programType || "MATEMATIKA";
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
          programType: progType,
          note: prev[key]?.note || "",
        };
        payload.push({
          studentId: s.id,
          studentName: s.name,
          studentCode: s.studentCode,
          className: s.className,
          branch: s.branch,
          date,
          status,
          method: prev[key]?.method || "MANUAL",
          programType: progType,
          note: prev[key]?.note || "",
          time: prev[key]?.time || currentTime,
        });
      });
      save("mf_attendances", next);
      return next;
    });

    if (payload.length > 0) {
      fetch("/api/attendances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((err) => console.error("Error batch syncing attendances to PostgreSQL:", err));
    }
  };

  const addAttendanceRecord = (record: AttendanceItem) => {
    const st = students.find((s) => s.id === record.studentId);
    const progType = record.programType || (st as any)?.programType || "MATEMATIKA";
    const fullRecord = { ...record, programType: progType };

    setAttendances((prev) => {
      const key = `${fullRecord.studentId}_${fullRecord.date}`;
      const next = {
        ...prev,
        [key]: {
          ...fullRecord,
          id: fullRecord.id || `att-${Date.now()}`,
        },
      };
      save("mf_attendances", next);
      return next;
    });

    fetch("/api/attendances", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullRecord),
    }).catch((err) => console.error("Error adding attendance to PostgreSQL:", err));
  };

  const updateAttendanceRecord = (key: string, updated: Partial<AttendanceItem>) => {
    let targetItem: AttendanceItem | null = null;
    setAttendances((prev) => {
      if (!prev[key]) return prev;
      targetItem = { ...prev[key], ...updated };
      const next = {
        ...prev,
        [key]: targetItem,
      };
      save("mf_attendances", next);
      return next;
    });

    if (targetItem) {
      fetch("/api/attendances", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(targetItem),
      }).catch((err) => console.error("Error updating attendance in PostgreSQL:", err));
    }
  };

  const deleteAttendanceRecord = (key: string) => {
    const existing = attendances[key];
    setAttendances((prev) => {
      const next = { ...prev };
      delete next[key];
      save("mf_attendances", next);
      return next;
    });

    const url = existing?.id && !existing.id.startsWith("att-")
      ? `/api/attendances?id=${encodeURIComponent(existing.id)}`
      : `/api/attendances?key=${encodeURIComponent(key)}`;

    fetch(url, { method: "DELETE" }).catch((err) =>
      console.error("Error deleting attendance from PostgreSQL:", err)
    );
  };

  // Journals
  const addJournalsBulk = async (journalsList: Omit<JournalItem, "id" | "refCode">[]) => {
    if (!journalsList || journalsList.length === 0) return;
    const now = Date.now();
    const newItems: { item: JournalItem; tempId: string }[] = journalsList.map((j, idx) => {
      const tempId = `j-${now}-${idx}-${Math.floor(Math.random() * 1000)}`;
      return {
        tempId,
        item: {
          ...j,
          id: tempId,
          refCode: `#${Math.random().toString(16).substring(2, 8)}`,
        },
      };
    });

    const newJournals = newItems.map((n) => n.item);
    setJournals((prev) => {
      const updated = [...newJournals, ...prev];
      save("mf_journals", updated);
      return updated;
    });

    try {
      const res = await fetch("/api/journals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journals: newJournals }),
      });
      if (res.ok) {
        const createdList = await res.json();
        if (Array.isArray(createdList)) {
          setJournals((prev) => {
            const mapped = [...prev];
            createdList.forEach((c: any, i: number) => {
              const tempId = newItems[i]?.tempId;
              const idx = mapped.findIndex((m) => m.id === tempId);
              if (idx !== -1) {
                mapped[idx] = { ...mapped[idx], id: c.id, refCode: c.refCode };
              }
            });
            save("mf_journals", mapped);
            return mapped;
          });
        }
      }
    } catch (err) {
      console.error("Error saving bulk journals to PostgreSQL:", err);
    }
  };

  const addJournal = (j: Omit<JournalItem, "id" | "refCode">) => {
    addJournalsBulk([j]);
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
      const enriched = newGrades.map((ng) => {
        const st = students.find((s) => s.id === ng.studentId);
        return {
          ...ng,
          branch: ng.branch || st?.branch || "Singkut",
          programType: ng.programType || (st as any)?.programType || "MATEMATIKA",
        };
      });
      const filtered = prev.filter((g) => !enriched.some((ng) => ng.id === g.id));
      const updated = [...enriched, ...filtered];
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
    branch?: string;
    topic: string;
    examDate: string;
    score: number;
    note?: string;
    isJoined?: boolean;
    programType?: "MATEMATIKA" | "MEMBACA";
  }) => {
    setGrades((prev) => {
      const st = students.find((s) => s.id === grade.studentId);
      const branch = grade.branch || st?.branch || "Singkut";
      const programType = grade.programType || (st as any)?.programType || "MATEMATIKA";
      const idx = prev.findIndex(
        (g) =>
          (grade.id && g.id === grade.id) ||
          (g.studentId === grade.studentId && g.topic === grade.topic && g.examDate === grade.examDate)
      );
      let updated: GradeItem[];
      if (idx >= 0) {
        const item = {
          ...prev[idx],
          ...grade,
          branch: grade.branch || prev[idx].branch || branch,
          programType: grade.programType || prev[idx].programType || programType,
          score: Number(grade.score),
        };
        updated = [...prev];
        updated[idx] = item;
      } else {
        const newG: GradeItem = {
          id: grade.id || `gr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          studentId: grade.studentId,
          studentName: grade.studentName || st?.name || "Siswa",
          className: grade.className || st?.className || "Kelas Reguler",
          branch,
          topic: grade.topic,
          examDate: grade.examDate,
          score: Number(grade.score),
          note: grade.note || "",
          isJoined: grade.isJoined !== undefined ? grade.isJoined : true,
          programType,
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

  const deleteGradeSession = async (topic: string, examDate: string, branch?: string) => {
    setGrades((prev) => {
      const filtered = prev.filter((g) => {
        const matches = g.topic === topic && g.examDate === examDate;
        if (!matches) return true;
        if (branch && branch !== "ALL") {
          const st = students.find((s) => s.id === g.studentId);
          const gBranch = g.branch || st?.branch;
          const normG = gBranch?.toLowerCase().includes("bangko") || gBranch?.toLowerCase().includes("tabir") ? "Tabir Timur" : gBranch;
          const normB = branch?.toLowerCase().includes("bangko") || branch?.toLowerCase().includes("tabir") ? "Tabir Timur" : branch;
          if (normG && normB && normG.toLowerCase() !== normB.toLowerCase()) {
            return true; // Keep because it's from another branch!
          }
        }
        return false;
      });
      save("mf_grades", filtered);
      return filtered;
    });

    try {
      const url = branch && branch !== "ALL"
        ? `/api/grades?topic=${encodeURIComponent(topic)}&examDate=${encodeURIComponent(examDate)}&branch=${encodeURIComponent(branch)}`
        : `/api/grades?topic=${encodeURIComponent(topic)}&examDate=${encodeURIComponent(examDate)}`;
      await fetch(url, { method: "DELETE" });
    } catch (err) {
      console.error("Error deleting grade session:", err);
    }
  };

  const renameGradeSession = async (
    oldTopic: string,
    oldExamDate: string,
    newTopic: string,
    newExamDate: string,
    branch?: string
  ) => {
    setGrades((prev) => {
      const updated = prev.map((g) => {
        const matches = g.topic === oldTopic && g.examDate === oldExamDate;
        if (!matches) return g;
        if (branch && branch !== "ALL") {
          const st = students.find((s) => s.id === g.studentId);
          const gBranch = g.branch || st?.branch;
          const normG = gBranch?.toLowerCase().includes("bangko") || gBranch?.toLowerCase().includes("tabir") ? "Tabir Timur" : gBranch;
          const normB = branch?.toLowerCase().includes("bangko") || branch?.toLowerCase().includes("tabir") ? "Tabir Timur" : branch;
          if (normG && normB && normG.toLowerCase() !== normB.toLowerCase()) {
            return g; // Keep unchanged because it's another branch!
          }
        }
        return { ...g, topic: newTopic, examDate: newExamDate };
      });
      save("mf_grades", updated);
      return updated;
    });

    try {
      await fetch("/api/grades", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldTopic, oldExamDate, newTopic, newExamDate, branch }),
      });
    } catch (err) {
      console.error("Error renaming grade session in PostgreSQL:", err);
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

  // Curriculum Modules (Branch-isolated)
  const addCurriculumModule = (mod: Omit<CurriculumModule, "id" | "orderIndex">) => {
    const tempId = `cur-${Date.now()}`;
    const branch = mod.branch || "Singkut";
    const newMod: CurriculumModule = {
      ...mod,
      branch,
      id: tempId,
      orderIndex: curriculumModules.filter((m) => isBranchMatch(m.branch, branch)).length + 1,
    };
    setCurriculumModules((prev) => {
      const updated = [...prev, newMod];
      save("mf_curriculum", updated);
      return updated;
    });

    fetch("/api/curriculums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMod),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((created) => {
        if (created && created.id) {
          setCurriculumModules((prev) => {
            const updated = prev.map((c) =>
              c.id === tempId ? { ...c, ...created, branch: c.branch || branch } : c
            );
            save("mf_curriculum", updated);
            return updated;
          });
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
    })
      .then(async (res) => {
        if (res.ok) {
          const updatedServer = await res.json();
          if (updatedServer && updatedServer.id) {
            setCurriculumModules((prev) => {
              const updated = prev.map((m) =>
                m.id === id || m.id === updatedServer.id
                  ? { ...m, ...updatedServer, branch: m.branch || updatedServer.branch }
                  : m
              );
              save("mf_curriculum", updated);
              return updated;
            });
          }
        } else {
          console.error("Gagal memperbarui kurikulum di PostgreSQL");
        }
      })
      .catch((err) => {
        console.error("Error updating curriculum in PostgreSQL:", err);
      });
  };

  const deleteCurriculumModule = (id: string, branch?: string) => {
    setCurriculumModules((prev) => {
      const filtered = prev.filter((m) => m.id !== id);
      save("mf_curriculum", filtered);
      return filtered;
    });

    const query = branch
      ? `?id=${encodeURIComponent(id)}&branch=${encodeURIComponent(branch)}`
      : `?id=${encodeURIComponent(id)}`;
    fetch(`/api/curriculums${query}`, {
      method: "DELETE",
    }).catch((err) => {
      console.error("Error deleting curriculum from PostgreSQL:", err);
    });
  };

  const resetCurriculumModules = (branch?: string) => {
    setCurriculumModules((prev) => {
      const filtered = branch ? prev.filter((m) => !isBranchMatch(m.branch, branch)) : [];
      save("mf_curriculum", filtered);
      return filtered;
    });

    const query = branch
      ? `/api/curriculums?all=true&branch=${encodeURIComponent(branch)}`
      : "/api/curriculums?all=true";
    fetch(query, {
      method: "DELETE",
    }).catch((err) => console.error("Error resetting curriculum in PostgreSQL:", err));
  };

  // Invoices & SPP
  const addInvoicesBulk = async (invs: Omit<InvoiceItem, "id" | "invoiceNo">[]) => {
    if (!invs || invs.length === 0) return;
    const now = Date.now();
    const newItems: { item: InvoiceItem; tempId: string }[] = invs.map((inv, idx) => {
      const tempId = `inv-${now}-${idx}-${Math.floor(Math.random() * 1000)}`;
      const code = Math.floor(1000 + Math.random() * 9000);
      const st = students.find((s) => s.id === inv.studentId);
      const progType = inv.programType || (st as any)?.programType || "MATEMATIKA";
      return {
        tempId,
        item: {
          ...inv,
          id: tempId,
          invoiceNo: `INV/MF/2608/${code}`,
          programType: progType,
        },
      };
    });

    const newInvoices = newItems.map((n) => n.item);
    setInvoices((prev) => {
      const updated = [...newInvoices, ...prev];
      save("mf_invoices", updated);
      return updated;
    });

    // If any newly added invoices are already LUNAS, sync to transactions
    const paidNewInvs = newInvoices.filter((i) => i.status === "LUNAS");
    if (paidNewInvs.length > 0) {
      setTransactions((prev) => {
        const newTxs: CashTransactionItem[] = paidNewInvs.map((inv) => ({
          id: `tx-inv-${inv.invoiceNo}-${Date.now()}`,
          date: inv.paidDate || new Date().toISOString().split("T")[0],
          type: "INCOME",
          category: "SPP",
          title: `Pembayaran SPP - ${inv.studentName} (${inv.period})`,
          amount: inv.amount,
          branch: (inv.branch as "Singkut" | "Bangko") || "Singkut",
          sourceOrRecipient: inv.studentName,
          notes: `[INV:${inv.invoiceNo}] Metode: ${inv.paidMethod || "Tunai"}`,
          programType: ((inv.programType || "MATEMATIKA").toUpperCase() === "MEMBACA" ? "MEMBACA" : "MATEMATIKA") as "MATEMATIKA" | "MEMBACA",
        }));
        const updated = [...newTxs, ...prev];
        save("mf_transactions", updated);
        return updated;
      });
    }

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoices: newInvoices }),
      });
      if (res.ok) {
        const createdList = await res.json();
        if (Array.isArray(createdList)) {
          setInvoices((prev) => {
            const mapped = [...prev];
            createdList.forEach((c: any, i: number) => {
              const tempId = newItems[i]?.tempId;
              const idx = mapped.findIndex((m) => m.id === tempId);
              if (idx !== -1) {
                mapped[idx] = { ...mapped[idx], id: c.id, invoiceNo: c.invoiceNo };
              }
            });
            save("mf_invoices", mapped);
            return mapped;
          });
        }
      }
    } catch (err) {
      console.error("Error saving bulk invoices to PostgreSQL:", err);
    }
  };

  const addInvoice = (inv: Omit<InvoiceItem, "id" | "invoiceNo">) => {
    addInvoicesBulk([inv]);
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
      const inv = targetInv || invoices.find((i) => i.id === id);
      if (inv) {
        // 1. Sync Cash Mutation
        setCashMutations((prev) => {
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

        // 2. Sync Cash Transaction (Pemasukan Arus Keuangan)
        setTransactions((prev) => {
          const refTag = `[INV:${inv.invoiceNo}]`;
          const exists = prev.some((t) => t.notes?.includes(refTag));
          const txDate = paidDate || new Date().toISOString().split("T")[0];
          const methodStr = paidMethod || "Tunai";
          const progType: "MATEMATIKA" | "MEMBACA" =
            (inv.programType || "MATEMATIKA").toUpperCase() === "MEMBACA" ? "MEMBACA" : "MATEMATIKA";
          const branchVal: "Singkut" | "Bangko" = (inv.branch as "Singkut" | "Bangko") || "Singkut";

          if (exists) {
            const updated: CashTransactionItem[] = prev.map((t) =>
              t.notes?.includes(refTag)
                ? {
                    ...t,
                    amount: inv.amount,
                    date: txDate,
                    notes: `${refTag} Metode: ${methodStr}`,
                    programType: progType,
                  }
                : t
            );
            save("mf_transactions", updated);
            return updated;
          }

          const newTx: CashTransactionItem = {
            id: `tx-inv-${inv.invoiceNo}-${Date.now()}`,
            date: txDate,
            type: "INCOME",
            category: "SPP",
            title: `Pembayaran SPP - ${inv.studentName} (${inv.period})`,
            amount: inv.amount,
            branch: branchVal,
            sourceOrRecipient: inv.studentName,
            notes: `${refTag} Metode: ${methodStr}`,
            programType: progType,
          };
          const next = [newTx, ...prev];
          save("mf_transactions", next);
          return next;
        });
      }
    } else {
      const inv = invoices.find((i) => i.id === id);
      if (inv) {
        setCashMutations((prev) => {
          const filtered = prev.filter((m) => m.invoiceNo !== inv.invoiceNo);
          save("mf_mutations", filtered);
          return filtered;
        });

        setTransactions((prev) => {
          const refTag = `[INV:${inv.invoiceNo}]`;
          const filtered = prev.filter((t) => !t.notes?.includes(refTag));
          save("mf_transactions", filtered);
          return filtered;
        });
      }
    }

    fetch("/api/invoices", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, paidDate, paidMethod }),
    }).catch((err) => console.error("Error updating invoice in PostgreSQL:", err));
  };

  const deleteInvoice = (id: string) => {
    const inv = invoices.find((i) => i.id === id);
    setInvoices((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      save("mf_invoices", filtered);
      return filtered;
    });

    if (inv) {
      setCashMutations((prev) => {
        const filtered = prev.filter((m) => m.invoiceNo !== inv.invoiceNo);
        save("mf_mutations", filtered);
        return filtered;
      });

      setTransactions((prev) => {
        const refTag = `[INV:${inv.invoiceNo}]`;
        const filtered = prev.filter((t) => !t.notes?.includes(refTag));
        save("mf_transactions", filtered);
        return filtered;
      });
    }

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
          setLandingPrograms((prev) => {
            const list = prev.map((p) => (p.id === tempId ? { ...p, id: created.id } : p));
            save("mf_landing_programs", list);
            return list;
          });
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
          setLandingTestimonials((prev) => {
            const list = prev.map((t) => (t.id === tempId ? { ...t, id: created.id } : t));
            save("mf_landing_testi", list);
            return list;
          });
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

  const updateLandingTestimonial = (id: string, testi: Partial<LandingTestimonialItem>) => {
    setLandingTestimonials((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...testi } : t));
      save("mf_landing_testi", updated);
      return updated;
    });

    fetch("/api/website/testimonials", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...testi }),
    }).catch((err) => console.error("Error updating website testimonial in PostgreSQL:", err));
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
          setLandingLeads((prev) => {
            const list = prev.map((l) => (l.id === tempId ? { ...l, id: created.id } : l));
            save("mf_landing_leads", list);
            return list;
          });
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
          setLandingPartners((prev) => {
            const list = prev.map((p) => (p.id === tempId ? { ...p, id: created.id } : p));
            save("mf_landing_partners", list);
            return list;
          });
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

  // Landing News CRUD
  const addLandingNews = (item: Omit<LandingNewsItem, "id">) => {
    const tempId = `news-${Date.now()}`;
    const newItem: LandingNewsItem = {
      ...item,
      id: tempId,
    };
    setLandingNews((prev) => {
      const updated = [newItem, ...prev];
      save("mf_landing_news", updated);
      return updated;
    });

    fetch("/api/website/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((created) => {
        if (created && created.id) {
          setLandingNews((prev) => {
            const list = prev.map((n) => (n.id === tempId ? { ...n, id: created.id } : n));
            save("mf_landing_news", list);
            return list;
          });
        }
      })
      .catch((err) => console.error("Error saving website news to PostgreSQL:", err));
  };

  const updateLandingNews = (id: string, item: Partial<LandingNewsItem>) => {
    setLandingNews((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, ...item } : n));
      save("mf_landing_news", updated);
      return updated;
    });

    fetch("/api/website/news", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...item }),
    }).catch((err) => console.error("Error updating website news in PostgreSQL:", err));
  };

  const deleteLandingNews = (id: string) => {
    setLandingNews((prev) => {
      const filtered = prev.filter((n) => n.id !== id);
      save("mf_landing_news", filtered);
      return filtered;
    });

    fetch(`/api/website/news?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch((err) => console.error("Error deleting website news from PostgreSQL:", err));
  };

  // Landing Events CRUD
  const addLandingEvent = (item: Omit<LandingEventItem, "id">) => {
    const tempId = `ev-${Date.now()}`;
    const newItem: LandingEventItem = {
      ...item,
      id: tempId,
    };
    setLandingEvents((prev) => {
      const updated = [...prev, newItem];
      save("mf_landing_events", updated);
      return updated;
    });

    fetch("/api/website/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((created) => {
        if (created && created.id) {
          setLandingEvents((prev) => {
            const list = prev.map((e) => (e.id === tempId ? { ...e, id: created.id } : e));
            save("mf_landing_events", list);
            return list;
          });
        }
      })
      .catch((err) => console.error("Error saving website event to PostgreSQL:", err));
  };

  const updateLandingEvent = (id: string, item: Partial<LandingEventItem>) => {
    setLandingEvents((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...item } : e));
      save("mf_landing_events", updated);
      return updated;
    });

    fetch("/api/website/events", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...item }),
    }).catch((err) => console.error("Error updating website event in PostgreSQL:", err));
  };

  const deleteLandingEvent = (id: string) => {
    setLandingEvents((prev) => {
      const filtered = prev.filter((e) => e.id !== id);
      save("mf_landing_events", filtered);
      return filtered;
    });

    fetch(`/api/website/events?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch((err) => console.error("Error deleting website event from PostgreSQL:", err));
  };

  // Level Progression Matrix Handlers (Kenaikan Level - Branch Isolated)
  const addLevelColumn = useCallback((name: string, description?: string, branch?: string) => {
    const targetBranch = branch || "Singkut";
    setLevelColumns((prev) => {
      const branchCols = prev.filter((c) => isBranchMatch(c.branch || "Singkut", targetBranch));
      const nextNum = branchCols.length + 1;
      const newCol: LevelProgressionConfig = {
        id: `lvl-${Date.now()}`,
        levelNumber: nextNum,
        name: name.trim() || `Level ${nextNum}`,
        description: description?.trim() || "",
        branch: targetBranch,
      };
      const updated = [...prev, newCol];
      save("mf_level_progression_columns", updated);
      return updated;
    });

    fetch("/api/level-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "ADD_LEVEL_COLUMN", name, description, branch: targetBranch }),
    }).catch((err) => console.error("Error creating level column:", err));
  }, [save]);

  const updateLevelColumn = useCallback((id: string, name: string, description?: string, branch?: string) => {
    setLevelColumns((prev) => {
      const updated = prev.map((col) =>
        col.id === id
          ? {
              ...col,
              name: name.trim(),
              ...(description !== undefined ? { description: description.trim() } : {}),
              ...(branch ? { branch } : {}),
            }
          : col
      );
      save("mf_level_progression_columns", updated);
      return updated;
    });

    fetch("/api/level-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "UPDATE_LEVEL_COLUMN", id, name, description, branch }),
    }).catch((err) => console.error("Error updating level column:", err));
  }, [save]);

  const deleteLevelColumn = useCallback((id: string) => {
    setLevelColumns((prev) => {
      const updated = prev.filter((col) => col.id !== id);
      save("mf_level_progression_columns", updated);
      return updated;
    });
    setStudentLevelRecords((prev) => {
      const updated = prev.filter((rec) => rec.levelId !== id);
      save("mf_student_level_records", updated);
      return updated;
    });

    fetch("/api/level-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "DELETE_LEVEL_COLUMN", id }),
    }).catch((err) => console.error("Error deleting level column:", err));
  }, [save]);

  const setStudentLevelRecord = useCallback(async (studentId: string, levelId: string, passedDate: string, notes?: string) => {
    setStudentLevelRecords((prev) => {
      const existingIndex = prev.findIndex((r) => r.studentId === studentId && r.levelId === levelId);
      let updated: StudentLevelRecord[];
      if (existingIndex >= 0) {
        updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          passedDate,
          notes: notes !== undefined ? notes : updated[existingIndex].notes,
          updatedAt: new Date().toISOString(),
        };
      } else {
        const newRecord: StudentLevelRecord = {
          id: `slr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          studentId,
          levelId,
          passedDate,
          notes: notes || "",
          updatedAt: new Date().toISOString(),
        };
        updated = [...prev, newRecord];
      }
      save("mf_student_level_records", updated);
      return updated;
    });

    fetch("/api/level-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "SET_STUDENT_LEVEL", studentId, levelId, passedDate, notes }),
    }).catch((err) => console.error("Error setting student level:", err));
  }, [save]);

  const deleteStudentLevelRecord = useCallback(async (studentId: string, levelId: string) => {
    setStudentLevelRecords((prev) => {
      const updated = prev.filter((r) => !(r.studentId === studentId && r.levelId === levelId));
      save("mf_student_level_records", updated);
      return updated;
    });

    fetch("/api/level-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "DELETE_STUDENT_LEVEL", studentId, levelId }),
    }).catch((err) => console.error("Error deleting student level:", err));
  }, [save]);

  const batchUpdateStudentLevelRecords = useCallback(async (studentId: string, records: { levelId: string; passedDate: string; notes?: string }[]) => {
    setStudentLevelRecords((prev) => {
      let updated = [...prev];
      records.forEach((rec) => {
        const existingIndex = updated.findIndex((r) => r.studentId === studentId && r.levelId === rec.levelId);
        if (rec.passedDate) {
          if (existingIndex >= 0) {
            updated[existingIndex] = {
              ...updated[existingIndex],
              passedDate: rec.passedDate,
              notes: rec.notes !== undefined ? rec.notes : updated[existingIndex].notes,
              updatedAt: new Date().toISOString(),
            };
          } else {
            updated.push({
              id: `slr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              studentId,
              levelId: rec.levelId,
              passedDate: rec.passedDate,
              notes: rec.notes || "",
              updatedAt: new Date().toISOString(),
            });
          }
        } else {
          if (existingIndex >= 0) {
            updated.splice(existingIndex, 1);
          }
        }
      });
      save("mf_student_level_records", updated);
      return updated;
    });

    fetch("/api/level-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "BATCH_UPDATE_STUDENT_LEVELS", studentId, records }),
    }).catch((err) => console.error("Error batch updating student levels:", err));
  }, [save]);

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
        enrollStudentInClass,
        unenrollStudentFromClass,
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
        addJournalsBulk,
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
        addInvoicesBulk,
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
        updateLandingTestimonial,
        deleteLandingTestimonial,
        landingNews,
        addLandingNews,
        updateLandingNews,
        deleteLandingNews,
        landingEvents,
        addLandingEvent,
        updateLandingEvent,
        deleteLandingEvent,
        landingLeads,
        addLandingLead,
        updateLandingLeadStatus,
        deleteLandingLead,
        landingPartners,
        addLandingPartner,
        updateLandingPartner,
        deleteLandingPartner,
        levelColumns,
        studentLevelRecords,
        addLevelColumn,
        updateLevelColumn,
        deleteLevelColumn,
        setStudentLevelRecord,
        deleteStudentLevelRecord,
        batchUpdateStudentLevelRecords,
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
