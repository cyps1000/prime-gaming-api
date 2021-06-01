/**
 * @see src\routes\auth\docs\register-admin.doc.ts
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
import { RequestError, ErrorTypes } from "../../../services/error";

/**
 * Defines the request validation middleware
 */
const requestValidation = [
  body("username").not().isEmpty().withMessage("Please provide your username."),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Please provide a password.")
    .bail()
    .isLength({ min: 10 })
    .withMessage("Password must be at least 10 characters long.")
    .bail()
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "g"
    )
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
    throw new RequestError(ErrorTypes.AdminExists);
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
