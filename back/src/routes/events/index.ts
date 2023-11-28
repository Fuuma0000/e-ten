import express from "express";
const router = express.Router();

router.get("/:id/students", async (req, res) => {
  res.json({ message: "ルーティング確認.events" });
});

export { router };