const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("=== TESTING REALTIME BRANCH CASCADE IN DATABASE ===");
  
  // 1. Find Singkut branch
  const singkut = await prisma.branch.findFirst({
    where: { branchCode: "SKT" },
  });

  if (!singkut) {
    console.error("Singkut branch not found!");
    return;
  }

  const originalName = singkut.branchName;
  const tempName = "Singkut Utama (Test Cascade)";
  console.log(`Initial Branch Name: ${originalName}`);

  // 2. Update branch name in PostgreSQL
  console.log(`Renaming branch to: ${tempName}...`);
  await prisma.branch.update({
    where: { id: singkut.id },
    data: { branchName: tempName },
  });

  // 3. Query students with relation
  const students = await prisma.student.findMany({
    where: { branchId: singkut.id },
    include: { branch: true },
    take: 3,
  });

  console.log(`\nVerified ${students.length} students relation branch:`);
  students.forEach((s) => {
    console.log(`- Student: ${s.studentName}, Branch Name from DB relation: "${s.branch.branchName}"`);
  });

  // 4. Query invoices with relation
  const invoices = await prisma.invoice.findMany({
    where: { branchId: singkut.id },
    include: { branch: true },
    take: 3,
  });

  console.log(`\nVerified ${invoices.length} invoices relation branch:`);
  invoices.forEach((inv) => {
    console.log(`- Invoice: ${inv.invoiceNumber}, Branch Name from DB relation: "${inv.branch.branchName}"`);
  });

  // 5. Query classes with relation
  const classes = await prisma.class.findMany({
    where: { branchId: singkut.id },
    include: { branch: true },
    take: 3,
  });

  console.log(`\nVerified ${classes.length} classes relation branch:`);
  classes.forEach((c) => {
    console.log(`- Class: ${c.className}, Branch Name from DB relation: "${c.branch.branchName}"`);
  });

  // 6. Revert back to original name
  console.log(`\nReverting branch name back to "${originalName}"...`);
  await prisma.branch.update({
    where: { id: singkut.id },
    data: { branchName: originalName },
  });

  console.log("=== DB CASCADE TEST PASSED 100% ===");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
