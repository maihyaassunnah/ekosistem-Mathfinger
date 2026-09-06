const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `;
  console.log("TABLES IN DATABASE:");
  console.table(result);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
