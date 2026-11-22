const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const branches = await prisma.branch.findMany();
  for (const b of branches) {
    const trimmedName = b.branchName.trim();
    const trimmedAddress = b.address.trim();
    if (trimmedName !== b.branchName || trimmedAddress !== b.address) {
      console.log(`Fixing branch ${b.id}: "${b.branchName}" -> "${trimmedName}"`);
      await prisma.branch.update({
        where: { id: b.id },
        data: {
          branchName: trimmedName,
          address: trimmedAddress,
        }
      });
    }
  }

  // Also check tutorAttendanceQr table
  const qrs = await prisma.tutorAttendanceQr.findMany();
  for (const q of qrs) {
    if (q.branchName && q.branchName.trim() !== q.branchName) {
      console.log(`Fixing QR ${q.id}: "${q.branchName}" -> "${q.branchName.trim()}"`);
      await prisma.tutorAttendanceQr.update({
        where: { id: q.id },
        data: { branchName: q.branchName.trim() }
      });
    }
  }

  // Also check User table for any branchName or ttl with trailing spaces
  const users = await prisma.user.findMany();
  for (const u of users) {
    if (u.address && u.address.trim() !== u.address) {
      await prisma.user.update({
        where: { id: u.id },
        data: { address: u.address.trim() }
      });
    }
  }

  console.log('Database branch and user strings cleaned successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
