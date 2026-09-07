const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const students = await prisma.student.findMany({
    include: { branch: true, currentLevel: true },
    orderBy: { createdAt: 'asc' },
  });

  const formattedStudents = students.map((s, idx) => ({
    id: s.id,
    index: idx + 1,
    studentCode: s.studentCode,
    name: s.studentName,
    gender: (s.gender === 'L' ? 'L' : 'P'),
    codeLabel: s.gender === 'L' ? '6L' : '8P',
    branch: s.branch?.branchName || 'Singkut',
    className: s.className || 'Kelas A',
    birthPlace: s.birthPlace || (s.branch?.branchName === 'Bangko' ? 'Merangin' : 'Singkut'),
    birthDate: typeof s.birthDate === 'string' ? s.birthDate : (s.birthDate ? s.birthDate.toISOString().split('T')[0] : '2018-01-01'),
    address: s.address || (s.branch?.branchName === 'Bangko' ? 'Jl Merak' : 'Sungai Gedang'),
    gradeLevel: s.gradeLevel || 'Ket: Kelas 3',
    parentName: s.parentName || '-',
    parentWhatsapp: s.parentWhatsapp || '-',
    levelCurriculum: s.currentLevel?.levelName || 'Level Dasar: Pengenalan Simbol Jari',
    registeredDate: s.registeredDate ? s.registeredDate.toISOString().split('T')[0] : '2024-08-01',
    status: s.status,
  }));

  const branches = await prisma.branch.findMany({
    include: {
      students: true,
      users: true,
      invoices: { where: { status: 'PAID' } },
    },
    orderBy: { branchName: 'asc' },
  });

  const formattedBranches = branches.map((b) => {
    const liveRevenue = b.invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
    const defaultRev = b.branchCode === 'SKT' ? 3250000 : 4355000;
    return {
      id: b.id,
      code: b.branchCode,
      name: b.branchName,
      address: b.address,
      phone: b.phone || '-',
      activeStudents: b.students.filter((s) => s.status === 'ACTIVE').length,
      adminCount: b.users.length,
      monthlyRevenue: liveRevenue > 0 ? liveRevenue : defaultRev,
      status: b.status,
    };
  });

  const mockFile = path.join(__dirname, '..', 'src', 'lib', 'mock-data.ts');
  const code = `export interface StudentItem {
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
  gradeLevel: string;
  parentName: string;
  parentWhatsapp: string;
  levelCurriculum: string;
  registeredDate: string;
  status?: string;
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

export const BRANCHES_DATA: BranchItem[] = ${JSON.stringify(formattedBranches, null, 2)};

export const STUDENTS_DATA: StudentItem[] = ${JSON.stringify(formattedStudents, null, 2)};

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
`;

  fs.writeFileSync(mockFile, code, 'utf8');
  console.log(`✅ Saved ${formattedStudents.length} students and ${formattedBranches.length} branches to mock-data.ts`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
