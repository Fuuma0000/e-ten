import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import passport from "passport";
import jwt from "jsonwebtoken";

import { router as indexRouter } from "./routes/index";
import { router as eventRoute } from "./routes/events";
import { router as profileRoute } from "./routes/profiles";
import { router as workRoute } from "./routes/works";
import { router as bookmarkRoute } from "./routes/bookmarks";
import { router as myprofileRoute } from "./routes/myprofile";
import { CorsOptions } from "cors";
const cors = require("cors");

const app = express();

const allowedOrigins = ["http://localhost:3000"];

const corsOptions: CorsOptions = {
  origin: function (
    origin: any,
    callback: (arg0: Error | null, arg1: boolean | undefined) => void
  ) {
    // 許可されたオリジンか、もしくは未定義（同一オリジンの場合）であれば許可
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
    }
  },
  credentials: true, // クッキーや認証ヘッダーの送信を有効にする
};

app.use(cors(corsOptions)); // すべてのリクエストに対してCORSを有効にする

// view engine setup
app.set("views", path.join("views")); //__dirNameと書いてある箇所を除く！
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //validator設定済み
app.use(cookieParser());
app.use(express.static(path.join("public"))); //__dirNameと書いてある箇所を除く！
app.use(express.static("public"));

// passportの初期化
app.use(passport.initialize());

app.use("/", indexRouter);
app.use("/events", eventRoute);
app.use("/profiles", profileRoute);
app.use("/works", workRoute);
app.use("/bookmarks", bookmarkRoute);
app.use("/myprofile", myprofileRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// ↓ 下のapp.use((err, req, res, next)=>{...})の引数errに付けるオブジェクトの型。
// errに付ける型として、vscode内のErrorというオブジェクト型があるが、statusというプロパティが無いため、拡張したinterfaceを定義している。
interface ErrorWithStatus extends Error {
  status: number;
}

// error handler
// ↓に関しては、このままだと全引数ともに暗黙的Anyとなってしまう。
// req,res,nextに関しては@types/expressの型を使えるが、errに関しては型拡張の必要あり！(上で定義したinterfaceを用いる。)
app.use(function (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
