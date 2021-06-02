/**
 * @see src\routes\users\docs\get-users.doc.ts
 */
import { Request, Response, RequestHandler } from "express";

/**
 * Imports models
 */
import { User } from "../../../models";

/**
 * Imports middlewares
 */
import { requireAdminAuth } from "../../../middlewares";

/**
 * Imports services
 */
import {
  PaginationService,
  PaginationConfig,
} from "../../../services/pagination";

/**
 * Handles getting the articles
 */
const getUsers = async (req: Request, res: Response) => {
  const { page, limit, orderBy, orderDir } = req.query;

  /**
   * Defines the pagination config
   */
  const config: PaginationConfig = {
    pagination: { page, limit, orderBy, orderDir },
  };

  const data = await PaginationService.paginate(User, config);

  res.send(data);
};

/**
 * Defines the controller
 */
const getUsersController: RequestHandler[] = [requireAdminAuth, getUsers];

export { getUsersController };
