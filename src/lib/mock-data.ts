export interface StudentItem {
  id: string;
  index: number;
  studentCode: string;
  name: string;
  gender: "P" | "L";
  codeLabel: string;
  branch: "Singkut" | "Bangko";
  className: string;
  birthPlace: string;
  birthDate: string;
  address: string;
  gradeLevel: string; // e.g. "Kelas 4"
  parentName: string;
  parentWhatsapp: string;
  levelCurriculum: string;
  registeredDate: string;
}

export interface BranchItem {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  activeStudents: number;
  adminCount: number;
  monthlyRevenue: number;
  status: "ACTIVE" | "INACTIVE";
}

export const CURRENT_USER = {
  name: "Wahyudin Hafiz, S.Pd",
  role: "Super Admin",
  email: "wahyudinhafiz123@gmail.com",
  avatar: "/avatars/wahyudin.jpg",
  branch: "Pusat",
};

export const BRANCHES_DATA: BranchItem[] = [
  {
    id: "b-1",
    code: "SKT",
    name: "Singkut",
    address: "Sungai Gedang, Kec. Singkut, Kab. Sarolangun",
    phone: "0812-7949-8907",
    activeStudents: 22,
    adminCount: 1,
    monthlyRevenue: 3250000,
    status: "ACTIVE",
  },
  {
    id: "b-2",
    code: "BGK",
    name: "Bangko",
    address: "Jl. Merak / Kenari, Kec. Bangko, Kab. Merangin",
    phone: "0813-7972-0841",
    activeStudents: 29,
    adminCount: 1,
    monthlyRevenue: 4355000,
    status: "ACTIVE",
  },
];

export const STUDENTS_DATA: StudentItem[] = [
  {
    id: "s-1",
    index: 7,
    studentCode: "79000",
    name: "Aishwa Rahma Annida",
    gender: "P",
    codeLabel: "8P",
    branch: "Singkut",
    className: "Kelas A",
    birthPlace: "Lahat",
    birthDate: "2018-01-03",
    address: "Sungai Gedang",
    gradeLevel: "Ket: Kelas 4",
    parentName: "Vetika",
    parentWhatsapp: "081279498907",
    levelCurriculum: "Level Dasar: Pengenalan Simbol Jari",
    registeredDate: "2026-08-22",
  },
  {
    id: "s-2",
    index: 8,
    studentCode: "91212",
    name: "Ajeng Cahyra Naifasha",
    gender: "P",
    codeLabel: "6P",
    branch: "Bangko",
    className: "CLASS C",
    birthPlace: "Merangin",
    birthDate: "2018-05-03",
    address: "Jalan Kenari",
    gradeLevel: "Ket: Kelas 2",
    parentName: "Eni",
    parentWhatsapp: "+62 813-9602-155",
    levelCurriculum: "Level Dasar: Pengenalan Simbol Jari",
    registeredDate: "2024-08-15",
  },
  {
    id: "s-3",
    index: 9,
    studentCode: "78564",
    name: "Alesha Rafani Marta",
    gender: "P",
    codeLabel: "8P",
    branch: "Bangko",
    className: "Kelas A2",
    birthPlace: "Padang Jantung",
    birthDate: "2016-09-06",
    address: "Jalan Merak",
    gradeLevel: "Ket: Kelas 4",
    parentName: "Mala Noftobela",
    parentWhatsapp: "081379720841",
    levelCurriculum: "Level Dasar: Pengenalan Simbol Jari",
    registeredDate: "2024-08-19",
  },
  {
    id: "s-4",
    index: 10,
    studentCode: "17055",
    name: "Anandira Dyah Asmara Wati",
    gender: "P",
    codeLabel: "8P",
    branch: "Bangko",
    className: "CLASS C",
    birthPlace: "Merangin",
    birthDate: "2018-11-18",
    address: "Jl Merpati",
    gradeLevel: "Ket: Kelas 2",
    parentName: "Agustina Wati",
    parentWhatsapp: "62858-3716-2339",
    levelCurriculum: "Level Dasar: Pengenalan Simbol Jari",
    registeredDate: "2024-08-20",
  },
  {
    id: "s-5",
    index: 11,
    studentCode: "95452",
    name: "Ananta Virya",
    gender: "P",
    codeLabel: "8P",
    branch: "Bangko",
    className: "CLASS B",
    birthPlace: "Merangin",
    birthDate: "2017-08-13",
    address: "Jl Kutilang",
    gradeLevel: "Ket: Kelas 3",
    parentName: "Sudar",
    parentWhatsapp: "085382485578",
    levelCurriculum: "Level 1: Penjumlahan & Pengurangan Angka Satuan",
    registeredDate: "2024-06-10",
  },
  {
    id: "s-6",
    index: 12,
    studentCode: "29797",
    name: "Aqila Fahmida",
    gender: "P",
    codeLabel: "8P",
    branch: "Bangko",
    className: "CLASS A1",
    birthPlace: "Merangin",
    birthDate: "2015-12-12",
    address: "Jl Merak",
    gradeLevel: "Ket: Kelas 5",
    parentName: "Maryono",
    parentWhatsapp: "+62 813-6398-294",
    levelCurriculum: "Level 1: Penjumlahan & Pengurangan Angka Satuan",
    registeredDate: "2024-06-15",
  },
  {
    id: "s-7",
    index: 13,
    studentCode: "88692",
    name: "Arasely Naura Shada",
    gender: "P",
    codeLabel: "8P",
    branch: "Bangko",
    className: "Kelas A2",
    birthPlace: "Merangin",
    birthDate: "2017-03-01",
    address: "Jalan Enggang",
    gradeLevel: "Ket: Kelas 4",
    parentName: "Reni Martuti",
    parentWhatsapp: "081368208100",
    levelCurriculum: "Level Dasar: Pengenalan Simbol Jari",
    registeredDate: "2024-07-02",
  },
  {
    id: "s-8",
    index: 14,
    studentCode: "61022",
    name: "Bagas Pratama Putra",
    gender: "L",
    codeLabel: "6L",
    branch: "Singkut",
    className: "Kelas B",
    birthPlace: "Sarolangun",
    birthDate: "2018-02-14",
    address: "Desa Pasar Singkut",
    gradeLevel: "Ket: Kelas 3",
    parentName: "Bambang Irawan",
    parentWhatsapp: "082188443321",
    levelCurriculum: "Level Dasar: Pengenalan Simbol Jari",
    registeredDate: "2024-08-01",
  },
  {
    id: "s-9",
    index: 15,
    studentCode: "33918",
    name: "Calista Azkadina",
    gender: "P",
    codeLabel: "8P",
    branch: "Singkut",
    className: "Kelas A",
    birthPlace: "Singkut",
    birthDate: "2017-10-25",
    address: "Jl. Poros Singkut 1",
    gradeLevel: "Ket: Kelas 4",
    parentName: "Dina Marlina",
    parentWhatsapp: "085299881144",
    levelCurriculum: "Level 1: Penjumlahan & Pengurangan Angka Satuan",
    registeredDate: "2024-07-15",
  },
];

export const DASHBOARD_STATS = {
  branchesCount: 2,
  adminsAndAssistants: 0,
  activeStudents: 51,
  totalStudents: 52,
  graduatedAlumni: 1,
  sppCollected: 7605000,
  sppPending: 2825000,
  sppPercentage: 73,
  quizAverage: 86,
  attendancePercentage: 0,
  attendedTodayCount: 0,
};
