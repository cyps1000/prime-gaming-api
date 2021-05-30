import { Request, Response, NextFunction } from "express";

/**
 * Imports services
 */
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
  const { accessToken } = await AuthService.verify(authorization, {
    validate: true,
    check: ["user"],
  });

  /**
   * Assigns the token on each request
   */
  req.token = accessToken;
  return next();
};
