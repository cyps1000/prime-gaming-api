import mongoose from "mongoose";

/**
 * An interface that describes the properties
 * that are required to create a new document
 */
export interface BlacklistAttributes {
  origin: string;
}

/**
 * An interface that describes the properties
 * that a document has
 */
export interface BlacklistDocument extends mongoose.Document {
  origin: string;
}

/**
 * An interface that describes the properties
 * that a model has
 */
export interface BlacklistModel extends mongoose.Model<BlacklistDocument> {
  build(attributes: BlacklistAttributes): BlacklistDocument;
}

/**
 * Builds the schema
 */
const blacklistSchema = new mongoose.Schema({
  origin: {
    type: String,
    required: true,
  },
});

/**
 * Adds a static method on the model which is used to create a new docment
 */
blacklistSchema.statics.build = (attributes: BlacklistAttributes) => {
  return new Blacklist(attributes);
};

/**
 * Defines the model
 */
const Blacklist = mongoose.model<BlacklistDocument, BlacklistModel>(
  "Blacklist",
  blacklistSchema
);

export { Blacklist };
