import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { convertUserData, UserType } from "./json-convert";
import { RequestBody } from "./types/index-type";

const router: Router = Router();

const prisma = new PrismaClient();

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

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
          url_name: true,
          url: true,
        },
      },
    },
  });

  let returnVal;
  if (user !== null) {
    returnVal = convertUserData(user);
  } else {
    returnVal = { message: "適切なIDを入力してください。" };
  }
  res.json(returnVal);
});

router.put("/:id", async (req: Request, res: Response) => {
  const body: RequestBody = req.body;

  // Todo:body.user_idを渡されたidに変更する
  await prisma.users.update({
    where: { id: body.user_id },
    data: {
      // email: body.email ?? null,
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
    where: { users_id: body.user_id },
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
          users_id: body.user_id,
          jobs_id: uniqueReqid,
        })),
      });

      for (const uniqueDbId of uniqueDbIds) {
        await prisma.users_jobs.delete({
          where: {
            users_id_jobs_id: {
              users_id: body.user_id,
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
        users_id: body.user_id,
      },
    });
  }

  const dbUrlObjects = await prisma.users_urls.findMany({
    where: { users_id: body.user_id },
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
        users_id: body.user_id,
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
        users_id: body.user_id
      }
    })
  }

  res.status(200).json({ message: "OK" });
});

export { router };
