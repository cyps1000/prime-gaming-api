/**
 * @see src\routes\users\docs\delete-user.doc.ts
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
const deleteUser = async (req: Request, res: Response) => {
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

  /**
   * Regular user can only delete their account if it was suspended first.
   */
  if (!isAdmin && !user.suspended) {
    throw new RequestError(ErrorTypes.NotSuspendedAccount);
  }

  /**
   * Deletes the user
   */
  await user.remove();

  res.send({ success: true, user });
};

/**
 * Defines the controller
 */
const deleteUserController: RequestHandler[] = [
  requireAuth,
  currentUser,
  validateRequest,
  deleteUser
];

export { deleteUserController };
