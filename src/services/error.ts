import { ValidationError } from "express-validator";

/**
 * Defines the error types
 */
export enum ErrorTypes {
  /**
   * @statusCode 400
   * @message Bad Request
   */
  GenericBadRequest = "GenericBadRequest",

  /**
   * @statusCode 401
   * @message  Refresh token has expired.
   */
  RefreshTokenExpired = "RefreshTokenExpired",

  /**
   * @statusCode 401
   * @message Access token has expired.
   */
  AccessTokenExpired = "AccessTokenExpired",

  /**
   * @statusCode 400
   * @message The provided token is invalid.
   */
  TokenInvalid = "TokenInvalid",

  /**
   * @statusCode 400
   * @message  Token missing from request.
   */
  TokenMissingFromReq = "TokenMissingFromReq",

  /**
   * @statusCode 400
   * @message The authorization header is required.
   */
  AuthorizationRequired = "AuthorizationRequired",

  /**
   * @statusCode 404
   * @message Account not found.
   */
  AccountNotFound = "AccountNotFound",

  /**
   * @statusCode 400
   * @message Invalid credentials.
   */
  InvalidCredentials = "InvalidCredentials",

  /**
   * @statusCode 400
   * @message An admin account already exists, contact your system administrator.
   */
  AdminExists = "AdminExists",

  /**
   * @statusCode 400
   * @message Email is in use.
   */
  EmailInUse = "EmailInUse",

  /**
   * @statusCode 401
   * @message You are not authorized.
   */
  NotAuthorized = "NotAuthorized",

  /**
   * @statusCode 500
   * @message  Error connecting to the database
   */
  DatabaseConnectionError = "DatabaseConnectionError",

  /**
   * @statusCode 404
   * @message  Not found.
   */
  GenericNotFound = "GenericNotFound",

  /**
   * @statusCode 404
   * @message Route not found.
   */
  RouteNotFound = "RouteNotFound",

  /**
   * @statusCode 404
   * @message  Resource not found.
   */
  ResourceNotFound = "ResourceNotFound",

  /**
   * @statusCode 400
   * @message  You have been banned.
   */
  UserBanned = "UserBanned",

  /**
   * @statusCode 400
   * @message express-validator - message
   * @field express-validator - field
   *
   * Special case, used in the validate-requests middleware
   */
  InputValidation = "InputValidation",

  /**
   * @statusCode 400
   * @message Please provide a valid object id.
   */
  InvalidObjectID = "InvalidObjectID",
}

/**
 * Defines the request error config
 */
interface RequestErrorConfig {
  message?: string;
  statusCode?: number;
  errors?: ValidationError[];
}

/**
 * Defines the Custom Error class
 */
export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract errorType: string;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): {
    message: string;
    field?: string;
    errorType: string;
  }[];
}

/**
 * Handles building the request error
 */
const buildRequestError = (errorType: ErrorTypes) => {
  let statusCode;
  let message;

  switch (errorType) {
    /**
     * Generic Bad Request
     */
    case ErrorTypes.GenericBadRequest:
      statusCode = 400;
      message = "Bad Request";
      break;

    /**
     * Refresh Token Expired
     */
    case ErrorTypes.RefreshTokenExpired:
      statusCode = 401;
      message = "Refresh token has expired.";
      break;

    /**
     * Access Token Expired
     */
    case ErrorTypes.AccessTokenExpired:
      statusCode = 401;
      message = "Access token has expired.";
      break;

    /**
     * Token Invalid
     */
    case ErrorTypes.TokenInvalid:
      statusCode = 400;
      message = "The provided token is invalid.";
      break;

    /**
     * Token is missing from request
     */
    case ErrorTypes.TokenMissingFromReq:
      statusCode = 400;
      message = "Token missing from request.";
      break;

    /**
     * Authorization Required
     */
    case ErrorTypes.AuthorizationRequired:
      statusCode = 400;
      message = "The authorization header is required.";
      break;

    /**
     * Account Not Found
     */
    case ErrorTypes.AccountNotFound:
      statusCode = 404;
      message = "Account not found.";
      break;

    /**
     * Invalid Credentials
     */
    case ErrorTypes.InvalidCredentials:
      statusCode = 400;
      message = "Invalid credentials.";
      break;

    /**
     * Admin Exists
     */
    case ErrorTypes.AdminExists:
      statusCode = 400;
      message =
        "An admin account already exists, contact your system administrator.";
      break;

    /**
     * Email in use
     */
    case ErrorTypes.EmailInUse:
      statusCode = 400;
      message = "Email is in use.";
      break;

    /**
     * Not authorized
     */
    case ErrorTypes.NotAuthorized:
      statusCode = 401;
      message = "You are not authorized.";
      break;

    /**
     * Database Connection Error
     */
    case ErrorTypes.DatabaseConnectionError:
      statusCode = 500;
      message = "Error connecting to the database";
      break;

    /**
     * Generic Not Found
     */
    case ErrorTypes.GenericNotFound:
      statusCode = 404;
      message = "Not found.";
      break;

    /**
     * Resource Not Found
     */
    case ErrorTypes.ResourceNotFound:
      statusCode = 404;
      message = "Resource not found.";
      break;

    /**
     * Route Not Found
     */
    case ErrorTypes.RouteNotFound:
      statusCode = 404;
      message = "Route not found.";
      break;

    /**
     * User Banned
     */
    case ErrorTypes.UserBanned:
      statusCode = 400;
      message = "You have been banned.";
      break;

    /**
     * Inputs Validation
     */
    case ErrorTypes.InputValidation:
      statusCode = 400;
      message = "";
      break;

    /**
     * Invalid Object ID
     */
    case ErrorTypes.InvalidObjectID:
      statusCode = 400;
      message = "Please provide a valid object id.";
      break;

    /**
     * Defaults
     */
    default:
      statusCode = 400;
      message = "";
      break;
  }

  return {
    statusCode,
    message,
  };
};

/**
 * Handles defining the RequestError class
 */
export class RequestError extends CustomError {
  statusCode = 400;
  errorType: ErrorTypes;
  errors: ValidationError[] = [];

  constructor(errorType: ErrorTypes, config?: RequestErrorConfig) {
    super(buildRequestError(errorType).message);

    const { message, statusCode } = buildRequestError(errorType);

    this.errorType = errorType;
    this.message = config?.message || message;
    this.statusCode = config?.statusCode || statusCode;

    if (config?.errors) {
      this.errors = config.errors;
    }

    // Only because we are extending a built-in class
    Object.setPrototypeOf(this, RequestError.prototype);
  }

  serializeErrors() {
    if (this.errors.length > 0) {
      return this.errors.map((err) => {
        return {
          message: err.msg,
          field: err.param,
          errorType: this.errorType,
          statusCode: this.statusCode,
        };
      });
    }

    return [
      {
        message: this.message,
        errorType: this.errorType,
        statusCode: this.statusCode,
      },
    ];
  }
}
