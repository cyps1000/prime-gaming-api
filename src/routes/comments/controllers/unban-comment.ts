/**
 * @see src\routes\comments\docs\unban-comment.doc.ts
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
  validateRequest
} from "../../../middlewares";

/**
 * Imports services
 */
import { RequestError, ErrorTypes } from "../../../services/error";

/**
 * Handles unbanning a comment
 */
const unbanComment = async (req: Request, res: Response) => {
  const { token } = req;
  const { id } = req.params;

  /**
   * Searches for the comment in the db
   */
  const comment = await Comment.findById(id);

  if (!comment) throw new RequestError(ErrorTypes.ResourceNotFound);

  comment.banned = false;

  await comment.save();

  res.send({ success: true, comment });
};

/**
 * Defines the controller
 */
const unbanCommentController: RequestHandler[] = [
  requireAdminAuth,
  currentUser,
  validateRequest,
  unbanComment
];

export { unbanCommentController };
