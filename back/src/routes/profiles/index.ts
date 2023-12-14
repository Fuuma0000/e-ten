import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { validationResult, body } from "express-validator";
import path from "path";
import fs from "fs";
import { convertUserData } from "./json-convert";
import { RequestBody } from "./types/index-type";
import { authenticate } from "../auth";
const router: Router = Router();

const prisma = new PrismaClient();

router.get("/:id", authenticate, async (req: Request, res: Response) => {
  const { id } = req.params;

  let returnVal;

  try {
    const user = await prisma.users.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        username: true,
        enrollment_year: true,
        graduation_year: true,
        icon_url: true,
        email: true,
        is_job_hunt_completed: true,
        self_introduction: true,
        users_jobs: {
          select: {
            jobs: {
              select: {
                name: true,
              },
            },
          },
        },
        courses: {
          select: {
            name: true,
          },
        },
        works_data_users: {
          select: {
            works_data: {
              select: {
                works_works_data_works_idToworks: {
                  select: {
                    works_data_works_latest_reviewed_idToworks_data: {
                      select: {
                        works_id: true,
                        name: true,
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
                },
                catch_copy: true,
                works_data_images: {
                  select: {
                    url: true,
                  },
                  orderBy: {
                    order: "asc",
                  },
                  take: 1,
                },
              },
            },
          },
        },
        users_urls: {
          select: {
            id: true,
            url_name: true,
            url: true,
          },
        },
      },
    });

    if (user !== null) {
      returnVal = convertUserData(user);
    } else {
      returnVal = { message: "適切なIDを入力してください。" };
    }
  } catch {
    returnVal = { message: "IDに数値以外を使わないでください。" };
  }
  res.json(returnVal);
});

router.put(
  "/:id",
  [
    body("username")
      .optional()
      .isString()
      .withMessage("usernameが文字列でない")
      .isLength({ max: 50 })
      .withMessage("usernameが長すぎる"),
    body("enrollment_year")
      .optional()
      .isInt({ min: 0, max: 2147483647 })
      .withMessage("enrollment_yearが数値でないか大きすぎる"),
    body("graduation_year")
      .optional()
      .isInt({ min: 0, max: 2147483647 })
      .withMessage("graduation_yearが数値でないか大きすぎる"),
    body("is_job_hunt_completed")
      .optional()
      .isBoolean()
      .withMessage("is_job_hunt_completedはbooleanで渡さなければならない"),
    body("self_introduction")
      .optional()
      .isString()
      .withMessage("self_introductionが文字列でない"),
    body("icon_url")
      .optional()
      .isString()
      .withMessage("icon_urlが文字列でない")
      .isLength({ max: 255 })
      .withMessage("icon_urlが長すぎる"),
    body("courses_id")
      .optional()
      .isInt({ min: 0, max: 4294967295 })
      .withMessage("courses_idが数値でないか大きすぎる"),
    body("jobs_id").optional().isArray().withMessage("jobs_idが配列でない"),
    body("urls").optional().isArray().withMessage("urlsが配列でない"),
  ],
  authenticate,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const accessUserId = req.user as number;
    const body: RequestBody = req.body;

    try {
      await prisma.users.update({
        where: { id: accessUserId },
        data: {
          username: body.username ?? null,
          enrollment_year: body.enrollment_year ?? null,
          graduation_year: body.graduation_year ?? null,
          is_job_hunt_completed: body.is_job_hunt_completed ?? null,
          self_introduction: body.self_introduction ?? null,
          icon_url: body.icon_url ?? null,
          courses_id: body.course_id ?? null,
        },
      });

      // ユーザに該当するレコードを検索
      const users_jobs = await prisma.users_jobs.findMany({
        where: { users_id: accessUserId },
        select: {
          jobs_id: true,
        },
      });

      const dbJobsIds = users_jobs.map(
        (currentUsersJob) => currentUsersJob.jobs_id
      );
      const reqJobsIds = body.jobs_id;

      // リクエストにだけ含まれるusers_jobs.IDを抽出
      if (typeof reqJobsIds !== "undefined") {
        const uniqueReqIds = reqJobsIds.filter(
          (reqJobsId) => !dbJobsIds.includes(reqJobsId)
        );
        // DBにだけ含まれるusers_jobs.IDを抽出
        const uniqueDbIds = dbJobsIds.filter(
          (dbJobsId) => !reqJobsIds.includes(dbJobsId)
        );
        // 抽出したレコードを元にinsert.delete
        await prisma.$transaction(async (prisma) => {
          await prisma.users_jobs.createMany({
            data: uniqueReqIds.map((uniqueReqid) => ({
              users_id: accessUserId,
              jobs_id: uniqueReqid,
            })),
          });

          for (const uniqueDbId of uniqueDbIds) {
            await prisma.users_jobs.delete({
              where: {
                users_id_jobs_id: {
                  users_id: accessUserId,
                  jobs_id: uniqueDbId,
                },
              },
            });
          }
        });
      } else {
        // req.jobs_idが空の時に走る
        await prisma.users_jobs.deleteMany({
          where: {
            users_id: accessUserId,
          },
        });
      }

      const dbUrlObjects = await prisma.users_urls.findMany({
        where: { users_id: accessUserId },
        select: {
          id: true,
          url_name: true,
          url: true,
        },
      });
      const reqUrlObjects = body.urls;

      if (typeof reqUrlObjects !== "undefined") {
        // リクエストにのみ含まれるusers_urls.url_name.users_url.users_url.idの組をオブジェクトとして抽出する
        const uniqueReqUrls = reqUrlObjects.filter(
          (reqUrlObject) =>
            !dbUrlObjects.some(
              (currentObject) =>
                currentObject.url_name === reqUrlObject.url_name &&
                currentObject.url === reqUrlObject.url
            )
        );
        // DBにのみ含まれるusers_urls.url.users_url.url.users_urls.idの組をオブジェクトとして抽出する
        const uniqueDbUrls = dbUrlObjects.filter(
          (dbUsersUrlsObject) =>
            !reqUrlObjects.some(
              (requUrlsObject) =>
                dbUsersUrlsObject.url_name === requUrlsObject.url_name &&
                dbUsersUrlsObject.url === requUrlsObject.url
            )
        );

        // 抽出したオブジェクトを元にinsert.delete
        await prisma.$transaction(async (prisma) => {
          await prisma.users_urls.createMany({
            data: uniqueReqUrls.map((uniqueReqUrl) => ({
              users_id: accessUserId,
              url_name: uniqueReqUrl.url_name,
              url: uniqueReqUrl.url,
            })),
          });

          for (const uniqueDbUsersUrl of uniqueDbUrls) {
            await prisma.users_urls.delete({
              where: { id: uniqueDbUsersUrl.id },
            });
          }
        });
      } else {
        // req.urlsが空の時に走る
        await prisma.users_urls.deleteMany({
          where: {
            users_id: accessUserId,
          },
        });
      }

      res.status(200).json({ message: "Success" });
    } catch (err) {
      if (err instanceof Error) {
        // エラー出力をログに書き出す
        const currentDate = new Date();
        fs.writeFileSync(path.resolve(__dirname, `../../../errorlogs/${currentDate.getDate()}_${currentDate.getHours()}_${currentDate.getMinutes()}_${currentDate.getSeconds()}`), err.message);
      }
      res.status(400).json({ message: "バリデーションに引っかからずにupdate出来なかった" });
    }
  }
);

export { router };
