import { Request, Response, Router } from "express";
const router: Router = Router();

router.get("/:id/students", async(req: Request, res: Response) => {
  res.json({ message: "events/{id}/studentsに対するルーティング" });
});

export { router };