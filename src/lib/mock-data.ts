export interface EnrolledClassInfo {
  id: string;
  className: string;
  programType?: string;
  days?: string;
  time?: string;
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
  teacherName?: string;
  room?: string;
}

export interface StudentItem {
  id: string;
  index: number;
  studentCode: string;
  name: string;
  gender: "P" | "L";
  codeLabel: string;
  branch: "Singkut" | "Bangko";
  className: string;
  enrolledClasses?: EnrolledClassInfo[];
  birthPlace: string;
  birthDate: string;
  address: string;
  gradeLevel: string;
  parentName: string;
  parentWhatsapp: string;
  levelCurriculum: string;
  registeredDate: string;
  status?: string;
  programType?: "MATEMATIKA" | "MEMBACA";
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
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  adminName?: string;
  signatureUrl?: string;
  programs?: string[] | string;
}

export const CURRENT_USER = {
  name: "Wahyudin Hafiz, S.Pd",
  role: "Super Admin",
  email: "wahyudinhafiz123@gmail.com",
  avatar: "",
  branch: "Pusat",
};

export const BRANCHES_DATA: BranchItem[] = [
  {
    "id": "58fc6af5-537e-4dbf-9297-3a8b7859934f",
    "code": "SKT",
    "name": "Singkut",
    "address": "Sungai Gedang, Kec. Singkut, Kab. Sarolangun, Jambi",
    "phone": "0812-7949-8907",
    "activeStudents": 22,
    "adminCount": 3,
    "monthlyRevenue": 3250000,
    "status": "ACTIVE",
    "programs": ["MATEMATIKA", "MEMBACA"],
    "bankName": "BCA",
    "accountNumber": "7825-119-021",
    "accountHolder": "Math Fingers Singkut",
    "adminName": "Febrianti Dewi, S.Pd",
    "signatureUrl": ""
  },
  {
    "id": "07a1fb4b-87af-4d88-9bed-d76168314f1c",
    "code": "BGK",
    "name": "Tabir Timur",
    "address": "Jl. Merak / Kenari, Kec. Bangko, Kab. Merangin, Jambi",
    "phone": "0813-7972-0841",
    "activeStudents": 29,
    "adminCount": 4,
    "monthlyRevenue": 4355000,
    "status": "ACTIVE",
    "programs": ["MATEMATIKA"],
    "bankName": "BRI",
    "accountNumber": "0123-01-002345-50-8",
    "accountHolder": "Math Fingers Bangko",
    "adminName": "M. Hafiz, S.Pd",
    "signatureUrl": ""
  }
];

export const STUDENTS_DATA: StudentItem[] = [
  {
    "id": "9c48106c-acd2-4a23-8ac3-543d94de143d",
    "index": 1,
    "studentCode": "50999",
    "name": "Abdan Zulfadli Fahyan",
    "gender": "L",
    "codeLabel": "3L",
    "branch": "Singkut",
    "className": "CLASS C",
    "birthPlace": "Singkut",
    "birthDate": "2018-02-05",
    "address": "Perumahan Hamenda cs",
    "gradeLevel": " Kelas 3",
    "parentName": "Izul Kopli",
    "parentWhatsapp": "085182546067",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "0389db61-45e9-46d5-bfa9-990b87072b28",
        "className": "CLASS C",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A1",
        "days": "Kamis & Jumat",
        "time": "13:30 - 14:30"
      }
    ]
  },
  {
    "id": "c5767e1d-86a4-4fdd-9bb1-f1a64bed4a6f",
    "index": 2,
    "studentCode": "17366",
    "name": "Abizar Rahandika Alghifari",
    "gender": "L",
    "codeLabel": "3L",
    "branch": "Bangko",
    "className": "KELAS B",
    "birthPlace": "Merangin",
    "birthDate": "2019-09-09",
    "address": "Jl. camar",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Agus",
    "parentWhatsapp": "082279315792",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "261f3a22-f43f-4287-b0bb-b95d52fc321e",
        "className": "KELAS B",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang B",
        "days": "Jumat & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "f2dcf39c-3131-497a-bce7-996dbeff9d62",
    "index": 3,
    "studentCode": "68933",
    "name": "Abizar Rahandika Alghifari",
    "gender": "L",
    "codeLabel": "3L",
    "branch": "Bangko",
    "className": "KELAS B",
    "birthPlace": "Bangko",
    "birthDate": "2018-03-14",
    "address": "Jl. Merpati Bangko",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Agus Nugroho",
    "parentWhatsapp": "082279315792",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-01",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "261f3a22-f43f-4287-b0bb-b95d52fc321e",
        "className": "KELAS B",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang B",
        "days": "Jumat & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "7263e6e3-a667-4f35-82e4-90cd8b59b2b8",
    "index": 4,
    "studentCode": "66469",
    "name": "Abrisam",
    "gender": "L",
    "codeLabel": "3L",
    "branch": "Bangko",
    "className": "KELAS B",
    "birthPlace": "Merangin",
    "birthDate": "2018-05-20",
    "address": "Jl. Kutilang Bangko",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Mustofa",
    "parentWhatsapp": "081538722406",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-02",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "261f3a22-f43f-4287-b0bb-b95d52fc321e",
        "className": "KELAS B",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang B",
        "days": "Jumat & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "d83505ed-0060-453a-9689-4dbf49f87bb8",
    "index": 5,
    "studentCode": "81124",
    "name": "Abrisam",
    "gender": "L",
    "codeLabel": "3L",
    "branch": "Bangko",
    "className": "KELAS B",
    "birthPlace": "S. BULIAN",
    "birthDate": "2017-07-28",
    "address": "Jl. Garuda",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Mustofa",
    "parentWhatsapp": "081538722406",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "261f3a22-f43f-4287-b0bb-b95d52fc321e",
        "className": "KELAS B",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang B",
        "days": "Jumat & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "cf26ab88-2a73-4162-8b55-810b69acb071",
    "index": 6,
    "studentCode": "35955",
    "name": "Abyan Azka Abdillah",
    "gender": "L",
    "codeLabel": "5L",
    "branch": "Bangko",
    "className": "KELAS A1",
    "birthPlace": "MERANGIN",
    "birthDate": "2015-12-07",
    "address": "Jl. KENARI",
    "gradeLevel": "Ket: Kelas 5",
    "parentName": "Yayuk Marsela",
    "parentWhatsapp": "082283451779",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "8ed0e558-30d7-4633-a0f4-c4870e24523e",
        "className": "KELAS A1",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang A1",
        "days": "Senin & Rabu",
        "time": "13:30 - 14:30"
      }
    ]
  },
  {
    "id": "8f01e65d-d43c-4d38-8e10-16f48712cffe",
    "index": 7,
    "studentCode": "14999",
    "name": "Adeeva Afsheen Myesha",
    "gender": "P",
    "codeLabel": "2P",
    "branch": "Bangko",
    "className": "KELAS C",
    "birthPlace": "merangin",
    "birthDate": "2018-10-07",
    "address": "Jl. nuri",
    "gradeLevel": "Ket: Kelas 2",
    "parentName": "wagito",
    "parentWhatsapp": "081271897532",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "b81600c8-4c1e-4e1f-a868-0147b3ec8f80",
        "className": "KELAS C",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang C",
        "days": "Sabtu & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "68d57e75-a2d2-4251-b6a7-541c3bc9c15d",
    "index": 8,
    "studentCode": "66458",
    "name": "Adeeva Afsheen Myesha",
    "gender": "P",
    "codeLabel": "2P",
    "branch": "Bangko",
    "className": "KELAS C",
    "birthPlace": "Bangko",
    "birthDate": "2018-07-15",
    "address": "Jl. Murai Bangko",
    "gradeLevel": "Ket: Kelas 2",
    "parentName": "Wagito",
    "parentWhatsapp": "081271897532",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-18",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "b81600c8-4c1e-4e1f-a868-0147b3ec8f80",
        "className": "KELAS C",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang C",
        "days": "Sabtu & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "31486b62-e24d-4ded-a892-c9be9a9b68c3",
    "index": 9,
    "studentCode": "56840",
    "name": "Afrial Arsenio",
    "gender": "L",
    "codeLabel": "4L",
    "branch": "Bangko",
    "className": "KELAS C",
    "birthPlace": "Merangin",
    "birthDate": "2017-02-28",
    "address": "Jl. Kutilang No. 5 Bangko",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Arsenio",
    "parentWhatsapp": "081366778899",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-07-12",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "b81600c8-4c1e-4e1f-a868-0147b3ec8f80",
        "className": "KELAS C",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang C",
        "days": "Sabtu & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "1fc1dc6c-9c06-4874-8783-790d12ab67fe",
    "index": 10,
    "studentCode": "MB-992",
    "name": "Ahnaf ",
    "gender": "P",
    "codeLabel": "1P",
    "branch": "Bangko",
    "className": "bee",
    "birthPlace": "Tabir Timur",
    "birthDate": "2019-01-01",
    "address": "Jl. Poros Singkut",
    "gradeLevel": "Level 1: Pra-Membaca & Pengenalan Huruf",
    "parentName": "Mhita",
    "parentWhatsapp": "0812",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-10-04",
    "status": "ACTIVE",
    "programType": "MEMBACA",
    "enrolledClasses": [
      {
        "id": "85c41490-5a43-4a56-80e2-ae320a3b32c1",
        "className": "bee",
        "programType": "MEMBACA",
        "teacherName": "Dewi Safitri, S.H.",
        "room": "Ruang Baca",
        "days": "Rabu & Jumat",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "f552cd7d-a33f-441a-b8f2-f529514df6ed",
    "index": 11,
    "studentCode": "77599",
    "name": "Aida Syafira N.A",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Bangko",
    "className": "KELAS A1",
    "birthPlace": "M BUNGO",
    "birthDate": "2015-02-19",
    "address": "Jl. KENARI",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Sunarmi",
    "parentWhatsapp": "082260015497",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "8ed0e558-30d7-4633-a0f4-c4870e24523e",
        "className": "KELAS A1",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang A1",
        "days": "Senin & Rabu",
        "time": "13:30 - 14:30"
      }
    ]
  },
  {
    "id": "981d918a-8b29-4b3f-b7e7-7d0baedae5b6",
    "index": 12,
    "studentCode": "15367",
    "name": "Aida Syafira N.A",
    "gender": "P",
    "codeLabel": "2P",
    "branch": "Bangko",
    "className": "KELAS A1",
    "birthPlace": "Bangko",
    "birthDate": "2018-09-12",
    "address": "Jl. Kenari No. 12 Bangko",
    "gradeLevel": "Ket: Kelas 2",
    "parentName": "Syafira",
    "parentWhatsapp": "081379124560",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-10",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "8ed0e558-30d7-4633-a0f4-c4870e24523e",
        "className": "KELAS A1",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang A1",
        "days": "Senin & Rabu",
        "time": "13:30 - 14:30"
      }
    ]
  },
  {
    "id": "17a21047-a092-4964-a396-ea778093f34d",
    "index": 13,
    "studentCode": "52651",
    "name": "Ainan Nuri Sumayah",
    "gender": "P",
    "codeLabel": "4P",
    "branch": "Bangko",
    "className": "KELAS D",
    "birthPlace": "Jambi",
    "birthDate": "2016-07-13",
    "address": "Jl. Nuri",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Tuti",
    "parentWhatsapp": "082123592522",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-10-03",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "c609f55f-6eca-41d1-93fe-261cc459933d",
        "className": "KELAS D",
        "programType": "MATEMATIKA",
        "teacherName": "Lailatus Istianah ",
        "room": "Ruang D",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "4c5462b2-a318-45de-8ffd-293df12e4334",
    "index": 14,
    "studentCode": "40736",
    "name": "Aira Anatasya Putri",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Bangko",
    "className": "KELAS B",
    "birthPlace": "S. BULIAN",
    "birthDate": "2018-01-16",
    "address": "Jl. BEO",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Nur Farida",
    "parentWhatsapp": "082214650659",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "261f3a22-f43f-4287-b0bb-b95d52fc321e",
        "className": "KELAS B",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang B",
        "days": "Jumat & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "c3f5334a-642b-4e05-a980-bbbc4442438b",
    "index": 15,
    "studentCode": "31996",
    "name": "Aira Anatasya Putri",
    "gender": "P",
    "codeLabel": "4P",
    "branch": "Bangko",
    "className": "KELAS B",
    "birthPlace": "Bangko",
    "birthDate": "2017-04-10",
    "address": "Jl. Merak Bangko",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Anatasya",
    "parentWhatsapp": "081379112200",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-07-01",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "261f3a22-f43f-4287-b0bb-b95d52fc321e",
        "className": "KELAS B",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang B",
        "days": "Jumat & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "ac9180e4-fedf-4941-b3c7-ca9cda665d88",
    "index": 16,
    "studentCode": "79000",
    "name": "Aishwa Rahma Annida",
    "gender": "P",
    "codeLabel": "4P",
    "branch": "Singkut",
    "className": "CLASS A",
    "birthPlace": "Lahat",
    "birthDate": "2018-01-03",
    "address": "Sungai Gedang",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Vetika",
    "parentWhatsapp": "081279498907",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-08-22",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "6539cf97-3499-4ebc-a583-ea1bd7e04506",
        "className": "CLASS A",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A1",
        "days": "Sabtu & Ahad",
        "time": "09:00 - 10:00"
      }
    ]
  },
  {
    "id": "a32a3e2b-2898-4a12-a20f-a2cb15c3ca22",
    "index": 17,
    "studentCode": "10650",
    "name": "Aishwa Rahma Annida",
    "gender": "P",
    "codeLabel": "4P",
    "branch": "Singkut",
    "className": "CLASS A",
    "birthPlace": "Lahat",
    "birthDate": "2018-01-03",
    "address": "Sungai Gedang",
    "gradeLevel": "Kelas 4",
    "parentName": "Vetika",
    "parentWhatsapp": "081279498907",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-08",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "6539cf97-3499-4ebc-a583-ea1bd7e04506",
        "className": "CLASS A",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A1",
        "days": "Sabtu & Ahad",
        "time": "09:00 - 10:00"
      }
    ]
  },
  {
    "id": "590ba72b-cae9-4773-9863-ac46b48e4eb1",
    "index": 18,
    "studentCode": "91212",
    "name": "Ajeng Cahyra Naifasha",
    "gender": "P",
    "codeLabel": "2P",
    "branch": "Bangko",
    "className": "KELAS C",
    "birthPlace": "Merangin",
    "birthDate": "2018-05-03",
    "address": "Jalan Kenari, Bangko",
    "gradeLevel": "Ket: Kelas 2",
    "parentName": "Eni",
    "parentWhatsapp": "08139602155",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-15",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "b81600c8-4c1e-4e1f-a868-0147b3ec8f80",
        "className": "KELAS C",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang C",
        "days": "Sabtu & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "746c4af0-24e7-44b9-b255-256bc96cd47d",
    "index": 19,
    "studentCode": "84072",
    "name": "Ajeng Chaira Naifasha",
    "gender": "P",
    "codeLabel": "2P",
    "branch": "Bangko",
    "className": "KELAS C",
    "birthPlace": "MERANGIN",
    "birthDate": "2018-05-03",
    "address": "Jl. KENARI",
    "gradeLevel": "Ket: Kelas 2",
    "parentName": "ENI",
    "parentWhatsapp": "08139602155",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "b81600c8-4c1e-4e1f-a868-0147b3ec8f80",
        "className": "KELAS C",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang C",
        "days": "Sabtu & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "51f2f51b-16db-42bc-8e24-c12e01e57977",
    "index": 20,
    "studentCode": "65815",
    "name": "Alesha Rafani Marta",
    "gender": "P",
    "codeLabel": "4P",
    "branch": "Bangko",
    "className": "KELAS A2",
    "birthPlace": "PADANG JANTUNG",
    "birthDate": "2016-09-06",
    "address": "Jl. MERAK",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Mala Noftobela",
    "parentWhatsapp": "081379720841",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "357c4e81-b230-4e28-b570-0ddefe8a6bfd",
        "className": "KELAS A2",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang A2",
        "days": "Selasa & Kamis",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "e08d4e8d-5858-4762-af6b-dfe5ff031bb9",
    "index": 21,
    "studentCode": "78564",
    "name": "Alesha Rafani Marta",
    "gender": "P",
    "codeLabel": "4P",
    "branch": "Bangko",
    "className": "KELAS A2",
    "birthPlace": "Padang Jantung",
    "birthDate": "2016-09-06",
    "address": "Jalan Merak, Bangko",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Mala Noftobela",
    "parentWhatsapp": "081379720841",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-19",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "357c4e81-b230-4e28-b570-0ddefe8a6bfd",
        "className": "KELAS A2",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang A2",
        "days": "Selasa & Kamis",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "1eecdd5c-da28-4078-a890-b2abe0ebfc9d",
    "index": 22,
    "studentCode": "49625",
    "name": "Amara Alifah Fauziah",
    "gender": "P",
    "codeLabel": "2P",
    "branch": "Bangko",
    "className": "KELAS C",
    "birthPlace": "MERANGIN ",
    "birthDate": "2018-09-21",
    "address": "Jl. GELATIK",
    "gradeLevel": "Ket: Kelas 2",
    "parentName": "Ani Linawati",
    "parentWhatsapp": "082176449839",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "b81600c8-4c1e-4e1f-a868-0147b3ec8f80",
        "className": "KELAS C",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang C",
        "days": "Sabtu & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "4fae6a4c-8c08-4351-bb25-71e9db2e4ecb",
    "index": 23,
    "studentCode": "17055",
    "name": "Anandira Dyah Asmara Wati",
    "gender": "P",
    "codeLabel": "2P",
    "branch": "Bangko",
    "className": "KELAS C",
    "birthPlace": "Merangin",
    "birthDate": "2018-11-18",
    "address": "Jl Merpati, Bangko",
    "gradeLevel": "Ket: Kelas 2",
    "parentName": "Agustina Wati",
    "parentWhatsapp": "085837162339",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-20",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "b81600c8-4c1e-4e1f-a868-0147b3ec8f80",
        "className": "KELAS C",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang C",
        "days": "Sabtu & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "b252f9f5-a288-433f-9ad7-ac52dbb7a9a7",
    "index": 24,
    "studentCode": "52809",
    "name": "Anandira Dyah Asmarawati",
    "gender": "P",
    "codeLabel": "2P",
    "branch": "Bangko",
    "className": "KELAS C",
    "birthPlace": "MERANGIN",
    "birthDate": "2018-11-18",
    "address": "Jl. MERPATI",
    "gradeLevel": "Ket: Kelas 2",
    "parentName": "Agustina Wati",
    "parentWhatsapp": "085837162339",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "b81600c8-4c1e-4e1f-a868-0147b3ec8f80",
        "className": "KELAS C",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang C",
        "days": "Sabtu & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "239abe9a-3759-4677-be68-aa5f1ed2796c",
    "index": 25,
    "studentCode": "66538",
    "name": "Ananta Virya",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Bangko",
    "className": "KELAS B",
    "birthPlace": "Merangin",
    "birthDate": "2017-08-13",
    "address": "Jl. kutilang",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "SUDAR",
    "parentWhatsapp": "08217336403",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "261f3a22-f43f-4287-b0bb-b95d52fc321e",
        "className": "KELAS B",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang B",
        "days": "Jumat & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "d6be9a6d-26fa-43ac-a80a-6ee5f30b80b4",
    "index": 26,
    "studentCode": "95452",
    "name": "Ananta Virya",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Bangko",
    "className": "KELAS B",
    "birthPlace": "Merangin",
    "birthDate": "2017-08-13",
    "address": "Jl Kutilang, Bangko",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Sudar",
    "parentWhatsapp": "085382485578",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-06-10",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "261f3a22-f43f-4287-b0bb-b95d52fc321e",
        "className": "KELAS B",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang B",
        "days": "Jumat & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "216e8e11-446a-46bd-8641-893961f9462f",
    "index": 27,
    "studentCode": "66787",
    "name": "Anindita Keisha Zahra",
    "gender": "P",
    "codeLabel": "5P",
    "branch": "Bangko",
    "className": "KELAS A1",
    "birthPlace": "MERANGIN",
    "birthDate": "2016-04-14",
    "address": "Jl. KENARI",
    "gradeLevel": "Ket: Kelas 5",
    "parentName": "Anik Kusdianti",
    "parentWhatsapp": "085268273004",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "8ed0e558-30d7-4633-a0f4-c4870e24523e",
        "className": "KELAS A1",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang A1",
        "days": "Senin & Rabu",
        "time": "13:30 - 14:30"
      }
    ]
  },
  {
    "id": "74fc5667-0936-4db6-a83f-1e4d69576041",
    "index": 28,
    "studentCode": "MB-475",
    "name": "Aqila ",
    "gender": "P",
    "codeLabel": "1P",
    "branch": "Bangko",
    "className": "bee",
    "birthPlace": "Tabir Timur",
    "birthDate": "2019-01-01",
    "address": "Jl. Poros Singkut",
    "gradeLevel": "Level 1: Pra-Membaca & Pengenalan Huruf",
    "parentName": "Maryono",
    "parentWhatsapp": "0812",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-10-04",
    "status": "ACTIVE",
    "programType": "MEMBACA",
    "enrolledClasses": [
      {
        "id": "85c41490-5a43-4a56-80e2-ae320a3b32c1",
        "className": "bee",
        "programType": "MEMBACA",
        "teacherName": "Dewi Safitri, S.H.",
        "room": "Ruang Baca",
        "days": "Rabu & Jumat",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "cea06363-69e7-47b6-9f47-1a7716561f7d",
    "index": 29,
    "studentCode": "65603",
    "name": "Aqila Fahmida",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Bangko",
    "className": "KELAS A1",
    "birthPlace": "MERANGIN",
    "birthDate": "2015-12-12",
    "address": "Jl. MERAK",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Maryono",
    "parentWhatsapp": "08136392294",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "8ed0e558-30d7-4633-a0f4-c4870e24523e",
        "className": "KELAS A1",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang A1",
        "days": "Senin & Rabu",
        "time": "13:30 - 14:30"
      }
    ]
  },
  {
    "id": "5c74b85c-f840-4649-ab72-e572843d8848",
    "index": 30,
    "studentCode": "29797",
    "name": "Aqila Fahmida",
    "gender": "P",
    "codeLabel": "5P",
    "branch": "Bangko",
    "className": "KELAS A1",
    "birthPlace": "Merangin",
    "birthDate": "2015-12-12",
    "address": "Jl Merak, Bangko",
    "gradeLevel": "Ket: Kelas 5",
    "parentName": "Maryono",
    "parentWhatsapp": "08136398294",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-06-15",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "8ed0e558-30d7-4633-a0f4-c4870e24523e",
        "className": "KELAS A1",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang A1",
        "days": "Senin & Rabu",
        "time": "13:30 - 14:30"
      }
    ]
  },
  {
    "id": "d0eaf62d-32db-4518-9ba9-35183a533bef",
    "index": 31,
    "studentCode": "88692",
    "name": "Arasely Naura Shada",
    "gender": "P",
    "codeLabel": "4P",
    "branch": "Bangko",
    "className": "KELAS A2",
    "birthPlace": "Merangin",
    "birthDate": "2017-03-01",
    "address": "Jalan Enggang, Bangko",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Reni Martuti",
    "parentWhatsapp": "081368208100",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-07-02",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "357c4e81-b230-4e28-b570-0ddefe8a6bfd",
        "className": "KELAS A2",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang A2",
        "days": "Selasa & Kamis",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "16f42f89-5c09-4b2b-9e8a-d01f7f275727",
    "index": 32,
    "studentCode": "18032",
    "name": "Areasely Naura Shada",
    "gender": "P",
    "codeLabel": "4P",
    "branch": "Bangko",
    "className": "KELAS A2",
    "birthPlace": "MERANGIN",
    "birthDate": "2017-03-01",
    "address": "Jl. ENGGANG",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Reni",
    "parentWhatsapp": "081368208100",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "357c4e81-b230-4e28-b570-0ddefe8a6bfd",
        "className": "KELAS A2",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang A2",
        "days": "Selasa & Kamis",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "9ae2069c-c732-4461-ae86-f18cffca1178",
    "index": 33,
    "studentCode": "45237",
    "name": "Arka Prapdipta Ardani",
    "gender": "L",
    "codeLabel": "3L",
    "branch": "Bangko",
    "className": "KELAS B",
    "birthPlace": "MERANGIN",
    "birthDate": "2018-01-25",
    "address": "Jl. NURI",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Sugeng",
    "parentWhatsapp": "085788123898",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "261f3a22-f43f-4287-b0bb-b95d52fc321e",
        "className": "KELAS B",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang B",
        "days": "Jumat & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "873cf03f-d94e-41c1-a8d8-44ea933c1d93",
    "index": 34,
    "studentCode": "93060",
    "name": "Arka Prapta Ardani",
    "gender": "L",
    "codeLabel": "4L",
    "branch": "Bangko",
    "className": "KELAS B",
    "birthPlace": "Merangin",
    "birthDate": "2017-01-25",
    "address": "Jl. Kenari Bangko",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Ardani",
    "parentWhatsapp": "081273998811",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-07-05",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "261f3a22-f43f-4287-b0bb-b95d52fc321e",
        "className": "KELAS B",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang B",
        "days": "Jumat & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "c407aac0-a001-4ce4-8aff-85634e737f3c",
    "index": 35,
    "studentCode": "86280",
    "name": "Arsy Akifa Salsabila",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Bangko",
    "className": "KELAS B",
    "birthPlace": "MERANGIN",
    "birthDate": "2018-11-17",
    "address": "Jl. SERITI",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Saiman",
    "parentWhatsapp": "085273950316",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "261f3a22-f43f-4287-b0bb-b95d52fc321e",
        "className": "KELAS B",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang B",
        "days": "Jumat & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "497ef1bb-d078-42af-a596-85d9d8c60bf0",
    "index": 36,
    "studentCode": "99133",
    "name": "Arsyila Nasha Razita",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Bangko",
    "className": "KELAS B",
    "birthPlace": "MERANGIN",
    "birthDate": "2017-01-15",
    "address": "Jl. NURI",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Yudistira",
    "parentWhatsapp": "082216436530",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "261f3a22-f43f-4287-b0bb-b95d52fc321e",
        "className": "KELAS B",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang B",
        "days": "Jumat & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "2643a6e6-fcc0-4c9f-81b1-db1d116e37cd",
    "index": 37,
    "studentCode": "89050",
    "name": "Arsyila Nasha Razita",
    "gender": "P",
    "codeLabel": "2P",
    "branch": "Singkut",
    "className": "CLASS A",
    "birthPlace": "Singkut",
    "birthDate": "2018-06-19",
    "address": "Jl. Lintas Sumatera Singkut",
    "gradeLevel": "Ket: Kelas 2",
    "parentName": "Nasha",
    "parentWhatsapp": "082281729011",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-12",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "6539cf97-3499-4ebc-a583-ea1bd7e04506",
        "className": "CLASS A",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A1",
        "days": "Sabtu & Ahad",
        "time": "09:00 - 10:00"
      }
    ]
  },
  {
    "id": "afff798e-f6eb-4730-883b-cebf7ee93880",
    "index": 38,
    "studentCode": "41984",
    "name": "Asheqa Shaqueena Qotrunada",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Bangko",
    "className": "KELAS A1",
    "birthPlace": "MERANGIN",
    "birthDate": "2016-05-05",
    "address": "Jl. KUTILANG",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "SUGENG",
    "parentWhatsapp": "081273986771",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "8ed0e558-30d7-4633-a0f4-c4870e24523e",
        "className": "KELAS A1",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang A1",
        "days": "Senin & Rabu",
        "time": "13:30 - 14:30"
      }
    ]
  },
  {
    "id": "ee84a828-abc0-41c5-9ead-d79ff2056910",
    "index": 39,
    "studentCode": "96166",
    "name": "Ayunda Shela Ferlita ",
    "gender": "P",
    "codeLabel": "4P",
    "branch": "Bangko",
    "className": "KELAS A2",
    "birthPlace": "MERANGIN",
    "birthDate": "2017-04-27",
    "address": "Jl. ENGGANG",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Suyamti",
    "parentWhatsapp": "081238822868",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "357c4e81-b230-4e28-b570-0ddefe8a6bfd",
        "className": "KELAS A2",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang A2",
        "days": "Selasa & Kamis",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "92d33126-0c86-4472-8a43-01098bf61c00",
    "index": 40,
    "studentCode": "95701",
    "name": "Azila Quira Zulda",
    "gender": "P",
    "codeLabel": "2P",
    "branch": "Singkut",
    "className": "CLASS C",
    "birthPlace": "Singkut",
    "birthDate": "2019-07-18",
    "address": "Perumahan Hamenda cs",
    "gradeLevel": "Kelas 2 ",
    "parentName": "Izul Kopli",
    "parentWhatsapp": "085182546067",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "0389db61-45e9-46d5-bfa9-990b87072b28",
        "className": "CLASS C",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A1",
        "days": "Kamis & Jumat",
        "time": "13:30 - 14:30"
      }
    ]
  },
  {
    "id": "e02583be-1443-414b-a37c-90e612bcd317",
    "index": 41,
    "studentCode": "61022",
    "name": "Bagas Pratama Putra",
    "gender": "L",
    "codeLabel": "3L",
    "branch": "Singkut",
    "className": "CLASS B",
    "birthPlace": "Sarolangun",
    "birthDate": "2018-02-14",
    "address": "Desa Pasar Singkut",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Bambang Irawan",
    "parentWhatsapp": "082188443321",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-01",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "807284f9-afad-4642-8b54-b45e2c7ca274",
        "className": "CLASS B",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A2",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "48721968-d3f2-4319-92be-7a5e972c106b",
    "index": 42,
    "studentCode": "55866",
    "name": "Bilqis Ufairah",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Singkut",
    "className": "CLASS A",
    "birthPlace": "Singkut",
    "birthDate": "2018-03-02",
    "address": "Jl. Raden Fatah Singkut",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Ufairah",
    "parentWhatsapp": "085377192800",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-01",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "6539cf97-3499-4ebc-a583-ea1bd7e04506",
        "className": "CLASS A",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A1",
        "days": "Sabtu & Ahad",
        "time": "09:00 - 10:00"
      }
    ]
  },
  {
    "id": "04796f1c-9a95-475e-a8db-b8fd605ae5ad",
    "index": 43,
    "studentCode": "76123",
    "name": "Bima Sakti",
    "gender": "L",
    "codeLabel": "4L",
    "branch": "Bangko",
    "className": "KELAS B",
    "birthPlace": "Merangin",
    "birthDate": "2016-09-12",
    "address": "Jl. Diponegoro Bangko",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Sakti",
    "parentWhatsapp": "081378990022",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-07-15",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "261f3a22-f43f-4287-b0bb-b95d52fc321e",
        "className": "KELAS B",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang B",
        "days": "Jumat & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "c76503ff-a1d9-45ee-815e-35e24c8f7c7c",
    "index": 44,
    "studentCode": "33918",
    "name": "Calista Azkadina",
    "gender": "P",
    "codeLabel": "4P",
    "branch": "Singkut",
    "className": "CLASS A",
    "birthPlace": "Singkut",
    "birthDate": "2017-10-25",
    "address": "Jl. Poros Singkut 1",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Dina Marlina",
    "parentWhatsapp": "085299881144",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-07-15",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "6539cf97-3499-4ebc-a583-ea1bd7e04506",
        "className": "CLASS A",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A1",
        "days": "Sabtu & Ahad",
        "time": "09:00 - 10:00"
      }
    ]
  },
  {
    "id": "cb436508-3a4d-49c9-85c5-636ea9e93e88",
    "index": 45,
    "studentCode": "89123",
    "name": "Citra Kirana",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Bangko",
    "className": "KELAS B",
    "birthPlace": "Bangko",
    "birthDate": "2017-12-08",
    "address": "Jl. Pramuka Bangko",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Kirana",
    "parentWhatsapp": "082199001133",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-07-22",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "261f3a22-f43f-4287-b0bb-b95d52fc321e",
        "className": "KELAS B",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang B",
        "days": "Jumat & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "3989a228-cdd0-456b-aa91-b9be32522cb5",
    "index": 46,
    "studentCode": "31290",
    "name": "Daniswara Rizky",
    "gender": "L",
    "codeLabel": "4L",
    "branch": "Bangko",
    "className": "KELAS A1",
    "birthPlace": "Merangin",
    "birthDate": "2016-10-05",
    "address": "Jl. Mayor H. Syamsudin Bangko",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Rizky",
    "parentWhatsapp": "081274112233",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-07-10",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "8ed0e558-30d7-4633-a0f4-c4870e24523e",
        "className": "KELAS A1",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang A1",
        "days": "Senin & Rabu",
        "time": "13:30 - 14:30"
      }
    ]
  },
  {
    "id": "f9ce8b07-5738-4c29-8ecc-048807666d4c",
    "index": 47,
    "studentCode": "61298",
    "name": "Dimas Arya Sena",
    "gender": "L",
    "codeLabel": "4L",
    "branch": "Singkut",
    "className": "CLASS A",
    "birthPlace": "Singkut",
    "birthDate": "2017-06-11",
    "address": "Jl. Poros Singkut 3",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Sena",
    "parentWhatsapp": "082389102390",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-07-18",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "6539cf97-3499-4ebc-a583-ea1bd7e04506",
        "className": "CLASS A",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A1",
        "days": "Sabtu & Ahad",
        "time": "09:00 - 10:00"
      }
    ]
  },
  {
    "id": "11a3901e-dae9-4902-a89e-578810a8fbad",
    "index": 48,
    "studentCode": "98124",
    "name": "Dzakiandra Putra",
    "gender": "L",
    "codeLabel": "2L",
    "branch": "Bangko",
    "className": "KELAS B",
    "birthPlace": "Merangin",
    "birthDate": "2018-08-17",
    "address": "Lingkungan Pasar Bangko",
    "gradeLevel": "Ket: Kelas 2",
    "parentName": "Putra",
    "parentWhatsapp": "085388991144",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-11",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "261f3a22-f43f-4287-b0bb-b95d52fc321e",
        "className": "KELAS B",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang B",
        "days": "Jumat & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "edfa74c0-7a6c-421e-b5a3-142f80563a3c",
    "index": 49,
    "studentCode": "34581",
    "name": "Dzakiyyah Al Fajri",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Singkut",
    "className": "CLASS B",
    "birthPlace": "Singkut",
    "birthDate": "2018-07-21",
    "address": "Jl. Melati Singkut 2",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Fajri",
    "parentWhatsapp": "085266182903",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-18",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "807284f9-afad-4642-8b54-b45e2c7ca274",
        "className": "CLASS B",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A2",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "2ca10889-b780-4660-8022-c1b1a23d5ce2",
    "index": 50,
    "studentCode": "97375",
    "name": "Dzakiyyah Al Fajri ",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Singkut",
    "className": "CLASS B",
    "birthPlace": "Singkut",
    "birthDate": "2017-08-26",
    "address": "Payolebar ",
    "gradeLevel": "Kelas 3",
    "parentName": "Fajar Triyanto ",
    "parentWhatsapp": "082281589851",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-08",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "807284f9-afad-4642-8b54-b45e2c7ca274",
        "className": "CLASS B",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A2",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "6c51a4cb-002b-4b1f-a757-d0920e3043d9",
    "index": 51,
    "studentCode": "86190",
    "name": "EL FIRQOTUN AN NAJIYAH",
    "gender": "P",
    "codeLabel": "1P",
    "branch": "Bangko",
    "className": "KELAS C",
    "birthPlace": "MERANGIN",
    "birthDate": "2019-11-17",
    "address": "Jl. KENARI",
    "gradeLevel": "Ket: Kelas 1",
    "parentName": "PURWANTO",
    "parentWhatsapp": "082310380097",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "b81600c8-4c1e-4e1f-a868-0147b3ec8f80",
        "className": "KELAS C",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang C",
        "days": "Sabtu & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "c1ccae6d-ae43-4bbf-b539-4c1c96c9c16b",
    "index": 52,
    "studentCode": "41209",
    "name": "Fakhri Al-Ghifari",
    "gender": "L",
    "codeLabel": "4L",
    "branch": "Singkut",
    "className": "CLASS A",
    "birthPlace": "Sarolangun",
    "birthDate": "2017-09-14",
    "address": "Jl. Dahlia Singkut",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Hendra",
    "parentWhatsapp": "081274901822",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-07-20",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "6539cf97-3499-4ebc-a583-ea1bd7e04506",
        "className": "CLASS A",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A1",
        "days": "Sabtu & Ahad",
        "time": "09:00 - 10:00"
      }
    ]
  },
  {
    "id": "6c55f895-276b-4955-ab24-223af3c42bea",
    "index": 53,
    "studentCode": "67890",
    "name": "Fathir Ahmad",
    "gender": "L",
    "codeLabel": "5L",
    "branch": "Bangko",
    "className": "KELAS A1",
    "birthPlace": "Bangko",
    "birthDate": "2015-11-20",
    "address": "Pematang Kandis Bangko",
    "gradeLevel": "Ket: Kelas 5",
    "parentName": "Ahmad",
    "parentWhatsapp": "085266778811",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-06-20",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "8ed0e558-30d7-4633-a0f4-c4870e24523e",
        "className": "KELAS A1",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang A1",
        "days": "Senin & Rabu",
        "time": "13:30 - 14:30"
      }
    ]
  },
  {
    "id": "fd6da340-cbd8-44e9-8d93-e97e51cbbe4d",
    "index": 54,
    "studentCode": "89919",
    "name": "Felisha Amara Gina",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Bangko",
    "className": "KELAS C",
    "birthPlace": "M. BUNGO",
    "birthDate": "2019-12-15",
    "address": "Jl. MERPATI",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Ulva",
    "parentWhatsapp": "082258881708",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "b81600c8-4c1e-4e1f-a868-0147b3ec8f80",
        "className": "KELAS C",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang C",
        "days": "Sabtu & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "d8340cb1-f138-425b-84ee-080de2586ece",
    "index": 55,
    "studentCode": "77435",
    "name": "Geofanny Gareos  P.K.B",
    "gender": "L",
    "codeLabel": "5L",
    "branch": "Bangko",
    "className": "KELAS A1",
    "birthPlace": "MERANGIN",
    "birthDate": "2015-04-25",
    "address": "Jl. Kutilang",
    "gradeLevel": "Ket: Kelas 5",
    "parentName": "Joko Kuncoro",
    "parentWhatsapp": "082180788769",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "8ed0e558-30d7-4633-a0f4-c4870e24523e",
        "className": "KELAS A1",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang A1",
        "days": "Senin & Rabu",
        "time": "13:30 - 14:30"
      }
    ]
  },
  {
    "id": "352a42af-0c46-4373-9ac4-69a5282da28c",
    "index": 56,
    "studentCode": "21446",
    "name": "Ghumaisha",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Singkut",
    "className": "CLASS A",
    "birthPlace": "Singkut",
    "birthDate": "2018-04-12",
    "address": "Desa Sungai Gedang",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Nur Halimah",
    "parentWhatsapp": "081373512990",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-10",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "6539cf97-3499-4ebc-a583-ea1bd7e04506",
        "className": "CLASS A",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A1",
        "days": "Sabtu & Ahad",
        "time": "09:00 - 10:00"
      }
    ]
  },
  {
    "id": "ade8738b-9e7a-4b56-9de7-169e74e714c1",
    "index": 57,
    "studentCode": "93231",
    "name": "Ghumaisha  ",
    "gender": "P",
    "codeLabel": "2P",
    "branch": "Singkut",
    "className": "CLASS B",
    "birthPlace": "Singkut",
    "birthDate": "2018-08-20",
    "address": "Siliwangi ",
    "gradeLevel": "Kelas 2",
    "parentName": "Sokhidin",
    "parentWhatsapp": "082186756050",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-08",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "807284f9-afad-4642-8b54-b45e2c7ca274",
        "className": "CLASS B",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A2",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "68d5295b-bde7-4391-bab3-68255dcee983",
    "index": 58,
    "studentCode": "78123",
    "name": "Gladis Anindita",
    "gender": "P",
    "codeLabel": "2P",
    "branch": "Bangko",
    "className": "KELAS A1",
    "birthPlace": "Merangin",
    "birthDate": "2018-07-07",
    "address": "Jl. Beringin Bangko",
    "gradeLevel": "Ket: Kelas 2",
    "parentName": "Hendra",
    "parentWhatsapp": "081389001122",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-12",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "8ed0e558-30d7-4633-a0f4-c4870e24523e",
        "className": "KELAS A1",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang A1",
        "days": "Senin & Rabu",
        "time": "13:30 - 14:30"
      }
    ]
  },
  {
    "id": "8e4bf798-43a8-4def-ad68-252c3035dd84",
    "index": 59,
    "studentCode": "43183",
    "name": "Habib Fadhil Abidin",
    "gender": "L",
    "codeLabel": "3L",
    "branch": "Bangko",
    "className": "KELAS D",
    "birthPlace": "Merangin ",
    "birthDate": "2018-06-19",
    "address": "Jl. Kaswari",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Khomi Asmiati ",
    "parentWhatsapp": "082284952384",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-10-03",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "c609f55f-6eca-41d1-93fe-261cc459933d",
        "className": "KELAS D",
        "programType": "MATEMATIKA",
        "teacherName": "Lailatus Istianah ",
        "room": "Ruang D",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "15de4d83-1d1b-4042-9bb4-9fdc65db1d3c",
    "index": 60,
    "studentCode": "67123",
    "name": "Hafiz Al-Faruq",
    "gender": "L",
    "codeLabel": "4L",
    "branch": "Singkut",
    "className": "CLASS A",
    "birthPlace": "Singkut",
    "birthDate": "2017-04-18",
    "address": "Sungai Gedang RT 02",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Faruq",
    "parentWhatsapp": "081273901188",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-07-05",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "6539cf97-3499-4ebc-a583-ea1bd7e04506",
        "className": "CLASS A",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A1",
        "days": "Sabtu & Ahad",
        "time": "09:00 - 10:00"
      }
    ]
  },
  {
    "id": "beacabdd-33b2-4d0c-a7fa-df2c0b3a0570",
    "index": 61,
    "studentCode": "23866",
    "name": "Hamid Al Irsad",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Bangko",
    "className": "KELAS C",
    "birthPlace": "MERANGIN",
    "birthDate": "2019-03-03",
    "address": "Jl. NURI",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "KARSIDI",
    "parentWhatsapp": "085837172125",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "b81600c8-4c1e-4e1f-a868-0147b3ec8f80",
        "className": "KELAS C",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang C",
        "days": "Sabtu & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "90d546d9-0f7c-4cdf-8351-5e854cce406c",
    "index": 62,
    "studentCode": "17246",
    "name": "Haris",
    "gender": "L",
    "codeLabel": "4L",
    "branch": "Singkut",
    "className": "CLASS B",
    "birthPlace": "Singkut",
    "birthDate": "2017-11-09",
    "address": "Jl. Kenanga Singkut",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "M. Yusuf",
    "parentWhatsapp": "081367891244",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-20",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "807284f9-afad-4642-8b54-b45e2c7ca274",
        "className": "CLASS B",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A2",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "f8916605-5eff-48c0-bd51-8301e015b855",
    "index": 63,
    "studentCode": "59847",
    "name": "Haris ",
    "gender": "L",
    "codeLabel": "2L",
    "branch": "Singkut",
    "className": "CLASS A",
    "birthPlace": "Singkut",
    "birthDate": "2018-12-27",
    "address": "Bukit Tigo ",
    "gradeLevel": "Kelas 2",
    "parentName": "Mundari ",
    "parentWhatsapp": "082283274071",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-08",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "6539cf97-3499-4ebc-a583-ea1bd7e04506",
        "className": "CLASS A",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A1",
        "days": "Sabtu & Ahad",
        "time": "09:00 - 10:00"
      }
    ]
  },
  {
    "id": "9e1eea3b-215f-41c6-b662-89e0f7bbac6a",
    "index": 64,
    "studentCode": "48291",
    "name": "Haura",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Bangko",
    "className": "KELAS A1",
    "birthPlace": "Bangko",
    "birthDate": "2018-02-18",
    "address": "Pasar Bawah Bangko",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Hafiz",
    "parentWhatsapp": "085384780910",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-20",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "8ed0e558-30d7-4633-a0f4-c4870e24523e",
        "className": "KELAS A1",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang A1",
        "days": "Senin & Rabu",
        "time": "13:30 - 14:30"
      }
    ]
  },
  {
    "id": "a8431d56-d3cb-4789-9bc7-242af68b616f",
    "index": 65,
    "studentCode": "MB-896",
    "name": "Kayla ",
    "gender": "P",
    "codeLabel": "1P",
    "branch": "Bangko",
    "className": "bee",
    "birthPlace": "Tabir Timur",
    "birthDate": "2019-01-01",
    "address": "Jl. Poros Singkut",
    "gradeLevel": "Level 1: Pra-Membaca & Pengenalan Huruf",
    "parentName": "idk",
    "parentWhatsapp": "0812",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-10-04",
    "status": "ACTIVE",
    "programType": "MEMBACA",
    "enrolledClasses": [
      {
        "id": "85c41490-5a43-4a56-80e2-ae320a3b32c1",
        "className": "bee",
        "programType": "MEMBACA",
        "teacherName": "Dewi Safitri, S.H.",
        "room": "Ruang Baca",
        "days": "Rabu & Jumat",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "c3dd210c-9220-4055-b57e-5ced60c906c7",
    "index": 66,
    "studentCode": "48712",
    "name": "Kenzo Alvaro",
    "gender": "L",
    "codeLabel": "3L",
    "branch": "Singkut",
    "className": "CLASS B",
    "birthPlace": "Sarolangun",
    "birthDate": "2018-01-20",
    "address": "Singkut 1 Pasar",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Rina",
    "parentWhatsapp": "081278119022",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-11",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "807284f9-afad-4642-8b54-b45e2c7ca274",
        "className": "CLASS B",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A2",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "ae6f604a-c5a1-48a0-a65c-776edc69b777",
    "index": 67,
    "studentCode": "54321",
    "name": "Kevin Pratama",
    "gender": "L",
    "codeLabel": "4L",
    "branch": "Bangko",
    "className": "KELAS A1",
    "birthPlace": "Bangko",
    "birthDate": "2016-08-15",
    "address": "Jl. Jend. Sudirman Bangko",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Pratama",
    "parentWhatsapp": "082188990011",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-07-08",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "8ed0e558-30d7-4633-a0f4-c4870e24523e",
        "className": "KELAS A1",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang A1",
        "days": "Senin & Rabu",
        "time": "13:30 - 14:30"
      }
    ]
  },
  {
    "id": "5a5302cf-3115-45c1-ae89-20208f8bd5f5",
    "index": 68,
    "studentCode": "81234",
    "name": "Keysha Anindya",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Singkut",
    "className": "CLASS B",
    "birthPlace": "Singkut",
    "birthDate": "2018-08-14",
    "address": "Sungai Gedang Dusun 1",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Anita",
    "parentWhatsapp": "082198001234",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-08",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "807284f9-afad-4642-8b54-b45e2c7ca274",
        "className": "CLASS B",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A2",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "7c900a4b-3261-46f2-9990-e54fbc729e3d",
    "index": 69,
    "studentCode": "38952",
    "name": "Kheyra Candra ",
    "gender": "P",
    "codeLabel": "2P",
    "branch": "Singkut",
    "className": "CLASS A",
    "birthPlace": "Kapuh",
    "birthDate": "2019-04-04",
    "address": "Bukit Tigo ",
    "gradeLevel": "Kelas 2",
    "parentName": "Vika",
    "parentWhatsapp": "082171827775",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-08",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "6539cf97-3499-4ebc-a583-ea1bd7e04506",
        "className": "CLASS A",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A1",
        "days": "Sabtu & Ahad",
        "time": "09:00 - 10:00"
      }
    ]
  },
  {
    "id": "e8375491-10a6-4a3e-a632-733721808900",
    "index": 70,
    "studentCode": "68766",
    "name": "Kristian Naibaho",
    "gender": "L",
    "codeLabel": "2L",
    "branch": "Singkut",
    "className": "CLASS C",
    "birthPlace": "Sarolangun",
    "birthDate": "2018-11-25",
    "address": "Sungai Gedang",
    "gradeLevel": "Kelas 2",
    "parentName": "Gisto Naibaho",
    "parentWhatsapp": "081396893250",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "0389db61-45e9-46d5-bfa9-990b87072b28",
        "className": "CLASS C",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A1",
        "days": "Kamis & Jumat",
        "time": "13:30 - 14:30"
      }
    ]
  },
  {
    "id": "5467d797-c061-4a6f-b981-86af0829951d",
    "index": 71,
    "studentCode": "43210",
    "name": "Luthfi Hakim",
    "gender": "L",
    "codeLabel": "5L",
    "branch": "Bangko",
    "className": "KELAS A1",
    "birthPlace": "Merangin",
    "birthDate": "2015-05-19",
    "address": "Kandis Indah Bangko",
    "gradeLevel": "Ket: Kelas 5",
    "parentName": "Hakim",
    "parentWhatsapp": "085377889922",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-06-18",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "8ed0e558-30d7-4633-a0f4-c4870e24523e",
        "className": "KELAS A1",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang A1",
        "days": "Senin & Rabu",
        "time": "13:30 - 14:30"
      }
    ]
  },
  {
    "id": "34f39374-825b-4c3e-8f5d-1e60dd92a722",
    "index": 72,
    "studentCode": "78700",
    "name": "M. Bintang Hisyam Naufal",
    "gender": "L",
    "codeLabel": "5L",
    "branch": "Bangko",
    "className": "KELAS A2",
    "birthPlace": "BUNGO",
    "birthDate": "2016-03-04",
    "address": "SPC",
    "gradeLevel": "Ket: Kelas 5",
    "parentName": "Kuat Taruna Negara",
    "parentWhatsapp": "085281105256",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "357c4e81-b230-4e28-b570-0ddefe8a6bfd",
        "className": "KELAS A2",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang A2",
        "days": "Selasa & Kamis",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "9f60be52-54d6-41df-a0b8-f1de43bbd7f7",
    "index": 73,
    "studentCode": "74789",
    "name": "M. Dhaffa Athallah",
    "gender": "P",
    "codeLabel": "2P",
    "branch": "Bangko",
    "className": "KELAS C",
    "birthPlace": "MERANGIN",
    "birthDate": "2018-12-05",
    "address": "Jl. KENARI",
    "gradeLevel": "Ket: Kelas 2",
    "parentName": "Sucipto",
    "parentWhatsapp": "082260544905",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "b81600c8-4c1e-4e1f-a868-0147b3ec8f80",
        "className": "KELAS C",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang C",
        "days": "Sabtu & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "55e4f383-8f7f-43aa-ab5b-bf31aaa02b29",
    "index": 74,
    "studentCode": "77364",
    "name": "M. Fahrul Al Khafid",
    "gender": "L",
    "codeLabel": "2L",
    "branch": "Bangko",
    "className": "KELAS D",
    "birthPlace": "Singkut",
    "birthDate": "2018-01-01",
    "address": "Jl. NURI",
    "gradeLevel": "Ket: Level 2: Kunci jempol",
    "parentName": "RIAYANTO",
    "parentWhatsapp": "085367221422",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-27",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "c609f55f-6eca-41d1-93fe-261cc459933d",
        "className": "KELAS D",
        "programType": "MATEMATIKA",
        "teacherName": "Lailatus Istianah ",
        "room": "Ruang D",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "9d9977fb-1a91-47b4-99df-288cc648d437",
    "index": 75,
    "studentCode": "55148",
    "name": "M. Hafizhan Khairan ",
    "gender": "L",
    "codeLabel": "2L",
    "branch": "Singkut",
    "className": "CLASS A",
    "birthPlace": "Lahat",
    "birthDate": "2019-03-05",
    "address": "Sungai Gedang ",
    "gradeLevel": "Kelas 2",
    "parentName": "Vetika",
    "parentWhatsapp": "081279498907",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-08",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "6539cf97-3499-4ebc-a583-ea1bd7e04506",
        "className": "CLASS A",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A1",
        "days": "Sabtu & Ahad",
        "time": "09:00 - 10:00"
      }
    ]
  },
  {
    "id": "7169f097-8bf5-40dd-934e-0f5460261c04",
    "index": 76,
    "studentCode": "20080",
    "name": "M. Hannan Habibillah",
    "gender": "L",
    "codeLabel": "3L",
    "branch": "Bangko",
    "className": "KELAS B",
    "birthPlace": "MERANGIN",
    "birthDate": "2017-06-27",
    "address": "Jl. ENGGANG",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Desy",
    "parentWhatsapp": "082280383064",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "261f3a22-f43f-4287-b0bb-b95d52fc321e",
        "className": "KELAS B",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang B",
        "days": "Jumat & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "20f9a9ba-13c7-4650-a900-61abd09ea07a",
    "index": 77,
    "studentCode": "22000",
    "name": "M. Hannan Habibillah",
    "gender": "L",
    "codeLabel": "4L",
    "branch": "Singkut",
    "className": "CLASS B",
    "birthPlace": "Singkut",
    "birthDate": "2017-08-29",
    "address": "Jl. Diponegoro Singkut",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Habib",
    "parentWhatsapp": "085290123845",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-07-10",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "807284f9-afad-4642-8b54-b45e2c7ca274",
        "className": "CLASS B",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A2",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "9997dcfe-ef86-40c4-a197-f1e968484719",
    "index": 78,
    "studentCode": "70066",
    "name": "M. Rafa Raditia",
    "gender": "L",
    "codeLabel": "2L",
    "branch": "Bangko",
    "className": "KELAS D",
    "birthPlace": "MERANGIN",
    "birthDate": "2018-04-20",
    "address": "Jl.KASWARI",
    "gradeLevel": "Ket: Kelas 2",
    "parentName": "Suryanti",
    "parentWhatsapp": "082228211272",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "c609f55f-6eca-41d1-93fe-261cc459933d",
        "className": "KELAS D",
        "programType": "MATEMATIKA",
        "teacherName": "Lailatus Istianah ",
        "room": "Ruang D",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "b0655f2e-a8c9-4320-9ad7-1e85f7e120ce",
    "index": 79,
    "studentCode": "88190",
    "name": "M. Rayyan Al-Fatih",
    "gender": "L",
    "codeLabel": "2L",
    "branch": "Bangko",
    "className": "KELAS C",
    "birthPlace": "Bangko",
    "birthDate": "2018-09-09",
    "address": "Jl. Cendrawasih Bangko",
    "gradeLevel": "Ket: Kelas 2",
    "parentName": "Fatih",
    "parentWhatsapp": "085399112233",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-22",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "b81600c8-4c1e-4e1f-a868-0147b3ec8f80",
        "className": "KELAS C",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang C",
        "days": "Sabtu & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "f5269115-d04f-4424-9bbc-ffbf35974aca",
    "index": 80,
    "studentCode": "79805",
    "name": "M. Razka Raffasya",
    "gender": "L",
    "codeLabel": "3L",
    "branch": "Bangko",
    "className": "KELAS B",
    "birthPlace": "MERANGIN",
    "birthDate": "2017-09-27",
    "address": "Jl. KUTILANG",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Anita",
    "parentWhatsapp": "085368958288",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "261f3a22-f43f-4287-b0bb-b95d52fc321e",
        "className": "KELAS B",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang B",
        "days": "Jumat & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "50d53115-8f00-40eb-90b0-1de731665ec4",
    "index": 81,
    "studentCode": "71940",
    "name": "Mahera Aiza Hilya",
    "gender": "P",
    "codeLabel": "2P",
    "branch": "Bangko",
    "className": "KELAS C",
    "birthPlace": "MERANGIN",
    "birthDate": "2019-04-10",
    "address": "Jl. NURI",
    "gradeLevel": "Ket: Kelas 2",
    "parentName": "NURYANI",
    "parentWhatsapp": "081271714382",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "b81600c8-4c1e-4e1f-a868-0147b3ec8f80",
        "className": "KELAS C",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang C",
        "days": "Sabtu & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "45d71ff0-749e-4176-b447-60bc25931671",
    "index": 82,
    "studentCode": "MB-811",
    "name": "Maryam",
    "gender": "P",
    "codeLabel": "1P",
    "branch": "Bangko",
    "className": "bee",
    "birthPlace": "Tabir Timur",
    "birthDate": "2019-01-01",
    "address": "Jl. Poros Singkut",
    "gradeLevel": "Level 1: Pra-Membaca & Pengenalan Huruf",
    "parentName": "yuli",
    "parentWhatsapp": "0812",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-10-04",
    "status": "ACTIVE",
    "programType": "MEMBACA",
    "enrolledClasses": [
      {
        "id": "85c41490-5a43-4a56-80e2-ae320a3b32c1",
        "className": "bee",
        "programType": "MEMBACA",
        "teacherName": "Dewi Safitri, S.H.",
        "room": "Ruang Baca",
        "days": "Rabu & Jumat",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "b42ef79c-f9c9-4972-8f36-525ec014240e",
    "index": 83,
    "studentCode": "51380",
    "name": "Maulana Syarif Wardani",
    "gender": "L",
    "codeLabel": "3L",
    "branch": "Singkut",
    "className": "CLASS B",
    "birthPlace": "Singkut",
    "birthDate": "2018-05-15",
    "address": "Sungai Gedang RT 04",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Wardani",
    "parentWhatsapp": "082190881230",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-05",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "807284f9-afad-4642-8b54-b45e2c7ca274",
        "className": "CLASS B",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A2",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "db3d66d8-d162-4032-a6df-cb222d521c53",
    "index": 84,
    "studentCode": "44789",
    "name": "Maulana Syarif Wardhani",
    "gender": "L",
    "codeLabel": "4L",
    "branch": "Bangko",
    "className": "KELAS A2",
    "birthPlace": "MERANGIN",
    "birthDate": "2016-02-28",
    "address": "Jl. CENDRAWASIH",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "WARDI",
    "parentWhatsapp": "085609370518",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "357c4e81-b230-4e28-b570-0ddefe8a6bfd",
        "className": "KELAS A2",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang A2",
        "days": "Selasa & Kamis",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "aa3fff59-d27e-4851-a660-ceaf1d8e9ade",
    "index": 85,
    "studentCode": "90123",
    "name": "Muhammad Azka",
    "gender": "L",
    "codeLabel": "5L",
    "branch": "Singkut",
    "className": "CLASS A",
    "birthPlace": "Sarolangun",
    "birthDate": "2017-03-22",
    "address": "Jl. Ahmad Yani Singkut",
    "gradeLevel": "Ket: Kelas 5",
    "parentName": "Azka",
    "parentWhatsapp": "085277123490",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-06-25",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "6539cf97-3499-4ebc-a583-ea1bd7e04506",
        "className": "CLASS A",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A1",
        "days": "Sabtu & Ahad",
        "time": "09:00 - 10:00"
      }
    ]
  },
  {
    "id": "bfd200b0-bc2f-4bae-9d2b-4ba947b7c924",
    "index": 86,
    "studentCode": "10001",
    "name": "Muhammad Rizky Al-Bukhari",
    "gender": "L",
    "codeLabel": "6L",
    "branch": "Bangko",
    "className": "Alumni",
    "birthPlace": "Merangin",
    "birthDate": "2013-05-10",
    "address": "Bangko",
    "gradeLevel": "Alumni Lulus",
    "parentName": "Bukhari",
    "parentWhatsapp": "081277665544",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2023-01-15",
    "status": "GRADUATED",
    "programType": "MATEMATIKA",
    "enrolledClasses": []
  },
  {
    "id": "e0f01c5d-a021-45d7-9828-102cb091a16d",
    "index": 87,
    "studentCode": "13846",
    "name": "Musyaffa' ",
    "gender": "L",
    "codeLabel": "3L",
    "branch": "Singkut",
    "className": "CLASS B",
    "birthPlace": "Sarolangun ",
    "birthDate": "2018-07-09",
    "address": "Payolebar ",
    "gradeLevel": "Kelas 3",
    "parentName": "Hardadi ",
    "parentWhatsapp": "082280649595",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-08",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "807284f9-afad-4642-8b54-b45e2c7ca274",
        "className": "CLASS B",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A2",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "96bd8abf-ce5e-42c0-8a3f-4d7549f8a2e9",
    "index": 88,
    "studentCode": "57782",
    "name": "Muwaffaq ",
    "gender": "L",
    "codeLabel": "3L",
    "branch": "Singkut",
    "className": "CLASS B",
    "birthPlace": "Sarolangun ",
    "birthDate": "2018-07-09",
    "address": "Payolebar ",
    "gradeLevel": "Kelas 3",
    "parentName": "Hardadi ",
    "parentWhatsapp": "082280649595",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-08",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "807284f9-afad-4642-8b54-b45e2c7ca274",
        "className": "CLASS B",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A2",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "1d157032-9563-4b12-933f-f45078bd1646",
    "index": 89,
    "studentCode": "38910",
    "name": "Nabila Putri Ramadhani",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Singkut",
    "className": "CLASS A",
    "birthPlace": "Sarolangun",
    "birthDate": "2018-09-08",
    "address": "Jl. Flamboyan Singkut",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Ramadhan",
    "parentWhatsapp": "085381902341",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-03",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "6539cf97-3499-4ebc-a583-ea1bd7e04506",
        "className": "CLASS A",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A1",
        "days": "Sabtu & Ahad",
        "time": "09:00 - 10:00"
      }
    ]
  },
  {
    "id": "4964c094-f258-4fcb-94ed-1619344d0377",
    "index": 90,
    "studentCode": "47440",
    "name": "Najwa Alarifah",
    "gender": "P",
    "codeLabel": "4P",
    "branch": "Bangko",
    "className": "KELAS A1",
    "birthPlace": "MERANGIN",
    "birthDate": "2017-04-19",
    "address": "Jl. MERAK",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Anita",
    "parentWhatsapp": "6287768872816",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "8ed0e558-30d7-4633-a0f4-c4870e24523e",
        "className": "KELAS A1",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang A1",
        "days": "Senin & Rabu",
        "time": "13:30 - 14:30"
      }
    ]
  },
  {
    "id": "452fe4ee-e4c6-4e63-a83d-9f0829085e88",
    "index": 91,
    "studentCode": "65103",
    "name": "Najwa Khaira Wilda",
    "gender": "P",
    "codeLabel": "6P",
    "branch": "Bangko",
    "className": "KELAS A2",
    "birthPlace": "S. BULIAN",
    "birthDate": "2014-07-18",
    "address": "Jl. KASWARI",
    "gradeLevel": "Ket: Kelas 6",
    "parentName": "SURYA",
    "parentWhatsapp": "085658613150",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "357c4e81-b230-4e28-b570-0ddefe8a6bfd",
        "className": "KELAS A2",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang A2",
        "days": "Selasa & Kamis",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "6f029f4e-d64a-4e54-a105-915d6be1e055",
    "index": 92,
    "studentCode": "79679",
    "name": "Nashwa Zahira Fahrefi ",
    "gender": "P",
    "codeLabel": "2P",
    "branch": "Singkut",
    "className": "CLASS A",
    "birthPlace": "Singkut",
    "birthDate": "2018-10-18",
    "address": "Sungai Benteng ",
    "gradeLevel": "Kelas 2",
    "parentName": "Almi Fahreza ",
    "parentWhatsapp": "082185945421",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-08",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "6539cf97-3499-4ebc-a583-ea1bd7e04506",
        "className": "CLASS A",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A1",
        "days": "Sabtu & Ahad",
        "time": "09:00 - 10:00"
      }
    ]
  },
  {
    "id": "145479a8-eaa4-4017-a099-b6dc90015f8f",
    "index": 93,
    "studentCode": "MB-681",
    "name": "Natasya ",
    "gender": "P",
    "codeLabel": "1P",
    "branch": "Bangko",
    "className": "bee",
    "birthPlace": "Tabir Timur",
    "birthDate": "2019-01-01",
    "address": "Jl. Poros Singkut",
    "gradeLevel": "Level 1: Pra-Membaca & Pengenalan Huruf",
    "parentName": "lasiyem",
    "parentWhatsapp": "0812",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-10-04",
    "status": "ACTIVE",
    "programType": "MEMBACA",
    "enrolledClasses": [
      {
        "id": "85c41490-5a43-4a56-80e2-ae320a3b32c1",
        "className": "bee",
        "programType": "MEMBACA",
        "teacherName": "Dewi Safitri, S.H.",
        "room": "Ruang Baca",
        "days": "Rabu & Jumat",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "32dad6a6-6729-4aed-a91c-885e1b685e4c",
    "index": 94,
    "studentCode": "21117",
    "name": "Natasya Elfani Alkhomah",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Bangko",
    "className": "KELAS A1",
    "birthPlace": "S. BULIAN",
    "birthDate": "2017-03-07",
    "address": "Jl. GARUDA",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Lasiyem",
    "parentWhatsapp": "081532256442",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "8ed0e558-30d7-4633-a0f4-c4870e24523e",
        "className": "KELAS A1",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang A1",
        "days": "Senin & Rabu",
        "time": "13:30 - 14:30"
      }
    ]
  },
  {
    "id": "5f15914c-65c0-4824-8170-2bc66288ae8d",
    "index": 95,
    "studentCode": "12232",
    "name": "Nathania Azkadina Farzana",
    "gender": "P",
    "codeLabel": "4P",
    "branch": "Bangko",
    "className": "KELAS A1",
    "birthPlace": "MERANGIN",
    "birthDate": "2017-02-17",
    "address": "Jl. KUWAU",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "EKA",
    "parentWhatsapp": "085832807423",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "8ed0e558-30d7-4633-a0f4-c4870e24523e",
        "className": "KELAS A1",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang A1",
        "days": "Senin & Rabu",
        "time": "13:30 - 14:30"
      }
    ]
  },
  {
    "id": "bb043228-0521-4772-8409-ffb114dea44d",
    "index": 96,
    "studentCode": "77189",
    "name": "Naura Zafira",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Bangko",
    "className": "KELAS C",
    "birthPlace": "Merangin",
    "birthDate": "2018-01-11",
    "address": "Pematang Kandis Bangko",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Zafira",
    "parentWhatsapp": "082188112244",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "b81600c8-4c1e-4e1f-a868-0147b3ec8f80",
        "className": "KELAS C",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang C",
        "days": "Sabtu & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "58a9b1e8-fe4b-4471-8ddc-05548604fe49",
    "index": 97,
    "studentCode": "67358",
    "name": "Nayla Inara Putri",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Bangko",
    "className": "KELAS D",
    "birthPlace": "Merangin",
    "birthDate": "2017-09-08",
    "address": "Jl. Gelatik",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Sumiyati",
    "parentWhatsapp": "082244237734",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-10-03",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "c609f55f-6eca-41d1-93fe-261cc459933d",
        "className": "KELAS D",
        "programType": "MATEMATIKA",
        "teacherName": "Lailatus Istianah ",
        "room": "Ruang D",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "3d378546-ea52-4a13-8235-8ca01bf9c218",
    "index": 98,
    "studentCode": "53421",
    "name": "Nayla Khairunnisa",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Singkut",
    "className": "CLASS B",
    "birthPlace": "Sarolangun",
    "birthDate": "2018-04-05",
    "address": "Singkut 1 Blok B",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Khairul",
    "parentWhatsapp": "081378901234",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-09",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "807284f9-afad-4642-8b54-b45e2c7ca274",
        "className": "CLASS B",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A2",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "0f0efef9-eda5-4673-a26b-4007603410a3",
    "index": 99,
    "studentCode": "83063",
    "name": "Nayyara Febi Anjani",
    "gender": "P",
    "codeLabel": "2P",
    "branch": "Bangko",
    "className": "KELAS D",
    "birthPlace": "Merangin ",
    "birthDate": "2019-02-14",
    "address": "Jl. bangau",
    "gradeLevel": "Kls 2 sd",
    "parentName": "Wakidi",
    "parentWhatsapp": "089678952260",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-10-03",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "c609f55f-6eca-41d1-93fe-261cc459933d",
        "className": "KELAS D",
        "programType": "MATEMATIKA",
        "teacherName": "Lailatus Istianah ",
        "room": "Ruang D",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "ffdc0d9b-af62-4250-b6f4-b561bdda627f",
    "index": 100,
    "studentCode": "80218",
    "name": "Nurul Hasna Maulidyah",
    "gender": "P",
    "codeLabel": "4P",
    "branch": "Bangko",
    "className": "KELAS A2",
    "birthPlace": "S. BULIAN",
    "birthDate": "2016-12-28",
    "address": "Jl. KASWARI",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "DWI",
    "parentWhatsapp": "085129246139",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "357c4e81-b230-4e28-b570-0ddefe8a6bfd",
        "className": "KELAS A2",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang A2",
        "days": "Selasa & Kamis",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "faf6d016-09db-47f7-88c1-93f2ba67a241",
    "index": 101,
    "studentCode": "66178",
    "name": "Prabu Wijaya",
    "gender": "L",
    "codeLabel": "3L",
    "branch": "Bangko",
    "className": "KELAS C",
    "birthPlace": "Bangko",
    "birthDate": "2017-10-10",
    "address": "Jl. Merpati Atas Bangko",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Wijaya",
    "parentWhatsapp": "081299112255",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-07-16",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "b81600c8-4c1e-4e1f-a868-0147b3ec8f80",
        "className": "KELAS C",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang C",
        "days": "Sabtu & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "10451ac4-1e41-430d-b17d-01de8a19261e",
    "index": 102,
    "studentCode": "64628",
    "name": "Qintara Izatunnisya",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Bangko",
    "className": "KELAS B",
    "birthPlace": "Lubuk Resam",
    "birthDate": "2017-12-21",
    "address": "Jl. Beo ",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Elsa",
    "parentWhatsapp": "085211779704",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "261f3a22-f43f-4287-b0bb-b95d52fc321e",
        "className": "KELAS B",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang B",
        "days": "Jumat & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "e521cf67-2781-4348-97f8-4a207ee97913",
    "index": 103,
    "studentCode": "MB-574",
    "name": "Radit ",
    "gender": "P",
    "codeLabel": "1P",
    "branch": "Bangko",
    "className": "bee",
    "birthPlace": "Tabir Timur",
    "birthDate": "2019-01-01",
    "address": "Jl. Poros Singkut",
    "gradeLevel": "Level 1: Pra-Membaca & Pengenalan Huruf",
    "parentName": "Ririn ",
    "parentWhatsapp": "0812",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-10-04",
    "status": "ACTIVE",
    "programType": "MEMBACA",
    "enrolledClasses": [
      {
        "id": "85c41490-5a43-4a56-80e2-ae320a3b32c1",
        "className": "bee",
        "programType": "MEMBACA",
        "teacherName": "Dewi Safitri, S.H.",
        "room": "Ruang Baca",
        "days": "Rabu & Jumat",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "001f391b-660f-46f6-a82e-d59a0bb45700",
    "index": 104,
    "studentCode": "86254",
    "name": "Raditya Riski Ramadhan ",
    "gender": "L",
    "codeLabel": "5L",
    "branch": "Bangko",
    "className": "KELAS D",
    "birthPlace": "Tabir Timur",
    "birthDate": "2015-06-18",
    "address": "Jl. Gelatik ",
    "gradeLevel": "Ket: Kelas 5",
    "parentName": "Ririn",
    "parentWhatsapp": "082373434273",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-22",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "c609f55f-6eca-41d1-93fe-261cc459933d",
        "className": "KELAS D",
        "programType": "MATEMATIKA",
        "teacherName": "Lailatus Istianah ",
        "room": "Ruang D",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "a6c9d744-dcac-4377-b0a0-0d2a140c1257",
    "index": 105,
    "studentCode": "44156",
    "name": "Rafa Al-Ghifari",
    "gender": "L",
    "codeLabel": "4L",
    "branch": "Bangko",
    "className": "KELAS A2",
    "birthPlace": "Bangko",
    "birthDate": "2016-11-12",
    "address": "Jl. Kenari Permai Bangko",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Ghifari",
    "parentWhatsapp": "081377112277",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-07-09",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "357c4e81-b230-4e28-b570-0ddefe8a6bfd",
        "className": "KELAS A2",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang A2",
        "days": "Selasa & Kamis",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "5831e4e4-ad30-43d7-a4d5-a11dd3b46508",
    "index": 106,
    "studentCode": "57508",
    "name": "Raffasya Abizar Raqilla",
    "gender": "L",
    "codeLabel": "3L",
    "branch": "Bangko",
    "className": "KELAS D",
    "birthPlace": "Merangin",
    "birthDate": "2018-11-14",
    "address": "Jl. Pialing",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Sunoto",
    "parentWhatsapp": "082331603185",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-10-03",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "c609f55f-6eca-41d1-93fe-261cc459933d",
        "className": "KELAS D",
        "programType": "MATEMATIKA",
        "teacherName": "Lailatus Istianah ",
        "room": "Ruang D",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "16d71476-7ec9-483a-a2b0-f1e9de3ade83",
    "index": 107,
    "studentCode": "65934",
    "name": "Rahajeng Ayu Kinanti",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Bangko",
    "className": "KELAS A2",
    "birthPlace": "BUNGO",
    "birthDate": "2017-08-05",
    "address": "SPC",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Kuat Taruna Negara",
    "parentWhatsapp": "085281105256",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "357c4e81-b230-4e28-b570-0ddefe8a6bfd",
        "className": "KELAS A2",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang A2",
        "days": "Selasa & Kamis",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "5f779113-fdc7-4393-8537-b28f76db27a9",
    "index": 108,
    "studentCode": "44512",
    "name": "Raisya Salsabila",
    "gender": "P",
    "codeLabel": "2P",
    "branch": "Singkut",
    "className": "CLASS B",
    "birthPlace": "Singkut",
    "birthDate": "2018-11-30",
    "address": "Desa Sungai Gedang",
    "gradeLevel": "Ket: Kelas 2",
    "parentName": "Salsa",
    "parentWhatsapp": "081266778899",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-21",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "807284f9-afad-4642-8b54-b45e2c7ca274",
        "className": "CLASS B",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A2",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "296a8d0a-9549-4f1a-b529-76eb203d8407",
    "index": 109,
    "studentCode": "24265",
    "name": "Rayendra Azzan Pramana",
    "gender": "L",
    "codeLabel": "5L",
    "branch": "Singkut",
    "className": "CLASS B",
    "birthPlace": "Singkut",
    "birthDate": "2016-07-30",
    "address": "Payolebar ",
    "gradeLevel": "Kelas 5",
    "parentName": "Imalis",
    "parentWhatsapp": "085273418406",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-08",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "807284f9-afad-4642-8b54-b45e2c7ca274",
        "className": "CLASS B",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A2",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "64dd1749-efcb-40c0-97e6-a30d772e50e0",
    "index": 110,
    "studentCode": "72190",
    "name": "Rayhan Pratama",
    "gender": "L",
    "codeLabel": "4L",
    "branch": "Singkut",
    "className": "CLASS B",
    "birthPlace": "Singkut",
    "birthDate": "2017-12-01",
    "address": "Singkut 2 Jalur 3",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Pratama",
    "parentWhatsapp": "081379102833",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-07-12",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "807284f9-afad-4642-8b54-b45e2c7ca274",
        "className": "CLASS B",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A2",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "dec5e211-a360-4207-83fb-9771011fab2f",
    "index": 111,
    "studentCode": "10409",
    "name": "Sarah ",
    "gender": "P",
    "codeLabel": "4P",
    "branch": "Singkut",
    "className": "CLASS A",
    "birthPlace": "Singkut",
    "birthDate": "2016-10-18",
    "address": "Bukit Tigo ",
    "gradeLevel": "Kelas 4",
    "parentName": "Mundari ",
    "parentWhatsapp": "082283274071",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-08",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "6539cf97-3499-4ebc-a583-ea1bd7e04506",
        "className": "CLASS A",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A1",
        "days": "Sabtu & Ahad",
        "time": "09:00 - 10:00"
      }
    ]
  },
  {
    "id": "6d947da3-e268-4b69-ab42-820c9b48132e",
    "index": 112,
    "studentCode": "70553",
    "name": "Shaqia Azzahra Rahayu",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Bangko",
    "className": "KELAS B",
    "birthPlace": "M. BUNGO",
    "birthDate": "2018-02-06",
    "address": "Jl. KUTILANG",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Soraya Mardini",
    "parentWhatsapp": "082269713031",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "261f3a22-f43f-4287-b0bb-b95d52fc321e",
        "className": "KELAS B",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang B",
        "days": "Jumat & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "ca9930de-9661-4823-a0e9-29621ef4f208",
    "index": 113,
    "studentCode": "32460",
    "name": "Shaqia Azzahra Rahayu",
    "gender": "P",
    "codeLabel": "3P",
    "branch": "Bangko",
    "className": "KELAS B",
    "birthPlace": "Bangko",
    "birthDate": "2018-06-30",
    "address": "Pematang Kandis",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Rahayu",
    "parentWhatsapp": "085266112244",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-04",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "261f3a22-f43f-4287-b0bb-b95d52fc321e",
        "className": "KELAS B",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang B",
        "days": "Jumat & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "657f7d55-4398-4d8e-a44d-1f6eb84a61c0",
    "index": 114,
    "studentCode": "30400",
    "name": "Shofiyah ",
    "gender": "P",
    "codeLabel": "4P",
    "branch": "Singkut",
    "className": "CLASS B",
    "birthPlace": "Singkut",
    "birthDate": "2016-07-08",
    "address": "Siliwangi",
    "gradeLevel": "Kelas 4",
    "parentName": "Sokhidin",
    "parentWhatsapp": "082186756050",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-08",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "807284f9-afad-4642-8b54-b45e2c7ca274",
        "className": "CLASS B",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A2",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "256ccdc6-5f78-4ce1-894e-4e6f8ee4800a",
    "index": 115,
    "studentCode": "33145",
    "name": "Syafiq Athallah",
    "gender": "L",
    "codeLabel": "4L",
    "branch": "Bangko",
    "className": "KELAS A2",
    "birthPlace": "Merangin",
    "birthDate": "2016-08-08",
    "address": "Jl. Beringin Indah Bangko",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Athallah",
    "parentWhatsapp": "085288112288",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-07-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "357c4e81-b230-4e28-b570-0ddefe8a6bfd",
        "className": "KELAS A2",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang A2",
        "days": "Selasa & Kamis",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "f20782b9-17ab-40f2-b315-7ad3aadc2739",
    "index": 116,
    "studentCode": "62901",
    "name": "Syakira Nur Aini",
    "gender": "P",
    "codeLabel": "2P",
    "branch": "Singkut",
    "className": "CLASS A",
    "birthPlace": "Singkut",
    "birthDate": "2018-12-05",
    "address": "Sungai Gedang Blok A",
    "gradeLevel": "Ket: Kelas 2",
    "parentName": "Rohani",
    "parentWhatsapp": "082390112765",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-15",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "6539cf97-3499-4ebc-a583-ea1bd7e04506",
        "className": "CLASS A",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A1",
        "days": "Sabtu & Ahad",
        "time": "09:00 - 10:00"
      }
    ]
  },
  {
    "id": "dd652c0e-1633-4495-8ff4-16c4cacc3ffc",
    "index": 117,
    "studentCode": "22134",
    "name": "Tiara Andini",
    "gender": "P",
    "codeLabel": "4P",
    "branch": "Bangko",
    "className": "KELAS A2",
    "birthPlace": "Bangko",
    "birthDate": "2017-01-19",
    "address": "Lingkungan Bukit Gajah Bangko",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Andini",
    "parentWhatsapp": "082177112299",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-06",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "357c4e81-b230-4e28-b570-0ddefe8a6bfd",
        "className": "KELAS A2",
        "programType": "MATEMATIKA",
        "teacherName": "Uswatun Khasanah",
        "room": "Ruang A2",
        "days": "Selasa & Kamis",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "700c0ee2-035a-4a13-bdba-e806864acd95",
    "index": 118,
    "studentCode": "31144",
    "name": "Uwais",
    "gender": "L",
    "codeLabel": "3L",
    "branch": "Singkut",
    "className": "CLASS B",
    "birthPlace": "Jambi",
    "birthDate": "2018-06-06",
    "address": "Payolebar",
    "gradeLevel": "Kelas 3",
    "parentName": "Ayu ",
    "parentWhatsapp": "082179754503",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-11-04",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "807284f9-afad-4642-8b54-b45e2c7ca274",
        "className": "CLASS B",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A2",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "1e8d5ed6-e5b1-474e-8b64-24633476b6f9",
    "index": 119,
    "studentCode": "95219",
    "name": "Viola Alesha Ganes",
    "gender": "P",
    "codeLabel": "4P",
    "branch": "Bangko",
    "className": "KELAS D",
    "birthPlace": "Merangin",
    "birthDate": "2017-03-21",
    "address": "Jl. Kenari",
    "gradeLevel": "Ket: Kelas 4",
    "parentName": "Amel",
    "parentWhatsapp": "081268619895",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-10-03",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "c609f55f-6eca-41d1-93fe-261cc459933d",
        "className": "KELAS D",
        "programType": "MATEMATIKA",
        "teacherName": "Lailatus Istianah ",
        "room": "Ruang D",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "98a69eaa-3d7a-4363-9958-755501175aee",
    "index": 120,
    "studentCode": "11687",
    "name": "Yusuf Alfarizky Sugara",
    "gender": "L",
    "codeLabel": "2L",
    "branch": "Bangko",
    "className": "KELAS D",
    "birthPlace": "MERANGIN",
    "birthDate": "2018-09-22",
    "address": "JL BEO",
    "gradeLevel": "Ket: Level 2: Kunci jempol",
    "parentName": "YOGI",
    "parentWhatsapp": "085381649379",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-27",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "c609f55f-6eca-41d1-93fe-261cc459933d",
        "className": "KELAS D",
        "programType": "MATEMATIKA",
        "teacherName": "Lailatus Istianah ",
        "room": "Ruang D",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "d8d8fd71-2a09-4ee9-8bab-723d01afcce5",
    "index": 121,
    "studentCode": "47603",
    "name": "Yusuf Syauqy Syahid",
    "gender": "L",
    "codeLabel": "5L",
    "branch": "Bangko",
    "className": "KELAS A1",
    "birthPlace": "MERANGIN",
    "birthDate": "2015-07-30",
    "address": "Jl. KENARI",
    "gradeLevel": "Ket: Kelas 5",
    "parentName": "HERU",
    "parentWhatsapp": "0895329255146",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "8ed0e558-30d7-4633-a0f4-c4870e24523e",
        "className": "KELAS A1",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang A1",
        "days": "Senin & Rabu",
        "time": "13:30 - 14:30"
      }
    ]
  },
  {
    "id": "d59d6d2c-166e-4f78-85f0-f3c346278122",
    "index": 122,
    "studentCode": "69413",
    "name": "Zafran Rafisqi",
    "gender": "L",
    "codeLabel": "2L",
    "branch": "Bangko",
    "className": "KELAS D",
    "birthPlace": "Merangin ",
    "birthDate": "2019-01-01",
    "address": "Jl. kutilang",
    "gradeLevel": "Ket: Kelas 2",
    "parentName": "Nanik",
    "parentWhatsapp": "085267603476",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-10-03",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "c609f55f-6eca-41d1-93fe-261cc459933d",
        "className": "KELAS D",
        "programType": "MATEMATIKA",
        "teacherName": "Lailatus Istianah ",
        "room": "Ruang D",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "ce034bcc-b39d-4fb6-a751-19dbf3371ab2",
    "index": 123,
    "studentCode": "59012",
    "name": "Zahrana Azzahra",
    "gender": "P",
    "codeLabel": "2P",
    "branch": "Singkut",
    "className": "CLASS B",
    "birthPlace": "Singkut",
    "birthDate": "2018-10-10",
    "address": "Jl. Pramuka Singkut",
    "gradeLevel": "Ket: Kelas 2",
    "parentName": "Siti Zubaidah",
    "parentWhatsapp": "082381290341",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2024-08-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "807284f9-afad-4642-8b54-b45e2c7ca274",
        "className": "CLASS B",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A2",
        "days": "Sabtu & Ahad",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "d5730b58-7251-402b-9059-cc8a9047dc2e",
    "index": 124,
    "studentCode": "13042",
    "name": "Zian Abdi Pratama ",
    "gender": "L",
    "codeLabel": "2L",
    "branch": "Singkut",
    "className": "CLASS C",
    "birthPlace": "Sarolangun ",
    "birthDate": "2018-11-23",
    "address": "Singkut 1",
    "gradeLevel": " Kelas 2 ",
    "parentName": "Siti Nurhayati ",
    "parentWhatsapp": "082181183630",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-11-01",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "0389db61-45e9-46d5-bfa9-990b87072b28",
        "className": "CLASS C",
        "programType": "MATEMATIKA",
        "teacherName": "Febrianti Dewi, S.Pd",
        "room": "Ruang A1",
        "days": "Kamis & Jumat",
        "time": "13:30 - 14:30"
      }
    ]
  },
  {
    "id": "75075ab4-09b7-4059-8b60-561f8ea52ebe",
    "index": 125,
    "studentCode": "11653",
    "name": "Zulfan Azhar Raihan",
    "gender": "L",
    "codeLabel": "3L",
    "branch": "Bangko",
    "className": "KELAS B",
    "birthPlace": "S. BULIAN",
    "birthDate": "2017-09-17",
    "address": "Jl. NURI",
    "gradeLevel": "Ket: Kelas 3",
    "parentName": "Suyanto",
    "parentWhatsapp": "085156750024",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-09-14",
    "status": "ACTIVE",
    "programType": "MATEMATIKA",
    "enrolledClasses": [
      {
        "id": "261f3a22-f43f-4287-b0bb-b95d52fc321e",
        "className": "KELAS B",
        "programType": "MATEMATIKA",
        "teacherName": "Dewi Safitri, S.H",
        "room": "Ruang B",
        "days": "Jumat & Minggu",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "d3512c7f-e92c-495c-8f6a-7d29c471cc32",
    "index": 126,
    "studentCode": "MB-651",
    "name": "keysha",
    "gender": "P",
    "codeLabel": "1P",
    "branch": "Bangko",
    "className": "bee",
    "birthPlace": "Tabir Timur",
    "birthDate": "2019-01-01",
    "address": "Jl. Poros Singkut",
    "gradeLevel": "Level 1: Pra-Membaca & Pengenalan Huruf",
    "parentName": "idkk",
    "parentWhatsapp": "0812",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-10-04",
    "status": "ACTIVE",
    "programType": "MEMBACA",
    "enrolledClasses": [
      {
        "id": "85c41490-5a43-4a56-80e2-ae320a3b32c1",
        "className": "bee",
        "programType": "MEMBACA",
        "teacherName": "Dewi Safitri, S.H.",
        "room": "Ruang Baca",
        "days": "Rabu & Jumat",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "aa49d4e5-59e1-4831-8595-e5b62f5d8973",
    "index": 127,
    "studentCode": "MB-437",
    "name": "shaqia",
    "gender": "P",
    "codeLabel": "1P",
    "branch": "Bangko",
    "className": "bee",
    "birthPlace": "Tabir Timur",
    "birthDate": "2019-01-01",
    "address": "Jl. Poros Singkut",
    "gradeLevel": "Level 1: Pra-Membaca & Pengenalan Huruf",
    "parentName": "soraya",
    "parentWhatsapp": "0812",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-10-04",
    "status": "ACTIVE",
    "programType": "MEMBACA",
    "enrolledClasses": [
      {
        "id": "85c41490-5a43-4a56-80e2-ae320a3b32c1",
        "className": "bee",
        "programType": "MEMBACA",
        "teacherName": "Dewi Safitri, S.H.",
        "room": "Ruang Baca",
        "days": "Rabu & Jumat",
        "time": "14:00 - 15:30"
      }
    ]
  },
  {
    "id": "69cfaf6e-7722-4324-bbc1-7acf6a8871b6",
    "index": 128,
    "studentCode": "MB-802",
    "name": "yusuf",
    "gender": "P",
    "codeLabel": "1P",
    "branch": "Bangko",
    "className": "bee",
    "birthPlace": "Tabir Timur",
    "birthDate": "2019-01-01",
    "address": "Jl. Poros Singkut",
    "gradeLevel": "Level 1: Pra-Membaca & Pengenalan Huruf",
    "parentName": "heru",
    "parentWhatsapp": "0812",
    "levelCurriculum": "Level Dasar: Pengenalan Simbol Jari",
    "registeredDate": "2026-10-04",
    "status": "ACTIVE",
    "programType": "MEMBACA",
    "enrolledClasses": [
      {
        "id": "85c41490-5a43-4a56-80e2-ae320a3b32c1",
        "className": "bee",
        "programType": "MEMBACA",
        "teacherName": "Dewi Safitri, S.H.",
        "room": "Ruang Baca",
        "days": "Rabu & Jumat",
        "time": "14:00 - 15:30"
      }
    ]
  }
];

export const DASHBOARD_STATS = {
  branchesCount: 2,
  adminsAndAssistants: 2,
  activeStudents: 51,
  totalStudents: 52,
  graduatedAlumni: 1,
  sppCollected: 7605000,
  sppPending: 2825000,
  sppPercentage: 73,
  quizAverage: 86,
  attendancePercentage: 92,
  attendedTodayCount: 40,
};
