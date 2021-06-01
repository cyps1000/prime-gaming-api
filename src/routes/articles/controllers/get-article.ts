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
import { validateRequest } from "../../../middlewares";

/**
 * Imports services
 */
import { RequestError, ErrorTypes } from "../../../services/error";

/**
 * Handles getting an article by id
 */
const getArticle = async (req: Request, res: Response) => {
  const { id } = req.params;

  /**
   * Searches for the article in the db
   * Populates the comments
   */
  const article = await Article.findById(id).populate({
    path: "comments",
    populate: {
      path: "userId",
      model: "User",
    },
  });

  if (!article) throw new RequestError(ErrorTypes.ResourceNotFound);

  res.send(article);
};

/**
 * Defines the controller
 */
const getArticleController: RequestHandler[] = [validateRequest, getArticle];

export { getArticleController };
