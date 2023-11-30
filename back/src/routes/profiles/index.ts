import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const router: Router = Router();

const prisma = new PrismaClient();

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  // const temp = await prisma.courses.findUnique({
  //   where: {
  //     id: parseInt(id),
  //   },
  // });

  // const temp = await prisma.courses.findMany();
  // console.log(temp);

  console.log("test");
  res.json({ message: "ルーティング確認.profile" });
});

export { router };

// usersから
// user_id.user_name.enrollment_year.graduation_year.icon_url.e-mail.is_job_hunt_completed.self_introduciton.
// user_idをキーにusers_jobsテーブルからjobs_idを取ってくる.jobsテーブルからjobs_idを元にnameを取ってくる
// courses_idをキーにcoursesテーブルからnameを取ってくる
// users_idをキーにworks_data_usersからworks_idを取ってくる.
// works_idをキーにworks_dataテーブルからname.catch_copy.
// works_data_genresテーブルからgenres_idを取ってくる.genres_idをキーにgenresテーブルからnameを取ってくる
// works_data_technologiesテーブルからtechnologies_idを取ってくる.technologies_idをキーにtechnologiesテーブルからnameを取ってくる
// work_imagesテーブルからurl取ってくる