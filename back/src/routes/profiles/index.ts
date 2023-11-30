import express from "express";
const router = express.Router();

router.get("/:id", async (req, res) => {
  res.json({ message: "ルーティング確認.profile" });
});

export { router };