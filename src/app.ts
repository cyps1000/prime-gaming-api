/**
 * External Imports
 */
import express, { Request, Response } from "express";
import { config } from "dotenv";
import "express-async-errors";
import path from "path";
import cookieSession from "cookie-session";
import { NotFoundError } from "./services/error";
import { errorHandler } from "./middlewares/error-handler";

/**
 * Imports Services
 */
import { setupCors } from "./services/cors";

/**
 * Imports routes
 */
import { usersRouter } from "./routes/users";
import { authRouter } from "./routes/auth";

/**
 * Configures the dot env
 */
config();

/**
 * Creates the express app
 */
const app = express();

/**
 * Defines the api version
 */
const apiVersion = "/v1";

/**
 * Sets up cors
 */
setupCors(app);

/**
 * Uses middlewares
 */
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === "production",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(apiVersion, usersRouter);
app.use(apiVersion, authRouter);

if (process.env.NODE_ENV !== "production") {
  app.use("/docs", express.static(path.join(__dirname, "docs")));
}

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
