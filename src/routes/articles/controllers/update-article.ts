/**
 * @see src\routes\articles\docs\update-article.doc.ts
 */
import { Request, Response, RequestHandler } from "express";

/**
 * Imports models
 */
import { Article } from "../../../models";

/**
 * Imports middlewares
 */
import { body } from "express-validator";
import {
  validateRequest,
  currentUser,
  requireAdminAuth,
} from "../../../middlewares";

/**
 * Imports services
 */
import { RequestError, ErrorTypes } from "../../../services/error";

/**
 * Defines the request validation middleware
 */
const requestValidation = [
  body("title").not().isEmpty().withMessage("Please provide a title"),
  body("content").not().isEmpty().withMessage("Please provide the content"),
];

/**
 * Handles updating an article
 */
const updateArticle = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const { id } = req.params;

  /**
   * Searches for the article in the db
   */
  const article = await Article.findById(id);

  if (!article) throw new RequestError(ErrorTypes.ResourceNotFound);

  article.title = title;
  article.content = content;

  await article.save();

  res.send(article);
};

/**
 * Defines the controller
 */
const updateArticleController: RequestHandler[] = [
  requireAdminAuth,
  currentUser,
  ...requestValidation,
  validateRequest,
  updateArticle,
];

export { updateArticleController };
