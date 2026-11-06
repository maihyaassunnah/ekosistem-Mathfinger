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
  isJoined?: boolean;
  programType?: string;
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
    studentCode?: string;
    studentName?: string;
    className?: string;
    branch?: string;
    branchId?: string;
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
  addLevelColumn: (name: string, description?: string) => void;
  updateLevelColumn: (id: string, name: string, description?: string) => void;
  deleteLevelColumn: (id: string) => void;
  setStudentLevelRecord: (studentId: string, levelId: string, passedDate: string, notes?: string) => Promise<void>;
  deleteStudentLevelRecord: (studentId: string, levelId: string) => Promise<void>;
  batchUpdateStudentLevelRecords: (studentId: string, records: { levelId: string; passedDate: string; notes?: string }[]) => Promise<void>;
}

const AppStoreContext = createContext<AppStoreContextType | null>(null);

const INITIAL_CLASSES: ClassItem[] = [
  {
    "id": "6539cf97-3499-4ebc-a583-ea1bd7e04506",
    "name": "CLASS A",
    "branch": "Singkut",
    "days": "Sabtu & Ahad",
    "time": "09:00 - 10:00",
    "teacher": "Febrianti Dewi, S.Pd",
    "room": "Ruang A1",
    "level": "Level 1: Penjumlahan & Pengurangan Angka Satuan",
    "enrolledCount": 17,
    "maxCapacity": 20,
    "programType": "MATEMATIKA"
  },
  {
    "id": "807284f9-afad-4642-8b54-b45e2c7ca274",
    "name": "CLASS B",
    "branch": "Singkut",
    "days": "Sabtu & Ahad",
    "time": "14:00 - 15:30",
    "teacher": "Febrianti Dewi, S.Pd",
    "room": "Ruang A2",
    "level": "Level 1: Penjumlahan & Pengurangan Angka Satuan",
    "enrolledCount": 18,
    "maxCapacity": 20,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0389db61-45e9-46d5-bfa9-990b87072b28",
    "name": "CLASS C",
    "branch": "Singkut",
    "days": "Kamis & Jumat",
    "time": "13:30 - 14:30",
    "teacher": "Febrianti Dewi, S.Pd",
    "room": "Ruang A1",
    "level": "Level Dasar: Pengenalan Simbol Jari",
    "enrolledCount": 4,
    "maxCapacity": 15,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8ed0e558-30d7-4633-a0f4-c4870e24523e",
    "name": "KELAS A1",
    "branch": "Bangko",
    "days": "Senin & Rabu",
    "time": "13:30 - 14:30",
    "teacher": "Dewi Safitri, S.H",
    "room": "Ruang A1",
    "level": "Level 1: Penjumlahan & Pengurangan Angka Satuan",
    "enrolledCount": 18,
    "maxCapacity": 20,
    "programType": "MATEMATIKA"
  },
  {
    "id": "357c4e81-b230-4e28-b570-0ddefe8a6bfd",
    "name": "KELAS A2",
    "branch": "Bangko",
    "days": "Selasa & Kamis",
    "time": "14:00 - 15:30",
    "teacher": "Uswatun Khasanah",
    "room": "Ruang A2",
    "level": "Level Dasar: Pengenalan Simbol Jari",
    "enrolledCount": 13,
    "maxCapacity": 15,
    "programType": "MATEMATIKA"
  },
  {
    "id": "261f3a22-f43f-4287-b0bb-b95d52fc321e",
    "name": "KELAS B",
    "branch": "Bangko",
    "days": "Jumat & Minggu",
    "time": "14:00 - 15:30",
    "teacher": "Dewi Safitri, S.H",
    "room": "Ruang B",
    "level": "Level 1: Penjumlahan & Pengurangan Angka Satuan",
    "enrolledCount": 21,
    "maxCapacity": 25,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b81600c8-4c1e-4e1f-a868-0147b3ec8f80",
    "name": "KELAS C",
    "branch": "Bangko",
    "days": "Sabtu & Minggu",
    "time": "14:00 - 15:30",
    "teacher": "Uswatun Khasanah",
    "room": "Ruang C",
    "level": "Level Dasar: Pengenalan Simbol Jari",
    "enrolledCount": 16,
    "maxCapacity": 20,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c609f55f-6eca-41d1-93fe-261cc459933d",
    "name": "KELAS D",
    "branch": "Bangko",
    "days": "Sabtu & Ahad",
    "time": "14:00 - 15:30",
    "teacher": "Lailatus Istianah ",
    "room": "Ruang D",
    "level": "Level Dasar: Pengenalan Simbol Jari",
    "enrolledCount": 11,
    "maxCapacity": 15,
    "programType": "MATEMATIKA"
  },
  {
    "id": "85c41490-5a43-4a56-80e2-ae320a3b32c1",
    "name": "bee",
    "branch": "Bangko",
    "days": "Rabu & Jumat",
    "time": "14:00 - 15:30",
    "teacher": "Dewi Safitri, S.H.",
    "room": "Ruang Baca",
    "level": "Level 1: Pra-Membaca & Pengenalan Huruf",
    "enrolledCount": 9,
    "maxCapacity": 12,
    "programType": "MEMBACA"
  }
];

const INITIAL_ADMINS: BranchAdminItem[] = [];

export const INITIAL_GRADES: GradeItem[] = [
  {
    "id": "gr-edfa74c0-7a6c-421e-b5a3-142f80563a3c-2026-09-05-levek-1-hlm-30",
    "studentId": "edfa74c0-7a6c-421e-b5a3-142f80563a3c",
    "studentCode": "10089",
    "studentName": "Dzakiyyah Al Fajri",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "levek 1 hlm  30",
    "examDate": "2026-09-05",
    "score": 100,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-352a42af-0c46-4373-9ac4-69a5282da28c-2026-09-05-levek-1-hlm-30",
    "studentId": "352a42af-0c46-4373-9ac4-69a5282da28c",
    "studentCode": "10091",
    "studentName": "Ghumaisha",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "levek 1 hlm  30",
    "examDate": "2026-09-05",
    "score": 70,
    "note": "Perlu latihan buka tutup jari",
    "isJoined": true
  },
  {
    "id": "gr-e0f01c5d-a021-45d7-9828-102cb091a16d-2026-09-05-levek-1-hlm-30",
    "studentId": "e0f01c5d-a021-45d7-9828-102cb091a16d",
    "studentCode": "10102",
    "studentName": "Musyaffa'",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "levek 1 hlm  30",
    "examDate": "2026-09-05",
    "score": 0,
    "note": "Perlu latihan buka tutup jari",
    "isJoined": true
  },
  {
    "id": "gr-96bd8abf-ce5e-42c0-8a3f-4d7549f8a2e9-2026-09-05-levek-1-hlm-30",
    "studentId": "96bd8abf-ce5e-42c0-8a3f-4d7549f8a2e9",
    "studentCode": "10103",
    "studentName": "Muwaffaq",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "levek 1 hlm  30",
    "examDate": "2026-09-05",
    "score": 0,
    "note": "Perlu latihan buka tutup jari",
    "isJoined": true
  },
  {
    "id": "gr-296a8d0a-9549-4f1a-b529-76eb203d8407-2026-09-05-levek-1-hlm-30",
    "studentId": "296a8d0a-9549-4f1a-b529-76eb203d8407",
    "studentCode": "10108",
    "studentName": "Rayendra Azzan Pramana",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "levek 1 hlm  30",
    "examDate": "2026-09-05",
    "score": 0,
    "note": "Perlu latihan buka tutup jari",
    "isJoined": true
  },
  {
    "id": "gr-657f7d55-4398-4d8e-a44d-1f6eb84a61c0-2026-09-05-levek-1-hlm-30",
    "studentId": "657f7d55-4398-4d8e-a44d-1f6eb84a61c0",
    "studentCode": "10111",
    "studentName": "Shofiyah",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "levek 1 hlm  30",
    "examDate": "2026-09-05",
    "score": 0,
    "note": "Perlu latihan buka tutup jari",
    "isJoined": true
  },
  {
    "id": "gr-a32a3e2b-2898-4a12-a20f-a2cb15c3ca22-2026-08-22-Level-1-hlm-1-2",
    "studentId": "a32a3e2b-2898-4a12-a20f-a2cb15c3ca22",
    "studentCode": "10082",
    "studentName": "Aishwa Rahma Annida",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-c76503ff-a1d9-45ee-815e-35e24c8f7c7c-2026-08-22-Level-1-hlm-1-2",
    "studentId": "c76503ff-a1d9-45ee-815e-35e24c8f7c7c",
    "studentCode": "10087",
    "studentName": "Calista Azkadina",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 83,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-352a42af-0c46-4373-9ac4-69a5282da28c-2026-08-22-Level-1-hlm-1-2",
    "studentId": "352a42af-0c46-4373-9ac4-69a5282da28c",
    "studentCode": "10091",
    "studentName": "Ghumaisha",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 86,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-2643a6e6-fcc0-4c9f-81b1-db1d116e37cd-2026-08-22-Level-1-hlm-1-2",
    "studentId": "2643a6e6-fcc0-4c9f-81b1-db1d116e37cd",
    "studentCode": "10083",
    "studentName": "Arsyila Nasha Razita",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 89,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-48721968-d3f2-4319-92be-7a5e972c106b-2026-08-22-Level-1-hlm-1-2",
    "studentId": "48721968-d3f2-4319-92be-7a5e972c106b",
    "studentCode": "10086",
    "studentName": "Bilqis Ufairah",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-c1ccae6d-ae43-4bbf-b539-4c1c96c9c16b-2026-08-22-Level-1-hlm-1-2",
    "studentId": "c1ccae6d-ae43-4bbf-b539-4c1c96c9c16b",
    "studentCode": "10090",
    "studentName": "Fakhri Al-Ghifari",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-f20782b9-17ab-40f2-b315-7ad3aadc2739-2026-08-22-Level-1-hlm-1-2",
    "studentId": "f20782b9-17ab-40f2-b315-7ad3aadc2739",
    "studentCode": "10112",
    "studentName": "Syakira Nur Aini",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-15de4d83-1d1b-4042-9bb4-9fdc65db1d3c-2026-08-22-Level-1-hlm-1-2",
    "studentId": "15de4d83-1d1b-4042-9bb4-9fdc65db1d3c",
    "studentCode": "10092",
    "studentName": "Hafiz Al-Faruq",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-1d157032-9563-4b12-933f-f45078bd1646-2026-08-22-Level-1-hlm-1-2",
    "studentId": "1d157032-9563-4b12-933f-f45078bd1646",
    "studentCode": "10104",
    "studentName": "Nabila Putri Ramadhani",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 83,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-aa3fff59-d27e-4851-a660-ceaf1d8e9ade-2026-08-22-Level-1-hlm-1-2",
    "studentId": "aa3fff59-d27e-4851-a660-ceaf1d8e9ade",
    "studentCode": "10101",
    "studentName": "Muhammad Azka",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 86,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-f9ce8b07-5738-4c29-8ecc-048807666d4c-2026-08-22-Level-1-hlm-1-2",
    "studentId": "f9ce8b07-5738-4c29-8ecc-048807666d4c",
    "studentCode": "10088",
    "studentName": "Dimas Arya Sena",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 89,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-e02583be-1443-414b-a37c-90e612bcd317-2026-08-22-Level-1-hlm-1-2",
    "studentId": "e02583be-1443-414b-a37c-90e612bcd317",
    "studentCode": "10085",
    "studentName": "Bagas Pratama Putra",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-edfa74c0-7a6c-421e-b5a3-142f80563a3c-2026-08-22-Level-1-hlm-1-2",
    "studentId": "edfa74c0-7a6c-421e-b5a3-142f80563a3c",
    "studentCode": "10089",
    "studentName": "Dzakiyyah Al Fajri",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-90d546d9-0f7c-4cdf-8351-5e854cce406c-2026-08-22-Level-1-hlm-1-2",
    "studentId": "90d546d9-0f7c-4cdf-8351-5e854cce406c",
    "studentCode": "10093",
    "studentName": "Haris",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-b42ef79c-f9c9-4972-8f36-525ec014240e-2026-08-22-Level-1-hlm-1-2",
    "studentId": "b42ef79c-f9c9-4972-8f36-525ec014240e",
    "studentCode": "10100",
    "studentName": "Maulana Syarif Wardani",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Level 1 hlm 1-2",
    "examDate": "2026-08-22",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-a32a3e2b-2898-4a12-a20f-a2cb15c3ca22-2026-08-16-Menulis-angka-p",
    "studentId": "a32a3e2b-2898-4a12-a20f-a2cb15c3ca22",
    "studentCode": "10082",
    "studentName": "Aishwa Rahma Annida",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-c76503ff-a1d9-45ee-815e-35e24c8f7c7c-2026-08-16-Menulis-angka-p",
    "studentId": "c76503ff-a1d9-45ee-815e-35e24c8f7c7c",
    "studentCode": "10087",
    "studentName": "Calista Azkadina",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 83,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-352a42af-0c46-4373-9ac4-69a5282da28c-2026-08-16-Menulis-angka-p",
    "studentId": "352a42af-0c46-4373-9ac4-69a5282da28c",
    "studentCode": "10091",
    "studentName": "Ghumaisha",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 86,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-2643a6e6-fcc0-4c9f-81b1-db1d116e37cd-2026-08-16-Menulis-angka-p",
    "studentId": "2643a6e6-fcc0-4c9f-81b1-db1d116e37cd",
    "studentCode": "10083",
    "studentName": "Arsyila Nasha Razita",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 89,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-48721968-d3f2-4319-92be-7a5e972c106b-2026-08-16-Menulis-angka-p",
    "studentId": "48721968-d3f2-4319-92be-7a5e972c106b",
    "studentCode": "10086",
    "studentName": "Bilqis Ufairah",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-c1ccae6d-ae43-4bbf-b539-4c1c96c9c16b-2026-08-16-Menulis-angka-p",
    "studentId": "c1ccae6d-ae43-4bbf-b539-4c1c96c9c16b",
    "studentCode": "10090",
    "studentName": "Fakhri Al-Ghifari",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-f20782b9-17ab-40f2-b315-7ad3aadc2739-2026-08-16-Menulis-angka-p",
    "studentId": "f20782b9-17ab-40f2-b315-7ad3aadc2739",
    "studentCode": "10112",
    "studentName": "Syakira Nur Aini",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-15de4d83-1d1b-4042-9bb4-9fdc65db1d3c-2026-08-16-Menulis-angka-p",
    "studentId": "15de4d83-1d1b-4042-9bb4-9fdc65db1d3c",
    "studentCode": "10092",
    "studentName": "Hafiz Al-Faruq",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-1d157032-9563-4b12-933f-f45078bd1646-2026-08-16-Menulis-angka-p",
    "studentId": "1d157032-9563-4b12-933f-f45078bd1646",
    "studentCode": "10104",
    "studentName": "Nabila Putri Ramadhani",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 83,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-aa3fff59-d27e-4851-a660-ceaf1d8e9ade-2026-08-16-Menulis-angka-p",
    "studentId": "aa3fff59-d27e-4851-a660-ceaf1d8e9ade",
    "studentCode": "10101",
    "studentName": "Muhammad Azka",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 86,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-f9ce8b07-5738-4c29-8ecc-048807666d4c-2026-08-16-Menulis-angka-p",
    "studentId": "f9ce8b07-5738-4c29-8ecc-048807666d4c",
    "studentCode": "10088",
    "studentName": "Dimas Arya Sena",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 89,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-e02583be-1443-414b-a37c-90e612bcd317-2026-08-16-Menulis-angka-p",
    "studentId": "e02583be-1443-414b-a37c-90e612bcd317",
    "studentCode": "10085",
    "studentName": "Bagas Pratama Putra",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-edfa74c0-7a6c-421e-b5a3-142f80563a3c-2026-08-16-Menulis-angka-p",
    "studentId": "edfa74c0-7a6c-421e-b5a3-142f80563a3c",
    "studentCode": "10089",
    "studentName": "Dzakiyyah Al Fajri",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-90d546d9-0f7c-4cdf-8351-5e854cce406c-2026-08-16-Menulis-angka-p",
    "studentId": "90d546d9-0f7c-4cdf-8351-5e854cce406c",
    "studentCode": "10093",
    "studentName": "Haris",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-b42ef79c-f9c9-4972-8f36-525ec014240e-2026-08-16-Menulis-angka-p",
    "studentId": "b42ef79c-f9c9-4972-8f36-525ec014240e",
    "studentCode": "10100",
    "studentName": "Maulana Syarif Wardani",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 2",
    "examDate": "2026-08-16",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-a32a3e2b-2898-4a12-a20f-a2cb15c3ca22-2026-08-16-Hitung-dan-tuli",
    "studentId": "a32a3e2b-2898-4a12-a20f-a2cb15c3ca22",
    "studentCode": "10082",
    "studentName": "Aishwa Rahma Annida",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-c76503ff-a1d9-45ee-815e-35e24c8f7c7c-2026-08-16-Hitung-dan-tuli",
    "studentId": "c76503ff-a1d9-45ee-815e-35e24c8f7c7c",
    "studentCode": "10087",
    "studentName": "Calista Azkadina",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 83,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-352a42af-0c46-4373-9ac4-69a5282da28c-2026-08-16-Hitung-dan-tuli",
    "studentId": "352a42af-0c46-4373-9ac4-69a5282da28c",
    "studentCode": "10091",
    "studentName": "Ghumaisha",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 86,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-2643a6e6-fcc0-4c9f-81b1-db1d116e37cd-2026-08-16-Hitung-dan-tuli",
    "studentId": "2643a6e6-fcc0-4c9f-81b1-db1d116e37cd",
    "studentCode": "10083",
    "studentName": "Arsyila Nasha Razita",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 89,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-48721968-d3f2-4319-92be-7a5e972c106b-2026-08-16-Hitung-dan-tuli",
    "studentId": "48721968-d3f2-4319-92be-7a5e972c106b",
    "studentCode": "10086",
    "studentName": "Bilqis Ufairah",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-c1ccae6d-ae43-4bbf-b539-4c1c96c9c16b-2026-08-16-Hitung-dan-tuli",
    "studentId": "c1ccae6d-ae43-4bbf-b539-4c1c96c9c16b",
    "studentCode": "10090",
    "studentName": "Fakhri Al-Ghifari",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-f20782b9-17ab-40f2-b315-7ad3aadc2739-2026-08-16-Hitung-dan-tuli",
    "studentId": "f20782b9-17ab-40f2-b315-7ad3aadc2739",
    "studentCode": "10112",
    "studentName": "Syakira Nur Aini",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-15de4d83-1d1b-4042-9bb4-9fdc65db1d3c-2026-08-16-Hitung-dan-tuli",
    "studentId": "15de4d83-1d1b-4042-9bb4-9fdc65db1d3c",
    "studentCode": "10092",
    "studentName": "Hafiz Al-Faruq",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-1d157032-9563-4b12-933f-f45078bd1646-2026-08-16-Hitung-dan-tuli",
    "studentId": "1d157032-9563-4b12-933f-f45078bd1646",
    "studentCode": "10104",
    "studentName": "Nabila Putri Ramadhani",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 83,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-aa3fff59-d27e-4851-a660-ceaf1d8e9ade-2026-08-16-Hitung-dan-tuli",
    "studentId": "aa3fff59-d27e-4851-a660-ceaf1d8e9ade",
    "studentCode": "10101",
    "studentName": "Muhammad Azka",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 86,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-f9ce8b07-5738-4c29-8ecc-048807666d4c-2026-08-16-Hitung-dan-tuli",
    "studentId": "f9ce8b07-5738-4c29-8ecc-048807666d4c",
    "studentCode": "10088",
    "studentName": "Dimas Arya Sena",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 89,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-e02583be-1443-414b-a37c-90e612bcd317-2026-08-16-Hitung-dan-tuli",
    "studentId": "e02583be-1443-414b-a37c-90e612bcd317",
    "studentCode": "10085",
    "studentName": "Bagas Pratama Putra",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-edfa74c0-7a6c-421e-b5a3-142f80563a3c-2026-08-16-Hitung-dan-tuli",
    "studentId": "edfa74c0-7a6c-421e-b5a3-142f80563a3c",
    "studentCode": "10089",
    "studentName": "Dzakiyyah Al Fajri",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-90d546d9-0f7c-4cdf-8351-5e854cce406c-2026-08-16-Hitung-dan-tuli",
    "studentId": "90d546d9-0f7c-4cdf-8351-5e854cce406c",
    "studentCode": "10093",
    "studentName": "Haris",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-b42ef79c-f9c9-4972-8f36-525ec014240e-2026-08-16-Hitung-dan-tuli",
    "studentId": "b42ef79c-f9c9-4972-8f36-525ec014240e",
    "studentCode": "10100",
    "studentName": "Maulana Syarif Wardani",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Hitung dan tulis",
    "examDate": "2026-08-16",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-a32a3e2b-2898-4a12-a20f-a2cb15c3ca22-2026-08-15-Menulis-angka-p",
    "studentId": "a32a3e2b-2898-4a12-a20f-a2cb15c3ca22",
    "studentCode": "10082",
    "studentName": "Aishwa Rahma Annida",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-c76503ff-a1d9-45ee-815e-35e24c8f7c7c-2026-08-15-Menulis-angka-p",
    "studentId": "c76503ff-a1d9-45ee-815e-35e24c8f7c7c",
    "studentCode": "10087",
    "studentName": "Calista Azkadina",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 83,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-352a42af-0c46-4373-9ac4-69a5282da28c-2026-08-15-Menulis-angka-p",
    "studentId": "352a42af-0c46-4373-9ac4-69a5282da28c",
    "studentCode": "10091",
    "studentName": "Ghumaisha",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 86,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-2643a6e6-fcc0-4c9f-81b1-db1d116e37cd-2026-08-15-Menulis-angka-p",
    "studentId": "2643a6e6-fcc0-4c9f-81b1-db1d116e37cd",
    "studentCode": "10083",
    "studentName": "Arsyila Nasha Razita",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 89,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-48721968-d3f2-4319-92be-7a5e972c106b-2026-08-15-Menulis-angka-p",
    "studentId": "48721968-d3f2-4319-92be-7a5e972c106b",
    "studentCode": "10086",
    "studentName": "Bilqis Ufairah",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-c1ccae6d-ae43-4bbf-b539-4c1c96c9c16b-2026-08-15-Menulis-angka-p",
    "studentId": "c1ccae6d-ae43-4bbf-b539-4c1c96c9c16b",
    "studentCode": "10090",
    "studentName": "Fakhri Al-Ghifari",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-f20782b9-17ab-40f2-b315-7ad3aadc2739-2026-08-15-Menulis-angka-p",
    "studentId": "f20782b9-17ab-40f2-b315-7ad3aadc2739",
    "studentCode": "10112",
    "studentName": "Syakira Nur Aini",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-15de4d83-1d1b-4042-9bb4-9fdc65db1d3c-2026-08-15-Menulis-angka-p",
    "studentId": "15de4d83-1d1b-4042-9bb4-9fdc65db1d3c",
    "studentCode": "10092",
    "studentName": "Hafiz Al-Faruq",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-1d157032-9563-4b12-933f-f45078bd1646-2026-08-15-Menulis-angka-p",
    "studentId": "1d157032-9563-4b12-933f-f45078bd1646",
    "studentCode": "10104",
    "studentName": "Nabila Putri Ramadhani",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 83,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-aa3fff59-d27e-4851-a660-ceaf1d8e9ade-2026-08-15-Menulis-angka-p",
    "studentId": "aa3fff59-d27e-4851-a660-ceaf1d8e9ade",
    "studentCode": "10101",
    "studentName": "Muhammad Azka",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 86,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-f9ce8b07-5738-4c29-8ecc-048807666d4c-2026-08-15-Menulis-angka-p",
    "studentId": "f9ce8b07-5738-4c29-8ecc-048807666d4c",
    "studentCode": "10088",
    "studentName": "Dimas Arya Sena",
    "className": "CLASS A",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 89,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "gr-e02583be-1443-414b-a37c-90e612bcd317-2026-08-15-Menulis-angka-p",
    "studentId": "e02583be-1443-414b-a37c-90e612bcd317",
    "studentCode": "10085",
    "studentName": "Bagas Pratama Putra",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-edfa74c0-7a6c-421e-b5a3-142f80563a3c-2026-08-15-Menulis-angka-p",
    "studentId": "edfa74c0-7a6c-421e-b5a3-142f80563a3c",
    "studentCode": "10089",
    "studentName": "Dzakiyyah Al Fajri",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-90d546d9-0f7c-4cdf-8351-5e854cce406c-2026-08-15-Menulis-angka-p",
    "studentId": "90d546d9-0f7c-4cdf-8351-5e854cce406c",
    "studentCode": "10093",
    "studentName": "Haris",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 98,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true
  },
  {
    "id": "gr-b42ef79c-f9c9-4972-8f36-525ec014240e-2026-08-15-Menulis-angka-p",
    "studentId": "b42ef79c-f9c9-4972-8f36-525ec014240e",
    "studentCode": "10100",
    "studentName": "Maulana Syarif Wardani",
    "className": "CLASS B",
    "branch": "Singkut",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1b",
    "topic": "Menulis angka puluhan berdasarkan simbol 1",
    "examDate": "2026-08-15",
    "score": 80,
    "note": "Akurasi gerakan jari jemari bagus",
    "isJoined": true
  },
  {
    "id": "87200252-63a3-4e57-93cf-4da10dd348a7",
    "studentId": "001f391b-660f-46f6-a82e-d59a0bb45700",
    "studentCode": "86254",
    "studentName": "Raditya Riski Ramadhan ",
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6ab1f3e0-0cdd-4fa1-b6aa-8b4c406b38d1",
    "studentId": "16d71476-7ec9-483a-a2b0-f1e9de3ade83",
    "studentCode": "65934",
    "studentName": "Rahajeng Ayu Kinanti",
    "className": "KELAS A2",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 83,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d7694af1-11e2-4c94-8978-5ee7f5343758",
    "studentId": "1e8d5ed6-e5b1-474e-8b64-24633476b6f9",
    "studentCode": "95219",
    "studentName": "Viola Alesha Ganes",
    "className": "KELAS D",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 87,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "1ff81b6d-6f8c-45eb-a443-aae9892ec45d",
    "studentId": "216e8e11-446a-46bd-8641-893961f9462f",
    "studentCode": "66787",
    "studentName": "Anindita Keisha Zahra",
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 87,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c6fc00f6-e775-4505-b386-a84fe694429f",
    "studentId": "31486b62-e24d-4ded-a892-c9be9a9b68c3",
    "studentCode": "56840",
    "studentName": "Afrial Arsenio",
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 86,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "7817aaf4-2ca3-4e05-b45e-19f79f79a395",
    "studentId": "3989a228-cdd0-456b-aa91-b9be32522cb5",
    "studentCode": "31290",
    "studentName": "Daniswara Rizky",
    "className": "KELAS A1",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 85,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "de5d4f93-cc36-442e-bba0-2932863ad2f5",
    "studentId": "452fe4ee-e4c6-4e63-a83d-9f0829085e88",
    "studentCode": "65103",
    "studentName": "Najwa Khaira Wilda",
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 88,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "53a28c22-9c7b-4b9d-8308-d8a52bdc56f2",
    "studentId": "4964c094-f258-4fcb-94ed-1619344d0377",
    "studentCode": "47440",
    "studentName": "Najwa Alarifah",
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 89,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5272c75a-1655-4a6d-9f7d-6d6846b2a6f7",
    "studentId": "5c74b85c-f840-4649-ab72-e572843d8848",
    "studentCode": "29797",
    "studentName": "Aqila Fahmida",
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "81b88d40-ec2d-4d57-8d90-19e6a216ad23",
    "studentId": "68d5295b-bde7-4391-bab3-68255dcee983",
    "studentCode": "78123",
    "studentName": "Gladis Anindita",
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 95,
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
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 84,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "acad7481-eca6-482b-8e0f-c2be35d1968b",
    "studentId": "873cf03f-d94e-41c1-a8d8-44ea933c1d93",
    "studentCode": "93060",
    "studentName": "Arka Prapta Ardani",
    "className": "KELAS B",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 86,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "213ac418-f8b7-489f-92bf-7243aa05c81d",
    "studentId": "981d918a-8b29-4b3f-b7e7-7d0baedae5b6",
    "studentCode": "15367",
    "studentName": "Aida Syafira N.A",
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 89,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c878d4d4-25c6-437f-a574-4d04beffeed9",
    "studentId": "9e1eea3b-215f-41c6-b662-89e0f7bbac6a",
    "studentCode": "48291",
    "studentName": "Haura",
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "819b0dea-afc5-4e8b-8615-d0117c29e2bd",
    "studentId": "a6c9d744-dcac-4377-b0a0-0d2a140c1257",
    "studentCode": "44156",
    "studentName": "Rafa Al-Ghifari",
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "fc5e8991-5121-40b6-9368-ffd1d487c539",
    "studentId": "ae6f604a-c5a1-48a0-a65c-776edc69b777",
    "studentCode": "54321",
    "studentName": "Kevin Pratama",
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 86,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e464f0fb-4840-490e-a740-c4d066472d87",
    "studentId": "bb043228-0521-4772-8409-ffb114dea44d",
    "studentCode": "77189",
    "studentName": "Naura Zafira",
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ab143c53-7ded-46a4-85e0-a1c407355b65",
    "studentId": "c3f5334a-642b-4e05-a980-bbbc4442438b",
    "studentCode": "31996",
    "studentName": "Aira Anatasya Putri",
    "className": "KELAS B",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e113d49e-9a53-4043-87e0-ed7647de4e67",
    "studentId": "ca9930de-9661-4823-a0e9-29621ef4f208",
    "studentCode": "32460",
    "studentName": "Shaqia Azzahra Rahayu",
    "className": "KELAS B",
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 93,
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d94a2945-0128-4070-9ab0-3005d11af115",
    "studentId": "d59d6d2c-166e-4f78-85f0-f3c346278122",
    "studentCode": "69413",
    "studentName": "Zafran Rafisqi",
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ea3634e8-2974-45d0-b841-9c7c34120fec",
    "studentId": "e08d4e8d-5858-4762-af6b-dfe5ff031bb9",
    "studentCode": "78564",
    "studentName": "Alesha Rafani Marta",
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0b460118-4d16-4fdc-8059-146b5c8f55c4",
    "studentId": "ee84a828-abc0-41c5-9ead-d79ff2056910",
    "studentCode": "96166",
    "studentName": "Ayunda Shela Ferlita ",
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8cbc0c25-2312-479e-9ad4-e641ef0d135f",
    "studentId": "f2dcf39c-3131-497a-bce7-996dbeff9d62",
    "studentCode": "68933",
    "studentName": "Abizar Rahandika Alghifari",
    "className": "KELAS B",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penguatan Simbol + Persiapan Level 1",
    "examDate": "2026-09-06",
    "score": 84,
    "note": "Gerakan jari cepat dan tepat",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "52a06983-dc17-442b-9181-34a95b4f18c7",
    "studentId": "faf6d016-09db-47f7-88c1-93f2ba67a241",
    "studentCode": "66178",
    "studentName": "Prabu Wijaya",
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 88,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5ed4edec-cc49-4b6d-981c-6e358a411844",
    "studentId": "16d71476-7ec9-483a-a2b0-f1e9de3ade83",
    "studentCode": "65934",
    "studentName": "Rahajeng Ayu Kinanti",
    "className": "KELAS A2",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d762998c-e7cf-421c-9209-6165e474a7cc",
    "studentId": "1e8d5ed6-e5b1-474e-8b64-24633476b6f9",
    "studentCode": "95219",
    "studentName": "Viola Alesha Ganes",
    "className": "KELAS D",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 83,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "88ce6b63-4a2b-4eac-9b57-3e6d2297f43b",
    "studentId": "216e8e11-446a-46bd-8641-893961f9462f",
    "studentCode": "66787",
    "studentName": "Anindita Keisha Zahra",
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 83,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "617ea25e-0d92-4c20-be77-cb0c00585fd2",
    "studentId": "31486b62-e24d-4ded-a892-c9be9a9b68c3",
    "studentCode": "56840",
    "studentName": "Afrial Arsenio",
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 82,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "cd6019d7-d53e-453f-ac56-7e40ef2120ff",
    "studentId": "3989a228-cdd0-456b-aa91-b9be32522cb5",
    "studentCode": "31290",
    "studentName": "Daniswara Rizky",
    "className": "KELAS A1",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 81,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "9306cf7e-56be-4703-bb3d-ed717ece259e",
    "studentId": "452fe4ee-e4c6-4e63-a83d-9f0829085e88",
    "studentCode": "65103",
    "studentName": "Najwa Khaira Wilda",
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 84,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "dcda8213-9f41-4670-997e-200b5c810a2b",
    "studentId": "4964c094-f258-4fcb-94ed-1619344d0377",
    "studentCode": "47440",
    "studentName": "Najwa Alarifah",
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 85,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "93a3a3c6-aa8e-4896-bab8-98e5c2f6a6ee",
    "studentId": "5c74b85c-f840-4649-ab72-e572843d8848",
    "studentCode": "29797",
    "studentName": "Aqila Fahmida",
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "88a18898-47aa-4a36-9c17-9cccaefeebd4",
    "studentId": "68d5295b-bde7-4391-bab3-68255dcee983",
    "studentCode": "78123",
    "studentName": "Gladis Anindita",
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
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
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c1c2cb15-f505-4fe1-83b5-fed615c74458",
    "studentId": "873cf03f-d94e-41c1-a8d8-44ea933c1d93",
    "studentCode": "93060",
    "studentName": "Arka Prapta Ardani",
    "className": "KELAS B",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 82,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b13f369a-7ad6-49e7-9446-7d8f7ffe70aa",
    "studentId": "981d918a-8b29-4b3f-b7e7-7d0baedae5b6",
    "studentCode": "15367",
    "studentName": "Aida Syafira N.A",
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 85,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "df8fe9bf-d7c1-404b-bd40-bc9e33933d1a",
    "studentId": "9e1eea3b-215f-41c6-b662-89e0f7bbac6a",
    "studentCode": "48291",
    "studentName": "Haura",
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 89,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "2b65152a-35de-4dc3-ae06-57c7eef95aa9",
    "studentId": "a6c9d744-dcac-4377-b0a0-0d2a140c1257",
    "studentCode": "44156",
    "studentName": "Rafa Al-Ghifari",
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
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
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 82,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f4a59dee-054d-44e6-9ca4-b99e2875f2dc",
    "studentId": "bb043228-0521-4772-8409-ffb114dea44d",
    "studentCode": "77189",
    "studentName": "Naura Zafira",
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "7a9b5667-12c8-4e27-9691-3bbf722bc69b",
    "studentId": "c3f5334a-642b-4e05-a980-bbbc4442438b",
    "studentCode": "31996",
    "studentName": "Aira Anatasya Putri",
    "className": "KELAS B",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "73abe8c5-9ee3-44c3-94b7-6489b0fcf944",
    "studentId": "ca9930de-9661-4823-a0e9-29621ef4f208",
    "studentCode": "32460",
    "studentName": "Shaqia Azzahra Rahayu",
    "className": "KELAS B",
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 89,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ad164e52-e77a-4865-a937-1b2f4581aa0d",
    "studentId": "cea06363-69e7-47b6-9f47-1a7716561f7d",
    "studentCode": "65603",
    "studentName": "Aqila Fahmida",
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 86,
    "note": "Fokus dan teliti menyelesaikan latihan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4e8110ea-edd2-40d6-859b-1ce46c18aaeb",
    "studentId": "d59d6d2c-166e-4f78-85f0-f3c346278122",
    "studentCode": "69413",
    "studentName": "Zafran Rafisqi",
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "36fc3b1a-6034-4ecf-a5d8-9590c5a3f6b2",
    "studentId": "e08d4e8d-5858-4762-af6b-dfe5ff031bb9",
    "studentCode": "78564",
    "studentName": "Alesha Rafani Marta",
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 91,
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "19852b0c-9714-4e24-bcb1-6d33032591ff",
    "studentId": "f2dcf39c-3131-497a-bce7-996dbeff9d62",
    "studentCode": "68933",
    "studentName": "Abizar Rahandika Alghifari",
    "className": "KELAS B",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul Level 1",
    "examDate": "2026-09-13",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "95a41b39-2ce5-4182-a84b-3c9fa5654405",
    "studentId": "faf6d016-09db-47f7-88c1-93f2ba67a241",
    "studentCode": "66178",
    "studentName": "Prabu Wijaya",
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A2",
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
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
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A2",
    "branch": "Bangko",
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
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A2",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A2",
    "branch": "Bangko",
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
    "className": "KELAS A2",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Penjumlahan Puluhan Satuan",
    "examDate": "2026-09-15",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b0f7fe79-f76b-445a-bf72-ae1d6c8dfaa7",
    "studentId": "001f391b-660f-46f6-a82e-d59a0bb45700",
    "studentCode": "86254",
    "studentName": "Raditya Riski Ramadhan ",
    "className": "KELAS D",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 88,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f6fe1631-12c6-4f3c-be8b-e428013c9176",
    "studentId": "001f391b-660f-46f6-a82e-d59a0bb45700",
    "studentCode": "86254",
    "studentName": "Raditya Riski Ramadhan ",
    "className": "KELAS D",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 84,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8545ea17-89f7-47c8-8ebf-ff12f94d06b4",
    "studentId": "04796f1c-9a95-475e-a8db-b8fd605ae5ad",
    "studentCode": "76123",
    "studentName": "Bima Sakti",
    "className": "KELAS B",
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 86,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "547ea9f9-dd48-435e-8cf8-50fa9459b40b",
    "studentId": "16d71476-7ec9-483a-a2b0-f1e9de3ade83",
    "studentCode": "65934",
    "studentName": "Rahajeng Ayu Kinanti",
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3073f920-2a49-48bd-b1d5-b212a6540c70",
    "studentId": "16d71476-7ec9-483a-a2b0-f1e9de3ade83",
    "studentCode": "65934",
    "studentName": "Rahajeng Ayu Kinanti",
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 94,
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 91,
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "03b7f419-1ae1-4dbf-a16a-461eff3d3c4f",
    "studentId": "17a21047-a092-4964-a396-ea778093f34d",
    "studentCode": "52651",
    "studentName": "Ainan Nuri Sumayah",
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A2",
    "branch": "Bangko",
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
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 85,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d33e68bd-ef00-4044-8601-9aa55483eafb",
    "studentId": "31486b62-e24d-4ded-a892-c9be9a9b68c3",
    "studentCode": "56840",
    "studentName": "Afrial Arsenio",
    "className": "KELAS C",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 83,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "4fa1b343-dce9-4848-95f5-7d15a3c9839f",
    "studentId": "31486b62-e24d-4ded-a892-c9be9a9b68c3",
    "studentCode": "56840",
    "studentName": "Afrial Arsenio",
    "className": "KELAS C",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3ec5e7e0-aeba-40e9-94b4-ba64f27cf4c9",
    "studentId": "32dad6a6-6729-4aed-a91c-885e1b685e4c",
    "studentCode": "21117",
    "studentName": "Natasya Elfani Alkhomah",
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 80,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "79c6acae-ce23-47a9-91ae-9ea4b57e1ede",
    "studentId": "3989a228-cdd0-456b-aa91-b9be32522cb5",
    "studentCode": "31290",
    "studentName": "Daniswara Rizky",
    "className": "KELAS A1",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 83,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5ac4590c-27c8-4a62-8754-a56e874e50a7",
    "studentId": "3989a228-cdd0-456b-aa91-b9be32522cb5",
    "studentCode": "31290",
    "studentName": "Daniswara Rizky",
    "className": "KELAS A1",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "bd3996cf-cd11-4f9c-972a-d923dd4918e8",
    "studentId": "452fe4ee-e4c6-4e63-a83d-9f0829085e88",
    "studentCode": "65103",
    "studentName": "Najwa Khaira Wilda",
    "className": "KELAS A2",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f68ed3ad-633f-404b-915b-00d7e4cf71d3",
    "studentId": "497ef1bb-d078-42af-a596-85d9d8c60bf0",
    "studentCode": "99133",
    "studentName": "Arsyila Nasha Razita",
    "className": "KELAS B",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 93,
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 89,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b10fa09b-5255-4a10-81c3-4b5ef1e4ebb3",
    "studentId": "4c5462b2-a318-45de-8ffd-293df12e4334",
    "studentCode": "40736",
    "studentName": "Aira Anatasya Putri",
    "className": "KELAS B",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "aa583212-fc0a-4a4b-a926-e20c888cd694",
    "studentId": "4fae6a4c-8c08-4351-bb25-71e9db2e4ecb",
    "studentCode": "17055",
    "studentName": "Anandira Dyah Asmara Wati",
    "className": "KELAS C",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "915af21d-2777-41a4-8c13-a1033cde5555",
    "studentId": "4fae6a4c-8c08-4351-bb25-71e9db2e4ecb",
    "studentCode": "17055",
    "studentName": "Anandira Dyah Asmara Wati",
    "className": "KELAS C",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 88,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f894219e-62c8-42a2-8ebf-f20fbee12d79",
    "studentId": "50d53115-8f00-40eb-90b0-1de731665ec4",
    "studentCode": "71940",
    "studentName": "Mahera Aiza Hilya",
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "className": "KELAS A1",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "df554bb6-8fc8-438c-900d-d6fc6a7cf0b3",
    "studentId": "55e4f383-8f7f-43aa-ab5b-bf31aaa02b29",
    "studentCode": "77364",
    "studentName": "M. Fahrul Al Khafid",
    "className": "KELAS D",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "7b3f777b-5e15-4985-b3e2-87366bf8a923",
    "studentId": "55e4f383-8f7f-43aa-ab5b-bf31aaa02b29",
    "studentCode": "77364",
    "studentName": "M. Fahrul Al Khafid",
    "className": "KELAS D",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 83,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e15b2469-06a8-42fe-b2aa-11b593a477b5",
    "studentId": "5831e4e4-ad30-43d7-a4d5-a11dd3b46508",
    "studentCode": "57508",
    "studentName": "Raffasya Abizar Raqilla",
    "className": "KELAS D",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 87,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ba4dcf98-9f14-455f-9d3b-943d00fc7d73",
    "studentId": "5831e4e4-ad30-43d7-a4d5-a11dd3b46508",
    "studentCode": "57508",
    "studentName": "Raffasya Abizar Raqilla",
    "className": "KELAS D",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 83,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "26d3727b-4250-4fe6-9ac1-e79b1fe33da8",
    "studentId": "58a9b1e8-fe4b-4471-8ddc-05548604fe49",
    "studentCode": "67358",
    "studentName": "Nayla Inara Putri",
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 83,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c305c391-bed5-4dd0-b6c9-9c1379371f12",
    "studentId": "5c74b85c-f840-4649-ab72-e572843d8848",
    "studentCode": "29797",
    "studentName": "Aqila Fahmida",
    "className": "KELAS A1",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 89,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6e56f6bc-1f1e-4bcb-a4df-7261593fbf74",
    "studentId": "5c74b85c-f840-4649-ab72-e572843d8848",
    "studentCode": "29797",
    "studentName": "Aqila Fahmida",
    "className": "KELAS A1",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 85,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f585a832-bd8c-478f-b294-c824138d2f11",
    "studentId": "5f15914c-65c0-4824-8170-2bc66288ae8d",
    "studentCode": "12232",
    "studentName": "Nathania Azkadina Farzana",
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 88,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a4326123-b6c8-488f-adff-8f02134e40c3",
    "studentId": "68d5295b-bde7-4391-bab3-68255dcee983",
    "studentCode": "78123",
    "studentName": "Gladis Anindita",
    "className": "KELAS A1",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "31f975b3-8bf0-493a-9496-81825154d555",
    "studentId": "68d5295b-bde7-4391-bab3-68255dcee983",
    "studentCode": "78123",
    "studentName": "Gladis Anindita",
    "className": "KELAS A1",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "3cd436ca-588f-423c-b68d-5617bc8696c7",
    "studentId": "68d57e75-a2d2-4251-b6a7-541c3bc9c15d",
    "studentCode": "66458",
    "studentName": "Adeeva Afsheen Myesha",
    "className": "KELAS C",
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 82,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "79af556f-1b6e-494d-bb67-248254a9aa2c",
    "studentId": "6c55f895-276b-4955-ab24-223af3c42bea",
    "studentCode": "67890",
    "studentName": "Fathir Ahmad",
    "className": "KELAS A1",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 85,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5f4bfcb6-a015-4b02-b5a9-5046ce32a100",
    "studentId": "6c55f895-276b-4955-ab24-223af3c42bea",
    "studentCode": "67890",
    "studentName": "Fathir Ahmad",
    "className": "KELAS A1",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 89,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8c302633-0ffc-4de7-8861-07110e5a9150",
    "studentId": "6d947da3-e268-4b69-ab42-820c9b48132e",
    "studentCode": "70553",
    "studentName": "Shaqia Azzahra Rahayu",
    "className": "KELAS B",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 89,
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8f21d679-f188-41fa-8994-155b47a75747",
    "studentId": "7169f097-8bf5-40dd-934e-0f5460261c04",
    "studentCode": "20080",
    "studentName": "M. Hannan Habibillah",
    "className": "KELAS B",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 93,
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 90,
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 94,
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "353f0220-4533-42f8-b837-17a3cf93591d",
    "studentId": "8e4bf798-43a8-4def-ad68-252c3035dd84",
    "studentCode": "43183",
    "studentName": "Habib Fadhil Abidin",
    "className": "KELAS D",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 83,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "9ad72a16-d91d-473e-9622-e7547550a1aa",
    "studentId": "8e4bf798-43a8-4def-ad68-252c3035dd84",
    "studentCode": "43183",
    "studentName": "Habib Fadhil Abidin",
    "className": "KELAS D",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 87,
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 80,
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 84,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "93db5c12-15b5-4ec1-a45b-1a76b020d1b5",
    "studentId": "981d918a-8b29-4b3f-b7e7-7d0baedae5b6",
    "studentCode": "15367",
    "studentName": "Aida Syafira N.A",
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "className": "KELAS A1",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 82,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c297b2c4-cae8-413b-99a2-adfb4438b79d",
    "studentId": "9f60be52-54d6-41df-a0b8-f1de43bbd7f7",
    "studentCode": "74789",
    "studentName": "M. Dhaffa Athallah",
    "className": "KELAS C",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 87,
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "47e2a127-fe30-4729-ad0b-b21e9292cc7a",
    "studentId": "a6c9d744-dcac-4377-b0a0-0d2a140c1257",
    "studentCode": "44156",
    "studentName": "Rafa Al-Ghifari",
    "className": "KELAS A2",
    "branch": "Bangko",
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
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f4c4cc89-2e72-44af-a031-1cd455361091",
    "studentId": "ae6f604a-c5a1-48a0-a65c-776edc69b777",
    "studentCode": "54321",
    "studentName": "Kevin Pratama",
    "className": "KELAS A1",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 85,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a1766c80-5d4d-45e7-b91d-f32bc039b778",
    "studentId": "ae6f604a-c5a1-48a0-a65c-776edc69b777",
    "studentCode": "54321",
    "studentName": "Kevin Pratama",
    "className": "KELAS A1",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 81,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5f87afc8-77b7-48be-aefb-bf3cbc50744a",
    "studentId": "afff798e-f6eb-4730-883b-cebf7ee93880",
    "studentCode": "41984",
    "studentName": "Asheqa Shaqueena Qotrunada",
    "className": "KELAS A1",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 81,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0cd83ff4-90b4-4a3e-bdf2-119506a0df77",
    "studentId": "afff798e-f6eb-4730-883b-cebf7ee93880",
    "studentCode": "41984",
    "studentName": "Asheqa Shaqueena Qotrunada",
    "className": "KELAS A1",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 85,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "80c0d67b-1a1f-4ab1-bc3f-c25dd0330d87",
    "studentId": "b0655f2e-a8c9-4320-9ad7-1e85f7e120ce",
    "studentCode": "88190",
    "studentName": "M. Rayyan Al-Fatih",
    "className": "KELAS C",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 85,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0c4f3a8f-4a79-4c66-9d1c-32423d73dbb7",
    "studentId": "b0655f2e-a8c9-4320-9ad7-1e85f7e120ce",
    "studentCode": "88190",
    "studentName": "M. Rayyan Al-Fatih",
    "className": "KELAS C",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 89,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "37d477ae-f57c-4efb-871f-e814f6e8263f",
    "studentId": "b252f9f5-a288-433f-9ad7-ac52dbb7a9a7",
    "studentCode": "52809",
    "studentName": "Anandira Dyah Asmarawati",
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b41c16cf-7d7a-4c26-b8ac-4bc0c382c2c8",
    "studentId": "c3f5334a-642b-4e05-a980-bbbc4442438b",
    "studentCode": "31996",
    "studentName": "Aira Anatasya Putri",
    "className": "KELAS B",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 88,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "8e0aafdb-8c3f-4772-b3d4-0173c3db06db",
    "studentId": "c3f5334a-642b-4e05-a980-bbbc4442438b",
    "studentCode": "31996",
    "studentName": "Aira Anatasya Putri",
    "className": "KELAS B",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 84,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "10caa41f-2c54-4572-9be5-468526292459",
    "studentId": "c407aac0-a001-4ce4-8aff-85634e737f3c",
    "studentCode": "86280",
    "studentName": "Arsy Akifa Salsabila",
    "className": "KELAS B",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 82,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "b033ac8b-b2d5-486a-a502-950b864c7449",
    "studentId": "c5767e1d-86a4-4fdd-9bb1-f1a64bed4a6f",
    "studentCode": "17366",
    "studentName": "Abizar Rahandika Alghifari",
    "className": "KELAS B",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "21556900-fec7-41b8-9541-8f6d9ce1edb9",
    "studentId": "c5767e1d-86a4-4fdd-9bb1-f1a64bed4a6f",
    "studentCode": "17366",
    "studentName": "Abizar Rahandika Alghifari",
    "className": "KELAS B",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "997ba3ab-2910-4a9a-bb4a-006ab1c9c6f7",
    "studentId": "ca9930de-9661-4823-a0e9-29621ef4f208",
    "studentCode": "32460",
    "studentName": "Shaqia Azzahra Rahayu",
    "className": "KELAS B",
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 88,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "99b7f59c-e232-4097-8227-96b0af11f2b6",
    "studentId": "d0eaf62d-32db-4518-9ba9-35183a533bef",
    "studentCode": "88692",
    "studentName": "Arasely Naura Shada",
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 84,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "11cba2f8-712a-45d4-bf86-8130dc2d0459",
    "studentId": "d0eaf62d-32db-4518-9ba9-35183a533bef",
    "studentCode": "88692",
    "studentName": "Arasely Naura Shada",
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 88,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "317204d2-56cd-45c7-bfbc-ed2515c0747d",
    "studentId": "d59d6d2c-166e-4f78-85f0-f3c346278122",
    "studentCode": "69413",
    "studentName": "Zafran Rafisqi",
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 85,
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "21e1ac78-c321-4a40-97c1-a113c9bba344",
    "studentId": "d8d8fd71-2a09-4ee9-8bab-723d01afcce5",
    "studentCode": "47603",
    "studentName": "Yusuf Syauqy Syahid",
    "className": "KELAS A1",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 83,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "ec03a0d9-756f-4953-9b7e-268612797133",
    "studentId": "db3d66d8-d162-4032-a6df-cb222d521c53",
    "studentCode": "44789",
    "studentName": "Maulana Syarif Wardhani",
    "className": "KELAS A2",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 87,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d2b6cdf7-b8cd-4b87-9f09-6a0d68b3654d",
    "studentId": "dd652c0e-1633-4495-8ff4-16c4cacc3ffc",
    "studentCode": "22134",
    "studentName": "Tiara Andini",
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "0a11e96d-a736-46f3-aab4-90e6290c1d0a",
    "studentId": "dd652c0e-1633-4495-8ff4-16c4cacc3ffc",
    "studentCode": "22134",
    "studentName": "Tiara Andini",
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 88,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "526d7fdc-be3e-47e2-8867-27881487a90e",
    "studentId": "e08d4e8d-5858-4762-af6b-dfe5ff031bb9",
    "studentCode": "78564",
    "studentName": "Alesha Rafani Marta",
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "e2caafa2-c180-4ae6-8ce3-058d318941fa",
    "studentId": "e08d4e8d-5858-4762-af6b-dfe5ff031bb9",
    "studentCode": "78564",
    "studentName": "Alesha Rafani Marta",
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 89,
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 92,
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 88,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "275c093a-6f70-4618-a1b4-60ebe4e60030",
    "studentId": "f2dcf39c-3131-497a-bce7-996dbeff9d62",
    "studentCode": "68933",
    "studentName": "Abizar Rahandika Alghifari",
    "className": "KELAS B",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 86,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "5d6c55e4-044d-4b30-937d-7c24bdb7d655",
    "studentId": "f2dcf39c-3131-497a-bce7-996dbeff9d62",
    "studentCode": "68933",
    "studentName": "Abizar Rahandika Alghifari",
    "className": "KELAS B",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 82,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "07d390ed-8902-42ed-81c5-9e9de9fd6ef0",
    "studentId": "f5269115-d04f-4424-9bbc-ffbf35974aca",
    "studentCode": "79805",
    "studentName": "M. Razka Raffasya",
    "className": "KELAS B",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 96,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "517ce89b-7455-4787-b74e-dab78dc65c4b",
    "studentId": "f5269115-d04f-4424-9bbc-ffbf35974aca",
    "studentCode": "79805",
    "studentName": "M. Razka Raffasya",
    "className": "KELAS B",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 92,
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 82,
    "note": "Peningkatan kecepatan hitung jari",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d8fd1ca2-27bb-44b4-a1b2-b48d89882420",
    "studentId": "faf6d016-09db-47f7-88c1-93f2ba67a241",
    "studentCode": "66178",
    "studentName": "Prabu Wijaya",
    "className": "KELAS C",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 93,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "bda4dc6c-bb9c-43c4-8a47-f1e52642fb35",
    "studentId": "fd6da340-cbd8-44e9-8d93-e97e51cbbe4d",
    "studentCode": "89919",
    "studentName": "Felisha Amara Gina",
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 96,
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "LV 1  Pengurangan",
    "examDate": "2026-09-21",
    "score": 86,
    "note": "Mampu membedakan gerakan jari turun",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "7dabef06-8d4a-4097-a43a-e05f958728c9",
    "studentId": "ffdc0d9b-af62-4250-b6f4-b561bdda627f",
    "studentCode": "80218",
    "studentName": "Nurul Hasna Maulidyah",
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Modul LV 1 P+P",
    "examDate": "2026-09-21",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "49d33926-5ab8-469b-8605-af0b9746e972",
    "studentId": "001f391b-660f-46f6-a82e-d59a0bb45700",
    "studentCode": "86254",
    "studentName": "Raditya Riski Ramadhan ",
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 100,
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 91,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6065d3a8-3deb-41e3-884c-31207b5eade6",
    "studentId": "1e8d5ed6-e5b1-474e-8b64-24633476b6f9",
    "studentCode": "95219",
    "studentName": "Viola Alesha Ganes",
    "className": "KELAS D",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 95,
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 95,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f985259b-fd53-4f5d-823a-faa5f65be142",
    "studentId": "31486b62-e24d-4ded-a892-c9be9a9b68c3",
    "studentCode": "56840",
    "studentName": "Afrial Arsenio",
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c181ffda-a8fc-42a3-83fc-ba3c498dda5b",
    "studentId": "3989a228-cdd0-456b-aa91-b9be32522cb5",
    "studentCode": "31290",
    "studentName": "Daniswara Rizky",
    "className": "KELAS A1",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 93,
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 96,
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "30864760-776e-4efe-a56e-2d872a542a06",
    "studentId": "5c74b85c-f840-4649-ab72-e572843d8848",
    "studentCode": "29797",
    "studentName": "Aqila Fahmida",
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 87,
    "note": "Sangat baik dalam operasi gabungan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f08ae5c6-1787-40c0-854f-78d1b17795c2",
    "studentId": "68d5295b-bde7-4391-bab3-68255dcee983",
    "studentCode": "78123",
    "studentName": "Gladis Anindita",
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 88,
    "note": "Sangat baik dalam operasi gabungan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f21e8ffe-3797-491a-bede-2335e64dc7b4",
    "studentId": "7169f097-8bf5-40dd-934e-0f5460261c04",
    "studentCode": "20080",
    "studentName": "M. Hannan Habibillah",
    "className": "KELAS B",
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "d9490726-f32c-4665-857a-06b583349c32",
    "studentId": "873cf03f-d94e-41c1-a8d8-44ea933c1d93",
    "studentCode": "93060",
    "studentName": "Arka Prapta Ardani",
    "className": "KELAS B",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "6f9f99db-3a1b-4d61-ad8f-82dddf78ddac",
    "studentId": "981d918a-8b29-4b3f-b7e7-7d0baedae5b6",
    "studentCode": "15367",
    "studentName": "Aida Syafira N.A",
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 97,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "31de4b34-d2fd-49d2-8364-fe63015a17d9",
    "studentId": "9e1eea3b-215f-41c6-b662-89e0f7bbac6a",
    "studentCode": "48291",
    "studentName": "Haura",
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 100,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "251f5724-bcf7-43c3-a842-8227dfc7c9bc",
    "studentId": "a6c9d744-dcac-4377-b0a0-0d2a140c1257",
    "studentCode": "44156",
    "studentName": "Rafa Al-Ghifari",
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 90,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "1bda4035-d089-4d4c-8e63-9f01273b541b",
    "studentId": "ae6f604a-c5a1-48a0-a65c-776edc69b777",
    "studentCode": "54321",
    "studentName": "Kevin Pratama",
    "className": "KELAS A1",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 94,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "9be50e77-3231-47ef-a970-e0229bd30c55",
    "studentId": "bb043228-0521-4772-8409-ffb114dea44d",
    "studentCode": "77189",
    "studentName": "Naura Zafira",
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 89,
    "note": "Sangat baik dalam operasi gabungan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "f9edf9e3-31ad-4fa4-9861-e7db571144f0",
    "studentId": "c3f5334a-642b-4e05-a980-bbbc4442438b",
    "studentCode": "31996",
    "studentName": "Aira Anatasya Putri",
    "className": "KELAS B",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 89,
    "note": "Sangat baik dalam operasi gabungan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c037f37e-99f3-4465-a176-7f8dba43fbb8",
    "studentId": "ca9930de-9661-4823-a0e9-29621ef4f208",
    "studentCode": "32460",
    "studentName": "Shaqia Azzahra Rahayu",
    "className": "KELAS B",
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 100,
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
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
    "className": "KELAS D",
    "branch": "Bangko",
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
    "className": "KELAS B",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 87,
    "note": "Sangat baik dalam operasi gabungan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "c8581f37-3ccd-461c-b755-c5c48fd4a7b3",
    "studentId": "e08d4e8d-5858-4762-af6b-dfe5ff031bb9",
    "studentCode": "78564",
    "studentName": "Alesha Rafani Marta",
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 88,
    "note": "Sangat baik dalam operasi gabungan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "a1810f94-7f4f-4b3f-92cb-2972268cdd44",
    "studentId": "ee84a828-abc0-41c5-9ead-d79ff2056910",
    "studentCode": "96166",
    "studentName": "Ayunda Shela Ferlita ",
    "className": "KELAS A2",
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 87,
    "note": "Sangat baik dalam operasi gabungan",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "43d326ee-b1f9-4ec0-b113-36d3c5188da5",
    "studentId": "f2dcf39c-3131-497a-bce7-996dbeff9d62",
    "studentCode": "68933",
    "studentName": "Abizar Rahandika Alghifari",
    "className": "KELAS B",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 92,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  },
  {
    "id": "786c0d14-9d99-4078-b0a9-e64e3041871a",
    "studentId": "faf6d016-09db-47f7-88c1-93f2ba67a241",
    "studentCode": "66178",
    "studentName": "Prabu Wijaya",
    "className": "KELAS C",
    "branch": "Bangko",
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
    "branch": "Bangko",
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
    "branch": "Bangko",
    "branchId": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "topic": "Operasi Campuran (+,-,x)",
    "examDate": "2026-09-27",
    "score": 100,
    "note": "Sangat cepat / fokus tinggi",
    "isJoined": true,
    "programType": "MATEMATIKA"
  }
];

export const INITIAL_BEHAVIORS: BehaviorItem[] = [];

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
  },
  {
    id: "b79e3ade-3270-4796-b526-b373792414c8",
    orderIndex: 4,
    levelTitle: "Level 3: Mahir & Olimpiade",
    shortDesc: "Perkalian dan pembagian cepat jari serta operasi campuran",
    learningGoals:
      "Menguasai perkalian dan pembagian jari tangan refleks serta persiapan olimpiade matematika.",
    competencies:
      "KD 3.1 Perkalian jari 6-10. KD 3.2 Pembagian jari cepat. KD 3.3 Hitung berantai 5 baris.",
    learningMaterials:
      "1. Rumus perkalian formasi jari\n2. Pembagian cepat\n3. Latihan olimpiade",
    indicators: [
      "Perkalian 1-100 tanpa kertas cakar",
      "Kecepatan mencongak < 2 detik",
    ],
  },
];

const INITIAL_LEVEL_COLUMNS: LevelProgressionConfig[] = [
  { id: "lvl-1", levelNumber: 1, name: "Level 1", description: "Penjumlahan & Pengurangan Satuan Langsung" },
  { id: "lvl-2", levelNumber: 2, name: "Level 2", description: "Kombinasi Rumus Teman Kecil (Basis 5)" },
  { id: "lvl-3", levelNumber: 3, name: "Level 3", description: "Kombinasi Rumus Teman Besar & Campuran" },
];

const INITIAL_STUDENT_LEVEL_RECORDS: StudentLevelRecord[] = [];

const INITIAL_INVOICES: InvoiceItem[] = [
  {
    "id": "d08d61cb-2a95-41f9-a3e3-cbebf1cebf9a",
    "invoiceNo": "INV/MF/2608/3668",
    "studentId": "04796f1c-9a95-475e-a8db-b8fd605ae5ad",
    "studentName": "Bima Sakti",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "8e2bbbaf-9a50-4a23-a4d6-d558d484d985",
    "invoiceNo": "INV/MF/2608/3645",
    "studentId": "ee84a828-abc0-41c5-9ead-d79ff2056910",
    "studentName": "Ayunda Shela Ferlita",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "6ff7365b-30b4-4d5e-8e15-3306a75da19d",
    "invoiceNo": "INV/MF/2608/3622",
    "studentId": "afff798e-f6eb-4730-883b-cebf7ee93880",
    "studentName": "Asheqa Shaqueena Qotrunada",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "cae691e3-b4f6-4701-8284-0adb8d228909",
    "invoiceNo": "INV/MF/2608/3599",
    "studentId": "497ef1bb-d078-42af-a596-85d9d8c60bf0",
    "studentName": "Arsyila Nasha Razita",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "22ac6a0b-b0e4-49b8-8ada-c05debcb382c",
    "invoiceNo": "INV/MF/2608/3576",
    "studentId": "c407aac0-a001-4ce4-8aff-85634e737f3c",
    "studentName": "Arsy Akifa Salsabila",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "4b4cf382-7b3f-4fb2-a258-3f7c6e33d182",
    "invoiceNo": "INV/MF/2608/3553",
    "studentId": "873cf03f-d94e-41c1-a8d8-44ea933c1d93",
    "studentName": "Arka Prapta Ardani",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "ca1188a0-3f6b-49f8-b38f-21baa264eee9",
    "invoiceNo": "INV/MF/2608/3530",
    "studentId": "9ae2069c-c732-4461-ae86-f18cffca1178",
    "studentName": "Arka Prapdipta Ardani",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "56a3e17e-b6c0-4fc3-a17f-96ace3942bd7",
    "invoiceNo": "INV/MF/2608/3507",
    "studentId": "16f42f89-5c09-4b2b-9e8a-d01f7f275727",
    "studentName": "Areasely Naura Shada",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "b2c39a98-07f8-4dd7-a999-7eb6d693c5ba",
    "invoiceNo": "INV/MF/2608/3484",
    "studentId": "d0eaf62d-32db-4518-9ba9-35183a533bef",
    "studentName": "Arasely Naura Shada",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "dc6f0222-e513-45cc-84c6-5b1692ad894f",
    "invoiceNo": "INV/MF/2608/3461",
    "studentId": "cea06363-69e7-47b6-9f47-1a7716561f7d",
    "studentName": "Aqila Fahmida",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "8f158f7b-5b3d-4221-88f3-f32b49e83d69",
    "invoiceNo": "INV/MF/2608/3438",
    "studentId": "74fc5667-0936-4db6-a83f-1e4d69576041",
    "studentName": "Aqila",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MEMBACA"
  },
  {
    "id": "34d3c6f5-05f8-4ca7-b330-1260f203588b",
    "invoiceNo": "INV/MF/2608/3415",
    "studentId": "216e8e11-446a-46bd-8641-893961f9462f",
    "studentName": "Anindita Keisha Zahra",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "423951d0-6209-438b-8d48-e29dc2b70481",
    "invoiceNo": "INV/MF/2608/3392",
    "studentId": "239abe9a-3759-4677-be68-aa5f1ed2796c",
    "studentName": "Ananta Virya",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "89840dcb-a3c0-4455-af44-e6842fa4df5d",
    "invoiceNo": "INV/MF/2608/3369",
    "studentId": "b252f9f5-a288-433f-9ad7-ac52dbb7a9a7",
    "studentName": "Anandira Dyah Asmarawati",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "5f4c6ac8-d3cc-4030-951f-fa9702cf5759",
    "invoiceNo": "INV/MF/2608/3346",
    "studentId": "4fae6a4c-8c08-4351-bb25-71e9db2e4ecb",
    "studentName": "Anandira Dyah Asmara Wati",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "9e83b8b9-f946-4365-befa-501f82e2c0c9",
    "invoiceNo": "INV/MF/2608/3323",
    "studentId": "1eecdd5c-da28-4078-a890-b2abe0ebfc9d",
    "studentName": "Amara Alifah Fauziah",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "545833d8-55a1-4eb5-bbd2-c6f06359dc1a",
    "invoiceNo": "INV/MF/2608/3300",
    "studentId": "e08d4e8d-5858-4762-af6b-dfe5ff031bb9",
    "studentName": "Alesha Rafani Marta",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 200000,
    "status": "LUNAS",
    "paidDate": "2026-08-31",
    "paidMethod": "Transfer Bank",
    "programType": "MATEMATIKA"
  },
  {
    "id": "1d3715fd-4860-4899-a66d-1d77985e13a2",
    "invoiceNo": "INV/MF/2608/3277",
    "studentId": "746c4af0-24e7-44b9-b255-256bc96cd47d",
    "studentName": "Ajeng Chaira Naifasha",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 305000,
    "status": "LUNAS",
    "paidDate": "2026-09-01",
    "paidMethod": "Tunai",
    "programType": "MATEMATIKA"
  },
  {
    "id": "fcf9e4ff-9438-412e-b147-3ef55121c4e8",
    "invoiceNo": "INV/MF/2608/3254",
    "studentId": "590ba72b-cae9-4773-9863-ac46b48e4eb1",
    "studentName": "Ajeng Cahyra Naifasha",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 350000,
    "status": "LUNAS",
    "paidDate": "2026-09-01",
    "paidMethod": "Tunai",
    "programType": "MATEMATIKA"
  },
  {
    "id": "24ae6cea-40d6-41bf-975c-5c28b747973c",
    "invoiceNo": "INV/MF/2608/3231",
    "studentId": "c3f5334a-642b-4e05-a980-bbbc4442438b",
    "studentName": "Aira Anatasya Putri",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 350000,
    "status": "LUNAS",
    "paidDate": "2026-09-02",
    "paidMethod": "Tunai",
    "programType": "MATEMATIKA"
  },
  {
    "id": "8d52938f-cbc7-4dbc-8d4b-8f0ede75e924",
    "invoiceNo": "INV/MF/2608/3208",
    "studentId": "17a21047-a092-4964-a396-ea778093f34d",
    "studentName": "Ainan Nuri Sumayah",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 350000,
    "status": "LUNAS",
    "paidDate": "2026-09-02",
    "paidMethod": "Transfer Bank",
    "programType": "MATEMATIKA"
  },
  {
    "id": "5b851334-ee15-4aac-885c-61049fd7f7e9",
    "invoiceNo": "INV/MF/2608/3185",
    "studentId": "981d918a-8b29-4b3f-b7e7-7d0baedae5b6",
    "studentName": "Aida Syafira N.A",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 400000,
    "status": "LUNAS",
    "paidDate": "2026-09-03",
    "paidMethod": "Tunai",
    "programType": "MATEMATIKA"
  },
  {
    "id": "3bb57ec4-ce74-4b1c-ab84-3d3f57cfb86f",
    "invoiceNo": "INV/MF/2608/3162",
    "studentId": "1fc1dc6c-9c06-4874-8783-790d12ab67fe",
    "studentName": "Ahnaf",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 400000,
    "status": "LUNAS",
    "paidDate": "2026-09-03",
    "paidMethod": "Tunai",
    "programType": "MEMBACA"
  },
  {
    "id": "93843075-7236-41c8-8a1b-017685423b1b",
    "invoiceNo": "INV/MF/2608/3139",
    "studentId": "31486b62-e24d-4ded-a892-c9be9a9b68c3",
    "studentName": "Afrial Arsenio",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 400000,
    "status": "LUNAS",
    "paidDate": "2026-09-04",
    "paidMethod": "Transfer Bank",
    "programType": "MATEMATIKA"
  },
  {
    "id": "8d014b8b-a959-47a1-a40c-041e72ff2ae8",
    "invoiceNo": "INV/MF/2608/3116",
    "studentId": "68d57e75-a2d2-4251-b6a7-541c3bc9c15d",
    "studentName": "Adeeva Afsheen Myesha",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 400000,
    "status": "LUNAS",
    "paidDate": "2026-09-04",
    "paidMethod": "Tunai",
    "programType": "MATEMATIKA"
  },
  {
    "id": "0207257b-b130-4168-aeb7-d0819ba603fb",
    "invoiceNo": "INV/MF/2608/3093",
    "studentId": "cf26ab88-2a73-4162-8b55-810b69acb071",
    "studentName": "Abyan Azka Abdillah",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 400000,
    "status": "LUNAS",
    "paidDate": "2026-09-04",
    "paidMethod": "Tunai",
    "programType": "MATEMATIKA"
  },
  {
    "id": "0d5cb46f-bc88-489a-9c0e-e2f4acc08709",
    "invoiceNo": "INV/MF/2608/3070",
    "studentId": "7263e6e3-a667-4f35-82e4-90cd8b59b2b8",
    "studentName": "Abrisam",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 400000,
    "status": "LUNAS",
    "paidDate": "2026-09-05",
    "paidMethod": "Transfer Bank",
    "programType": "MATEMATIKA"
  },
  {
    "id": "9bc32a11-6fc6-423d-b527-aac6f0ddaa0c",
    "invoiceNo": "INV/MF/2608/3047",
    "studentId": "f2dcf39c-3131-497a-bce7-996dbeff9d62",
    "studentName": "Abizar Rahandika Alghifari",
    "branch": "Bangko",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 400000,
    "status": "LUNAS",
    "paidDate": "2026-09-05",
    "paidMethod": "Tunai",
    "programType": "MATEMATIKA"
  },
  {
    "id": "36aea22d-4b5f-4950-aebf-be1eb941b472",
    "invoiceNo": "INV/MF/2608/1370",
    "studentId": "e0f01c5d-a021-45d7-9828-102cb091a16d",
    "studentName": "Musyaffa'",
    "branch": "Singkut",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "1c8a8e65-5a0f-41b9-8a0d-ab58d17a059a",
    "invoiceNo": "INV/MF/2608/1353",
    "studentId": "aa3fff59-d27e-4851-a660-ceaf1d8e9ade",
    "studentName": "Muhammad Azka",
    "branch": "Singkut",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "3579bd45-b302-4821-83e2-3a055c99ebec",
    "invoiceNo": "INV/MF/2608/1336",
    "studentId": "b42ef79c-f9c9-4972-8f36-525ec014240e",
    "studentName": "Maulana Syarif Wardani",
    "branch": "Singkut",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "470fd3ec-d553-412c-8e46-66c525c51122",
    "invoiceNo": "INV/MF/2608/1319",
    "studentId": "20f9a9ba-13c7-4650-a900-61abd09ea07a",
    "studentName": "M. Hannan Habibillah",
    "branch": "Singkut",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "95bac68c-2bef-4006-aba4-1d1b941ddb75",
    "invoiceNo": "INV/MF/2608/1302",
    "studentId": "9d9977fb-1a91-47b4-99df-288cc648d437",
    "studentName": "M. Hafizhan Khairan",
    "branch": "Singkut",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "b6e7080e-eacc-4d6f-a770-b352106eb538",
    "invoiceNo": "INV/MF/2608/1285",
    "studentId": "e8375491-10a6-4a3e-a632-733721808900",
    "studentName": "Kristian Naibaho",
    "branch": "Singkut",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "96d4327b-3317-443d-bfaf-f50e40719431",
    "invoiceNo": "INV/MF/2608/1268",
    "studentId": "7c900a4b-3261-46f2-9990-e54fbc729e3d",
    "studentName": "Kheyra Candra",
    "branch": "Singkut",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "bb27afd8-8dce-458b-a2b1-95161961ae22",
    "invoiceNo": "INV/MF/2608/1251",
    "studentId": "5a5302cf-3115-45c1-ae89-20208f8bd5f5",
    "studentName": "Keysha Anindya",
    "branch": "Singkut",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "7084b3e8-b9f4-43e9-abda-ce3c29f7f7eb",
    "invoiceNo": "INV/MF/2608/1234",
    "studentId": "c3dd210c-9220-4055-b57e-5ced60c906c7",
    "studentName": "Kenzo Alvaro",
    "branch": "Singkut",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "2cad77c3-e390-4bf4-9b2e-e1ed590b9de1",
    "invoiceNo": "INV/MF/2608/1217",
    "studentId": "90d546d9-0f7c-4cdf-8351-5e854cce406c",
    "studentName": "Haris",
    "branch": "Singkut",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "69c568bb-4343-4cd5-8c9c-20e5f4e2e489",
    "invoiceNo": "INV/MF/2608/1200",
    "studentId": "15de4d83-1d1b-4042-9bb4-9fdc65db1d3c",
    "studentName": "Hafiz Al-Faruq",
    "branch": "Singkut",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 100000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "6961d617-3945-4210-a44a-85afa3c1f426",
    "invoiceNo": "INV/MF/2608/1183",
    "studentId": "352a42af-0c46-4373-9ac4-69a5282da28c",
    "studentName": "Ghumaisha",
    "branch": "Singkut",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 125000,
    "status": "BELUM BAYAR",
    "programType": "MATEMATIKA"
  },
  {
    "id": "4c4c35a3-9660-4b87-a9ea-71662aa6f895",
    "invoiceNo": "INV/MF/2608/1166",
    "studentId": "c1ccae6d-ae43-4bbf-b539-4c1c96c9c16b",
    "studentName": "Fakhri Al-Ghifari",
    "branch": "Singkut",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 300000,
    "status": "LUNAS",
    "paidDate": "2026-09-01",
    "paidMethod": "Transfer Bank",
    "programType": "MATEMATIKA"
  },
  {
    "id": "3f15e463-edfa-4628-8e42-cd7f1d9ca301",
    "invoiceNo": "INV/MF/2608/1149",
    "studentId": "edfa74c0-7a6c-421e-b5a3-142f80563a3c",
    "studentName": "Dzakiyyah Al Fajri",
    "branch": "Singkut",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 300000,
    "status": "LUNAS",
    "paidDate": "2026-09-01",
    "paidMethod": "Tunai",
    "programType": "MATEMATIKA"
  },
  {
    "id": "e847400b-b8ed-4b8e-bc6a-35f338e6437b",
    "invoiceNo": "INV/MF/2608/1132",
    "studentId": "f9ce8b07-5738-4c29-8ecc-048807666d4c",
    "studentName": "Dimas Arya Sena",
    "branch": "Singkut",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 300000,
    "status": "LUNAS",
    "paidDate": "2026-09-02",
    "paidMethod": "Tunai",
    "programType": "MATEMATIKA"
  },
  {
    "id": "eeeef80d-54e4-4097-a8f1-31e18121039c",
    "invoiceNo": "INV/MF/2608/1115",
    "studentId": "c76503ff-a1d9-45ee-815e-35e24c8f7c7c",
    "studentName": "Calista Azkadina",
    "branch": "Singkut",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 300000,
    "status": "LUNAS",
    "paidDate": "2026-09-02",
    "paidMethod": "Transfer Bank",
    "programType": "MATEMATIKA"
  },
  {
    "id": "794237b4-5575-475b-94ce-bcee73bf852d",
    "invoiceNo": "INV/MF/2608/1098",
    "studentId": "48721968-d3f2-4319-92be-7a5e972c106b",
    "studentName": "Bilqis Ufairah",
    "branch": "Singkut",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 300000,
    "status": "LUNAS",
    "paidDate": "2026-09-03",
    "paidMethod": "Tunai",
    "programType": "MATEMATIKA"
  },
  {
    "id": "594ec10a-d21d-4410-a4a5-e6d6c6236add",
    "invoiceNo": "INV/MF/2608/1081",
    "studentId": "e02583be-1443-414b-a37c-90e612bcd317",
    "studentName": "Bagas Pratama Putra",
    "branch": "Singkut",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 350000,
    "status": "LUNAS",
    "paidDate": "2026-09-03",
    "paidMethod": "Tunai",
    "programType": "MATEMATIKA"
  },
  {
    "id": "4ad0a6c8-f4ec-4007-bd61-e929da122c02",
    "invoiceNo": "INV/MF/2608/1064",
    "studentId": "92d33126-0c86-4472-8a43-01098bf61c00",
    "studentName": "Azila Quira Zulda",
    "branch": "Singkut",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 350000,
    "status": "LUNAS",
    "paidDate": "2026-09-04",
    "paidMethod": "Transfer Bank",
    "programType": "MATEMATIKA"
  },
  {
    "id": "f02400ce-3e01-440e-af31-129cbb16a1bb",
    "invoiceNo": "INV/MF/2608/1047",
    "studentId": "2643a6e6-fcc0-4c9f-81b1-db1d116e37cd",
    "studentName": "Arsyila Nasha Razita",
    "branch": "Singkut",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 350000,
    "status": "LUNAS",
    "paidDate": "2026-09-04",
    "paidMethod": "Tunai",
    "programType": "MATEMATIKA"
  },
  {
    "id": "bb467ac9-7ed1-430b-801c-10d4ca6e80b6",
    "invoiceNo": "INV/MF/2608/1030",
    "studentId": "a32a3e2b-2898-4a12-a20f-a2cb15c3ca22",
    "studentName": "Aishwa Rahma Annida",
    "branch": "Singkut",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 350000,
    "status": "LUNAS",
    "paidDate": "2026-09-05",
    "paidMethod": "Transfer Bank",
    "programType": "MATEMATIKA"
  },
  {
    "id": "2576a653-f99e-4743-8621-323c343251ed",
    "invoiceNo": "INV/MF/2608/1013",
    "studentId": "9c48106c-acd2-4a23-8ac3-543d94de143d",
    "studentName": "Abdan Zulfadli Fahyan",
    "branch": "Singkut",
    "period": "September 2026",
    "dueDate": "2026-09-10",
    "amount": 350000,
    "status": "LUNAS",
    "paidDate": "2026-09-05",
    "paidMethod": "Tunai",
    "programType": "MATEMATIKA"
  }
];

const INITIAL_MUTATIONS: CashMutationItem[] = [
  {
    "id": "db874078-5299-4873-8745-a3ab889f76b4",
    "date": "2026-09-05",
    "invoiceNo": "INV/MF/2608/1013",
    "studentName": "Abdan Zulfadli Fahyan",
    "period": "September 2026",
    "method": "TUNAI",
    "description": "Pelunasan Penuh",
    "amount": 350000
  },
  {
    "id": "280eeea9-8234-4a6b-b996-f59a0709a4ad",
    "date": "2026-09-05",
    "invoiceNo": "INV/MF/2608/1030",
    "studentName": "Aishwa Rahma Annida",
    "period": "September 2026",
    "method": "TRANSFER",
    "description": "Pelunasan Penuh",
    "amount": 350000
  },
  {
    "id": "922ec997-db85-4850-8a60-bd0c4709d59d",
    "date": "2026-09-05",
    "invoiceNo": "INV/MF/2608/3047",
    "studentName": "Abizar Rahandika Alghifari",
    "period": "September 2026",
    "method": "TUNAI",
    "description": "Pelunasan Penuh",
    "amount": 400000
  },
  {
    "id": "07e4db6b-4b8d-4e92-a78d-5525a4329c7c",
    "date": "2026-09-05",
    "invoiceNo": "INV/MF/2608/3070",
    "studentName": "Abrisam",
    "period": "September 2026",
    "method": "TRANSFER",
    "description": "Pelunasan Penuh",
    "amount": 400000
  },
  {
    "id": "0021b1f9-5b11-4a91-b48e-64f80f48c822",
    "date": "2026-09-04",
    "invoiceNo": "INV/MF/2608/1064",
    "studentName": "Azila Quira Zulda",
    "period": "September 2026",
    "method": "TRANSFER",
    "description": "Pelunasan Penuh",
    "amount": 350000
  },
  {
    "id": "c4c896eb-0f21-40fd-af4c-1a4e2fe7e7c5",
    "date": "2026-09-04",
    "invoiceNo": "INV/MF/2608/3093",
    "studentName": "Abyan Azka Abdillah",
    "period": "September 2026",
    "method": "TUNAI",
    "description": "Pelunasan Penuh",
    "amount": 400000
  },
  {
    "id": "840bc36f-32cd-436a-b011-fa0532254110",
    "date": "2026-09-04",
    "invoiceNo": "INV/MF/2608/3116",
    "studentName": "Adeeva Afsheen Myesha",
    "period": "September 2026",
    "method": "TUNAI",
    "description": "Pelunasan Penuh",
    "amount": 400000
  },
  {
    "id": "6617865f-e997-406d-90e9-0cd8e234bb98",
    "date": "2026-09-04",
    "invoiceNo": "INV/MF/2608/3139",
    "studentName": "Afrial Arsenio",
    "period": "September 2026",
    "method": "TRANSFER",
    "description": "Pelunasan Penuh",
    "amount": 400000
  },
  {
    "id": "bc9d3c4c-a89c-4d29-aed3-30f30ba36cfa",
    "date": "2026-09-04",
    "invoiceNo": "INV/MF/2608/1047",
    "studentName": "Arsyila Nasha Razita",
    "period": "September 2026",
    "method": "TUNAI",
    "description": "Pelunasan Penuh",
    "amount": 350000
  },
  {
    "id": "08d510c1-3b91-41db-92a3-e5463804d77c",
    "date": "2026-09-03",
    "invoiceNo": "INV/MF/2608/1098",
    "studentName": "Bilqis Ufairah",
    "period": "September 2026",
    "method": "TUNAI",
    "description": "Pelunasan Penuh",
    "amount": 300000
  },
  {
    "id": "0d991902-9ed9-45b2-9d0e-40b9bd435a0d",
    "date": "2026-09-03",
    "invoiceNo": "INV/MF/2608/1081",
    "studentName": "Bagas Pratama Putra",
    "period": "September 2026",
    "method": "TUNAI",
    "description": "Pelunasan Penuh",
    "amount": 350000
  },
  {
    "id": "dfce4fbe-7fdf-4e1c-b11c-1eb313462d42",
    "date": "2026-09-03",
    "invoiceNo": "INV/MF/2608/3162",
    "studentName": "Ahnaf",
    "period": "September 2026",
    "method": "TUNAI",
    "description": "Pelunasan Penuh",
    "amount": 400000
  },
  {
    "id": "ca7c673a-ad7a-48e8-92fa-45a0c2338008",
    "date": "2026-09-03",
    "invoiceNo": "INV/MF/2608/3185",
    "studentName": "Aida Syafira N.A",
    "period": "September 2026",
    "method": "TUNAI",
    "description": "Pelunasan Penuh",
    "amount": 400000
  },
  {
    "id": "e908a471-206f-4964-a1a9-c051346196fd",
    "date": "2026-09-02",
    "invoiceNo": "INV/MF/2608/1132",
    "studentName": "Dimas Arya Sena",
    "period": "September 2026",
    "method": "TUNAI",
    "description": "Pelunasan Penuh",
    "amount": 300000
  },
  {
    "id": "edf752c8-96a9-47f2-a74d-5b75ac26e2e6",
    "date": "2026-09-02",
    "invoiceNo": "INV/MF/2608/1115",
    "studentName": "Calista Azkadina",
    "period": "September 2026",
    "method": "TRANSFER",
    "description": "Pelunasan Penuh",
    "amount": 300000
  },
  {
    "id": "bb647052-0a3c-4a40-a493-0150c1e58840",
    "date": "2026-09-02",
    "invoiceNo": "INV/MF/2608/3231",
    "studentName": "Aira Anatasya Putri",
    "period": "September 2026",
    "method": "TUNAI",
    "description": "Pelunasan Penuh",
    "amount": 350000
  },
  {
    "id": "770c2171-b6b1-4170-8f88-069930eacda3",
    "date": "2026-09-02",
    "invoiceNo": "INV/MF/2608/3208",
    "studentName": "Ainan Nuri Sumayah",
    "period": "September 2026",
    "method": "TRANSFER",
    "description": "Pelunasan Penuh",
    "amount": 350000
  },
  {
    "id": "cfb59b62-f018-4bed-8382-e3818db678d1",
    "date": "2026-09-01",
    "invoiceNo": "INV/MF/2608/1149",
    "studentName": "Dzakiyyah Al Fajri",
    "period": "September 2026",
    "method": "TUNAI",
    "description": "Pelunasan Penuh",
    "amount": 300000
  },
  {
    "id": "3c17d254-1789-45bd-94b9-7fa4febe7bdc",
    "date": "2026-09-01",
    "invoiceNo": "INV/MF/2608/3277",
    "studentName": "Ajeng Chaira Naifasha",
    "period": "September 2026",
    "method": "TUNAI",
    "description": "Pelunasan Penuh",
    "amount": 305000
  },
  {
    "id": "642fc4b3-1a85-4b1f-9ed9-463d42ac9ae8",
    "date": "2026-09-01",
    "invoiceNo": "INV/MF/2608/3254",
    "studentName": "Ajeng Cahyra Naifasha",
    "period": "September 2026",
    "method": "TUNAI",
    "description": "Pelunasan Penuh",
    "amount": 350000
  },
  {
    "id": "a5ab7398-cd9c-42c7-af2b-620f858f36a1",
    "date": "2026-09-01",
    "invoiceNo": "INV/MF/2608/1166",
    "studentName": "Fakhri Al-Ghifari",
    "period": "September 2026",
    "method": "TRANSFER",
    "description": "Pelunasan Penuh",
    "amount": 300000
  },
  {
    "id": "8400fafe-fbee-4f0a-b3d1-71a65914cf29",
    "date": "2026-08-31",
    "invoiceNo": "INV/MF/2608/3300",
    "studentName": "Alesha Rafani Marta",
    "period": "September 2026",
    "method": "TRANSFER",
    "description": "Pelunasan Penuh",
    "amount": 200000
  }
];

const INITIAL_TRANSACTIONS: CashTransactionItem[] = [
  {
    "id": "69811c76-627c-4a9a-b5a1-d61d6f3d5f18",
    "date": "2026-09-05",
    "type": "INCOME",
    "category": "SPP",
    "title": "Realisasi SPP Bulanan Bangko",
    "amount": 4355000,
    "branch": "Bangko",
    "sourceOrRecipient": "12 Siswa Lunas Bangko",
    "notes": "Penerimaan SPP Periode September 2026",
    "programType": "MATEMATIKA"
  },
  {
    "id": "426a29e1-84e4-43c0-a99b-27567fc0d245",
    "date": "2026-09-05",
    "type": "INCOME",
    "category": "SPP",
    "title": "Realisasi SPP Bulanan Singkut",
    "amount": 3250000,
    "branch": "Singkut",
    "sourceOrRecipient": "10 Siswa Lunas Singkut",
    "notes": "Penerimaan SPP Periode September 2026",
    "programType": "MATEMATIKA"
  },
  {
    "id": "d38a3845-969a-4ba1-8f07-e943b42e3690",
    "date": "2026-09-02",
    "type": "EXPENSE",
    "category": "Honor Tutor",
    "title": "Insentif Mengajar Tutor Bangko",
    "amount": 1000000,
    "branch": "Bangko",
    "sourceOrRecipient": "Dewi Safitri & Kak Nanda",
    "notes": "Honor mengajar sesi pekanan",
    "programType": "MATEMATIKA"
  },
  {
    "id": "1b8f179f-c8f0-410e-8684-46750412ee2c",
    "date": "2026-09-02",
    "type": "EXPENSE",
    "category": "Honor Tutor",
    "title": "Insentif Mengajar Tutor Singkut",
    "amount": 800000,
    "branch": "Singkut",
    "sourceOrRecipient": "Febrianti Dewi, S.Pd",
    "notes": "Honor mengajar sesi pekanan",
    "programType": "MATEMATIKA"
  },
  {
    "id": "a1e7cd3f-ab1c-473c-8d93-28459dca0fb4",
    "date": "2026-08-31",
    "type": "INCOME",
    "category": "Modul/Buku",
    "title": "Penjualan Modul Rumus & Flashcard",
    "amount": 150000,
    "branch": "Singkut",
    "sourceOrRecipient": "Wali Siswa Singkut",
    "notes": "Modul Penjumlahan Kombinasi",
    "programType": "MATEMATIKA"
  },
  {
    "id": "01f75263-8d6d-4dc6-9807-8f8304e563e4",
    "date": "2026-08-28",
    "type": "EXPENSE",
    "category": "Cetak buku",
    "title": "Cetak buku modul latihan jari",
    "amount": 75000,
    "branch": "Bangko",
    "sourceOrRecipient": "Percetakan Mandiri",
    "notes": "Penggandaan lembar kerja kuis",
    "programType": "MATEMATIKA"
  },
  {
    "id": "5675ef9d-8762-4e8f-9825-f1389fa93f4d",
    "date": "2026-08-27",
    "type": "INCOME",
    "category": "Modul/Buku",
    "title": "Penjualan Buku Jaritmatika",
    "amount": 150000,
    "branch": "Bangko",
    "sourceOrRecipient": "Wali Siswa Bangko",
    "notes": "Paket Modul Level 1",
    "programType": "MATEMATIKA"
  },
  {
    "id": "92cb7664-7113-4165-b33b-89ca348df700",
    "date": "2026-08-25",
    "type": "INCOME",
    "category": "Pendaftaran",
    "title": "Pendaftaran Siswa Baru",
    "amount": 200000,
    "branch": "Bangko",
    "sourceOrRecipient": "Wali Siswa Baru",
    "notes": "Pendaftaran murid baru Level Dasar",
    "programType": "MATEMATIKA"
  },
  {
    "id": "d9d69234-3afc-47ca-984e-9b80688e103e",
    "date": "2026-07-30",
    "type": "EXPENSE",
    "category": "Operasional & ATK",
    "title": "Pengeluaran Operasional & Logistik",
    "amount": 280719,
    "branch": "Bangko",
    "sourceOrRecipient": "Pusat Logistik",
    "notes": "Pengadaan formulir dan sertifikat",
    "programType": "MATEMATIKA"
  },
  {
    "id": "2fc4910e-00f6-4e34-ae17-69396554e212",
    "date": "2026-07-28",
    "type": "INCOME",
    "category": "SPP",
    "title": "Akumulasi Pemasukan Kas Juli",
    "amount": 3800000,
    "branch": "Singkut",
    "sourceOrRecipient": "Wali Siswa Gabungan",
    "notes": "Total iuran SPP cabang periode Juli",
    "programType": "MATEMATIKA"
  }
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

export const INITIAL_ATTENDANCES: Record<string, AttendanceItem> = {};

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
      const CURRENT_DATA_VERSION = "mf_live_sync_v14";
      if (localStorage.getItem("mf_data_version") !== CURRENT_DATA_VERSION) {
        localStorage.removeItem("mf_students");
        localStorage.removeItem("mf_classes");
        localStorage.removeItem("mf_branches");
        localStorage.removeItem("mf_invoices");
        localStorage.removeItem("mf_mutations");
        localStorage.removeItem("mf_branchAdmins");
        localStorage.removeItem("mf_curriculum");
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
      if (savedCurriculum) setCurriculumModules(JSON.parse(savedCurriculum));

      const savedInvoices = localStorage.getItem("mf_invoices");
      if (savedInvoices) setInvoices(JSON.parse(savedInvoices));

      const savedLevelCols = localStorage.getItem("mf_level_progression_columns");
      if (savedLevelCols) {
        try {
          const parsed = JSON.parse(savedLevelCols);
          if (Array.isArray(parsed) && parsed.length > 0) setLevelColumns(parsed);
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
    studentCode?: string;
    studentName?: string;
    className?: string;
    branch?: string;
    branchId?: string;
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
          studentCode: grade.studentCode,
          studentName: grade.studentName || "Siswa",
          className: grade.className || "Kelas Reguler",
          branch: grade.branch,
          branchId: grade.branchId,
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
          setCurriculumModules((prev) => {
            const updated = prev.map((c) => (c.id === tempId ? { ...c, ...created } : c));
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
                m.id === id || m.id === updatedServer.id ? { ...m, ...updatedServer } : m
              );
              save("mf_curriculum", updated);
              return updated;
            });
          }
        } else {
          console.error("Gagal memperbarui kurikulum di PostgreSQL");
          fetchAllLiveData();
        }
      })
      .catch((err) => {
        console.error("Error updating curriculum in PostgreSQL:", err);
        fetchAllLiveData();
      });
  };

  const deleteCurriculumModule = (id: string) => {
    setCurriculumModules((prev) => {
      const filtered = prev.filter((m) => m.id !== id);
      save("mf_curriculum", filtered);
      return filtered;
    });

    fetch(`/api/curriculums?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          console.error("Gagal menghapus kurikulum dari PostgreSQL");
          fetchAllLiveData();
        }
      })
      .catch((err) => {
        console.error("Error deleting curriculum from PostgreSQL:", err);
        fetchAllLiveData();
      });
  };

  const resetCurriculumModules = () => {
    setCurriculumModules([]);
    save("mf_curriculum", []);

    fetch("/api/curriculums?all=true", {
      method: "DELETE",
    })
      .then(() => fetchAllLiveData())
      .catch((err) => console.error("Error resetting curriculum in PostgreSQL:", err));
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

  // Level Progression Matrix Handlers (Kenaikan Level)
  const addLevelColumn = useCallback((name: string, description?: string) => {
    setLevelColumns((prev) => {
      const nextNum = prev.length + 1;
      const newCol: LevelProgressionConfig = {
        id: `lvl-${Date.now()}`,
        levelNumber: nextNum,
        name: name.trim() || `Level ${nextNum}`,
        description: description?.trim() || "",
      };
      const updated = [...prev, newCol];
      save("mf_level_progression_columns", updated);
      return updated;
    });

    fetch("/api/level-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "ADD_LEVEL_COLUMN", name, description }),
    }).catch((err) => console.error("Error creating level column:", err));
  }, [save]);

  const updateLevelColumn = useCallback((id: string, name: string, description?: string) => {
    setLevelColumns((prev) => {
      const updated = prev.map((col) =>
        col.id === id ? { ...col, name: name.trim(), ...(description !== undefined ? { description: description.trim() } : {}) } : col
      );
      save("mf_level_progression_columns", updated);
      return updated;
    });

    fetch("/api/level-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "UPDATE_LEVEL_COLUMN", id, name, description }),
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
