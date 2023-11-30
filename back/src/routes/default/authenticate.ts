import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const config = require("../../../config/jwt.config");

export default function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send("Access denied");
    }
    const decoded = jwt.verify(token, config.jwt.secret) as any;
    // req.user = decoded;
    console.log(decoded);
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }
}
