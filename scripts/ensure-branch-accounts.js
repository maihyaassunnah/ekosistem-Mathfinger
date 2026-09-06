const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Menyelaraskan akun cabang & asisten di database PostgreSQL...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  // 1. Get branches
  const singkut = await prisma.branch.findFirst({
    where: { branchName: { contains: "Singkut", mode: "insensitive" } },
  });
  const bangko = await prisma.branch.findFirst({
    where: { branchName: { contains: "Bangko", mode: "insensitive" } },
  });

  if (!singkut || !bangko) {
    throw new Error("Cabang Singkut atau Bangko tidak ditemukan di database!");
  }

  const accounts = [
    {
      fullName: "Wahyudin Hafiz, S.Pd",
      email: "wahyudinhafiz123@gmail.com",
      role: "SUPER_ADMIN",
      branchId: null,
      phone: "0853-8478-0910",
    },
    {
      fullName: "Febrianti Dewi, S.Pd",
      email: "febriantidewi043@gmail.com",
      role: "BRANCH_ADMIN",
      branchId: singkut.id,
      phone: "0812-7949-8907",
    },
    {
      fullName: "Admin Singkut",
      email: "singkut.mathfingers@gmail.com",
      role: "BRANCH_ADMIN",
      branchId: singkut.id,
      phone: "0812-7949-8907",
    },
    {
      fullName: "Dewi Safitri, S.H",
      email: "dwsafitri97@gmail.com",
      role: "BRANCH_ADMIN",
      branchId: bangko.id,
      phone: "0813-7972-0841",
    },
    {
      fullName: "Admin Bangko",
      email: "bangko.mathfingers@gmail.com",
      role: "BRANCH_ADMIN",
      branchId: bangko.id,
      phone: "0813-7972-0841",
    },
    {
      fullName: "Asisten Singkut",
      email: "asisten.singkut@mathfingers.com",
      role: "BRANCH_ASSISTANT",
      branchId: singkut.id,
      phone: "0812-7949-8908",
    },
    {
      fullName: "Asisten Bangko",
      email: "asisten.bangko@mathfingers.com",
      role: "BRANCH_ASSISTANT",
      branchId: bangko.id,
      phone: "0813-7972-0842",
    },
    {
      fullName: "Tutor Singkut",
      email: "tutor1.mathfingers@gmail.com",
      role: "TUTOR",
      branchId: singkut.id,
      phone: "0812-7949-8907",
    },
  ];

  for (const acc of accounts) {
    await prisma.user.upsert({
      where: { email: acc.email.toLowerCase().trim() },
      update: {
        fullName: acc.fullName,
        role: acc.role,
        branchId: acc.branchId,
        status: "ACTIVE",
        passwordHash: hashedPassword,
        phone: acc.phone,
      },
      create: {
        fullName: acc.fullName,
        email: acc.email.toLowerCase().trim(),
        role: acc.role,
        branchId: acc.branchId,
        status: "ACTIVE",
        passwordHash: hashedPassword,
        phone: acc.phone,
      },
    });
    console.log(`✅ Akun siap: ${acc.fullName} (${acc.email}) -> Role: ${acc.role}`);
  }

  console.log("\n🎉 Seluruh akun berhasil diselaraskan dengan kata sandi: password123");
}

main()
  .catch((e) => {
    console.error("❌ Gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
