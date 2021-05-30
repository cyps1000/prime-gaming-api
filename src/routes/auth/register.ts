/**
 * @api {POST} /auth/register  POST - Register User
 * @apiVersion 1.0.0
 * @apiName PostRegisterUser
 * @apiGroup Auth
 */
import mongoose from "mongoose";
import { Request, Response, RequestHandler } from "express";

/**
 * Imports middlewares
 */
import { body } from "express-validator";
import { validateRequest } from "../../middlewares";

/**
 * Imports models
 */
import { User, RefreshToken } from "../../models";

/**
 * Imports services
 */

import { AuthService } from "../../services/auth";
import { RequestError, ErrorTypes } from "../../services/error";

/**
 * Defines the request validation middleware
 */
const requestValidation = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("firstName")
    .not()
    .isEmpty()
    .withMessage("Please provide your first name"),
  body("lastName").not().isEmpty().withMessage("Please provide your last name"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
];

/**
 * Handles registering a user
 */
const registerUser = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  /**
   * Checks if the user exists
   */
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new RequestError(ErrorTypes.EmailInUse);
  }

  /**
   * Creates the user
   */
  const user = User.build({ email, password, firstName, lastName });
  await user.save();

  /**
   * Defines the payload
   */
  const payload = {
    id: user.id,
  };

  /**
   * Creates an access token
   */
  const { accessToken } = await AuthService.create(req, payload);

  res.status(201).send({ user, token: accessToken });
};

/**
 * Defines the controller
 */
const registerController: RequestHandler[] = [
  ...requestValidation,
  validateRequest,
  registerUser,
];

export { registerController };
