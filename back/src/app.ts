import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import { router as indexRouter } from "./routes/index";
import { router as usersRouter } from "./routes/users";
import authenticate from "./routes/default/authenticate";

const app = express();

// view engine setup
app.set("views", path.join("views")); //__dirNameと書いてある箇所を除く！
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join("public"))); //__dirNameと書いてある箇所を除く！
app.use(express.static("public"));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// jwtテスト用: jwt認証なしver
app.get("/test", (req, res) => {
  res.status(200).json({
    message: "Hello!",
    token: "token",
  });
});

// jwtテスト用: jwt認証ありver
// authenticateを挟むことで、jwt認証が通らないと、このルーティングには到達しない。
app.get("/test2", authenticate, (req, res) => {
  res.status(200).json({
    message: "Hello!",
    token: "token",
  });
});

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
