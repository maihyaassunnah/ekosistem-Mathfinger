const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: { branch: true }
  });
  console.log('USERS IN DB:');
  for (const u of users) {
    console.log({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      branchId: u.branchId,
      branchName: u.branch?.branchName,
      branchCode: u.branch?.branchCode
    });
  }

  const branchSettings = await prisma.branchSetting.findMany({
    include: { branch: true }
  });
  console.log('BRANCH SETTINGS:');
  console.log(branchSettings);
}

main().catch(console.error).finally(() => prisma.$disconnect());
