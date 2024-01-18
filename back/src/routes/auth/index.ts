import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const sitePasswordToken = req.cookies["x-site-password-token"] as string;
  if (!sitePasswordToken) {
    return res
      .status(401)
      .json({ message: "サイトパスワードの認証が必要です2" });
  }

  const siteSecret = process.env.JWT_SECRET_SITE_PASSWORD as string;
  try {
    jwt.verify(sitePasswordToken, siteSecret);
  } catch (err) {
    return res
      .status(401)
      .json({ message: "無効なサイトパスワードトークンです" });
  }

  const accessToken = req.cookies["x-access-token"] as string;
  if (!accessToken) {
    return res.status(401).json({ message: "アクセストークンが必要です" });
  }

  const accessSecret = process.env.JWT_SECRET_SIGN_IN as string;
  try {
    const decoded = jwt.verify(accessToken, accessSecret) as JwtPayload;
    const userId = Number(decoded.userId);
    req.user = userId;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "トークンの有効期限が切れています", error: err });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "無効なトークンです" });
    } else {
      return res
        .status(401)
        .json({ message: "トークンの検証中にエラーが発生しました" });
    }
  }
}

// サイトパスワードの認証を行うミドルウェア
export function authenticateSitePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const sitePasswordToken = req.cookies["x-site-password-token"] as string;
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
