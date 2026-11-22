const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const branches = await prisma.branch.findMany();
  console.log('BRANCHES:', JSON.stringify(branches, null, 2));

  const admins = await prisma.admin.findMany({
    select: { id: true, username: true, name: true, role: true, branchId: true }
  });
  console.log('ADMINS:', JSON.stringify(admins, null, 2));

  const classes = await prisma.class.findMany({
    select: { id: true, name: true, branchId: true }
  });
  console.log('CLASSES COUNT:', classes.length);
  console.log('CLASSES PER BRANCH:');
  const countPerBranch = {};
  for (const c of classes) {
    countPerBranch[c.branchId] = (countPerBranch[c.branchId] || 0) + 1;
  }
  console.log(countPerBranch);
}

main().catch(console.error).finally(() => prisma.$disconnect());
