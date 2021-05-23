/**
 * @api {POST} /auth/register  POST - Register User
 * @apiVersion 1.0.0
 * @apiName PostRegisterUser
 * @apiGroup Auth
 * @apiSampleRequest off
 * @apiDescription
 *  Registers a user
 * @apiParamExample  Example request
    {
        "firstName": "John",
        "lastName": "Tyson",
        "email": "j.tyson@gmail.com",
        "password": "Test1231231"
    }
 * @apiParam {String} email Email - required.
 * @apiParam {String} firstName First name - required.
 * @apiParam {String} lastName Last name - required.
 * @apiParam {String} password Password - required.
 * @apiSuccessExample Example response
    {
        "firstName": "John",
        "lastName": "Tyson",
        "email": "j.tyson@gmail.com",
        "id": "60a96faf25552e625cce1dd7"
    }
 * @apiSuccess {String} email Email
 * @apiSuccess {String} firstName First name
 * @apiSuccess {String} lastName Last name
 * @apiSuccess {String} id MongoDB _id
 * @apiError EmailNotValid <code>Email must be valid</code>
 * @apiError PasswordNotValid <code>Password must be between 4 and 20 characters</code>
 */

import { Request, Response, RequestHandler } from "express";
import { body } from "express-validator";
import { User } from "../../models/User";
import jwt from "jsonwebtoken";
import { validateRequest } from "../../middlewares";
import { BadRequestError } from "../../services/error";

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

const registerUser = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError("Email in use");
  }

  const user = User.build({ email, password, firstName, lastName });
  await user.save();

  const userJWT = jwt.sign(
    {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    process.env.JWT_KEY!
  );

  req.session = {
    jwt: userJWT,
  };

  res.status(201).send(user);
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
