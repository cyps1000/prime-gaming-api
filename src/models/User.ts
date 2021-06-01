import mongoose from "mongoose";
import { PasswordManager } from "../services/password-manager";

/**
 * An interface that describes the properties
 * that are required to create a new document
 */
export interface UserAttributes {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

/**
 * An interface that describes the properties
 * that a document has
 */
export interface UserDocument extends mongoose.Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * An interface that describes the properties
 * that a model has
 */
export interface UserModel extends mongoose.Model<UserDocument> {
  build(attributes: UserAttributes): UserDocument;
}

/**
 * Builds the schema
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
    },
    timestamps: true,
  }
);

/**
 * Pre-save hook
 */
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await PasswordManager.hash(this.get("password"));
    this.set("password", hashed);
  }

  done();
});

/**
 * Adds a static method on the model which is used to create a new docment
 */
userSchema.statics.build = (attributes: UserAttributes) => {
  return new User(attributes);
};

/**
 * Defines the model
 */
const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };
