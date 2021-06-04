import express from "express";
import path from "path";
import "express-async-errors";

/**
 * External Imports
 */
import dotenv from "dotenv";
import helmet from "helmet";

/**
 * Imports services
 */
import { RequestError, ErrorTypes } from "./services/error";

/**
 * Imports middlewares
 */
import { errorHandler, blacklistHandler } from "./middlewares";

/**
 * Imports Services
 */
import { CorsService } from "./services/cors";

/**
 * Imports routes
 */
import { authRouter } from "./routes/auth";
import { articlesRouter } from "./routes/articles";
import { commentsRouter } from "./routes/comments";
import { usersRouter } from "./routes/users";

/**
 * Enables access to .env
 */
dotenv.config();

/**
 * Creates the express server
 */
const server = express();
server.set("trust proxy", true);

/**
 * Defines the api version
 */
const apiVersion = "/v1";

/**
 * Sets up cors
 */
server.use(CorsService.setup());

/**
 * Middlewares
 */
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(helmet());

/**
 * Blacklist
 */
server.use(blacklistHandler);

/**
 * Auth Router
 */
server.use(apiVersion, authRouter);

/**
 * Articles Router
 */
server.use(apiVersion, articlesRouter);

/**
 * Comments Router
 */
server.use(apiVersion, commentsRouter);

/**
 * Users Router
 */
server.use(apiVersion, usersRouter);

/**
 * Sets up the api docs route (only in development)
 */
if (process.env.NODE_ENV !== "production") {
  server.use("/docs", express.static(path.join(__dirname, "docs")));
}

/**
 * Catch all route
 */
server.all("*", async () => {
  throw new RequestError(ErrorTypes.RouteNotFound);
});

/**
 * Error handler, must be placed last
 * If any errors are thrown, this handler will be able to catch them
 */
server.use(errorHandler);

export { server };
