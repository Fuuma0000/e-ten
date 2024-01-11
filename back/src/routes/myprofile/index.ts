import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../auth";
import { convertMyprofileData } from "./json-convert";
import { inputMyprofileJson } from "./json-convert-type";

const router: Router = Router();
const prisma = new PrismaClient();

// 自分のプロフィール情報の取得
router.get("/", authenticate, async (req: Request, res: Response) => {
  const users_id = Number(req.user);

  const myprofile = await prisma.users.findUnique({
    where: { id: users_id },
    select: {
      id: true,
      username: true,
      enrollment_year: true,
      graduation_year: true,
      icon_url: true,
      email: true,
      courses: {
        select: {
          name: true,
        },
      },
      users_jobs: {
        select: {
          jobs: {
            select: {
              name: true,
            },
          },
        },
      },
      is_job_hunt_completed: true,
      self_introduction: true,
      users_urls: {
        select: {
          url_name: true,
          url: true,
        },
      },
      works_data_users: {
        select: {
          works_data: {
            select: {
              id: true,
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
              catch_copy: true,
              works_data_images: {
                orderBy: {
                  order: "asc",
                },
                select: {
                  url: true,
                },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  let result;
  if (myprofile != null) {
    result = convertMyprofileData(myprofile as inputMyprofileJson);
    // result = myprofile;
    console.log(result);
  } else {
    result = { message: "ユーザーデータが取得できませんでした" };
  }
  res.json(result);
});

// TODO:自分のプロフィール情報の編集

export { router };
