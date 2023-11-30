import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
const router: Router = Router();
const prisma = new PrismaClient();

// イベント一覧の取得
router.get("/", async (req: Request, res: Response) => {
  const events = await prisma.events.findMany();
  res.json(events);
});

// イベント参加学生の取得
router.get("/:id/students", async (req: Request, res: Response) => {
  res.json({ message: "events/{id}/studentsに対するルーティング" });
});

export { router };
