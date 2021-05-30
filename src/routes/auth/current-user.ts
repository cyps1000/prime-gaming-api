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

/**
 * Imports middlewares
 */
import { requireAuth } from "../../middlewares";

/**
 * Imports models
 */
import { Admin, User } from "../../models";

/**
 * Imports services
 */
import { RequestError, ErrorTypes } from "../../services/error";

/**
 * Handles getting the current user
 */
const getCurrentUser = async (req: Request, res: Response) => {
  if (!req.token) {
    throw new RequestError(ErrorTypes.NotAuthorized);
  }

  if (req.token.role === "prime-admin") {
    const admin = await Admin.findById(req.token.id);
    if (admin) return res.send(admin);

    throw new RequestError(ErrorTypes.AccountNotFound);
  }

  const user = await User.findById(req.token.id);
  if (user) return res.send(user);

  throw new RequestError(ErrorTypes.AccountNotFound);
};

/**
 * Defines the controller
 */
const currentUserController: RequestHandler[] = [requireAuth, getCurrentUser];

export { currentUserController };
