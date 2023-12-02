import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { convertUsersData, inputUsersJson } from "./json-convert";
const router: Router = Router();

const prisma = new PrismaClient();

router.get("/:id/students", async(req: Request, res: Response) => {
  const users = await prisma.users.findMany({
    select: {
      id: true,
      username: true,
      enrollment_year: true,
      graduation_year: true,
      users_jobs: {
        select: {
          jobs: {
            select: {
              name: true
            }
          }
        }
      },
      icon_url: true,
    }
  });

  const convertedUsersData = convertUsersData(users as inputUsersJson[]);
  res.json(convertedUsersData);
});

export { router };