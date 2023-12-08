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


  const returnVal = convertUserData(user as UserType);
  res.json(returnVal);
});

router.put("/:id", async (req: Request, res: Response) => {
  const body: RequestBody = req.body;
  
  // Todo:body.user_idを渡されたidに変更する
  await prisma.users.update({
    where: { id: body.user_id },
    data: {
      email: body.email,
      username: body.username,
      enrollment_year: body.enrollment_year,
      graduation_year: body.graduation_year,
      is_job_hunt_completed: body.is_job_hunt_completed,
      self_introduction: body.self_introduction,
      icon_url: body.icon_url,
      courses_id: body.course_id,
    },
  });

  
  // ユーザに該当するレコードを検索
  const users_jobs = await prisma.users_jobs.findMany({
    where: { users_id: body.user_id },
  });

  const dbJobsIds = users_jobs.map((currentUsersJob) => currentUsersJob.jobs_id);
  const reqJobsIds = body.jobs_id;

  // リクエストにだけ含まれるusers_jobs.IDを抽出
  const uniqueReqIds = reqJobsIds.filter(reqJobsId => !dbJobsIds.includes(reqJobsId));
  // DBにだけ含まれるusers_jobs.IDを抽出
  const uniqueDbIds = dbJobsIds.filter(dbJobsId => !reqJobsIds.includes(dbJobsId));

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


  const users_urls = await prisma.users_urls.findMany({
    where: { users_id: body.user_id },
  });

  const dbUsersUrlsObjects = users_urls.map((users_url) => ({
    id: users_url.id,
    url_name: users_url.url_name,
    url: users_url.url,
  }));
  const reqUrlsObjects = body.urls;

  // リクエストにのみ含まれるusers_urls.url_name.users_url.users_url.idの組をオブジェクトとして抽出する
  const uniqueReqUrls = reqUrlsObjects.filter(
    (reqUrlObject) =>
      !dbUsersUrlsObjects.some(
        (dbUsersUrlsObject) =>
          dbUsersUrlsObject.url_name === reqUrlObject.url_name &&
          dbUsersUrlsObject.url === reqUrlObject.url
      )
  );
  // DBにのみ含まれるusers_urls.url.users_url.url.users_urls.idの組をオブジェクトとして抽出する
  const uniqueDbUsersUrls = dbUsersUrlsObjects.filter(
    (dbUsersUrlsObject) =>
      !reqUrlsObjects.some(
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
    
    for (const uniqueDbUsersUrl of uniqueDbUsersUrls) {
      await prisma.users_urls.delete({
        where: { id: uniqueDbUsersUrl.id },
      });
    }
  });

  res.status(200).json({ message: "OK" });
});

export { router };
