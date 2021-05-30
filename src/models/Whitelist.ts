import mongoose from "mongoose";

/**
 * An interface that describes the properties
 * that are required to create a new document
 */
export interface WhitelistAttributes {
  origin: string;
}

/**
 * An interface that describes the properties
 * that a document has
 */
export interface WhitelistDocument extends mongoose.Document {
  origin: string;
}

/**
 * An interface that describes the properties
 * that a model has
 */
export interface WhitelistModel extends mongoose.Model<WhitelistDocument> {
  build(attributes: WhitelistAttributes): WhitelistDocument;
}

/**
 * Builds the schema
 */
const whitelistSchema = new mongoose.Schema({
  origin: {
    type: String,
    required: true,
  },
});

/**
 * Adds a static method on the model which is used to create a new docment
 */
whitelistSchema.statics.build = (attributes: WhitelistAttributes) => {
  return new Whitelist(attributes);
};

/**
 * Defines the model
 */
const Whitelist = mongoose.model<WhitelistDocument, WhitelistModel>(
  "Whitelist",
  whitelistSchema
);

export { Whitelist };
