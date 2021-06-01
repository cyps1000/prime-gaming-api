/**
 * External Imports
 */
import cors, { CorsOptionsDelegate } from "cors";

/**
 * Imports Models
 */
import { Whitelist } from "../models/Whitelist";

/**
 * Checks if the origin is allowed
 */
const isAllowedOrigin = (origin: string | undefined, whitelist: string[]) => {
  if (process.env.NODE_ENV === "development" && !origin) return false;

  return whitelist.indexOf(origin!) !== -1;
};

/**
 * Defines the Cors Service
 */
export class CorsService {
  static setup() {
    const corsOptionsDelegate: CorsOptionsDelegate = async (req, callback) => {
      /**
       * Gets the whitelist
       */
      const collection = await Whitelist.find({});
      const whitelist = collection.map((item) => item.origin);

      /**
       * Defines the cors options
       */
      const options = {
        origin: false,
        methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
        allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization"],
      };

      /**
       * Checks if the origin is allowed
       */
      if (isAllowedOrigin(req.headers.origin, whitelist)) {
        options["origin"] = true;
      }

      callback(null, options);
    };

    return cors(corsOptionsDelegate);
  }
}
