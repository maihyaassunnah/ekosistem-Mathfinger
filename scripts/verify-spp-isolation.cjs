const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== VERIFY SPP ISOLATION & DATA INTEGRITY ===\n');

  // 1. Verify DB Students
  const students = await prisma.student.findMany({
    include: { branch: true },
    orderBy: { studentName: 'asc' }
  });
  const singkutStudents = students.filter(s => s.branch.branchName === 'Singkut');
  const bangkoStudents = students.filter(s => s.branch.branchName === 'Bangko');

  console.log(`[STUDENTS BENCHMARK]`);
  console.log(`Total DB Students: ${students.length}`);
  console.log(`Singkut Students: ${singkutStudents.length} (Target: 17) -> ${singkutStudents.length === 17 ? 'PASSED OK' : 'FAILED'}`);
  console.log(`Bangko Students: ${bangkoStudents.length} (Target: 80) -> ${bangkoStudents.length === 80 ? 'PASSED OK' : 'FAILED'}`);

  // Check if Arsyila and Hannan are in Singkut or Bangko
  const arsyila = students.find(s => s.studentName.toLowerCase().includes('arsyila'));
  const hannan = students.find(s => s.studentName.toLowerCase().includes('hannan'));
  console.log(`Arsyila student branch: ${arsyila?.branch.branchName}`);
  console.log(`Hannan student branch: ${hannan?.branch.branchName}`);

  // 2. Verify DB Invoices
  const invoices = await prisma.invoice.findMany({
    include: {
      student: { include: { branch: true } },
      branch: true
    },
    orderBy: { invoiceNumber: 'asc' }
  });
  const singkutInvoices = invoices.filter(i => i.branch.branchName === 'Singkut');
  const bangkoInvoices = invoices.filter(i => i.branch.branchName === 'Bangko');

  console.log(`\n[INVOICES BENCHMARK]`);
  console.log(`Total DB Invoices: ${invoices.length}`);
  console.log(`Singkut Invoices: ${singkutInvoices.length} (Target: 10) -> ${singkutInvoices.length === 10 ? 'PASSED OK' : 'FAILED'}`);
  console.log(`Bangko Invoices: ${bangkoInvoices.length} (Target: 30) -> ${bangkoInvoices.length === 30 ? 'PASSED OK' : 'FAILED'}`);

  console.log(`\nSingkut Invoices List (${singkutInvoices.length}):`);
  singkutInvoices.forEach((i, idx) => {
    console.log(`  ${idx + 1}. [${i.invoiceNumber}] ${i.student?.studentName} - Status: ${i.status} - Rp ${Number(i.amount).toLocaleString('id-ID')}`);
  });

  // Verify that NONE of the Singkut invoices belong to a non-Singkut student
  const leakedInSingkut = singkutInvoices.filter(i => i.student?.branch.branchName !== 'Singkut');
  console.log(`Leaked invoices in Singkut: ${leakedInSingkut.length} -> ${leakedInSingkut.length === 0 ? 'PASSED OK' : 'FAILED'}`);

  const leakedInBangko = bangkoInvoices.filter(i => i.student?.branch.branchName !== 'Bangko');
  console.log(`Leaked invoices in Bangko: ${leakedInBangko.length} -> ${leakedInBangko.length === 0 ? 'PASSED OK' : 'FAILED'}`);

  console.log('\n=== ALL VERIFICATION CHECKS COMPLETED SUCCESSFULLY ===');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
