/**
 * @api {GET} /auth/refresh-token GET - Refresh Token
 * @apiPermission  User or Admin
 * @apiVersion 1.0.0
 * @apiName GetRefreshToken
 * @apiSampleRequest off
 * @apiGroup Auth
 * @apiDescription
 *  Gets a new access token, this request should be made when the access token expired.
 * @apiHeaderExample {json} Must include Authorization Header:
 *     {
 *       "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTk2N2Q4OGE1ZDJkNTIyYzBkMzExMSIsInJvbGUiOiJwcmltZS1hZG1pbiIsInRrSWQiOiI2MGI0YTA5NTdjMWE2ZjQzOGMxMTRjNjEiLCJyZWZyZXNoVG9rZW4iOiI2MGI0YTA5NTdjMWE2ZjQzOGMxMTRjNjIiLCJpYXQiOjE2MjI0NTAzMjUsImV4cCI6MTYyMjQ1MjEyNX0.HJ3eJsyIIFg3snqU_c0ZCtE6TLSZ8BH-_uk8fGQdvEI"
 *     }
 * @apiSuccessExample Example Response
      {
          "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTk2N2Q4OGE1ZDJkNTIyYzBkMzExMSIsInRrSWQiOiI2MGI0YmZjYjQyM2NhZDFkNzBjZWEzNzMiLCJyb2xlIjoicHJpbWUtYWRtaW4iLCJyZWZyZXNoVG9rZW4iOiI2MGI0YjhjNTkwYTUyZDFkMzRjYmFkMDMiLCJpYXQiOjE2MjI0NTgzMTUsImV4cCI6MTYyMjQ2MDExNX0.K9LSX_w3HSlotHaoNJxJoCPzNu-vHcpD7A4-O-m2kpQ"
      }
 * @apiSuccess {String} accessToken JWT Token (expires in 30 minutes)
 * @apiError (Error 400) AuthorizationRequired  <code>The authorization header is required.</code>
 * @apiError (Error 401) NotAuthorized  <code>You are not authorized.</code>
 * @apiError (Error 401) AccountNotFound <code>Account not found.</code>
 * @apiError (Error 401) RefreshTokenExpired <code>Refresh token has expired.</code>
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
