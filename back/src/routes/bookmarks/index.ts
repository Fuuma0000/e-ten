import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const router: Router = Router();
const prisma = new PrismaClient();

// ブックマークの取得
router.get("/", async (req: Request, res: Response) => {
  // TODO: ユーザーIDを取得する
  const users_id = 1;

  const bookmark = await prisma.bookmarks.findMany({
    where: { users_id: users_id },
    select: {
      works_id: true,
      works: {
        select: {
          works_data_works_latest_reviewed_idToworks_data: {
            select: {
              name: true,
              catch_copy: true,
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
                orderBy: {
                  order: "asc",
                },
                take: 1,
                select: {
                  url: true,
                },
              },
            },
          },
        },
      },
    },
  });

  //   TODO: jsonを整形する

  return res.json(bookmark);
});

export { router };
