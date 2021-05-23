import dotenv from "dotenv";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

/**
 * Enables access to .env
 */
dotenv.config();

/**
 * Initializes mongo
 */
let mongo: any;

/**
 * Sets up mongodb before all tests
 */
beforeAll(async () => {
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
});

/**
 * Resets all collections before each test
 */
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

/**
 * Stops mongodb after all tests
 */
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
