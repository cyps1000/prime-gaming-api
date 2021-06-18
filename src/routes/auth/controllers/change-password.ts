/**
 * @see src\routes\auth\docs\change-password.doc.ts
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
  requireAuth,
  validateRequest,
} from "../../../middlewares";

/**
 * Imports services
 */
import { RequestError, ErrorTypes } from "../../../services/error";
import { PasswordManager } from "../../../services/password-manager";

/**
 * Defines the request validation middleware
 */
const requestValidation = [
  body("currentPassword")
    .trim()
    .notEmpty()
    .withMessage("You must provide your current password."),
  body("newPassword")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Your new password must be between 4 and 20 characters"),
];

/**
 * Handles deleting a user
 */
const changePassword = async (req: Request, res: Response) => {
  const { currentUser } = req;
  const { currentPassword, newPassword } = req.body;

  /**
   * Searches the user in the db
   */
  const user = await User.findById(currentUser);

  if (!user) throw new RequestError(ErrorTypes.AccountNotFound);

  /**
   * Checks if the provided password is correct
   */
  const passwordsMatch = await PasswordManager.compare(
    user.password,
    currentPassword
  );

  if (!passwordsMatch) {
    throw new RequestError(ErrorTypes.InvalidCredentials);
  }

  // user.password = await PasswordManager.hash(newPassword);
  user.password = newPassword;

  await user.save();

  res.send({ success: true, user });
};

/**
 * Defines the controller
 */
const changePasswordController: RequestHandler[] = [
  requireAuth,
  ...requestValidation,
  validateRequest,
  currentUser,
  changePassword,
];

export { changePasswordController };
