/**
 * @api {POST} /auth/register-admin  POST - Register Admin
 * @apiVersion 1.0.0
 * @apiName PostRegisterAdmin
 * @apiGroup Auth
 * @apiSampleRequest off
 * @apiDescription
 *  Currently only one account is supported,
 *  if an account exists, the  request will return an error.
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
 * @apiError UsernameEmpty <code>Please provide your username.</code>
 * @apiError PasswordNotStrongEnough <code>The password must include one lowercase character, one uppercase character, a number, and a special character.</code>
 * @apiError AdminExists <code>An admin account already exists, contact your system administrator.</code>
 */

import { Request, Response, RequestHandler } from "express";
import { body } from "express-validator";
import { Admin } from "../../models/Admin";
import jwt from "jsonwebtoken";
import { validateRequest } from "../../middlewares";
import { BadRequestError } from "../../services/error";

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

const registerAdmin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const existingAdmin = await Admin.findOne({});

  console.log("WORKS");

  if (existingAdmin) {
    throw new BadRequestError(
      "An admin account already exists, contact your system administrator."
    );
  }

  const admin = Admin.build({ username, password, role: "prime-admin" });
  await admin.save();

  const adminJWT = jwt.sign(
    { id: admin.id, username: admin.username },
    process.env.JWT_KEY!
  );

  req.session = {
    jwt: adminJWT,
  };

  res.status(201).send(admin);
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
