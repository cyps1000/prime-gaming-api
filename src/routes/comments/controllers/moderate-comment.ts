/**
 * @see src\routes\comments\docs\moderate-comment.doc.ts
 */
import { Request, Response, RequestHandler } from "express";

/**
 * Imports models
 */
import { Comment } from "../../../models";

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
  body("content").not().isEmpty().withMessage("Please provide the content"),
];

/**
 * Handles moderating a comment
 */
const moderateComment = async (req: Request, res: Response) => {
  const { token } = req;
  const { content } = req.body;
  const { id } = req.params;

  /**
   * Searches for the comment in the db
   */
  const comment = await Comment.findById(id);

  if (!comment) throw new RequestError(ErrorTypes.ResourceNotFound);

  comment.moderated = true;
  comment.moderatedContent = content;

  await comment.save();

  res.send(comment);
};

/**
 * Defines the controller
 */
const moderateCommentController: RequestHandler[] = [
  requireAdminAuth,
  currentUser,
  ...requestValidation,
  validateRequest,
  moderateComment,
];

export { moderateCommentController };
