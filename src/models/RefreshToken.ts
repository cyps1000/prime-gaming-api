import mongoose from "mongoose";

/**
 * An interface that describes the properties
 * that are required to create a new user
 */
export interface RefreshTokenAttributes {
  user: string;
  tokenId: string;
  expiresAt: Date;
  createdAt?: Date;
  createdByIp: string;
}

/**
 * An interface that describes the properties
 * that a user document has
 */
interface RefreshTokenDocument extends mongoose.Document {
  user: string;
  tokenId: string;
  expiresAt: Date;
  createdAt: Date;
  createdByIp: string;
}

/**
 * An interface that describes the properties
 * that a user model has
 */
interface RefreshTokenModel extends mongoose.Model<RefreshTokenDocument> {
  build(attributes: RefreshTokenAttributes): RefreshTokenDocument;
}

const refreshTokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tokenId: String,
    expiresAt: Date,
    createdAt: { type: Date, default: Date.now },
    createdByIp: String,
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(doc, ret) {
        delete ret._id;
        delete ret.id;
        delete ret.user;
      },
    },
  }
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

refreshTokenSchema.statics.build = (attributes: RefreshTokenAttributes) => {
  return new RefreshToken(attributes);
};

const RefreshToken = mongoose.model<RefreshTokenDocument, RefreshTokenModel>(
  "RefreshToken",
  refreshTokenSchema
);

export { RefreshToken };
