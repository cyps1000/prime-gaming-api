import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { RefreshToken } from "../models/RefreshToken";
import { Admin } from "../models/Admin";
import { User } from "../models/User";
import { BadRequestError, NotAuthorizedError } from "../services/error";

interface TokenData {
  id: string;
  role?: string;
  iat: number;
  exp: number;
}

export const requireUserAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new BadRequestError("You are not authorized.");
  }

  try {
    const token = jwt.verify(authorization, process.env.JWT_KEY!);

    console.log("token:", token);

    if (!token) throw new NotAuthorizedError();

    const _token = token as TokenData;

    const user = await User.findById(_token.id);

    if (user) {
      return next();
    }

    throw new BadRequestError("Account not found");
  } catch (error) {
    switch (error.name) {
      case "JsonWebTokenError":
        throw new BadRequestError("Token is invalid.");
      case "TokenExpiredError":
        throw new BadRequestError("Token has expired.");
      default:
        throw new BadRequestError(error.message);
    }
  }
};
