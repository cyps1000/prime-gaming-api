import { app } from "./app";
import mongoose from "mongoose";
const { PORT, MONGO_URI } = process.env;

const start = async () => {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
};

start();
