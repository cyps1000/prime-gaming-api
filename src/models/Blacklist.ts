import mongoose from "mongoose";

/**
 * An interface that describes the properties
 * that are required to create a new user
 */
interface BlacklistAttributes {
  type: "ip" | "token";
  ip?: string;
  expiresAt: Date;
  token?: {
    id: string;
    role?: string;
    tkId: string;
    iat: number;
    exp: number;
    refreshToken: string;
  };
}

/**
 * An interface that describes the properties
 * that a user document has
 */
interface BlacklistDocument extends mongoose.Document {
  type: "ip" | "token";
  expiresAt: Date;
  ip?: string;
  token?: string;
}

/**
 * An interface that describes the properties
 * that a user model has
 */
interface BlacklistModel extends mongoose.Model<BlacklistDocument> {
  build(attributes: BlacklistAttributes): BlacklistDocument;
}

const blacklistSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["ip", "token"],
    default: "ip",
  },
  expiresAt: Date,
  ip: {
    type: String,
  },
  token: {
    type: {
      id: String,
      role: String,
      tkId: String,
      iat: Number,
      exp: Number,
      refreshToken: String,
    },
  },
});

blacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

blacklistSchema.statics.build = (attributes: BlacklistAttributes) => {
  return new Blacklist(attributes);
};

const Blacklist = mongoose.model<BlacklistDocument, BlacklistModel>(
  "Blacklist",
  blacklistSchema
);

export { Blacklist };
