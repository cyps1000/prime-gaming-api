/**
 * @see src\routes\articles\docs\delete-article.doc.ts
 */
import { Request, Response, RequestHandler } from "express";

/**
 * Imports models
 */
import { Article } from "../../../models";

/**
 * Imports middlewares
 */
import {
  currentUser,
  requireAdminAuth,
  validateRequest,
} from "../../../middlewares";

/**
 * Imports services
 */
import { RequestError, ErrorTypes } from "../../../services/error";

/**
 * Handles deleting an article
 */
const deleteArticle = async (req: Request, res: Response) => {
  const { id } = req.params;

  /**
   * Searches the article in the db
   */
  const article = await Article.findById(id);

  if (!article) throw new RequestError(ErrorTypes.ResourceNotFound);

  /**
   * Deletes the article
   */
  await article.remove();

  res.send({ success: true, article });
};

/**
 * Defines the controller
 */
const deleteArticleController: RequestHandler[] = [
  requireAdminAuth,
  currentUser,
  validateRequest,
  deleteArticle,
];

export { deleteArticleController };
