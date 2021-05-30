import { Request, Response, RequestHandler } from "express";
import { requireAdminAuth, requireAuth } from "../../middlewares";

/**
 * Imports models
 */
import { Article } from "../../models";

/**
 * Handles getting the articles
 */
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
    })
    .populate("author");
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
const getArticlesController: RequestHandler[] = [requireAuth, getArticles];

export { getArticlesController };
