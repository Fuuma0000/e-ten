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
            }
          }
        }
      },
      courses: {
        select: {
          name: true
        }
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
                              name: true
                            }
                          }
                        }
                      },
                      works_data_technologies: {
                        select: {
                          technologies: {
                            select: {
                              name: true
                            }
                          }
                        }
                      }
                    }
                  },
                }
              },
            catch_copy: true,
            works_data_images: {  
              select: {
                url: true
              },
              orderBy: {
                order: "asc"
              },
              take: 1
            }
            },
          }
        }
      },
    },
  });

  const returnVal = convertUserData(user as UserType);
  res.json(returnVal);
  // res.json( user );
});

export { router };

// usersから
// user_id.user_name.enrollment_year.graduation_year.icon_url.e-mail.is_job_hunt_completed.self_introduciton.
// user_idをキーにusers_jobsテーブルからjobs_idを取ってくる.jobsテーブルからjobs_idを元にnameを取ってくる
// courses_idをキーにcoursesテーブルからnameを取ってくる
// users_idをキーにworks_data_usersからworks_data_idを取ってくる.
// works_data_idをキーにworksテーブルからlatest_reviewed_idを取ってくる
// latest_reviewed_idをキーにworks_dataテーブルからname.catch_copy.
// works_data_genresテーブルからgenres_idを取ってくる.genres_idをキーにgenresテーブルからnameを取ってくる
// works_data_technologiesテーブルからtechnologies_idを取ってくる.technologies_idをキーにtechnologiesテーブルからnameを取ってくる
// work_imagesテーブルからurl取ってくる

// works.id指定で検索(latest_reviewed_id).works_data