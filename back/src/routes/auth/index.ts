import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function getUserIdFromToken(accessToken: string): string | null {
  try {
    const accessSecret = process.env.JWT_SECRET_SIGN_IN as string;
    const payload = jwt.verify(accessToken, accessSecret) as any;
    return payload.userId; // ユーザーIDを取得
  } catch (err) {
    return null;
  }
}

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

  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).json({ message: "アクセストークンが必要です" });
  }

  const accessToken = authorizationHeader.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({ message: "アクセストークンが不正です" });
  }

  const userId = getUserIdFromToken(accessToken);
  if (!userId) {
    return res.status(401).json({ message: "無効なアクセストークンです" });
  }

  req.user = userId; // リクエストオブジェクトにユーザーIDをセット
  next(); // 認証が成功したら次の処理へ
}

// サイトパスワードの認証を行うミドルウェア
export function authenticateSitePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

  next();
}
