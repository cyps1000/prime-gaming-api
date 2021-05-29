import express from "express";
import path from "path";
import "express-async-errors";

/**
 * External Imports
 */
import dotenv from "dotenv";

/**
 * Imports services
 */
import { NotFoundError } from "./services/error";

/**
 * Imports middlewares
 */
import { errorHandler, blacklistHandler } from "./middlewares";

/**
 * Imports Services
 */
import { setupCors } from "./services/cors";

/**
 * Imports routes
 */
import { authRouter } from "./routes/auth";
import { articlesRouter } from "./routes/articles";
import { commentsRouter } from "./routes/comments";

/**
 * Enables access to .env
 */
dotenv.config();

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
app.use(setupCors());

/**
 * Middlewares
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Blacklist
 */
app.use(blacklistHandler);

/**
 * Auth Router
 */
app.use(apiVersion, authRouter);

/**
 * Articles Router
 */
app.use(apiVersion, articlesRouter);

/**
 * Comments Router
 */
app.use(apiVersion, commentsRouter);

/**
 * Sets up the api docs route (only in development)
 */
if (process.env.NODE_ENV !== "production") {
  app.use("/docs", express.static(path.join(__dirname, "docs")));
}

/**
 * Catch all route
 */
app.all("*", async () => {
  throw new NotFoundError();
});

/**
 * Error handler, must be placed last
 * If any errors are thrown, this handler will be able to catch them
 */
app.use(errorHandler);

export { app };
