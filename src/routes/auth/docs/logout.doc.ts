/**
 * @api {POST} /auth/logout POST - Logout
 * @apiPermission  Admin and User
 * @apiVersion 1.0.0
 * @apiName PostLogout
 * @apiSampleRequest off
 * @apiGroup Auth
 * @apiDescription Log out from your account, deletes the refresh token
  * @apiHeaderExample {json} Must include Authorization Header:
 *     {
 *       "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTk2N2Q4OGE1ZDJkNTIyYzBkMzExMSIsInJvbGUiOiJwcmltZS1hZG1pbiIsInRrSWQiOiI2MGI0YTA5NTdjMWE2ZjQzOGMxMTRjNjEiLCJyZWZyZXNoVG9rZW4iOiI2MGI0YTA5NTdjMWE2ZjQzOGMxMTRjNjIiLCJpYXQiOjE2MjI0NTAzMjUsImV4cCI6MTYyMjQ1MjEyNX0.HJ3eJsyIIFg3snqU_c0ZCtE6TLSZ8BH-_uk8fGQdvEI"
 *     }
 * @apiSuccessExample Example Response
      true
 * @apiSuccess {Boolean} true Signals that you have been logged out.
 * @apiError (Error 400) TokenMissingFromReq  <code>Token missing from request.</code>
 * @apiError (Error 400) AuthorizationRequired  <code>The authorization header is required.</code>
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
