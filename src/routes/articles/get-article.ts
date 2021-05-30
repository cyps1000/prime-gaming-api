import { Request, Response, RequestHandler } from "express";
import { Article } from "../../models/Article";

import { RequestError, ErrorTypes } from "../../services/error";

const getArticle = async (req: Request, res: Response) => {
  const article = await Article.findById(req.params.id).populate({
    path: "comments",
    populate: {
      path: "userId",
      model: "User",
    },
  });

  if (!article) throw new RequestError(ErrorTypes.ResourceNotFound);

  res.send(article);
};

/**
 * Defines the controller
 */
const getArticleController: RequestHandler[] = [getArticle];

export { getArticleController };
