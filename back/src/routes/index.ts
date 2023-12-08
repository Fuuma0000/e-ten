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
async function isEmailRegistered(
  email: string
): Promise<{ bool: Boolean | null; error: Error | null }> {
  const user = await prisma.users
    .findUnique({
      where: {
        email: email,
      },
    })
    .catch((err) => {
      console.log(err);
      return { bool: null, error: err };
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  if (user) {
    return { bool: true, error: null };
  }

  return { bool: false, error: null };
}

// メールを送信する関数
async function sendEmail(email: string, token: string): Promise<Error | null> {
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

  await transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.log("Email not sent:", error);
      return { error };
    } else {
      console.log("Email sent:", info);
      return null;
    }
  });

  return null;
}

// メール認証用のランダム文字列を発行する関数
function generateToken() {
  const token: string = crypto.randomBytes(32).toString("hex");
  return token;
}

// 仮ユーザテーブルに既にメールアドレスが登録されていたら、そのレコードを削除する関数
async function deleteTemporaryUser(email: string): Promise<Error | null> {
  await prisma.temporary_users
    .delete({
      where: {
        email: email,
      },
    })
    .catch((err) => {
      console.log(err);
      return { err };
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
  return null;
}

// 仮ユーザテーブルにメールアドレス、パスワード、ランダム文字列を入れる関数
async function createTemporaryUser(
  email: string,
  hashedPassword: string,
  token: string
): Promise<Error | null> {
  // 仮登録の有効期限は15分とする
  const expirationDate: Date = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + 15);

  await prisma.temporary_users
    .create({
      data: {
        email: email,
        hashed_password: hashedPassword,
        token: token,
        expired_at: expirationDate,
      },
    })
    .catch((err) => {
      console.log(err);
      return { err };
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  return null;
}

// 本登録を行う関数
async function registerUser(
  email: string,
  hashedPassword: string
): Promise<Error | null> {
  await prisma.users
    .create({
      data: {
        email: email,
        password: hashedPassword,
      },
    })
    .catch((err) => {
      console.log(err);
      return { err };
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
  return null;
}

// temporary_usersでメールアドレスが一致するのを検索する関数
async function findTemporaryUser(
  email: string
): Promise<{ data: any | null; error: Error | null }> {
  try {
    const temporaryUser = await prisma.temporary_users.findUnique({
      where: {
        email: email,
      },
    });
    return { data: temporaryUser, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
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

    var err: Error | null = null;

    // すでに登録されているメールアドレスかどうかをチェックする
    const { bool: isRegistered, error } = await isEmailRegistered(email);
    if (error) {
      res.status(500).json({ message: error });
      return;
    }
    if (isRegistered) {
      res.status(400).json({ message: "既に登録されているメールアドレスです" });
      return;
    }
    const token: string = generateToken();
    const hashedPassword: string = hashPassword(password);
    // すでに仮登録されているメールアドレスがあれば、そのレコードを削除する
    err = await deleteTemporaryUser(email);
    if (err) {
      res.status(500).json({ message: err });
      return;
    }

    err = await createTemporaryUser(email, hashedPassword, token);
    if (err) {
      res.status(500).json({ message: err });
      return;
    }

    // メールを送信する
    err = await sendEmail(email, token);
    if (err) {
      res.status(500).json({ message: err });
      return;
    }

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

  var err: Error | null = null;

  const { data: temporaryUser, error } = await findTemporaryUser(email);
  if (error) {
    res.status(500).json({ message: error });
    return;
  }

  if (!temporaryUser) {
    res.status(400).json({ message: "仮登録がされていません" });
    return;
  }

  const now = new Date();
  if (now > temporaryUser.expired_at) {
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
  err = await registerUser(email, temporaryUser.hashed_password);
  if (err) {
    res.status(500).json({ message: err });
    return;
  }

  res.json("本登録が完了しました");
});

router.post("/signin", async (req: Request, res: Response) => {});

export { router };
