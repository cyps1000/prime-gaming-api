/**
 * External Imports
 */
import cors, { CorsOptions, CorsRequest } from "cors";
import { Express } from "express";

/**
 * Imports Models
 */
import { Whitelist } from "../models/Whitelist";

/**
 * Handles setting up cors
 */
export const setupCors = async (app: Express) => {
  try {
    const collection = await Whitelist.find({});
    const whitelist = collection.map((item) => item.origin);

    /**
     * Defines the allowed methods
     */
    const allowedMethods = "GET,HEAD,PUT,PATCH,POST,DELETE";

    /**
     * Defines the static origin and custom origin types
     */
    type StaticOrigin = boolean | string | RegExp | (string | RegExp)[];
    type CustomOrigin = (
      requestOrigin: string | undefined,
      callback: (err: Error | null, origin?: StaticOrigin) => void
    ) => void;

    /**
     * Handles the cors based on request origin
     */
    const handleOrigin: CustomOrigin = (origin, callback) => {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    };

    /**
     * Defines the cors options
     */
    const corsOptions: CorsOptions = {
      methods: allowedMethods,
      origin: handleOrigin,
      allowedHeaders: ["Content-Type", "application/json"],
      preflightContinue: true,
    };

    // app.all('*', function(req, res, next) {
    //   res.header('Access-Control-Allow-Headers', 'Content-Type');
    //   if ('OPTIONS' == req.method) {
    //   res.sendStatus(200);
    //   } else {
    //     next();
    //   }
    // });

    const corsOptionsDelegate = (req: CorsRequest, callback: any) => {
      callback(null, corsOptions);
    };

    app.use(cors());
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong during cors setup.");
  }
};
