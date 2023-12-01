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
}


// 混ぜると分からなくなるので関数切っておきます
// レコードチェックしてもらってから複数個にする
async function insertProfileSeedData() {
  // ユーザ情報
  const registedUser = await prisma.users.create({
    data: {
      email: "example@example.com",
      password: "example",
      username: "testuser",
      courses_id: 1,
      enrollment_year: 2022,
      graduation_year: 2026,
      is_job_hunt_completed: false,
      self_introduction: "ここに自己紹介のテキストが入ります",
      icon_url: "https://cdn2.thecatapi.com/images/c5b.jpg",
    },
  });


  // 志望職種情報
  const registedJob = await prisma.jobs.create({
    data: {
      name: "ここに志望職種の値が入ります"
    },
  });

  // 志望職種情報とユーザ情報の中間テーブル
  const registedUserId = registedUser.id;
  const registedJobId = registedJob.id;

  await prisma.users_jobs.create({
    data: {
      users_id: registedUserId,
      jobs_id: registedJobId,
    }
  });

  // コース情報
  await prisma.courses.create({
    data: {
      name: "ここにコースの名前が入ります"
    },
  });

  //  worksテーブル
  const registedWork = await prisma.works.create({
    data: {
      events_id: 1,
      latest_reviewed_id: null,
    }
  });
  
  // 作品情報
  const registedWorkId = registedWork.id;
  const registedWorkData = await prisma.works_data.create({
    data: {
      works_id: registedWorkId,
      name: "ここに作品名が入ります",
      catch_copy: "ここにキャッチコピーが入ります",
      description: "ここに作品概要が入ります",
      works_url: "ここに作品のURLが入ります",
      movie_url: "ここに動画URLが入ります",
      system_diagram_url: "ここにシステム構成図が入ります",
      detail: "ここに作品詳細が入ります"
    }
  });

  // nullで作ってるから参照出来るようにupdateする
  const registedWorkDataId = registedWorkData.id;
  const registedWorkDataWorkId = registedWorkData.works_id;
  await prisma.works.update({
    where: { id: registedWorkDataWorkId },
    data: {
      latest_reviewed_id: registedWorkDataId
    }
  })
  

  // 作品情報とユーザ情報の中間テーブル
  await prisma.works_data_users.create({
    data: {
      works_data_id: registedWorkDataId,
      users_id: registedUserId,
      role_explanation: "ここに担当箇所が入ります"
    }
  });
  


  //  ジャンル情報
  const registedGenre = await prisma.genres.create({
    data: {
      name: "ここにジャンル名が入ります"
    }
  });

  // 作品情報とジャンル情報の中間テーブル
  const registedGenreId = registedGenre.id;
  await prisma.works_data_genres.create({
    data: {
      works_data_id: registedWorkDataId,
      genres_id: registedGenreId,
    }
  })

  // 技術情報
  const registedTechnology = await prisma.technologies.create({
    data: {
      name: "ここに技術名が入ります"
    }
  });

  // 作品情報と技術情報の中間テーブル
  const registedTechnologyId = registedTechnology.id;
  await prisma.works_data_technologies.create({
    data: {
      works_data_id: registedWorkDataId,
      technologies_id: registedTechnologyId
    }
  });


  // 作品画像情報
  await prisma.works_data_images.create({
    data: {
      works_data_id: registedWorkDataId,
      url: "ここに画像が詰まっているS3のアドレスが入ります",
      order: 1
    }
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

  //  切った関数の実行
  insertProfileSeedData()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });