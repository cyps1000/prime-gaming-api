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

/**
 * Handles geteting the current user
 */
const getCurrentUser = (req: Request, res: Response) => {
  res
    .status(req.currentUser ? 200 : 404)
    .send({ currentUser: req.currentUser || null });
};

/**
 * Defines the controller
 */
const currentUserController: RequestHandler[] = [currentUser, getCurrentUser];

export { currentUserController };
