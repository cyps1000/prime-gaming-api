/**
 * @see src\routes\auth\docs\current-user.doc.ts
 */
import { Request, Response, RequestHandler } from "express";

/**
 * Imports middlewares
 */
import { requireAuth } from "../../../middlewares";

/**
 * Imports models
 */
import { Admin, User } from "../../../models";

/**
 * Handles getting the current user
 */
const getCurrentUser = async (req: Request, res: Response) => {
  const { token } = req;

  if (token!.role === "prime-admin") {
    const admin = await Admin.findById(token!.id);
    return res.send(admin);
  }

  const user = await User.findById(token!.id);
  return res.send(user);
};

/**
 * Defines the controller
 */
const currentUserController: RequestHandler[] = [requireAuth, getCurrentUser];

export { currentUserController };
