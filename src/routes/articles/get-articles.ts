import { Request, Response, RequestHandler } from "express";
import { body } from "express-validator";
import { Article } from "../../models/Article";
import jwt from "jsonwebtoken";
import { validateRequest, requireAuth } from "../../middlewares";
import { BadRequestError } from "../../services/error";

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

const getArticles = async (req: Request, res: Response) => {
  const pageOptions: {
    page: number;
    limit: number;
    orderBy: string;
    orderDir: string;
  } = {
    page: req.query.page ? parseInt(req.query.page.toString()) : 1,
    limit: req.query.limit ? parseInt(req.query.limit.toString()) : 5,
    orderBy: req.query.orderBy ? req.query.orderBy.toString() : "createdAt",
    orderDir: req.query.orderDir ? req.query.orderDir.toString() : "desc",
  };

  console.log("pageOptions:", pageOptions);

  const articles = await Article.find({})
    .skip((pageOptions.page - 1) * pageOptions.limit)
    .limit(pageOptions.limit)
    .sort({
      [pageOptions.orderBy]: pageOptions.orderDir,
    })
    .populate({
      path: "comments",
      populate: {
        path: "userId",
        model: "User",
      },
    });
  const count = await Article.countDocuments();

  res.send({
    items: articles,
    total: count,
    currentPage: pageOptions.page,
    itemsPerPage: pageOptions.limit,
    totalPages:
      count < pageOptions.limit
        ? 1
        : Math.floor((count + pageOptions.limit - 1) / pageOptions.limit),
    orderBy: pageOptions.orderBy,
    orderDir: pageOptions.orderDir,
  });
};

/**
 * Defines the controller
 */
const getArticlesController: RequestHandler[] = [getArticles];

export { getArticlesController };
