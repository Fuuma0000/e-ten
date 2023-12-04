import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 前期+E展情報
  const e_ten_2023_summer = await prisma.events.upsert({
    where: { id: 1 },
    create: {
      name: "2023年度前期 +E展",
      // TODO: 画像データのパス
      icon_url: "",
      description:
        "世の中を便利にするってなんだろう?」 「役に立つってなんだろう?」 ECCコンピュータ専門学校の学生達が自分なりに向き合って考えた、 世の中を良くするアイデアをお届けします。",
    },
    update: {},
  });

  const work_01 = await prisma.works.upsert({
    where: { id: 1 },
    create: {
      events_id: 1,
      latest_reviewed_id: null,
    },
    update: {},
  });

  // TODO: reset db
  const work_data_01 = await prisma.works_data.upsert({
    where: { id: 1 },
    create: {
      works_id: 1,
      name: "テスト作品01",
      catch_copy: "テスト作品01のキャッチコピー",
      description: "テスト作品01の説明",
      works_url: "https://example.com",
      movie_url: "",
      system_diagram_url: "",
      detail: "テスト作品01の概要",
      works_data_genres: {
        createMany: {
          data: [{ genres_id: 1 }, { genres_id: 2 }],
        },
      },
      works_data_technologies: {
        createMany: {
          data: [{ technologies_id: 1 }, { technologies_id: 2 }],
        },
      },
    },
    include: {
      works_data_genres: true,
      works_data_technologies: true,
    },
    update: {},
  });
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
