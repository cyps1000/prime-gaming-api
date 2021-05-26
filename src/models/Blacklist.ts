import mongoose from "mongoose";

/**
 * An interface that describes the properties
 * that are required to create a new user
 */
interface BlacklistAttributes {
  ip: string;
}

/**
 * An interface that describes the properties
 * that a user document has
 */
interface BlacklistDocument extends mongoose.Document {
  ip: string;
}

/**
 * An interface that describes the properties
 * that a user model has
 */
interface BlacklistModel extends mongoose.Model<BlacklistDocument> {
  build(attributes: BlacklistAttributes): BlacklistDocument;
}

const blacklistSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
  },
});

blacklistSchema.statics.build = (attributes: BlacklistAttributes) => {
  return new Blacklist(attributes);
};

const Blacklist = mongoose.model<BlacklistDocument, BlacklistModel>(
  "Blacklist",
  blacklistSchema
);

export { Blacklist };
