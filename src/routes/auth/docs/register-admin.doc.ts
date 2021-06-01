/**
 * @api {POST} /auth/register-admin POST - Register Admin
 * @apiVersion 1.0.0
 * @apiName PostRegisterAdmin
 * @apiSampleRequest off
 * @apiGroup Auth
 * @apiDescription Register an admin account, receive a 30 minute access token
 *  <br /> <strong style="color: red"> Only one admin account is allowed </strong>
 * @apiParamExample  Example request 
    {
      "username": "tonkor",
      "password": "Nota2goo!dpassword"
    }
 * @apiParam (Request body) {String} username Username - required  
 * @apiParam (Request body) {String} password Password - required
 * @apiSuccessExample Example Response
    {
        "user": {
            "username": "tonkor",
            "role": "prime-admin",
            "id": "60b4c463b2709950186dc9ed"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYjRjNDYzYjI3MDk5NTAxODZkYzllZCIsInJvbGUiOiJwcmltZS1hZG1pbiIsInRrSWQiOiI2MGI0YzQ2M2IyNzA5OTUwMTg2ZGM5ZWUiLCJyZWZyZXNoVG9rZW4iOiI2MGI0YzQ2M2IyNzA5OTUwMTg2ZGM5ZWYiLCJpYXQiOjE2MjI0NTk0OTEsImV4cCI6MTYyMjQ2MTI5MX0.khaAb-cJ0tKg2ZIk8geEMd7xN1znzj6iqEZCtP5xc90"
    }
 * @apiSuccess {String} user[username] Admin username
 * @apiSuccess {String} user[role] Admin specific role
 * @apiSuccess {String} user[id] MongoDB Id
 * @apiSuccess {String} token JWT Token (expires in 30 minutes)
 * @apiError (Error 400) InputValidation <ul>
 *  <li><code>Please provide a username.</code></li>
 *  <li><code>Please provide a password.</code></li>
 *  <li><code>Password must be at least 10 characters long.</code></li>
 *  <li><code>Password must include one lowercase character, one uppercase character, a number, and a special character.</code></li>
 * </ul>
 * @apiError (Error 400) AdminExists  <code>An admin account already exists, contact your system administrator.</code>
 * @apiErrorExample {json} Example Error Response:
    {
        "errors": [
            {
                "message": "An admin account already exists, contact your system administrator.",
                "errorType": "AdminExists",
                "statusCode": 400
            }
        ]
    }
* @apiErrorExample {json} InputValidation Response:
    {
        "errors": [
            {
                "message": "Please provide a username",
                "field": "username",
                "errorType": "InputValidation",
                "statusCode": 400
            },
            {
                "message": "Please provide a password",
                "field": "password",
                "errorType": "InputValidation",
                "statusCode": 400
            }
        ]
    }
 */
