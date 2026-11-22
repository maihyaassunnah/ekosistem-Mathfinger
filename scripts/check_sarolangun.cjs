const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const branch = await prisma.branch.findFirst({
    where: { branchCode: 'SRL' },
    include: {
      classes: true,
      students: true,
      users: true,
      setting: true,
    }
  });
  console.log('SAROLANGUN BRANCH INFO:');
  console.log(JSON.stringify(branch, null, 2));

  // Check curriculum modules
  const curriculums = await prisma.curriculumModule.findMany({
    where: {
      OR: [
        { branchId: branch?.id },
        { branch: { contains: 'Sarolangun', mode: 'insensitive' } }
      ]
    }
  });
  console.log('SAROLANGUN CURRICULUMS:', curriculums.length);

  // Check all distinct branches in curriculumModule
  const allCurriculums = await prisma.curriculumModule.findMany({
    select: { branchId: true, branch: true }
  });
  const curBranchMap = {};
  for (const c of allCurriculums) {
    const k = `${c.branch} (${c.branchId})`;
    curBranchMap[k] = (curBranchMap[k] || 0) + 1;
  }
  console.log('ALL CURRICULUMS BRANCH MAP:', curBranchMap);

  // Check grade sessions (ExamSession)
  const examSessions = await prisma.examSession.findMany({
    include: { branch: true }
  });
  console.log('EXAM SESSIONS:');
  for (const es of examSessions) {
    console.log({
      id: es.id,
      title: es.title,
      branchId: es.branchId,
      branchName: es.branch?.branchName,
    });
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
