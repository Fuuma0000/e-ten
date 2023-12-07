import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { convertUserData, UserType } from "./json-convert";

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

export { router };
