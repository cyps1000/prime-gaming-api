/**
 * @see src\routes\auth\docs\refresh-token.doc.ts
 */
import { Request, Response, RequestHandler } from "express";

/**
 * Imports services
 */
import { AuthService } from "../../../services/auth";

/**
 * Handles refreshing the token by sending a new access token
 */
const refreshToken = async (req: Request, res: Response) => {
  const { authorization } = req.headers;

  /**
   * Verifies the token
   */
  const { accessToken } = await AuthService.refresh(authorization);

  /**
   * Sets the token on each request
   */
  req.token = accessToken;

  return res.send({ accessToken });
};

/**
 * Defines the controller
 */
const refreshTokenController: RequestHandler[] = [refreshToken];

export { refreshTokenController };
