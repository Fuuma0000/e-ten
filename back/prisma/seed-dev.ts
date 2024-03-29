import { PrismaClient } from "@prisma/client";
import { ParseResult, parse } from "papaparse";
import { promises as fsPromises } from "fs";
const prisma = new PrismaClient();

interface User {
  username: string;
  roles_id: number;
  courses_id: number;
  enrollment_year: number;
  graduation_year: number;
  is_job_hunt_completed: boolean;
  events_id: number;
}

interface Work {
  name: string;
  genre: number;
  catch_copy: string;
  description: string;
  technology: string;
  tool: string;
  works_url: string;
  system_diagram_url: string;
  user: string;
  role: string;
}

// CSVファイルをパースする関数
const fileParser = async <T>(filePath: string): Promise<T[]> => {
  try {
    const fileContent = await fsPromises.readFile(filePath, "utf8");

    const results: ParseResult<T> = parse(fileContent, {
      header: true,
      dynamicTyping: true,
    });

    if (results.errors && results.errors.length > 0) {
      throw new Error(
        `CSV parsing errors: ${results.errors
          .map((error) => error.message)
          .join(", ")}`
      );
    }

    return results?.data || [];
  } catch (error: any) {
    throw new Error(`Failed to parse CSV file: ${error.message}`);
  }
};

async function main() {
  // 前期+E展情報
  const e_ten_2023_summer = await prisma.events.create({
    data: {
      name: "2023年度前期 +E展",
      // TODO: 画像データのパス
      icon_url: "",
      description:
        "世の中を便利にするってなんだろう?」 「役に立つってなんだろう?」 ECCコンピュータ専門学校の学生達が自分なりに向き合って考えた、 世の中を良くするアイデアをお届けします。",
    },
  });

  // 出展ユーザー
  const user_data: User[] = await fileParser<User>(
    "prisma/seed-data/user_data_2024.csv"
  );

  for (let i = 0; i < user_data.length; i++) {
    await prisma.users.create({
      data: {
        username: user_data[i].username,
        email: "example" + i + "@example.com",
        password: "password",
        salt: "salt",
        courses_id: user_data[i].courses_id,
        enrollment_year: user_data[i].enrollment_year,
        graduation_year: user_data[i].graduation_year,
        is_job_hunt_completed: user_data[i].is_job_hunt_completed,
        icon_url: "",
        event_users_roles: {
          create: {
            events_id: user_data[i].events_id,
            roles_id: user_data[i].roles_id,
          },
        },
      },
    });
  }

  // 作品情報
  const work_data: Work[] = await fileParser<Work>(
    "prisma/seed-data/works_data_2024.csv"
  );

  // 作品をwork_dataの数だけ登録
  for (let i = 0; i < work_data.length; i++) {
    await prisma.works.create({
      data: {
        events_id: 1,
        latest_reviewed_id: null,
      },
    });
  }

  // 作品情報をworks_dataに登録
  for (let i = 0; i < work_data.length; i++) {
    const technologies: string[] = work_data[i].technology.split(",");
    const tools: string[] = work_data[i].tool.split(",");

    const user: string[] =
      work_data[i] != null ? work_data[i].user.split(",") : [];
    const role: string[] = work_data[i].role.split(",");

    const work = await prisma.works_data.create({
      data: {
        works_id: i + 1,
        name: work_data[i].name,
        catch_copy: work_data[i].catch_copy,
        description: work_data[i].description,
        works_url: work_data[i].works_url,
        movie_url: "",
        system_diagram_url: work_data[i].system_diagram_url,
      },
    });

    // 作品とユーザーの中間テーブル
    for (let j = 0; j < user.length; j++) {
      if (user[j] != " ") {
        // userテーブルからuser[j]のidを取得
        const currentUser = await prisma.users.findFirst({
          where: { username: user[j].trim() },
        });
        // userがなければエラー
        if (!currentUser) {
          throw new Error("user not found:" + user[j]);
        }
        await prisma.works_data_users.create({
          data: {
            works_data_id: i + 1,
            users_id: currentUser.id,
            role_explanation: role[j] ? role[j].trim() : "",
          },
        });
      }
    }

    // 作品とジャンルの中間テーブル
    await prisma.works_data_genres.create({
      data: {
        works_data_id: i + 1,
        genres_id: work_data[i].genre,
      },
    });

    // 作品と技術の中間テーブル
    // technologies[j]がtechnologiesテーブルにあったらworks_data_technologiesに登録
    // なかったらtechnologiesテーブルに登録してからworks_data_technologiesに登録
    for (let j = 0; j < technologies.length; j++) {
      if (technologies[j] != " ") {
        const technology = await prisma.technologies.findFirst({
          where: { name: technologies[j].trim() },
        });
        if (technology) {
          await prisma.works_data_technologies.create({
            data: {
              works_data_id: i + 1,
              technologies_id: technology.id,
            },
          });
        } else {
          const registedTechnology = await prisma.technologies.create({
            data: {
              name: technologies[j].trim(),
            },
          });
          await prisma.works_data_technologies.create({
            data: {
              works_data_id: i + 1,
              technologies_id: registedTechnology.id,
            },
          });
        }
      }
    }

    // 作品とツールの中間テーブル
    for (let j = 0; j < tools.length; j++) {
      if (tools[j] != " ") {
        const tool = await prisma.tools.findFirst({
          where: { name: tools[j].trim() },
        });
        if (tool) {
          await prisma.works_data_tools.create({
            data: {
              works_data_id: i + 1,
              tools_id: tool.id,
            },
          });
        } else {
          const registedTool = await prisma.tools.create({
            data: {
              name: tools[j].trim(),
            },
          });
          await prisma.works_data_tools.create({
            data: {
              works_data_id: i + 1,
              tools_id: registedTool.id,
            },
          });
        }
      }
    }

    // TODO:works_data_images
  }

  // 校閲後の作品データ
  // 作品の数アップデート
  for (let i = 0; i < work_data.length; i++) {
    await prisma.works.update({
      where: { id: i + 1 },
      data: {
        latest_reviewed_id: i + 1,
      },
    });
  }

  // テスト用ユーザー
  const passwordTestList = [
    "d71c8601cef40e28aad6d15a88cf7311dc95cc96d4f20d989a90d1a5202789b07f75eff7ccb95c5400e2e4ca3b46c17f17a3646659b51689374b42a039a97528",
    "0d5ca4e7af038a8b08bec3d0e820f5e5a5b6745750193ee4954bcf544b996767062a288afe78635526139ebc531d56a5c2e88b1be123b919677d9b98c332dd0c",
    "2ed1f3f24da6c275ed2ef8ccc4eb0eaae9a70f3c3a3603f9f690071290f210874e80204029eee0bf117a6ea63c0db8d26d51166414c6a9e5a14ea6de81e1c8a1",
    "e84063032b764a8cc5fc80e0c86f2fd20440c082352874d33287b42575c6943628f8d7a28616e64ab561ae5ed761461d3c1a81ea2392f787d05432cbc32204ba",
  ];
  for (let i = 0; i < 3; i++) {
    const registedUser = await prisma.users.create({
      data: {
        email: `example${i}@ex.com`,
        password: passwordTestList[i],
        salt: `salt${i}`,
        username: "testuser",
        courses_id: 1,
        enrollment_year: 0,
        graduation_year: 0,
        is_job_hunt_completed: false,
        self_introduction: "",
        icon_url: "",
      },
    });
  }
}

// 混ぜると分からなくなるので関数切っておきます
// レコードチェックしてもらってから複数個にする
async function insertProfileSeedData() {
  // ユーザ情報
  const passwordTestList = [
    "d71c8601cef40e28aad6d15a88cf7311dc95cc96d4f20d989a90d1a5202789b07f75eff7ccb95c5400e2e4ca3b46c17f17a3646659b51689374b42a039a97528",
    "0d5ca4e7af038a8b08bec3d0e820f5e5a5b6745750193ee4954bcf544b996767062a288afe78635526139ebc531d56a5c2e88b1be123b919677d9b98c332dd0c",
    "2ed1f3f24da6c275ed2ef8ccc4eb0eaae9a70f3c3a3603f9f690071290f210874e80204029eee0bf117a6ea63c0db8d26d51166414c6a9e5a14ea6de81e1c8a1",
    "e84063032b764a8cc5fc80e0c86f2fd20440c082352874d33287b42575c6943628f8d7a28616e64ab561ae5ed761461d3c1a81ea2392f787d05432cbc32204ba",
  ];
  // ユーザ情報
  for (let i = 0; i < 3; i++) {
    const registedUser = await prisma.users.create({
      data: {
        email: `example${i}@example.com`,
        password: passwordTestList[i],
        salt: `salt${i}`,
        username: "testuser",
        courses_id: 1,
        enrollment_year: 2022,
        graduation_year: 2026,
        is_job_hunt_completed: false,
        self_introduction: "ここに自己紹介のテキストが入ります",
        icon_url: "https://cdn2.thecatapi.com/images/c5b.jpg",
      },
    });

    // 型推論のために代入してる
    let registedUserId = registedUser.id;

    // 権限テーブル.中間テーブルのために追加しておく
    const registedRoles = await prisma.roles.create({
      data: {
        name: `${i}.ここに権限のテキストが入ります`,
      },
    });

    const registedRolesId = registedRoles.id;

    // イベントとユーザの中間テーブル
    // events_idはハードコーディングしています
    // マーメイドとnotionはusers_idになってるけどschemaはuser_idになってるがどちらに統一する？
    const registedEventUserRoles = await prisma.event_users_roles.create({
      data: {
        events_id: 1,
        user_id: registedUserId,
        roles_id: registedRolesId,
      },
    });

    // 追加されたやつのデータ
    for (let i = 0; i < 3; i++) {
      const registedUserUrl = await prisma.users_urls.create({
        data: {
          users_id: registedUserId,
          url_name: `${i}.Qiita等のSNSの名前が入ります`,
          url: `${i}.ここにユーザに結びつくQiita等のURLが入ります`,
        },
      });
    }

    // 志望職種情報
    for (let i = 0; i < 3; i++) {
      const registedJob = await prisma.jobs.create({
        data: {
          name: "ここに志望職種の値が入ります",
        },
      });

      // 志望職種情報とユーザ情報の中間テーブル
      const registedJobId = registedJob.id;
      registedUserId = registedUser.id;
      await prisma.users_jobs.create({
        data: {
          users_id: registedUserId,
          jobs_id: registedJobId,
        },
      });
    }

    // コース情報
    await prisma.courses.create({
      data: {
        name: "ここにコースの名前が入ります",
      },
    });

    let registedWorkDataId: number;
    for (let i = 0; i < 3; i++) {
      //  worksテーブル
      const registedWork = await prisma.works.create({
        data: {
          events_id: 1,
          latest_reviewed_id: null,
        },
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
          detail: "ここに作品詳細が入ります",
        },
      });

      // nullで作ってるから参照出来るようにupdateする
      registedWorkDataId = registedWorkData.id;
      const registedWorkDataWorkId = registedWorkData.works_id;
      await prisma.works.update({
        where: { id: registedWorkDataWorkId },
        data: {
          latest_reviewed_id: registedWorkDataId,
        },
      });

      // 作品情報とユーザ情報の中間テーブル
      await prisma.works_data_users.create({
        data: {
          works_data_id: registedWorkDataId,
          users_id: registedUserId,
          role_explanation: "ここに担当箇所が入ります",
        },
      });

      for (let i = 0; i < 3; i++) {
        //  ジャンル情報
        const registedGenre = await prisma.genres.create({
          data: {
            name: "ここにジャンル名が入ります",
          },
        });

        // 作品情報とジャンル情報の中間テーブル
        const registedGenreId = registedGenre.id;
        await prisma.works_data_genres.create({
          data: {
            works_data_id: registedWorkDataId,
            genres_id: registedGenreId,
          },
        });

        // 技術情報
        const registedTechnology = await prisma.technologies.create({
          data: {
            name: `${i}.ここに技術名が入ります`,
          },
        });

        // 作品情報と技術情報の中間テーブル
        const registedTechnologyId = registedTechnology.id;
        await prisma.works_data_technologies.create({
          data: {
            works_data_id: registedWorkDataId,
            technologies_id: registedTechnologyId,
          },
        });

        // 作品画像情報
        await prisma.works_data_images.create({
          data: {
            works_data_id: registedWorkDataId,
            url: `${i}.ここに画像が詰まっているS3のアドレスが入ります`,
            order: 1,
          },
        });
      }
    }
  }
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
// insertProfileSeedData()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
