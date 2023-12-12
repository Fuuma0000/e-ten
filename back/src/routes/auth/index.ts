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

  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).json({ message: "アクセストークンが必要です" });
  }

  // トークンが有効期限切れかどうかを検証する
  const accessToken = authorizationHeader.split(" ")[1];
  const accessSecret = process.env.JWT_SECRET_SIGN_IN as string;
  try {
    jwt.verify(accessToken, accessSecret, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: "無効なトークンです" });
      }

      const userId = decoded.userId; // ユーザーIDなどの情報を取得する
      req.user = userId; // リクエストオブジェクトにユーザーIDをセット
      next(); // 認証が成功したら次の処理へ
    });
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
