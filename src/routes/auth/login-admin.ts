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
import mongoose from "mongoose";
import { body } from "express-validator";
import { Admin } from "../../models/Admin";
import { RefreshToken } from "../../models/RefreshToken";
import jwt from "jsonwebtoken";
import { validateRequest } from "../../middlewares";
import { BadRequestError } from "../../services/error";
import { PasswordManager } from "../../services/password-manager";

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

const loginAdmin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const existingAdmin = await Admin.findOne({ username });

  if (!existingAdmin) {
    throw new BadRequestError("Invalid credentials.");
  }

  const passwordsMatch = await PasswordManager.compare(
    existingAdmin.password,
    password
  );

  if (!passwordsMatch) {
    throw new BadRequestError("Invalid credentials.");
  }

  const tokenId = mongoose.Types.ObjectId().toHexString();

  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + 60);

  const refreshTokenDoc = RefreshToken.build({
    user: existingAdmin.id,
    tokenId: tokenId,
    expiresAt: expiresAt,
    createdByIp: req.ip,
  });

  await refreshTokenDoc.save();

  const adminJWT = jwt.sign(
    {
      id: existingAdmin.id,
      tkId: tokenId,
      role: existingAdmin.role,
      refreshToken: refreshTokenDoc.id,
    },
    process.env.JWT_KEY!,
    {
      // expiresIn: 30 * 60, // 30 minutes
      expiresIn: 15,
    }
  );

  res.status(200).send({ token: adminJWT });
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
