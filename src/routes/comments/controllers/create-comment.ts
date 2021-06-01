/**
 * @see src\routes\comments\docs\create-comment.doc.ts
 */
import { Request, Response, RequestHandler } from "express";

/**
 * Imports validator
 */
import { body } from "express-validator";

/**
 * Imports Models
 */
import { Comment } from "../../../models/Comment";
import { Article } from "../../../models/Article";

/**
 * Imports middlewares
 */
import {
  validateRequest,
  requireAuth,
  currentUser,
} from "../../../middlewares";

/**
 * Imports services
 */
import { RequestError, ErrorTypes } from "../../../services/error";

/**
 * Defines the request validation
 */
const requestValidation = [
  body("content")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Your comment must have at least 5 characters."),
  body("content")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Your comment exceeds the limit of 500 characters."),
  body("articleId")
    .not()
    .isEmpty()
    .withMessage("You must provide an article id."),
];

/**
 * Handles creating a comment
 */
const createComment = async (req: Request, res: Response) => {
  const { content, articleId } = req.body;

  const foundArticle = await Article.findById(articleId);

  if (!foundArticle) {
    throw new RequestError(ErrorTypes.ResourceNotFound);
  }

  const comment = Comment.build({
    content,
    user: req.currentUser!,
    articleId: foundArticle.id,
  });

  await comment.save();

  foundArticle.comments.push(comment.id);

  await foundArticle.save();

  res.status(201).send(comment);
};

/**
 * Defines the controller
 */
const createCommentController: RequestHandler[] = [
  requireAuth,
  currentUser,
  ...requestValidation,
  validateRequest,
  createComment,
];

export { createCommentController };
