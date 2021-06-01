/**
 * @api {GET} /auth GET - Current User
 * @apiPermission  User or Admin
 * @apiVersion 1.0.0
 * @apiName GetCurrentUser
 * @apiSampleRequest off
 * @apiGroup Auth
 * @apiDescription
 *  Gets the currently logged in user. You must be authenticated.
 * @apiHeaderExample {json} Must include Authorization Header:
 *     {
 *       "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTk2N2Q4OGE1ZDJkNTIyYzBkMzExMSIsInJvbGUiOiJwcmltZS1hZG1pbiIsInRrSWQiOiI2MGI0YTA5NTdjMWE2ZjQzOGMxMTRjNjEiLCJyZWZyZXNoVG9rZW4iOiI2MGI0YTA5NTdjMWE2ZjQzOGMxMTRjNjIiLCJpYXQiOjE2MjI0NTAzMjUsImV4cCI6MTYyMjQ1MjEyNX0.HJ3eJsyIIFg3snqU_c0ZCtE6TLSZ8BH-_uk8fGQdvEI"
 *     }
 * @apiSuccessExample Example response User
    {
        "email": "test@test.com",
        "firstName": "Test",
        "lastName": "Test",
        "id": "60ad2887ce46da41fc4d1236"
    }
* @apiSuccessExample Example response Admin
    {
        "username": "godsavethequeen",
        "role": "prime-admin",
        "id": "60a967d88a5d2d522c0d3111"
    }
 * @apiSuccess {String} email Email (only for normal User)
 * @apiSuccess {String} username Username (only for Admin)
 * @apiSuccess {String} firstName First name (only for normal User)
 * @apiSuccess {String} lastName Last name (only for normal User)
 * @apiSuccess {String} id MongoDB _id
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
 */
