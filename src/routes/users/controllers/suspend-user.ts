/**
 * @see src\routes\users\docs\suspend-user.doc.ts
 */
import { Request, Response, RequestHandler } from "express";

/**
 * Imports models
 */
import { User, Admin } from "../../../models";

/**
 * Imports middlewares
 */
import {
  currentUser,
  requireAuth,
  validateRequest
} from "../../../middlewares";

/**
 * Imports services
 */
import { RequestError, ErrorTypes } from "../../../services/error";

/**
 * Handles deleting a user
 */
const suspendUser = async (req: Request, res: Response) => {
  const { currentUser } = req;
  const { id } = req.params;

  /**
   * Searches the user in the db
   */
  const user = await User.findById(id);
  const isAdmin = await Admin.findById(currentUser);

  if (!user) throw new RequestError(ErrorTypes.AccountNotFound);

  /**
   * Only allow the user itself to change the account or an admin
   */
  if (currentUser !== user.id && !isAdmin) {
    throw new RequestError(ErrorTypes.NotAuthorized);
  }

  user.suspended = true;
  await user.save();

  res.send({ success: true, user });
};

/**
 * Defines the controller
 */
const suspendUserController: RequestHandler[] = [
  requireAuth,
  currentUser,
  validateRequest,
  suspendUser
];

export { suspendUserController };
