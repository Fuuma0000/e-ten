import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // コース情報
  // ジャンル
  // 技術
  // 権限

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

  // テストユーザー: 管理者
  // テストユーザー: 展示者
  // テストユーザー: 閲覧者
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
