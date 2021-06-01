/**
 * @see src\routes\comments\docs\get-comments.doc.ts
 */
import { Request, Response, RequestHandler } from "express";

/**
 * Imports models
 */
import { Comment } from "../../../models";

/**
 * Imports services
 */
import { PaginationService } from "../../../services/pagination";

/**
 * Handles getting the comments
 */
const getComments = async (req: Request, res: Response) => {
  const { page, limit, orderBy, orderDir } = req.query;

  /**
   * Defines the pagination config
   */
  const config = {
    pagination: { page, limit, orderBy, orderDir },
    populate: { path: "user" },
  };

  /**
   * Gets the data
   */
  const data = await PaginationService.paginate(Comment, config);

  res.send(data);
};

/**
 * Defines the controller
 */
const getCommentsController: RequestHandler[] = [getComments];

export { getCommentsController };
