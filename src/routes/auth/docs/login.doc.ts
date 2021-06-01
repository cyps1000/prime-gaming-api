/**
 * @api {POST} /auth/login POST - Login User
 * @apiPermission  Only User can authenticate
 * @apiVersion 1.0.0
 * @apiName PostLoginUser
 * @apiSampleRequest off
 * @apiGroup Auth
 * @apiDescription Login as a user, receive a 30 minute access token.
 * @apiParamExample  Example request
    {
      "email": "john@test.com",
      "password": "ABCa2a24a79a8c48a05d!"
    }
 * @apiParam (Request body) {String} email Email - required  
 * @apiParam (Request body) {String} password Password - required
 * @apiSuccessExample Example Response
      {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTk2N2Q4OGE1ZDJkNTIyYzBkMzExMSIsInRrSWQiOiI2MGI0YmZjYjQyM2NhZDFkNzBjZWEzNzMiLCJyb2xlIjoicHJpbWUtYWRtaW4iLCJyZWZyZXNoVG9rZW4iOiI2MGI0YjhjNTkwYTUyZDFkMzRjYmFkMDMiLCJpYXQiOjE2MjI0NTgzMTUsImV4cCI6MTYyMjQ2MDExNX0.K9LSX_w3HSlotHaoNJxJoCPzNu-vHcpD7A4-O-m2kpQ"
      }
 * @apiSuccess {String} token JWT Token (expires in 30 minutes)
 * @apiError (Error 400) InputValidation <ul>
 *  <li><code>Email must be valid</code></li>
 *  <li><code>You must provide a password.</code></li>
 * </ul>
 * @apiError (Error 400) InvalidCredentials  <code>Invalid credentials.</code>
 * @apiErrorExample {json} Example Error Response:
    {
        "errors": [
            {
                "message": "Invalid credentials.",
                "errorType": "InvalidCredentials",
                "statusCode": 400
            }
        ]
    }
* @apiErrorExample {json} InputValidation Response:
    {
        "errors": [
            {
                "message": "Email must be valid",
                "field": "email",
                "errorType": "InputValidation",
                "statusCode": 400
            },
            {
                "message": "You must provide a password.",
                "field": "password",
                "errorType": "InputValidation",
                "statusCode": 400
            }
        ]
    }
 */
