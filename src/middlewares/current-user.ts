import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
/**
 * Defines the user payload
 */
interface UserPayload {
  id: string;
}

/**
 * Declares the current user as part of the req object globally
 */
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

/**
 * Defines the middleware
 */
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) return next();

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;

    req.currentUser = payload;
  } catch (error) {
    return res.send({ currentUser: null });
  }

  next();
};
