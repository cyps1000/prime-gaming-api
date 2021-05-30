import mongoose from "mongoose";
import { PasswordManager } from "../services/password-manager";

/**
 * An interface that describes the properties
 * that are required to create a new document
 */
export interface AdminAttributes {
  username: string;
  password: string;
  role: "prime-admin";
}

/**
 * An interface that describes the properties
 * that a document has
 */
export interface AdminDocument extends mongoose.Document {
  username: string;
  password: string;
  role: "prime-admin";
}

/**
 * An interface that describes the properties
 * that a model has
 */
export interface AdminModel extends mongoose.Model<AdminDocument> {
  build(attributes: AdminAttributes): AdminDocument;
}

/**
 * Builds the schema
 */
const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
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
  }
);

/**
 * Pre-save hook
 */
adminSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await PasswordManager.hash(this.get("password"));
    this.set("password", hashed);
  }

  done();
});

/**
 * Adds a static method on the model which is used to create a new docment
 */
adminSchema.statics.build = (attributes: AdminAttributes) => {
  return new Admin(attributes);
};

/**
 * Defines the model
 */
const Admin = mongoose.model<AdminDocument, AdminModel>("Admin", adminSchema);

export { Admin };
