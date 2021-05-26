/**
 * @api {GET} /auth/ GET - Gets the current user
 * @apiVersion 1.0.0
 * @apiName GetCurrentUser
 * @apiGroup Auth
 * @apiDescription
 *  Gets the currently logged in user. You need to send the cookie for this to work.
 * @apiSampleRequest http://localhost:3001/v1/auth
 * @apiSuccessExample Example response User
    {
        "currentUser": {
            "id": "60a96faf25552e625cce1dd7",
            "email": "j.tyson@gmail.com",
            "firstName": "John",
            "lastName": "Tyson",
            "iat": 1621716911
        }
    }
* @apiSuccessExample Example response Admin
    {
        "currentUser": {
            "id": "60a967d88a5d2d522c0d3111",
            "username": "godsavethequeen",
            "iat": 1621746434
        }
    }
 * @apiSuccess {String} email Email (only for normal User)
 * @apiSuccess {String} username Username (only for Admin)
 * @apiSuccess {String} firstName First name
 * @apiSuccess {String} lastName Last name
 * @apiSuccess {String} id MongoDB _id
 * @apiSuccess {Number} iat Token issued at time
 * @apiError  CurrentUserNull If the current user is null, it means you are not logged in or you didn't send a cookie.
 */

import { Request, Response, RequestHandler } from "express";
import { currentUser } from "../../middlewares";
import jwt from "jsonwebtoken";
import { Admin } from "../../models/Admin";
import { User } from "../../models/User";
import { BadRequestError, NotAuthorizedError } from "../../services/error";

interface TokenData {
  id: string;
  role?: string;
  iat: number;
  exp: number;
}

/**
 * Handles geteting the current user
 */
const getCurrentUser = async (req: Request, res: Response) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new BadRequestError("No authorization header provided");
  }

  try {
    const token = jwt.verify(authorization, process.env.JWT_KEY!);

    if (!token) throw new NotAuthorizedError();

    const _token = token as TokenData;

    if (_token.role === "prime-admin") {
      const admin = await Admin.findById(_token.id);
      if (admin) {
        return res.send(admin);
      }

      throw new BadRequestError("Account not found");
    }

    const user = await User.findById(_token.id);

    if (user) {
      return res.send(user);
    }

    throw new BadRequestError("Account not found");
  } catch (error) {
    switch (error.name) {
      case "JsonWebTokenError":
        throw new BadRequestError("Token is invalid.");
      case "TokenExpiredError":
        throw new BadRequestError("Token has expired.");
      default:
        throw new BadRequestError(error);
    }
  }
};

/**
 * Defines the controller
 */
const currentUserController: RequestHandler[] = [currentUser, getCurrentUser];

export { currentUserController };
