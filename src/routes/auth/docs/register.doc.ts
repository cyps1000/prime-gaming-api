/**
 * @api {POST} /auth/register POST - Register User
 * @apiVersion 1.0.0
 * @apiName PostRegisterUser
 * @apiSampleRequest off
 * @apiGroup Auth
 * @apiDescription Register a user account, receive a 30 minute access token
 * @apiParamExample  Example request 
    {
      "email": "test32@test.com",
      "firstName": "Test",
      "lastName": "Test",
      "password": "Nota2goo!dpassword"
    }
 * @apiParam (Request body) {String} email Email - required  
 * @apiParam (Request body) {String} firstName First Name - required  
 * @apiParam (Request body) {String} lastName Last Name - required  
 * @apiParam (Request body) {String} password Password - required
 * @apiSuccessExample Example Response
    {
        "user": {
            "email": "test32@test.com",
            "firstName": "Test",
            "lastName": "Test",
            "id": "60b4cccb16d4a119d409057e"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYjRjY2NiMTZkNGExMTlkNDA5MDU3ZSIsInRrSWQiOiI2MGI0Y2NjYjE2ZDRhMTE5ZDQwOTA1N2YiLCJyZWZyZXNoVG9rZW4iOiI2MGI0Y2NjYjE2ZDRhMTE5ZDQwOTA1ODAiLCJpYXQiOjE2MjI0NjE2NDMsImV4cCI6MTYyMjQ2MzQ0M30.q2nlVyMW3-JsLGCxWi-8Ir3-FR8OADpxEy3Lr2F4k4E"
    }
 * @apiSuccess {String} user[email] User's email
 * @apiSuccess {String} user[firstName] User's first name
 * @apiSuccess {String} user[lastName] User's last name
 * @apiSuccess {String} user[id] MongoDB Id
 * @apiSuccess {String} token JWT Token (expires in 30 minutes)
 * @apiError (Error 400) InputValidation <ul>
 *  <li><code>Email must be valid</code></li>
 *  <li><code>Please provide your first name</code></li>
 *  <li><code>Please provide your last name</code></li>
 *  <li><code>Password must be between 4 and 20 characters</code></li>
 * </ul>
 * @apiError (Error 400) EmailInUse  <code>Email is in use.</code>
 * @apiErrorExample {json} Example Error Response:
    {
        "errors": [
            {
                "message": "Email is in use.",
                "errorType": "EmailInUse",
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
                "message": "Please provide your first name",
                "field": "firstName",
                "errorType": "InputValidation",
                "statusCode": 400
            },
            {
                "message": "Please provide your last name",
                "field": "lastName",
                "errorType": "InputValidation",
                "statusCode": 400
            },
            {
                "message": "Password must be between 4 and 20 characters",
                "field": "password",
                "errorType": "InputValidation",
                "statusCode": 400
            }
        ]
    }
 */
