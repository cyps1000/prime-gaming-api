/**
 * @see src\routes\comments\docs\update-comment.doc.ts
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
  requireAuth,
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
 * Handles updating an comment
 */
const updateComment = async (req: Request, res: Response) => {
  const { token } = req;
  const { content } = req.body;
  const { id } = req.params;

  /**
   * Searches for the comment in the db
   */
  const comment = await Comment.findById(id);

  if (!comment) throw new RequestError(ErrorTypes.ResourceNotFound);

  /**
   * Checks if the user who made the comment is deleting or an admin
   */
  if (token!.id !== comment.user.toString()) {
    throw new RequestError(ErrorTypes.NotAuthorized);
  }

  comment.content = content;

  await comment.save();

  res.send(comment);
};

/**
 * Defines the controller
 */
const updateCommentController: RequestHandler[] = [
  requireAuth,
  currentUser,
  ...requestValidation,
  validateRequest,
  updateComment,
];

export { updateCommentController };
