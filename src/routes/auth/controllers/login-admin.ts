/**
 * @see src\routes\auth\docs\login-admin.doc.ts
 */
import { Request, Response, RequestHandler } from "express";

/**
 * Imports middlewares
 */
import { body } from "express-validator";
import { validateRequest } from "../../../middlewares";

/**
 * Imports models
 */
import { Admin } from "../../../models";

/**
 * Imports services
 */

import { AuthService } from "../../../services/auth";
import { PasswordManager } from "../../../services/password-manager";
import { RequestError, ErrorTypes } from "../../../services/error";

/**
 * Defines the request validation middleware
 */
const requestValidation = [
  body("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please provide a username"),
  body("password").trim().notEmpty().withMessage("You must provide a password.")
];

/**
 * Handles authenticating the admin
 */
const loginAdmin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  /**
   * Checks if the admin exists
   */
  const existingAdmin = await Admin.findOne({ username });

  if (!existingAdmin) {
    throw new RequestError(ErrorTypes.InvalidCredentials);
  }

  /**
   * Checks if the provided password is correct
   */
  const passwordsMatch = await PasswordManager.compare(
    existingAdmin.password,
    password
  );

  if (!passwordsMatch) {
    throw new RequestError(ErrorTypes.InvalidCredentials);
  }

  /**
   * Defines the payload
   */
  const payload = {
    id: existingAdmin.id,
    role: existingAdmin.role
  };

  /**
   * Creates an access token
   */
  const { accessToken } = await AuthService.create(req, payload);

  res.send({ token: accessToken });
};

/**
 * Defines the controller
 */
const loginAdminController: RequestHandler[] = [
  ...requestValidation,
  validateRequest,
  loginAdmin
];

export { loginAdminController };
