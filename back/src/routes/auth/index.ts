import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const sitePasswordToken = req.headers["x-site-password-token"] as string;
  if (!sitePasswordToken) {
    return res
      .status(401)
      .json({ message: "サイトパスワードの認証が必要です" });
  }

  const siteSecret = process.env.JWT_SECRET_SITE_PASSWORD as string;
  try {
    jwt.verify(sitePasswordToken, siteSecret);
  } catch (err) {
    return res
      .status(401)
      .json({ message: "無効なサイトパスワードトークンです" });
  }

  const accessToken = req.headers.authorization?.split(" ")[1]; // Authorizationヘッダーからトークンを取得
  if (!accessToken) {
    return res.status(401).json({ message: "アクセストークンが必要です" });
  }

  const accessSecret = process.env.JWT_SECRET_SIGN_IN as string;
  try {
    jwt.verify(accessToken, accessSecret);
  } catch (err) {
    return res.status(401).json({ message: "無効なアクセストークンです" });
  }

  next(); // 認証が成功したら次の処理へ
}
