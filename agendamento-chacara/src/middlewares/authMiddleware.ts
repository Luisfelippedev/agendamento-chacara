import { NextFunction, Request, Response } from "express";
import { LoginService } from "../services/LoginService";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginService = new LoginService();

  const { authorization } = req.headers;

  const user = await loginService.getProfile(authorization);

  req.user = user;

  next();
};
