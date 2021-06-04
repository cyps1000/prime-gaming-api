/**
 * @see src\routes\users\docs\get-user.doc.ts
 */
import { Request, Response, RequestHandler } from "express";

/**
 * Imports models
 */
import { User } from "../../../models";

/**
 * Imports middlewares
 */
import { validateRequest, requireAdminAuth } from "../../../middlewares";

/**
 * Imports services
 */
import { RequestError, ErrorTypes } from "../../../services/error";

/**
 * Handles getting a user by id
 */
const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  /**
   * Searches for the user in the db
   * Populates the comments
   */
  const user = await User.findById(id);

  if (!user) throw new RequestError(ErrorTypes.AccountNotFound);

  res.send(user);
};

/**
 * Defines the controller
 */
const getUserController: RequestHandler[] = [
  requireAdminAuth,
  validateRequest,
  getUser
];

export { getUserController };
