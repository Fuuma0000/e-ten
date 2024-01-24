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

// 検索用：技術一覧の取得
router.get("/technologies", async (req: Request, res: Response) => {
  const technologies = await prisma.technologies.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  res.json(technologies);
});

// 検索用：志望職種一覧の取得
router.get("/jobs", async (req: Request, res: Response) => {
  const jobs = await prisma.jobs.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  res.json(jobs);
});

// イベントの詳細情報の取得
router.get("/:id?", async (req: Request, res: Response) => {
  console.log(req.params);
  const event = await prisma.events.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  res.json(event);
});

// 作品一覧の取得
router.get("/:id?/works", authenticate, async (req: Request, res: Response) => {
  // worksからevents_idが一致するものを検索
  // works_dataのidとworksのlatest_reviewed_idが一致 -> 取得
  const works = await prisma.works.findMany({
    where: { events_id: Number(req.params.id) },
    select: {
      works_data_works_latest_reviewed_idToworks_data: {
        select: {
          id: true,
          name: true,
          catch_copy: true,
          works_data_images: {
            // orderが一番若いものを取得
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
                  id: true,
                  name: true,
                },
              },
            },
          },
          works_data_technologies: {
            select: {
              technologies: {
                select: {
                  id: true,
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
router.get(
  "/:id?/students",
  authenticate,
  async (req: Request, res: Response) => {
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
  }
);

router.post("/events/:id/works", async (req, res) => {
  const eventId = parseInt(req.params.id, 10);

  // eventIdがない場合はエラー
  if (!eventId) {
    return res.status(400).json({ error: "イベントIDが必要です" });
  }

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
    users,
  } = req.body;

  // バリデーション: name と catch_copy が必須
  if (!name || !catch_copy) {
    return res
      .status(400)
      .json({ error: "名前または、キャッチコピーが必要です" });
  }

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

  try {
    res.status(201).json(transactionResult);
  } catch (error) {
    console.error("作品の投稿中にエラーが起きました:", error);
    res.status(500).json({ error: "サーバーでエラーが発生しました" });
  }
});

export { router };
