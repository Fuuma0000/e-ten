import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const router: Router = Router();

const prisma = new PrismaClient();

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  // works_data_usersからworksを上手く辿れないので分けて記述しています
  const temp = await prisma.users.findUnique({
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
      // works_data_users: {
      //   select: {
      //     works_data: {
      //       select: {
      //         works: {

      //         }
      //       }
      //     }
      //   }
      // }
    },
    });

    
    // TODO:複数個レコードが取得出来た場合を考慮していないので入っているレコードが適切かどうかチェックしてもらってから作成する
    const temp2 = await prisma.works_data_users.findMany({
      where: { users_id: parseInt(id) },
      select: {
        works_data_id: true 
      }
    });

    const temp3 = await prisma.works_data.findUnique({
      where: { id: temp2[0].works_data_id },
      select: { works_id: true }
    });

    const temp4 = await prisma.works.findUnique({
      where: { id: temp3?.works_id },
      select: { latest_reviewed_id: true }
    });

    // TODO:型定義誤魔化してる.次授業時に聞く
    const temp5 = await prisma.works_data.findUnique({
      where: { id: temp4?.latest_reviewed_id as number | undefined },
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
        },
        catch_copy: true,
        works_data_images: {
          select: {
            url: true,
          }
        }
      }
    })
  console.log(temp);

  res.json(temp5);
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