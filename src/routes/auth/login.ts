/**
 * @api {POST} /auth/login  POST - Login User
 * @apiVersion 1.0.0
 * @apiName PostLoginUser
 * @apiGroup Auth
 * @apiSampleRequest off
 * @apiDescription
 *  Log in as a user
 * @apiParamExample  Example request
    {
        "email": "john@test.com",
        "password": "myweakpassword"
    }
 * @apiParam {String} email Email - required.
 * @apiParam {String} password Password - required.
 * @apiSuccessExample Example response
    {
        "email": "john@test.com",
        "firstName": "John",
        "lastName": "Dixon",
        "id": "60a9ea51489ee6170cd87a06"
    }
 * @apiSuccess {String} email Email
 * @apiSuccess {String} firstName  First name
 * @apiSuccess {String} lastName  Last name
 * @apiSuccess {String} id MongoDB _id
 * @apiError (Error 400 - Bad Request)  EmailEmpty <code>Please provide your email.</code>
 * @apiError (Error 400 - Bad Request) InvalidCredentials <code>Invalid credentials.</code> 
 */
import { Request, Response, RequestHandler } from "express";

/**
 * Imports middlewares
 */
import { body } from "express-validator";
import { validateRequest } from "../../middlewares";

/**
 * Imports models
 */
import { User } from "../../models";

/**
 * Imports services
 */

import { AuthService } from "../../services/auth";
import { PasswordManager } from "../../services/password-manager";
import { RequestError, ErrorTypes } from "../../services/error";

/**
 * Defines the request validation middleware
 */
const requestValidation = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("You must provide a password."),
];

/**
 * Handles authenticating the user
 */
const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  /**
   * Checks if the user exists
   */
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new RequestError(ErrorTypes.InvalidCredentials);
  }

  /**
   * Checks if the provided password is correct
   */
  const passwordsMatch = await PasswordManager.compare(
    existingUser.password,
    password
  );

  if (!passwordsMatch) {
    throw new RequestError(ErrorTypes.InvalidCredentials);
  }

  /**
   * Defines the payload
   */
  const payload = {
    id: existingUser.id,
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
const loginController: RequestHandler[] = [
  ...requestValidation,
  validateRequest,
  loginUser,
];

export { loginController };
