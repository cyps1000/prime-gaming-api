import { CustomError } from "./CustomError";

export class TokenError extends CustomError {
  statusCode = 401;

  constructor(public message: string) {
    super(message);

    // Only because we are extending a built-in class
    Object.setPrototypeOf(this, TokenError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
