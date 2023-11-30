import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // コース情報
  const courses = await prisma.courses.createMany({
    data: [
      { name: "IT" },
      { name: "Web" },
      { name: "経営情報" },
      { name: "国際エンジニア" },
    ],
  });
  // ジャンル
  const genres = await prisma.genres.createMany({
    data: [
      { name: "Webアプリケーション" },
      { name: "モバイルアプリケーション" },
      { name: "IoT" },
    ],
  });
  // 技術
  const technologies = await prisma.technologies.createMany({
    data: [
      { name: "HTML" },
      { name: "CSS" },
      { name: "JavaScript" },
      { name: "TypeScript" },
    ],
  });
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
