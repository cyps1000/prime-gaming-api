/**
 * @api {GET} /users/:id GET - Get User
 * @apiPermission Admin
 * @apiVersion 1.0.0
 * @apiName GetUser
 * @apiSampleRequest off
 * @apiGroup Users
 * @apiDescription  Gets a user by id
 * @apiHeaderExample {json} Must include Authorization Header:
 *     {
 *       "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTk2N2Q4OGE1ZDJkNTIyYzBkMzExMSIsInJvbGUiOiJwcmltZS1hZG1pbiIsInRrSWQiOiI2MGI0YTA5NTdjMWE2ZjQzOGMxMTRjNjEiLCJyZWZyZXNoVG9rZW4iOiI2MGI0YTA5NTdjMWE2ZjQzOGMxMTRjNjIiLCJpYXQiOjE2MjI0NTAzMjUsImV4cCI6MTYyMjQ1MjEyNX0.HJ3eJsyIIFg3snqU_c0ZCtE6TLSZ8BH-_uk8fGQdvEI"
 *     }
 * @apiParam (Request parameters) {String} id User Unique ID.
 * @apiSuccessExample Example Response
    {
        "suspended": false,
        "email": "jane@doe.com",
        "firstName": "Jane",
        "lastName": "Doe",
        "createdAt": "2021-06-04T17:02:43.219Z",
        "updatedAt": "2021-06-04T17:02:43.219Z",
        "id": "60ba5cb3ec7062163434a26e"
    }
 * @apiSuccess {Boolean} suspended User suspended status
 * @apiSuccess {String} email User's Email
 * @apiSuccess {String} firstName User's first name
 * @apiSuccess {String} lastName User's last name
 * @apiSuccess {String} createdAt User created at time - auto-generated by Mongo
 * @apiSuccess {String} updatedAt User updated at time - auto-generated by Mongo
 * @apiSuccess {String} id User id
 * @apiError (Error 400) InvalidObjectID <code>Please provide a valid object id.</code>
 * @apiError (Error 400) AuthorizationRequired  <code>The authorization header is required.</code>
 * @apiError (Error 401) NotAuthorized  <code>You are not authorized.</code>
 * @apiError (Error 401) RefreshTokenExpired <code>Refresh token has expired.</code>
 * @apiError (Error 401) AccessTokenExpired <code>Access token has expired.</code>
 * @apiError (Error 404) AccountNotFound <code>Account not found.</code>
 * @apiErrorExample {json} Example Error Response:
    {
        "errors": [
            {
                "message": "Account not found.",
                "errorType": "AccountNotFound",
                "statusCode": 404
            }
        ]
    }
 */