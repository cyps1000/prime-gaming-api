import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

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

  next();
};
