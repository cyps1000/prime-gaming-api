/**
 * @api {POST} /articles POST - Create Article
 * @apiPermission Admin only
 * @apiVersion 1.0.0
 * @apiName PostCreateArticle
 * @apiSampleRequest off
 * @apiGroup Articles
 * @apiDescription Creates a new article
 * @apiHeaderExample {json} Must include Authorization Header:
 *     {
 *       "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTk2N2Q4OGE1ZDJkNTIyYzBkMzExMSIsInJvbGUiOiJwcmltZS1hZG1pbiIsInRrSWQiOiI2MGI0YTA5NTdjMWE2ZjQzOGMxMTRjNjEiLCJyZWZyZXNoVG9rZW4iOiI2MGI0YTA5NTdjMWE2ZjQzOGMxMTRjNjIiLCJpYXQiOjE2MjI0NTAzMjUsImV4cCI6MTYyMjQ1MjEyNX0.HJ3eJsyIIFg3snqU_c0ZCtE6TLSZ8BH-_uk8fGQdvEI"
 *     }
 * @apiParamExample  Example request 
    {
      "title": "How not to write an api doc",
      "content": "Step 1. I forgot what I was about to say. Goodbye"
    }
 * @apiParam (Request body) {String} title Username - required  
 * @apiParam (Request body) {String} [content] Content
 * @apiSuccessExample Example Response
    {
        "likes": [],
        "comments": [],
        "createdAt": "2021-05-31T11:57:54.290Z",
        "title": "How not to write an api doc",
        "content": "Step 1. I forgot what I was about to say. Goodbye",
        "author": "60a967d88a5d2d522c0d3111",
        "id": "60b4d051bfbbbd42f83bc4fd"
    }
 * @apiSuccess {String[]} likes Article likes
 * @apiSuccess {String[]} comments Article comments
 * @apiSuccess {String} createdAt Auto-generated created at date.
 * @apiSuccess {String} title Title
 * @apiSuccess {String} content Content
 * @apiSuccess {String} author User id
 * @apiSuccess {String} id Article id
 * @apiError (Error 400) InputValidation <code>Please provide a title.</code>
 * @apiError (Error 400) AuthorizationRequired  <code>The authorization header is required.</code>
 * @apiError (Error 401) NotAuthorized  <code>You are not authorized.</code>
 * @apiError (Error 401) RefreshTokenExpired <code>Refresh token has expired.</code>
 * @apiError (Error 401) AccessTokenExpired <code>Access token has expired.</code>
 * @apiError (Error 404) AccountNotFound <code>Account not found.</code>
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
                "message": "Please provide a title",
                "field": "title",
                "errorType": "InputValidation",
                "statusCode": 400
            }
        ]
    }
 */
