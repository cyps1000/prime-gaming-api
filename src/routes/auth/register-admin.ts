/**
 * @api {POST} /auth/register-admin  POST - Register Admin
 * @apiVersion 1.0.0
 * @apiName PostRegisterAdmin
 * @apiGroup Auth
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

/**
 * Defines the request validation middleware
 */
const requestValidation = [
  body("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please provide your username"),
  body("password")
    .trim()
    .not()
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
    .withMessage(
      "Password must include one lowercase character, one uppercase character, a number, and a special character."
    ),
];

/**
 * Handles registering a new admin
 */
const registerAdmin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  /**
   * Checks if any admins exist
   */
  const existingAdmin = await Admin.findOne({});

  if (existingAdmin) {
    throw new BadRequestError(
      "An admin account already exists, contact your system administrator."
    );
  }

  /**
   * Creates the admin
   */
  const admin = Admin.build({ username, password, role: "prime-admin" });
  await admin.save();

  /**
   * Defines the payload
   */
  const payload = {
    id: admin.id,
    role: admin.role,
  };

  /**
   * Creates an access token
   */
  const { accessToken } = await AuthService.create(req, payload);

  res.status(201).send({ user: admin, token: accessToken });
};

/**
 * Defines the controller
 */
const registerAdminController: RequestHandler[] = [
  ...requestValidation,
  validateRequest,
  registerAdmin,
];

export { registerAdminController };
