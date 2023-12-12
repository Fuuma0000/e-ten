import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import { router as indexRouter } from "./routes/index";
import { router as eventRoute } from "./routes/events";
import { router as profileRoute } from "./routes/profiles";
import { router as workRoute } from "./routes/works";
import passport from "passport";
import jwt from "jsonwebtoken";

const app = express();

// view engine setup
app.set("views", path.join("views")); //__dirNameと書いてある箇所を除く！
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  //validator設定済み
app.use(cookieParser());
app.use(express.static(path.join("public"))); //__dirNameと書いてある箇所を除く！
app.use(express.static("public"));

// passportの初期化
app.use(passport.initialize());

app.use("/", indexRouter);
app.use("/events", eventRoute);
app.use("/profiles", profileRoute);
app.use("/works", workRoute);

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
