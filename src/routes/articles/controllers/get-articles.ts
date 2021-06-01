/**
 * @see src\routes\articles\docs\get-articles.doc.ts
 */
import { Request, Response, RequestHandler } from "express";

/**
 * Imports models
 */
import { Article } from "../../../models";

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
const getArticles = async (req: Request, res: Response) => {
  const { page, limit, orderBy, orderDir } = req.query;

  /**
   * Defines the pagination config
   */
  const config: PaginationConfig = {
    pagination: { page, limit, orderBy, orderDir },
    populate: {
      path: "comments author",
      populate: {
        path: "userId",
        model: "User",
      },
    },
  };

  const data = await PaginationService.paginate(Article, config);

  res.send(data);
};

/**
 * Defines the controller
 */
const getArticlesController: RequestHandler[] = [getArticles];

export { getArticlesController };
