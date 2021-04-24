import mongoose from "mongoose";

/**
 * An interface that describes the properties
 * that are required to create a new user
 */
interface WhitelistAttributes {
  origin: string;
}

/**
 * An interface that describes the properties
 * that a user document has
 */
interface WhitelistDocument extends mongoose.Document {
  origin: string;
}

/**
 * An interface that describes the properties
 * that a user model has
 */
interface WhitelistModel extends mongoose.Model<WhitelistDocument> {
  build(attributes: WhitelistAttributes): WhitelistDocument;
}

const whitelistSchema = new mongoose.Schema({
  origin: {
    type: String,
    required: true,
  },
});

whitelistSchema.statics.build = (attributes: WhitelistAttributes) => {
  return new Whitelist(attributes);
};

const Whitelist = mongoose.model<WhitelistDocument, WhitelistModel>(
  "Whitelist",
  whitelistSchema
);

export { Whitelist };
