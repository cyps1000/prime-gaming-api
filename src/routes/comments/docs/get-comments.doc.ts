/**
 * @api {GET} /comments GET - Get Comments List
 * @apiVersion 1.0.0
 * @apiName GetComments
 * @apiSampleRequest off
 * @apiGroup Comments
 * @apiDescription  Gets a list of comments
 * @apiParam (Query Parameters) {Number} [page=1] Comment Unique ID.
 * @apiParam (Query Parameters) {Number} [limit=15] Comment Unique ID.
 * @apiParam (Query Parameters) {String} [orderBy="createdAt"] Comment Unique ID.
 * @apiParam (Query Parameters) {String} [orderDir="desc"] Comment Unique ID.
 * @apiParamExample  Example request 
    GET - /v1/comments?limit=2&page=1&orderBy=content&orderDir=desc
 * @apiSuccessExample Example Response
    {
        "items": [
            {
                "createdAt": "2021-05-23T08:44:18.105Z",
                "content": "I dont care lalalalala",
                "user": {
                    "email": "john@test.com",
                    "firstName": "John",
                    "lastName": "Dixon",
                    "id": "60a9ea51489ee6170cd87a06"
                },
                "articleId": "60aa15f583ce030a34fcbbb9",
                "id": "60aa160083ce030a34fcbbba"
            },
            {
                "content": "Hello. This is me",
                "user": {
                    "email": "test@test.com",
                    "firstName": "Test",
                    "lastName": "Test",
                    "id": "60ad2887ce46da41fc4d1236"
                },
                "articleId": "60ac8cfe8c932132c4fe4173",
                "createdAt": "2021-05-31T17:15:01.626Z",
                "updatedAt": "2021-05-31T17:15:01.626Z",
                "id": "60b51995397de345b092708f"
            }
        ],
        "total": 2,
        "pages": 1,
        "page": 1,
        "limit": 2,
        "orderBy": "content",
        "orderDir": "desc"
    }
 * @apiSuccess {Object[]} items List of comments.
 * @apiSuccess {String} item[content] Comment content
 * @apiSuccess {Object} item[user] Comment user
 * @apiSuccess {String} user[email] Comment user email
 * @apiSuccess {String} user[firstName] Comment user first name
 * @apiSuccess {String} user[lastName] Comment user last name
 * @apiSuccess {String} user[id] Comment user id
 * @apiSuccess {String} item[articleId] Comment article id
 * @apiSuccess {String} item[id] Comment id
 * @apiSuccess {String} item[createdAt] Comment created at time - auto-generated by Mongo
 * @apiSuccess {String} item[updatedAt] Comment updated at time - auto-generated by Mongo
 * @apiSuccess {Number} total Total number of comments
 * @apiSuccess {Number} pages Total number of pages
 * @apiSuccess {Number} page  Current page
 * @apiSuccess {Number} limit Comments per page
 * @apiSuccess {String} orderBy Order comments by field
 * @apiSuccess {String} orderDir Order comments in desc or asc order
 * @apiError (Error 400) InvalidObjectID <code>Please provide a valid object id.</code>
 * @apiError (Error 400) AuthorizationRequired  <code>The authorization header is required.</code>
 * @apiError (Error 401) NotAuthorized  <code>You are not authorized.</code>
 * @apiError (Error 401) RefreshTokenExpired <code>Refresh token has expired.</code>
 * @apiError (Error 401) AccessTokenExpired <code>Access token has expired.</code>
 * @apiError (Error 404) AccountNotFound <code>Account not found.</code>
 * @apiError (Error 404) ResourceNotFound <code>Resource not found.</code>
 * @apiErrorExample {json} Example Error Response:
    {
        "errors": [
            {
                "message": "Resource not found.",
                "errorType": "ResourceNotFound",
                "statusCode": 404
            }
        ]
    }
 */
