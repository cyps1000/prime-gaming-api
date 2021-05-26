import { Request, Response, NextFunction } from "express";
import { Blacklist } from "../models/Blacklist";
import { BadRequestError } from "../services/error";

export const blacklistHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isBlacklisted = await Blacklist.findOne({ ip: req.ip });

  if (isBlacklisted) {
    throw new BadRequestError("You have been banned.");
  }

  next();
};
