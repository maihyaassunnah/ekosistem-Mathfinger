const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Checking database connection and contents...");
  const branches = await prisma.branch.findMany({
    include: {
      _count: {
        select: { students: true, users: true, classes: true },
      },
    },
    orderBy: { branchName: "asc" },
  });

  console.log("\n=== BRANCHES IN POSTGRESQL ===");
  console.log(
    branches.map((b) => ({
      id: b.id,
      code: b.branchCode,
      name: b.branchName,
      status: b.status,
      studentsCount: b._count.students,
      classesCount: b._count.classes,
      usersCount: b._count.users,
    }))
  );

  const totalStudents = await prisma.student.count();
  console.log(`\nTotal students in DB: ${totalStudents}`);

  const studentsByBranch = await prisma.student.groupBy({
    by: ["branchId"],
    _count: { id: true },
  });
  console.log("\nStudents grouped by branchId:", studentsByBranch);

  const sampleStudents = await prisma.student.findMany({
    select: {
      id: true,
      studentCode: true,
      studentName: true,
      branch: { select: { branchName: true, branchCode: true } },
      className: true,
      status: true,
    },
    take: 10,
  });
  console.log("\n=== FIRST 10 STUDENTS IN DB ===");
  console.log(sampleStudents);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
