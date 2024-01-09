import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../auth";

const router: Router = Router();
const prisma = new PrismaClient();

// TODO:自分のプロフィール情報の取得
router.get("/", authenticate, async (req: Request, res: Response) => {
  res.json({ message: "myprofile" });
});

// TODO:自分のプロフィール情報の編集

export { router };
