/**
 * @see src\routes\comments\docs\get-comment.doc.ts
 */
import { Request, Response, RequestHandler } from "express";

/**
 * Imports models
 */
import { Comment } from "../../../models";

/**
 * Imports middlewares
 */
import { validateRequest } from "../../../middlewares";

/**
 * Imports services
 */
import { RequestError, ErrorTypes } from "../../../services/error";

/**
 * Handles getting a comment by id
 */
const getComment = async (req: Request, res: Response) => {
  const { id } = req.params;

  /**
   * Searches for the comment in the db
   * Populates the comments
   */
  const comment = await Comment.findById(id).populate("user");

  if (!comment) throw new RequestError(ErrorTypes.ResourceNotFound);

  res.send(comment);
};

/**
 * Defines the controller
 */
const getCommentController: RequestHandler[] = [validateRequest, getComment];

export { getCommentController };
