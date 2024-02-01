import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../auth";
import { convertWorkData } from "./json-convert";

const router: Router = Router();
const prisma = new PrismaClient();

// 作品詳細の取得
router.get("/:id", authenticate, async (req: Request, res: Response) => {
  const users_id = Number(req.user);

  const work = await prisma.works.findUnique({
    where: { id: Number(req.params.id) },
    select: {
      id: true,
      works_data_works_latest_reviewed_idToworks_data: {
        select: {
          works_id: true,
          name: true,
          catch_copy: true,
          description: true,
          movie_url: true,
          works_url: true,
          works_data_genres: {
            select: {
              genres: {
                select: {
                  name: true,
                },
              },
            },
          },
          works_data_technologies: {
            select: {
              technologies: {
                select: {
                  name: true,
                },
              },
            },
          },
          works_data_images: {
            select: {
              url: true,
            },
          },
          works_data_users: {
            select: {
              users: {
                select: {
                  id: true,
                  username: true,
                  works_data_users: {
                    where: { works_data_id: Number(req.params.id) },
                    select: {
                      role_explanation: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      bookmarks: {
        where: { users_id: users_id, works_id: Number(req.params.id) },
      },
    },
  });

  // データがなかったら
  if (work === null) {
    res.status(404).json({ message: "Not Found" });
    return;
  }

  const convertedWorkData = convertWorkData(work);
  res.json(convertedWorkData);
});

// TODO: 作品の新規作成
router.post("/", authenticate, async (req: Request, res: Response) => {
  // クエリパラメータ events_id のデフォルト値を設定
  // イベントに紐づいていない作品を作成する場合は、events_id=0 とする
  const eventsIdQueryParam = (req.query.events_id as string) || "0";

  const eventId = parseInt(eventsIdQueryParam, 10);

  //evnttIdが存在するか確認
  const event = await prisma.events.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    return res.status(404).json({ error: "イベントが存在しません" });
  }

  const {
    name,
    genres_id,
    technologies_id,
    catch_copy,
    description,
    images,
    movie_url,
    works_url,
    system_diagram_url,
    detail,
    users,
  } = req.body;

  // バリデーション: name と catch_copy が必須
  if (!name || !catch_copy) {
    return res
      .status(400)
      .json({ error: "名前または、キャッチコピーが必要です" });
  }
  try {
    const transactionResult = await prisma.$transaction(async (prisma) => {
      const createdWork = await prisma.works.create({
        data: {
          events_id: eventId,
        },
      });

      const createdWorksData = await prisma.works_data.create({
        data: {
          works_id: createdWork.id,
          name,
          catch_copy: catch_copy,
          description,
          works_url: works_url,
          movie_url: movie_url,
          system_diagram_url: system_diagram_url,
          detail: detail,
        },
      });

      // Create Genres
      await Promise.all(
        genres_id.map(async (genreId: number) => {
          await prisma.works_data_genres.create({
            data: {
              works_data_id: createdWorksData.id,
              genres_id: genreId,
            },
          });
        })
      );

      // Create Technologies
      await Promise.all(
        technologies_id.map(async (techId: number) => {
          await prisma.works_data_technologies.create({
            data: {
              works_data_id: createdWorksData.id,
              technologies_id: techId,
            },
          });
        })
      );

      // Create Images
      await Promise.all(
        images.map(async (imageUrl: string, index: number) => {
          await prisma.works_data_images.create({
            data: {
              works_data_id: createdWorksData.id,
              url: imageUrl,
              order: index + 1,
            },
          });
        })
      );

      // Create Users
      await Promise.all(
        users.map(async (user: { user_id: number; role: string }) => {
          await prisma.works_data_users.create({
            data: {
              works_data_id: createdWorksData.id,
              users_id: user.user_id,
              role_explanation: user.role,
            },
          });
        })
      );

      return { createdWork, createdWorksData };
    });

    res.status(201).json(transactionResult);
  } catch (error) {
    console.error("作品の投稿中にエラーが起きました:", error);
    res.status(500).json({ error: "サーバーエラーが発生しました" });
  }
});

// TODO: 作品の更新

// TODO: 作品の削除

export { router };
