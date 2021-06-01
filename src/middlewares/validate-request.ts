import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

/**
 * Imports services
 */
import { RequestError, ErrorTypes } from "../services/error";

/**
 * Defines the middleware
 */
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestError(ErrorTypes.InputValidation, {
      errors: errors.array(),
    });
  }

  if (req.params.id && !mongoose.isValidObjectId(req.params.id)) {
    throw new RequestError(ErrorTypes.InvalidObjectID);
  }

  next();
};
