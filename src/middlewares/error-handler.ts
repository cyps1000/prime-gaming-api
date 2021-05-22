import { Request, Response, NextFunction } from "express";
import { CustomError } from "../services/error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  /**
   * Console the error
   */
  console.error(err);
  res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });
};
