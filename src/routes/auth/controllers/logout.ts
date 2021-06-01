/**
 * @see src\routes\auth\docs\logout.doc.ts
 */
import { Request, Response, RequestHandler } from "express";

/**
 * Imports middlewares
 */
import { requireAuth } from "../../../middlewares";

/**
 * Imports models
 */
import { RefreshToken } from "../../../models";

/**
 * Handles logging out the user or admin
 */
const logout = async (req: Request, res: Response) => {
  /**
   * Deletes the associated refresh token
   */
  await RefreshToken.findOneAndDelete({ tokenId: req.token!.tkId });

  return res.send(true);
};

/**
 * Defines the controller
 */
const logoutController: RequestHandler[] = [requireAuth, logout];

export { logoutController };
