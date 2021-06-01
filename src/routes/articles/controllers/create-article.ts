/**
 * @see src\routes\articles\docs\create-article.doc.ts
 */
import { Request, Response, RequestHandler } from "express";

/**
 * Imports middlewares
 */
import { body } from "express-validator";
import {
  requireAdminAuth,
  currentUser,
  validateRequest,
} from "../../../middlewares";

/**
 * Imports models
 */
import { Article } from "../../../models";

/**
 * Defines the request validation middleware
 */
const requestValidation = [
  body("title").not().isEmpty().withMessage("Please provide a title"),
];

/**
 * Handles creating a new article
 */
const createArticle = async (req: Request, res: Response) => {
  const { title, content } = req.body;

  /**
   * Builds an article document
   */
  const article = Article.build({
    title,
    content,
    author: req.currentUser!,
  });

  await article.save();

  res.status(201).send(article);
};

/**
 * Defines the controller
 */
const createArticleController: RequestHandler[] = [
  requireAdminAuth,
  currentUser,
  ...requestValidation,
  validateRequest,
  createArticle,
];

export { createArticleController };
