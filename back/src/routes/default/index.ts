import { Request, Response, Router } from "express";
const crypto = require("crypto");
const router: Router = Router();

// パスワードをハッシュ化する関数
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hashedPassword: string = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha256")
    .toString("hex");

  return hashedPassword;
}

// メールアドレスが既に登録されているかどうかをチェックする関数
function isEmailRegistered(email: string) {}

// メールを送信する関数
function sendEmail(email: string, token: string) {
  // /verify?id={id}&random={random}&expires={expires} のリンクを記載したメールを送信
}

// メール認証用のランダム文字列を発行する関数
function generateToken() {
  const token = crypto.randomBytes(32).toString("hex");
  return token;
}

// 仮ユーザテーブルにメールアドレス、パスワード、ランダム文字列を入れる関数
function createTemporaryUser(email: string, password: string, token: string) {}

router.post("/signup", async (req: Request, res: Response) => {
  // ユーザが入力したメールアドレスとパスワードを読み込む
  const email: string = req.body.email;
  const password: string = req.body.password;
  // 既に登録されているメールアドレスに被ってないか確認
  // メール認証用のランダム文字列を発行する
  // パスワードをハッシュ化する
  const hashedPassword = hashPassword(password);
  // 仮ユーザテーブルにメールアドレス、パスワード、ランダム文字列を入れる
  // メールを送信する

  res.json();
});

export { router };
