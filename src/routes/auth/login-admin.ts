/**
 * @api {POST} /auth/login-admin  POST - Login Admin
 * @apiVersion 1.0.0
 * @apiName PostLoginAdmin
 * @apiGroup Auth
 * @apiSampleRequest off
 * @apiDescription
 *  Log in as an admin
 * @apiParamExample  Example request
    {
        "username": "iamrootgroot",
        "password": "B2hQXHluXA2Ta2F$"
    }
 * @apiParam {String} username Username - required.
 * @apiParam {String} password Password - required.
 * @apiSuccessExample Example response
 * {
 *   "username": "iamrootgroot",
 *   "role": "prime-admin",
 *   "id": "60a967d88a5d2d522c0d3111"
 *  }
 * @apiSuccess {String} username Username
 * @apiSuccess {String} role Role of prime-admin
 * @apiSuccess {String} id MongoDB _id
 * @apiError (Error 400 - Bad Request)  UsernameEmpty <code>Please provide your username.</code>
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
import { Admin } from "../../models";

/**
 * Imports services
 */
import { BadRequestError } from "../../services/error";
import { AuthService } from "../../services/auth";
import { PasswordManager } from "../../services/password-manager";

/**
 * Defines the request validation middleware
 */
const requestValidation = [
  body("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please provide a username"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("You must provide a password."),
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
    throw new BadRequestError("Invalid credentials.");
  }

  /**
   * Checks if the provided password is correct
   */
  const passwordsMatch = await PasswordManager.compare(
    existingAdmin.password,
    password
  );

  if (!passwordsMatch) {
    throw new BadRequestError("Invalid credentials.");
  }

  /**
   * Defines the payload
   */
  const payload = {
    id: existingAdmin.id,
    role: existingAdmin.role,
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
  loginAdmin,
];

export { loginAdminController };
