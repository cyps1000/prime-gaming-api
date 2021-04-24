import mongoose from "mongoose";

/**
 * An interface that describes the properties
 * that are required to create a new user
 */
interface UserAttributes {
  email: string;
  age: number;
  name: string;
}

/**
 * An interface that describes the properties
 * that a user document has
 */
interface UserDocument extends mongoose.Document {
  email: string;
  age: number;
  name: string;
}

/**
 * An interface that describes the properties
 * that a user model has
 */
interface UserModel extends mongoose.Model<UserDocument> {
  build(attributes: UserAttributes): UserDocument;
}

/**
 * Builds the user schema
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    name: {
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
      },
    },
  }
);

userSchema.statics.build = (attributes: UserAttributes) => {
  return new User(attributes);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };
