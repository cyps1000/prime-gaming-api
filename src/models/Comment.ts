import mongoose from "mongoose";

/**
 * An interface that describes the properties
 * that are required to create a new user
 */
interface CommentAttributes {
  userId: string;
  articleId: string;
  content: string;
  moderatedContent?: string;
  moderated?: boolean;
  banned?: boolean;
  createdAt?: Date;
}

/**
 * An interface that describes the properties
 * that a user document has
 */
interface CommentDocument extends mongoose.Document {
  userId: string;
  articleId: string;
  content: string;
  moderatedContent?: string;
  moderated?: boolean;
  banned?: boolean;
  createdAt?: Date;
}

/**
 * An interface that describes the properties
 * that a user model has
 */
interface CommentModel extends mongoose.Model<CommentDocument> {
  build(attributes: CommentAttributes): CommentDocument;
}

/**
 * Builds the user schema
 */
const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
    },
    content: {
      type: String,
      required: true,
    },
    moderatedContent: {
      type: String,
    },
    moderated: {
      type: Boolean,
    },
    createdAt: {
      type: Date,
      default: new Date(),
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

commentSchema.statics.build = (attributes: CommentAttributes) => {
  return new Comment(attributes);
};

const Comment = mongoose.model<CommentDocument, CommentModel>(
  "Comment",
  commentSchema
);

export { Comment };
