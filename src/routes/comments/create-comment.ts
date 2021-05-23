/**
 * @api {POST} /comments  POST - Create a comment
 * @apiVersion 1.0.0
 * @apiName PostCreateComment
 * @apiGroup Comments
 * @apiSampleRequest off
 * @apiDescription
 *  Handles creating a new comment associated with an article 
 * @apiParamExample  Example request
    {
      "content": "This is a test.",
      "articleId": "60aa2a24a79a8c48a05d1436"
    }
 * @apiParam {String} content Content - required (5 - 500 characters)
 * @apiParam {String} articleId Article Id - required, MongoDB ID
 * @apiSuccessExample Example response
    {
        "createdAt": "2021-05-23T10:49:13.895Z",
        "content":  "This is a test.",
        "userId": "60a967d88a5d2d522c0d3111",
        "articleId": "60aa2a24a79a8c48a05d1436",
        "id": "60aa33387210c4420c8c76a4"
    }
 * @apiSuccess {Date} createdAt Date at which the record is created
 * @apiSuccess {String} content The contents of the comment
 * @apiSuccess {String} userId MongoDB Id referencing the user who created the comment.
 * @apiSuccess {String} articleId MongoDB Id referencing the article that owns this comment.
 * @apiSuccess {String} id MongoDB Id referencing the id of the comment.
 * @apiError ArticleNotFound <code>Article not found</code> . The provided articleId didn't result in any matches in the database.
 * @apiError CommentTooShort <code>Your comment must have at least 5 characters.</code>
 * @apiError CommentTooLong <code>Your comment exceeds the limit of 500 characters.</code>
 * @apiError NoArticleId <code>You must provide an article id.</code>
 */
import { Request, Response, RequestHandler } from "express";

/**
 * Imports validator
 */
import { body } from "express-validator";

/**
 * Imports Models
 */
import { Comment } from "../../models/Comment";
import { Article } from "../../models/Article";

/**
 * Imports middlewares
 */
import { validateRequest, requireAuth, currentUser } from "../../middlewares";

/**
 * Imports services
 */
import { BadRequestError } from "../../services/error";

/**
 * Defines the request validation
 */
const requestValidation = [
  body("content")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Your comment must have at least 5 characters."),
  body("content")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Your comment exceeds the limit of 500 characters."),
  body("articleId")
    .not()
    .isEmpty()
    .withMessage("You must provide an article id."),
];

/**
 * Handles creating a comment
 */
const createComment = async (req: Request, res: Response) => {
  const { content, articleId } = req.body;

  const foundArticle = await Article.findById(articleId);

  if (!foundArticle) {
    throw new BadRequestError("Article not found");
  }

  const comment = Comment.build({
    content,
    userId: req.currentUser!.id,
    articleId: foundArticle.id,
  });

  await comment.save();

  foundArticle.comments.push(comment.id);

  await foundArticle.save();

  res.status(201).send(comment);
};

/**
 * Defines the controller
 */
const createCommentController: RequestHandler[] = [
  currentUser,
  requireAuth,
  ...requestValidation,
  validateRequest,
  createComment,
];

export { createCommentController };
