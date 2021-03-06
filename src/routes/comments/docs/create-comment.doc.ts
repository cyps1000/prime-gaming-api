/**
 * @api {POST} /comments  POST - Create a comment
 * @apiPermission  User or Admin
 * @apiVersion 1.0.0
 * @apiName PostCreateComment
 * @apiGroup Comments
 * @apiSampleRequest off
 * @apiDescription
 *  Handles creating a new comment associated with an article. You must be authenticated.
 * @apiHeaderExample {json} Must include Authorization Header:
 *     {
 *       "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTk2N2Q4OGE1ZDJkNTIyYzBkMzExMSIsInJvbGUiOiJwcmltZS1hZG1pbiIsInRrSWQiOiI2MGI0YTA5NTdjMWE2ZjQzOGMxMTRjNjEiLCJyZWZyZXNoVG9rZW4iOiI2MGI0YTA5NTdjMWE2ZjQzOGMxMTRjNjIiLCJpYXQiOjE2MjI0NTAzMjUsImV4cCI6MTYyMjQ1MjEyNX0.HJ3eJsyIIFg3snqU_c0ZCtE6TLSZ8BH-_uk8fGQdvEI"
 *     }
 * @apiParamExample  Example request
      {
         "content": "Hello. This is me",
         "articleId": "60ac8cfe8c932132c4fe4173"
      }
 * @apiParam {String{5..500}} content Content - required (min: 5, max: 500 - characters) 
 * @apiParam {String} articleId Article Id - required
 * @apiSuccessExample Example response
      {
         "content": "Hello. This is me",
         "user": "60ad2887ce46da41fc4d1236",
         "articleId": "60ac8cfe8c932132c4fe4173",
         "createdAt": "2021-05-31T17:15:01.626Z",
         "updatedAt": "2021-05-31T17:15:01.626Z",
         "id": "60b51995397de345b092708f"
      }
 * @apiSuccess {String} content The contents of the comment
 * @apiSuccess {String} user MongoDB Id referencing the user who created the comment.
 * @apiSuccess {String} articleId MongoDB Id referencing the article that owns this comment.
 * @apiSuccess {String} id MongoDB Id referencing the id of the comment.
 * @apiSuccess {String} createdAt Comment created at time - auto-generated by Mongo
 * @apiSuccess {String} updatedAt Comment updated at time - auto-generated by Mongo
 * @apiError ResourceNotFound <code>Resource not found.</code>
 * @apiError (Error 400) InputValidation <ul>
 *  <li><code>Your comment must have at least 5 characters.</code></li>
 *  <li><code>Your comment exceeds the limit of 500 characters.</code></li>
 *  <li><code>You must provide an article id.</code></li>
 * </ul>
 * @apiError (Error 400) AuthorizationRequired  <code>The authorization header is required.</code>
 * @apiError (Error 401) NotAuthorized  <code>You are not authorized.</code>
 * @apiError (Error 401) RefreshTokenExpired <code>Refresh token has expired.</code>
 * @apiError (Error 401) AccessTokenExpired <code>Access token has expired.</code>
 * @apiError (Error 404) AccountNotFound <code>Account not found.</code>
 * @apiError NoArticleId <code>You must provide an article id.</code>
 * @apiErrorExample {json} Example Error Response:
    {
          "errors": [
              {
                  "message": "The authorization header is required.",
                  "errorType": "AuthorizationRequired",
                  "statusCode": 400
              }
          ]
      }
* @apiErrorExample {json} InputValidation Response:
      {
         "errors": [
            {
                  "message": "Your comment must have at least 5 characters.",
                  "field": "content",
                  "errorType": "InputValidation",
                  "statusCode": 400
            },
            {
                  "message": "You must provide an article id.",
                  "field": "articleId",
                  "errorType": "InputValidation",
                  "statusCode": 400
            }
         ]
      }
 */
