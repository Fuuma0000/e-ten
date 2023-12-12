import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { convertBookmarkData } from "./json-convert";

const router: Router = Router();
const prisma = new PrismaClient();

// ブックマークの取得
router.get("/", async (req: Request, res: Response) => {
  // TODO: ユーザーIDを取得する
  const users_id = 1;

  const bookmark = await prisma.bookmarks.findMany({
    where: { users_id: users_id },
    select: {
      id: true,
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

  const convertedBookmarkData = convertBookmarkData(bookmark);

  return res.json(convertedBookmarkData);
});

// ブックマークの追加・削除
router.post("/:id", async (req: Request, res: Response) => {
  // TODO: ユーザーIDを取得する
  const users_id = 1;
  const works_id = Number(req.params.id);

  const bookmark = await prisma.bookmarks.findFirst({
    where: {
      users_id: users_id,
      works_id: works_id,
    },
  });

  console.log(bookmark);

  // すでにブックマークされていたら削除
  if (bookmark !== null) {
    await prisma.bookmarks.delete({
      where: {
        id: bookmark.id,
      },
    });
    return res.status(200).send("deleted");
  }

  // なかったら追加
  const test = await prisma.bookmarks.create({
    data: {
      users_id: users_id,
      works_id: works_id,
    },
  });

  return res.status(201).send("created");
});

export { router };
