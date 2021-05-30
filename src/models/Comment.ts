import mongoose from "mongoose";

/**
 * An interface that describes the properties
 * that are required to create a new document
 */
export interface CommentAttributes {
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
 * that a document has
 */
export interface CommentDocument extends mongoose.Document {
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
 * that a model has
 */
export interface CommentModel extends mongoose.Model<CommentDocument> {
  build(attributes: CommentAttributes): CommentDocument;
}

/**
 * Builds the schema
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

/**
 * Adds a static method on the model which is used to create a new docment
 */
commentSchema.statics.build = (attributes: CommentAttributes) => {
  return new Comment(attributes);
};

/**
 * Defines the model
 */
const Comment = mongoose.model<CommentDocument, CommentModel>(
  "Comment",
  commentSchema
);

export { Comment };
