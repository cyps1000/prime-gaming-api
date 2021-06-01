/**
 * @see src\routes\comments\docs\delete-comment.doc.ts
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
  requireAuth,
  validateRequest,
} from "../../../middlewares";

/**
 * Imports services
 */
import { RequestError, ErrorTypes } from "../../../services/error";

/**
 * Handles deleting an comment
 */
const deleteComment = async (req: Request, res: Response) => {
  const { token } = req;
  const { id } = req.params;

  /**
   * Searches the comment in the db
   */
  const comment = await Comment.findById(id);

  if (!comment) throw new RequestError(ErrorTypes.ResourceNotFound);

  /**
   * Checks if the user who made the comment is deleting or an admin
   */
  if (token!.id !== comment.user.toString() && token!.role !== "prime-admin") {
    throw new RequestError(ErrorTypes.NotAuthorized);
  }

  /**
   * Deletes the comment
   */
  await comment.remove();

  res.send({ success: true, comment });
};

/**
 * Defines the controller
 */
const deleteCommentController: RequestHandler[] = [
  requireAuth,
  currentUser,
  validateRequest,
  deleteComment,
];

export { deleteCommentController };
