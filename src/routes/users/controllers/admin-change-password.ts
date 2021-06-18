/**
 * @see src\routes\users\docs\admin-change-password.doc.ts
 */
import { Request, Response, RequestHandler } from "express";

/**
 * Imports models
 */
import { User } from "../../../models";

/**
 * Imports middlewares
 */
import { body } from "express-validator";
import {
  currentUser,
  requireAdminAuth,
  validateRequest,
} from "../../../middlewares";

/**
 * Imports services
 */
import { RequestError, ErrorTypes } from "../../../services/error";

/**
 * Defines the request validation middleware
 */
const requestValidation = [
  body("newPassword")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("The password must be between 4 and 20 characters"),
];

/**
 * Handles deleting a user
 */
const changePassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  /**
   * Searches the user in the db
   */
  const user = await User.findById(id);

  if (!user) throw new RequestError(ErrorTypes.AccountNotFound);

  user.password = newPassword;

  await user.save();

  res.send({ success: true, user });
};

/**
 * Defines the controller
 */
const adminChangePasswordController: RequestHandler[] = [
  requireAdminAuth,
  ...requestValidation,
  validateRequest,
  currentUser,
  changePassword,
];

export { adminChangePasswordController };
