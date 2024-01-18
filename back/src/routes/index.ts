import { NextFunction, Request, Response, Router } from "express";
// TODO: prismaclientのimportまとめる
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import jwt, { JwtPayload } from "jsonwebtoken";
import { authenticate, authenticateSitePassword } from "./auth";
import { body } from "express-validator";

const router: Router = Router();
const crypto = require("crypto");
const prisma = new PrismaClient();

// パスワードをハッシュ化する関数
function hashPassword(password: string, salt: string): string {
  const hashedPassword: string = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha256")
    .toString("hex");

  return hashedPassword;
}

// メールアドレスが既に登録されているかどうかをチェックする関数
async function isEmailRegistered(email: string): Promise<{ bool: boolean }> {
  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });

  if (user) {
    return { bool: true };
  }

  return { bool: false };
}

// メールを送信する関数
async function sendEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL
    auth: {
      user: process.env.GMAIL_ADDRESS,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  // 本来はメールの内容を HTML で記述する
  // 今回は簡単のため、テキストのみでメールを送信する
  const mailOptions = {
    from: process.env.GMAIL_ADDRESS,
    to: email,
    subject: "メールアドレス確認",
    text: `${process.env.SITE_URL_DEV}/verify?email=${email}&token=${token}`,
  };

  transporter.sendMail(mailOptions, (info: any) => {
    console.log("Message sent: %s", info.messageId);
  });

  return;
}

// パスワードをハッシュ化する関数
function generateSalt(): string {
  const salt: string = crypto.randomBytes(16).toString("hex");
  return salt;
}

// メール認証用のランダム文字列を発行する関数
function generateToken(): string {
  const token: string = crypto.randomBytes(32).toString("hex");
  return token;
}

// 仮ユーザテーブルに既にメールアドレスが登録されていたら、そのレコードを削除する関数
async function deleteTemporaryUser(email: string) {
  const existingUser = await prisma.temporary_users.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    await prisma.temporary_users.delete({
      where: {
        email: email,
      },
    });
  }
}

// 仮ユーザテーブルにメールアドレス、パスワード、ランダム文字列を入れる関数
async function createTemporaryUser(
  email: string,
  hashedPassword: string,
  salt: string,
  token: string
) {
  // 仮登録の有効期限は15分とする
  const expirationDate: Date = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + 15);

  await prisma.temporary_users.create({
    data: {
      email: email,
      hashed_password: hashedPassword,
      salt: salt,
      token: token,
      expired_at: expirationDate,
    },
  });
}

// 本登録を行う関数
async function registerUser(
  email: string,
  hashedPassword: string,
  salt: string
) {
  await prisma.users.create({
    data: {
      email: email,
      password: hashedPassword,
      salt: salt,
    },
  });
}

// temporary_usersでメールアドレスが一致するのを検索する関数
async function findTemporaryUser(email: string): Promise<{ data: any }> {
  const temporaryUser = await prisma.temporary_users.findUnique({
    where: {
      email: email,
    },
  });

  return { data: temporaryUser };
}

function verifyPassword(
  password: string,
  hashedPassword: string,
  salt: string
): boolean {
  const hashedAttempt: string = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha256")
    .toString("hex");
  return hashedAttempt === hashedPassword;
}

/* GET home page. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.json({ message: "サーバ起動確認用" });
});

// ユーザの仮登録を行う
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("メールアドレスの形式が不正です"),
    body("password")
      .isString()
      .withMessage("パスワードは文字列である必要があります"),
  ],
  authenticateSitePassword,
  async (req: Request, res: Response) => {
    try {
      const email: string = req.body.email;
      const password: string = req.body.password;

      // TODO:後で消す
      console.log(`email:${email}`);
      console.log(`password:${password}`);

      // メールアドレスのバリデーション
      const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .json({ message: "メールアドレスの形式が不正です" });
      }

      if (password.length < 8) {
        return res.status(400).json({
          message: "パスワードは8文字以上である必要があります",
        });
      }

      if (password.length > 72) {
        return res.status(400).json({
          message: "パスワードは72文字以下である必要があります",
        });
      }

      // すでに登録されているメールアドレスかどうかをチェックする
      const { bool: isRegistered } = await isEmailRegistered(email);
      if (isRegistered) {
        res
          .status(400)
          .json({ message: "既に登録されているメールアドレスです" });
      }

      const salt: string = generateSalt();
      const token: string = generateToken();
      const hashedPassword: string = hashPassword(password, salt);
      // すでに仮登録されているメールアドレスがあれば、そのレコードを削除する
      await deleteTemporaryUser(email);

      await createTemporaryUser(email, hashedPassword, salt, token);

      // メールを送信する
      await sendEmail(email, token);

      res.json("メールを送信しました");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "サーバーエラーが発生しました" });
    } finally {
      await prisma.$disconnect();
    }
  }
);

// ユーザの本登録を行う
router.get(
  "/verify",
  [
    body("email").isEmail().withMessage("メールアドレスの形式が不正です"),
    body("token")
      .isString()
      .withMessage("トークンは文字列である必要があります"),
  ],
  async (req: Request, res: Response) => {
    try {
      const email: string = req.query.email as string;
      const token: string = req.query.token as string;

      const { data: temporaryUser } = await findTemporaryUser(email);
      if (!temporaryUser) {
        return res.status(400).json({ message: "仮登録がされていません" });
      }

      const now = new Date();
      if (now > temporaryUser.expired_at) {
        return res
          .status(400)
          .json({ message: "トークンの有効期限が切れています" });
      }

      if (temporaryUser.token !== token) {
        return res.status(400).json({ message: "トークンが一致しません" });
      }

      await registerUser(
        email,
        temporaryUser.hashed_password,
        temporaryUser.salt
      );

      res.json("本登録が完了しました");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "サーバーエラーが発生しました" });
    } finally {
      await prisma.$disconnect();
    }
  }
);

router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("メールアドレスの形式が不正です"),
    body("password")
      .isString()
      .withMessage("パスワードは文字列である必要があります"),
  ],
  authenticateSitePassword,
  async (req: Request, res: Response) => {
    try {
      const email: string = req.body.email;
      const password: string = req.body.password;

      const user = await prisma.users.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        return res
          .status(400)
          .json({ message: "メールアドレスが間違っています" });
      }

      const isPasswordValid = verifyPassword(
        password,
        user.password,
        user.salt
      );
      if (!isPasswordValid) {
        return res.status(400).json({ message: "パスワードが間違っています" });
      }

      // アクセストークンを発行する
      const accessTokenPayload = {
        userId: user.id,
      };
      const accessTokenSecret = process.env.JWT_SECRET_SIGN_IN as string;
      const accessToken: string = jwt.sign(
        accessTokenPayload,
        accessTokenSecret,
        {
          expiresIn: "1h",
        }
      );

      // リフレッシュトークンを発行する
      const refreshTokenPayload = {
        userId: user.id,
      };
      const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;
      const refreshToken: string = jwt.sign(
        refreshTokenPayload,
        refreshTokenSecret,
        {
          expiresIn: "30d",
        }
      );

      // res.json({ accessToken: accessToken, refreshToken: refreshToken });
      res.cookie("x-access-token", accessToken, {
        maxAge: 3600000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      res.cookie("x-refresh-token", refreshToken, {
        maxAge: 2592000000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      res.status(200).json({ message: "ログインに成功しました" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "サーバーエラーが発生しました" });
    } finally {
      await prisma.$disconnect();
    }
  }
);

router.post(
  "/site-password",
  [
    body("password")
      .isString()
      .withMessage("パスワードは文字列である必要があります"),
  ],
  async (req: Request, res: Response) => {
    try {
      const password = req.body.password;

      if (password !== process.env.SITE_PASSWORD) {
        return res.status(400).json({ message: "パスワードが間違っています" });
      }

      const payload = { isSitePasswordKnown: true };
      const secret = process.env.JWT_SECRET_SITE_PASSWORD as string;
      const token = jwt.sign(payload, secret, {
        expiresIn: "30d",
      });
      res.cookie("x-site-password-token", token, {
        maxAge: 2592000000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
      return res
        .status(200)
        .json({ message: "サイトパスワードの認証に成功しました" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "サーバーエラーが発生しました" });
    } finally {
    }
  }
);

router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const refreshToken = req.headers["x-refresh-token"] as string;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;
    const decoded = jwt.verify(refreshToken, refreshTokenSecret) as JwtPayload;
    const userId = Number(decoded.userId);
    const payload = { userId: userId }; // 新しいアクセストークンに含める情報
    const secret = process.env.JWT_SECRET_SIGN_IN as string;
    const accessToken = jwt.sign(payload, secret, {
      expiresIn: "1h", // アクセストークンの有効期限を設定
    });

    res.cookie("x-access-token", accessToken, {
      maxAge: 3600000,
      httpOnly: true,
      secure: true,
      path: "/",
    });

    return res.status(200).json({ message: "トークンの更新に成功しました" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

// テスト用 プロフィール情報を取得する
router.get("/profile", authenticate, async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user);

    // ユーザー情報をデータベースから取得
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "ユーザーが見つかりません" });
    }

    res.json({ user }); // ユーザー情報を返す
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "サーバーエラーが発生しました" });
  }
});

export { router };
