import { NextFunction, Request, Response, Router } from "express";
const router: Router = Router();
const crypto = require("crypto");
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import nodemailer from "nodemailer";

// パスワードをハッシュ化する関数
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hashedPassword: string = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha256")
    .toString("hex");

  return hashedPassword;
}

// メールアドレスが既に登録されているかどうかをチェックする関数
async function isEmailRegistered(email: string): Promise<boolean> {
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    return !!user; // 存在すれば true、存在しなければ false を返す
  } catch (error) {
    console.error("Error in checking email registration:", error);
    return false; // エラーが発生した場合も false を返す
  }
}

// メールを送信する関数
function sendEmail(email: string, token: string) {
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

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.error("Send email error:", error);
    } else {
      console.log("Email sent:", info);
    }
  });
}

// メール認証用のランダム文字列を発行する関数
function generateToken() {
  const token: string = crypto.randomBytes(32).toString("hex");
  return token;
}

// 仮ユーザテーブルに既にメールアドレスが登録されていたら、そのレコードを削除する関数
function deleteTemporaryUser(email: string) {
  prisma.temporary_users.delete({
    where: {
      email: email,
    },
  });
}

// 仮ユーザテーブルにメールアドレス、パスワード、ランダム文字列を入れる関数
function createTemporaryUser(
  email: string,
  hashedPassword: string,
  token: string
) {
  console.log("CreatedTemporaryUser ");
  // 仮登録の有効期限は15分とする
  const expirationDate: Date = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + 15);

  prisma.temporary_users.create({
    data: {
      email: email,
      hashed_password: hashedPassword,
      token: token,
      expired_at: expirationDate,
    },
  });
}

/* GET home page. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.json({ message: "サーバ起動確認用" });
});

// ユーザの仮登録を行う
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const email: string = req.body.email;
    const password: string = req.body.password;

    const isRegistered: boolean = await isEmailRegistered(email);
    if (isRegistered) {
      res.status(400).json({ message: "既に登録されているメールアドレスです" });
      return;
    }
    const token: string = generateToken();
    const hashedPassword: string = hashPassword(password);
    // すでに仮登録されているメールアドレスがあれば、そのレコードを削除する
    deleteTemporaryUser(email);
    createTemporaryUser(email, hashedPassword, token);

    // メールを送信する
    sendEmail(email, token);

    res.json("メールを送信しました");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

// ユーザの本登録を行う
router.get("/verify", async (req: Request, res: Response) => {
  const email: string = req.query.email as string;
  const token: string = req.query.token as string;

  const temporaryUser = await prisma.temporary_users.findUnique({
    where: {
      email: email,
    },
  });

  if (!temporaryUser) {
    res.status(400).json({ message: "仮登録がされていません" });
    return;
  }

  const now = new Date();
  if (now < temporaryUser.expired_at) {
    res.status(400).json({ message: "トークンの有効期限が切れています" });
    return;
  }

  if (temporaryUser.token !== token) {
    res.status(400).json({ message: "トークンが一致しません" });
    return;
  }

  // TODO: ここはどっちでもいいかも expが切れているのを削除するbatを作るか
  // 本登録が完了したら、仮ユーザテーブルのレコードを削除する
  // deleteTemporaryUser(email);

  // 本登録が完了したら、ユーザテーブルにレコードを追加する
  prisma.users.create({
    data: {
      email: email,
      password: temporaryUser.hashed_password,
    },
  });

  res.json("本登録が完了しました");
});

router.post("/signin", async (req: Request, res: Response) => {});

export { router };
