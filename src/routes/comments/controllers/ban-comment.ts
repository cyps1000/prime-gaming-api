/**
 * @see src\routes\comments\docs\ban-comment.doc.ts
 */
import { Request, Response, RequestHandler } from "express";

/**
 * Imports models
 */
import { Comment } from "../../../models";

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
 * Handles banning a comment
 */
const banComment = async (req: Request, res: Response) => {
  const { id } = req.params;

  /**
   * Searches for the comment in the db
   */
  const comment = await Comment.findById(id);

  if (!comment) throw new RequestError(ErrorTypes.ResourceNotFound);

  comment.banned = true;

  await comment.save();

  res.send(comment);
};

/**
 * Defines the controller
 */
const banCommentController: RequestHandler[] = [
  requireAdminAuth,
  currentUser,
  validateRequest,
  banComment,
];

export { banCommentController };
