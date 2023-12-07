import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
const router: Router = Router();
const prisma = new PrismaClient();

// 作品詳細の取得
router.get("/:id", async (req: Request, res: Response) => {
  const work = await prisma.works.findUnique({
    where: { id: Number(req.params.id) },
    select: {
      latest_reviewed_id: true,
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
                  // TODO: 役割名がないかも？
                  // role: true,
                  event_users_roles: {
                    select: {
                      roles: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  // TODO: JSONの形式を整形する

  res.json(work);
});

// TODO: 作品の新規作成

// TODO: 作品の更新

// TODO: 作品の削除

export { router };
