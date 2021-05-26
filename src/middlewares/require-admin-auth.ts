import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { RefreshToken } from "../models/RefreshToken";
import { Admin } from "../models/Admin";
import mongoose from "mongoose";

import { User } from "../models/User";
import { BadRequestError, NotAuthorizedError } from "../services/error";

interface TokenData {
  id: string;
  role?: string;
  tkId: string;
  iat: number;
  exp: number;
  refreshToken: string;
}

export const requireAdminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new BadRequestError("You are not authorized.");
  }

  try {
    const token = jwt.verify(authorization, process.env.JWT_KEY!, {
      ignoreExpiration: true,
    });

    console.log("token:", token, new Date().getTime() / 1000);

    if (!token) throw new NotAuthorizedError();

    const _token = token as TokenData;

    console.log("Exp get time:", new Date(_token.exp).getTime());

    if (new Date(_token.exp).getTime() < new Date().getTime() / 1000) {
      const refreshToken = await RefreshToken.findById(_token.refreshToken);

      if (!refreshToken) {
        throw new BadRequestError("Token has expired.");
      }

      if (refreshToken.tokenId !== _token.tkId) {
        throw new NotAuthorizedError();
      }

      const tokenId = mongoose.Types.ObjectId().toHexString();

      const newToken = jwt.sign(
        {
          id: refreshToken.user,
          tkId: tokenId,
          role: _token.role,
          refreshToken: refreshToken.id,
        },
        process.env.JWT_KEY!,
        {
          expiresIn: 30,
        }
      );

      refreshToken.tokenId = tokenId;
      await refreshToken.save();

      return res.send({
        message:
          "Access token has expired. Use the new token to make the request.",
        accessToken: newToken,
      });
    }

    const admin = await Admin.findById(_token.id);
    if (admin) {
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
