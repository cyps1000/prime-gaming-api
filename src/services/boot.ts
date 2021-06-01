import { Express } from "express";
import mongoose from "mongoose";

/**
 * Imports Env Variables
 */
const { PORT, MONGO_URI, JWT_KEY } = process.env;

/**
 * Imports types
 */
import { AccessToken } from "../routes/auth/types";

declare global {
  /**
   * Expands the Express namespace
   */
  namespace Express {
    /**
     * Expands the request interface
     */
    interface Request {
      token?: AccessToken;
      currentUser?: string;
    }
  }

  /**
   * Expands the NodeJS namespace
   */
  namespace NodeJS {
    /**
     * Expands the Process env interface
     */
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "testing";
      JWT_KEY: string;
      MONGO_URI: string;
      PORT: string;
      REFRESH_TOKEN_EXP?: string;
      ACCESS_TOKEN_EXP?: string;
    }
  }
}

/**
 * Defines the service
 */
export class BootService {
  static async start(server: Express) {
    /**
     * Checks for the JWT KEY
     */
    if (!JWT_KEY) {
      throw new Error("JWT_KEY must be defined");
    }

    /**
     * Checks for the MONGO URI
     */
    if (!MONGO_URI) {
      throw new Error("MONGO_URI must be defined");
    }

    /**
     * Connects to the database
     */
    try {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });

      console.log("Connected to database.");
    } catch (error) {
      console.error(error);
      process.exit(1);
    }

    server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  }
}
