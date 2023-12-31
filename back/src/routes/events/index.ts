import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { convertUsersData, convertWorksData } from "./json-convert";
import { authenticate } from "../auth";
const router: Router = Router();
const prisma = new PrismaClient();

// イベント一覧の取得
router.get("/", authenticate, async (req: Request, res: Response) => {
  const events = await prisma.events.findMany();
  res.json(events);
});

// 作品一覧の取得
router.get("/:id/works", authenticate, async (req: Request, res: Response) => {
  // worksからevents_idが一致するものを検索
  // works_dataのidとworksのlatest_reviewed_idが一致 -> 取得
  const works = await prisma.works.findFirst({
    where: { events_id: Number(req.params.id) },
    select: {
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
          id: true,
          name: true,
          catch_copy: true,
          works_data_images: {
            // orderが一番若いのもを取得
            orderBy: {
              order: "asc",
            },
            select: {
              url: true,
            },
            take: 1,
          },
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

  const returnWorksJson = convertWorksData(works);

  // res.json(works);
  res.json(returnWorksJson);
});

// イベント参加学生の取得
router.get("/:id/students", authenticate, async (req: Request, res: Response) => {
  const { id } = req.params;

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
      },
    },
  });

  const convertedUsersData = convertUsersData(events_users);
  res.json(convertedUsersData);
});

export { router };
