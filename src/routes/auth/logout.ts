/**
 * @api {POST} /auth/logout  POST - Logout User / Admin
 * @apiVersion 1.0.0
 * @apiName PostLogout
 * @apiGroup Auth
 */
import { Request, Response, RequestHandler } from "express";

/**
 * Imports middlewares
 */
import { requireAuth } from "../../middlewares";

/**
 * Imports models
 */
import { RefreshToken } from "../../models";

/**
 * Imports services
 */
import { RequestError, ErrorTypes } from "../../services/error";

/**
 * Handles logging out the user or admin
 */
const logout = async (req: Request, res: Response) => {
  if (!req.token) throw new RequestError(ErrorTypes.TokenMissingFromReq);

  /**
   * Deletes the associated refresh token
   */
  await RefreshToken.findOneAndDelete({ tokenId: req.token?.tkId });

  return res.send(true);
};

/**
 * Defines the controller
 */
const logoutController: RequestHandler[] = [requireAuth, logout];

export { logoutController };
