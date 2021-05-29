import { Request, Response, NextFunction } from "express";

/**
 * Imports models
 */
import { Admin, User } from "../models";

/**
 * Imports services
 */
import { BadRequestError } from "../services/error";
import { AuthService } from "../services/auth";

/**
 * Defines the middleware
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  /**
   * Verifies the authorization header and gets the access token
   */
  const { accessToken } = await AuthService.verify(authorization);

  /**
   * Assigns the token on each request
   */
  req.token = accessToken;

  /**
   * Checks if the user is an admin
   */
  if (accessToken.role === "prime-admin") {
    /**
     * Searches for the admin in the db
     */
    const admin = await Admin.findById(accessToken.id);
    if (admin) return next();

    throw new BadRequestError("Account not found");
  }

  /**
   * Searches for the user in the db
   */
  const user = await User.findById(accessToken.id);
  if (user) return next();

  throw new BadRequestError("Account not found");
};
