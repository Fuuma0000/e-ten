import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { convertUsersData, inputUsersJson } from "./json-convert";
const router: Router = Router();
const prisma = new PrismaClient();

// イベント一覧の取得
router.get("/", async (req: Request, res: Response) => {
  const events = await prisma.events.findMany();
  res.json(events);
});

// 作品一覧の取得
router.get("/:id/works", async (req: Request, res: Response) => {
  // worksからevents_idが一致するものを検索
  // works_dataのidとworksのlatest_reviewed_idが一致 -> 取得
  const works = await prisma.works.findMany({
    where: { events_id: Number(req.params.id) },
    include: {
      events: {
        select: {
          id: true,
          name: true,
          description: true,
          icon_url: true,
          start_at: true,
          end_at: true,
        },
      },
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
        },
      },
    },
  });

  // TODO: JSONの形式を整形する

  res.json(works);
});

// イベント参加学生の取得
router.get("/:id/students", async (req: Request, res: Response) => {
  // events.idを指している
  const { id } = req.params;

  // TODO:events.idに対応するユーザだけ拾ってくるように修正する
  // events.id -> events_users_roles.users_id -> users取得?
  const events_users = await prisma.event_users_roles.findMany({
    where: { events_id: parseInt(id) },
    select: {
      users: {
        select: {
          id: true,
          username: true,
          enrollment_year: true,
          graduation_year: true,
          users_jobs: {
            select: {
              jobs: {
                select: {
                  name: true,
                },
              },
            },
          },
          icon_url: true,
        },
      }
    }
  });

  // const users = await prisma.users.findMany({
  //   select: {
  //     id: true,
  //     username: true,
  //     enrollment_year: true,
  //     graduation_year: true,
  //     users_jobs: {
  //       select: {
  //         jobs: {
  //           select: {
  //             name: true,
  //           },
  //         },
  //       },
  //     },
  //     icon_url: true,
  //   },
  // });

  // const convertedUsersData = convertUsersData(users as inputUsersJson[]);
  // res.json(convertedUsersData);

  res.json(events_users);
});

export { router };