const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const classes = await prisma.class.findMany({
    include: { branch: true }
  });
  console.log(`TOTAL CLASSES: ${classes.length}`);
  for (const c of classes) {
    console.log({
      id: c.id,
      name: c.className,
      branchId: c.branchId,
      branchName: c.branch?.branchName,
      branchCode: c.branch?.branchCode
    });
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
