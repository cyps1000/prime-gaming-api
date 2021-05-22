import { Express } from "express";
import mongoose from "mongoose";
const { PORT, MONGO_URI, JWT_KEY } = process.env;

/**
 * Handles booting up the server.
 */
export const bootServer = async (app: Express) => {
  if (!JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to database.");
  } catch (error) {
    console.error(error);
  }

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
};
