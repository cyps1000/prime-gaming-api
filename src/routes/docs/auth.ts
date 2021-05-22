/**
 * API DOC DEFINITIONS
 */

/**
 * ***************************************************************************************************************************************************************************
 */

/**
 * @apiDefine UsernameEmptyError
 * @apiError UsernameEmpty Please provide your <code>username</code>.
 * @apiErrorExample Error-Response: UsernameEmpty
 *     HTTP/1.1 400 Bad Request
      {
          "errors": [
              {
                  "message": "Please provide your username",
                  "field": "username"
              }
          ]
      }
 */
/**
 * ***************************************************************************************************************************************************************************
 */
/**
 * @apiDefine EmailError
 * @apiError EmailNotValid Email must be valid
 * @apiErrorExample Error-Response: EmailError
 *     HTTP/1.1 400 Bad Request
        {
            "errors": [
                {
                    "message": "Email must be valid",
                    "field": "email"
                }
            ]
        }
 */
/**
 * ***************************************************************************************************************************************************************************
 */
/**
 * @apiDefine PasswordError
 * @apiError PasswordNotStrongEnough The password must include one lowercase character, one uppercase character, a number, and a special character.
 * @apiErrorExample Error-Response: PasswordError
 *     HTTP/1.1 400 Bad Request
        {
            "errors": [
                {
                    "message": "Password must include one lowercase character, one uppercase character, a number, and a special character.",
                    "field": "password"
                }
            ]
        }
 */
/**
 * ***************************************************************************************************************************************************************************
 */
/**
 * @apiDefine WeakerPasswordError
 * @apiError PasswordNotValid Password must be between 4 and 20 characters
 * @apiErrorExample Error-Response: PasswordError
 *     HTTP/1.1 400 Bad Request
      {
          "errors": [
              {
                  "message": "Password must be between 4 and 20 characters",
                  "field": "password"
              }
          ]
      }
 */
/**
 * ***************************************************************************************************************************************************************************
 */
/**
 * @api {POST} /auth/register-admin/  POST - Register Admin
 * @apiVersion 1.0.0
 * @apiName PostRegisterAdmin
 * @apiGroup Auth
 * @apiSampleRequest off
 * @apiDescription
 *  Currently only one account is supported,
 *  if an account exists, the  request will return an error.
 * @apiHeaderExample {json} Header-Example
 *     {
 *       "Content-Type": "application/json; charset=utf-8"
 *     }
 * @apiParam {String} username Username - required.
 * @apiParam {String} password Password - required.
 * @apiSuccessExample Example request
    {
        "username": "iamrootgroot",
        "password": "B2hQXHluXA2Ta2F$"
    }
 * @apiSuccessExample Example response
 * {
 *   "username": "iamrootgroot",
 *   "role": "prime-admin",
 *   "id": "60a967d88a5d2d522c0d3111"
 *  }
 * @apiSuccess {String} username Username
 * @apiSuccess {String} role Role of prime-admin
 * @apiSuccess {String} id MongoDB _id
 * @apiUse UsernameEmptyError
 * @apiUse PasswordError
 */
/**
 * ***************************************************************************************************************************************************************************
 */
/**
 * @api {POST} /auth/register/  POST - Register User
 * @apiVersion 1.0.0
 * @apiName PostRegisterUser
 * @apiGroup Auth
 * @apiSampleRequest off
 * @apiDescription
 *  Registers a user
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type": "application/json; charset=utf-8"
 *     }
 * @apiParam {String} email Email - required.
 * @apiParam {String} firstName First name - required.
 * @apiParam {String} lastName Last name - required.
 * @apiParam {String} password Password - required.
 * @apiSuccessExample Example request
    {
        "firstName": "John",
        "lastName": "Tyson",
        "email": "j.tyson@gmail.com",
        "password": "Test1231231"
    }
 * @apiSuccessExample Example response
    {
        "firstName": "John",
        "lastName": "Tyson",
        "email": "j.tyson@gmail.com",
        "id": "60a96faf25552e625cce1dd7"
    }
 * @apiSuccess {String} email Email
 * @apiSuccess {String} firstName First name
 * @apiSuccess {String} lastName Last name
 * @apiSuccess {String} id MongoDB _id
 * @apiUse EmailError
 * @apiUse WeakerPasswordError
 */
/**
 * ***************************************************************************************************************************************************************************
 */
