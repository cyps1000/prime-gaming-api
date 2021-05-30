import { Request, Response, RequestHandler } from "express";
import { body } from "express-validator";
import { Comment } from "../../models/Comment";
import jwt from "jsonwebtoken";
import { validateRequest, requireAuth } from "../../middlewares";

const requestValidation = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("firstName")
    .not()
    .isEmpty()
    .withMessage("Please provide your first name"),
  body("lastName").not().isEmpty().withMessage("Please provide your last name"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
];

const getComments = async (req: Request, res: Response) => {
  const comments = await Comment.find({});
  res.send(comments);
};

/**
 * Defines the controller
 */
const getCommentsController: RequestHandler[] = [getComments];

export { getCommentsController };
