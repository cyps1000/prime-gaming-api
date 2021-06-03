/**
 * @see src\routes\users\docs\update-user.doc.ts
 */
import { Request, Response, RequestHandler } from "express";

/**
 * Imports models
 */
import { User, Admin } from "../../../models";

/**
 * Imports middlewares
 */
import { body } from "express-validator";
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
 * Defines the request validation middleware
 */
const requestValidation = [
  body("email").optional().isEmail().withMessage("Email must be valid"),
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide your first name"),
  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide your last name")
];

/**
 * Handles deleting a user
 */
const updateUser = async (req: Request, res: Response) => {
  const { currentUser } = req;
  const { id } = req.params;
  const { email, firstName, lastName } = req.body;

  /**
   * Searches the user in the db
   */
  const user = await User.findById(id);
  const isAdmin = await Admin.findById(currentUser);

  if (!user) throw new RequestError(ErrorTypes.ResourceNotFound);

  /**
   * Only allow the user itself to change the account or an admin
   */
  if (currentUser !== user.id && !isAdmin) {
    throw new RequestError(ErrorTypes.NotAuthorized);
  }

  if (email) user.email = email;
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;

  await user.save();

  res.send({ success: true, user });
};

/**
 * Defines the controller
 */
const updateUserController: RequestHandler[] = [
  ...requestValidation,
  validateRequest,
  requireAuth,
  currentUser,
  updateUser
];

export { updateUserController };
