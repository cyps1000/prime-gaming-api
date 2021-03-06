/**
 * @api {PUT} /users/:id PUT - Update User
 * @apiPermission Admin
 * @apiVersion 1.0.0
 * @apiName PutUpdateUser
 * @apiSampleRequest off
 * @apiGroup Users
 * @apiDescription Updates a user account
 * @apiParamExample  Example request 
    {
       "email": "test@tes.com",
      "firstName": "HHH",
      "lastName": "AAA"
    }
 * @apiParam (Request body) {String} [email] Email   
 * @apiParam (Request body) {String} [firstName] First Name   
 * @apiParam (Request body) {String} [lastName] Last Name   
 * @apiSuccessExample Example Response
    {
        "success": true,
        "user": {
            "suspended": false,
            "email": "test@tes.com",
            "firstName": "HHH",
            "lastName": "AAA",
            "createdAt": "2021-06-04T17:08:42.929Z",
            "updatedAt": "2021-06-04T17:08:42.929Z",
            "id": "60ba5e1a793e584a80ebfb54"
        }
    }
 * @apiSuccess {Boolean} success Indicates that the user was updated.
 * @apiSuccess {Boolean} user[suspended] User suspended status
 * @apiSuccess {String} user[email] User's Email
 * @apiSuccess {String} user[firstName] User's first name
 * @apiSuccess {String} user[lastName] User's last name
 * @apiSuccess {String} user[createdAt] User created at time - auto-generated by Mongo
 * @apiSuccess {String} user[updatedAt] User updated at time - auto-generated by Mongo
 * @apiSuccess {String} user[id] User id
 * @apiError (Error 400) InvalidObjectID <code>Please provide a valid object id.</code>
 * @apiError (Error 400) AuthorizationRequired  <code>The authorization header is required.</code>
 * @apiError (Error 401) NotAuthorized  <code>You are not authorized.</code>
 * @apiError (Error 401) RefreshTokenExpired <code>Refresh token has expired.</code>
 * @apiError (Error 401) AccessTokenExpired <code>Access token has expired.</code>
 * @apiError (Error 404) AccountNotFound <code>Account not found.</code>
 * @apiError (Error 400) InputValidation <ul>
 *  <li><code>Email must be valid</code></li> If you provide an email, it must be valid.
 *  <li><code>Please provide your first name</code></li> You can't provide an empty string as the first name
 *  <li><code>Please provide your last name</code></li> You can't provide an empty string as the last name
 * </ul>
 * @apiError (Error 400) EmailInUse  <code>Email is in use.</code>
 * @apiErrorExample {json} Example Error Response:
    {
        "errors": [
            {
                "message": "Access token has expired.",
                "errorType": "AccessTokenExpired",
                "statusCode": 401
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
            }
        ]
    }
 */
