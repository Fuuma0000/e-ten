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

// TODO: 作品の更新

// TODO: 作品の削除

export { router };
