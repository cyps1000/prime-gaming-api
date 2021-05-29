import { Request, Response, NextFunction } from "express";

/**
 * Imports types
 */
import { AccessToken } from "../routes/auth/types";

/**
 * Imports models
 */
import { Admin } from "../models";

/**
 * Imports services
 */
import { BadRequestError, NotAuthorizedError } from "../services/error";
import { AuthService } from "../services/auth";

/**
 * Extends the request interface with the token key
 */
declare global {
  namespace Express {
    interface Request {
      token?: AccessToken;
    }
  }
}

/**
 * Defines the middleware
 */
export const requireAdminAuth = async (
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

  throw new NotAuthorizedError();
};
