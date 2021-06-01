import mongoose from "mongoose";

/**
 * An interface that describes the properties
 * that are required to create a new document
 */
export interface RefreshTokenAttributes {
  user: string;
  tokenId: string;
  expiresAt: Date;
  createdByIp: string;
}

/**
 * An interface that describes the properties
 * that a document has
 */
export interface RefreshTokenDocument extends mongoose.Document {
  user: string;
  tokenId: string;
  expiresAt: Date;
  createdByIp: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * An interface that describes the properties
 * that a model has
 */
export interface RefreshTokenModel
  extends mongoose.Model<RefreshTokenDocument> {
  build(attributes: RefreshTokenAttributes): RefreshTokenDocument;
}

/**
 * Builds the schema
 */
const refreshTokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tokenId: String,
    expiresAt: Date,
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
    timestamps: true,
  }
);

/**
 * Creates an index on the expiresAt attribute
 * @expireAfterSeconds 0 because we dynamically set a TTL to a document
 * @see https://docs.mongodb.com/manual/tutorial/expire-data/#expire-documents-at-a-certain-clock-time
 */
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/**
 * Adds a static method on the model which is used to create a new docment
 */
refreshTokenSchema.statics.build = (attributes: RefreshTokenAttributes) => {
  return new RefreshToken(attributes);
};

/**
 * Defines the model
 */
const RefreshToken = mongoose.model<RefreshTokenDocument, RefreshTokenModel>(
  "RefreshToken",
  refreshTokenSchema
);

export { RefreshToken };
