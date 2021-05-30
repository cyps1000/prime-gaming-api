import { Request, Response, NextFunction } from "express";

/**
 * Imports models
 */
import { Blacklist } from "../models";

/**
 * Imports services
 */
import { RequestError, ErrorTypes } from "../services/error";

/**
 * Defines the middleware
 */
export const blacklistHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * Checks if the ip is blacklisted
   */
  const isBlacklisted = await Blacklist.findOne({ ip: req.ip });

  if (isBlacklisted) {
    throw new RequestError(ErrorTypes.UserBanned);
  }

  next();
};
