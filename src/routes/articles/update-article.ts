import { Request, Response, RequestHandler } from "express";
import { body } from "express-validator";
import { Article } from "../../models/Article";
import { Admin } from "../../models/Admin";
import jwt from "jsonwebtoken";
import { validateRequest, requireAuth, currentUser } from "../../middlewares";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from "../../services/error";

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

const updateArticle = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const isAdmin = await Admin.findById(req.currentUser!.id);

  if (!isAdmin) {
    throw new NotAuthorizedError();
  }

  const article = await Article.findById(req.params.id);

  if (!article) throw new NotFoundError();

  article.title = title;
  article.content = content;

  await article.save();

  res.send(article);
};

/**
 * Defines the controller
 */
const updateArticleController: RequestHandler[] = [updateArticle];

export { updateArticleController };
