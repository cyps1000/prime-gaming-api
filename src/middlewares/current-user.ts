import { Request, Response, NextFunction } from "express";

/**
 * Imports services
 */
import { AuthService } from "../services/auth";

/**
 * Defines the middleware
 */
export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * Handles getting the current user
   */
  const { currentUser } = await AuthService.getCurrentUser(req.token);

  req.currentUser = currentUser;
  return next();
};
