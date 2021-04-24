/**
 * External Imports
 */
import express, { Request, Response } from "express";
import { config } from "dotenv";
import "express-async-errors";

/**
 * Imports Services
 */
import { setupCors } from "./services/cors";

/**
 * Imports routes
 */
import { usersRouter } from "./routes/users";

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiVersion, usersRouter);

/**
 * Test api route
 * @Temporary
 */
app.get("/test-api", (req, res) => {
  res.status(200).json({ message: "Hello from api" });
});

/**
 * Catch all route
 * @Temporary
 */
app.all("*", async (req: Request, res: Response) => {
  res.status(404).send("Route not found.");
});

export { app };
