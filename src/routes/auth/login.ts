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
import { body } from "express-validator";
import { User } from "../../models/User";
import jwt from "jsonwebtoken";
import { validateRequest } from "../../middlewares";
import { BadRequestError } from "../../services/error";
import { PasswordManager } from "../../services/password-manager";

const requestValidation = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("You must provide a password."),
];

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new BadRequestError("Invalid credentials.");
  }

  const passwordsMatch = await PasswordManager.compare(
    existingUser.password,
    password
  );

  if (!passwordsMatch) {
    throw new BadRequestError("Invalid credentials.");
  }

  const userJWT = jwt.sign(
    { id: existingUser.id, email: existingUser.email },
    process.env.JWT_KEY!
  );

  req.session = {
    jwt: userJWT,
  };

  res.status(200).send(existingUser);
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
