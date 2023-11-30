import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // コース情報
  // ジャンル
  // 技術
  // 権限
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
