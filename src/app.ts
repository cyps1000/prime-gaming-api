import express, { Request, Response, NextFunction } from "express";
import path from "path";
import "express-async-errors";

/**
 * External Imports
 */
import dotenv from "dotenv";
import cookieSession from "cookie-session";

/**
 * Imports services
 */
import { NotFoundError } from "./services/error";

/**
 * Imports middlewares
 */
import { errorHandler } from "./middlewares/error-handler";

/**
 * Imports Services
 */
// import { setupCors } from "./services/cors";
import cors from "cors";

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
// setupCors(app);

app.use(function (req: Request, res: Response, next: NextFunction) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cors({ credentials: true }));

/**
 * Uses middlewares
 */
app.set("trust proxy", true); // trust first proxy
app.use(cookieSession({ signed: false, secure: false, domain: undefined }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Routes
 */
app.use(apiVersion, authRouter);
app.use(apiVersion, articlesRouter);
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
