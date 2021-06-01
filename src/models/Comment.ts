import mongoose from "mongoose";

/**
 * An interface that describes the properties
 * that are required to create a new document
 */
export interface CommentAttributes {
  user: string;
  articleId: string;
  content: string;
  moderatedContent?: string;
  moderated?: boolean;
  banned?: boolean;
}

/**
 * An interface that describes the properties
 * that a document has
 */
export interface CommentDocument extends mongoose.Document {
  user: string;
  articleId: string;
  content: string;
  moderatedContent?: string;
  moderated: boolean;
  banned: boolean;
  createdAt: Date;
  updatedAt: Date;
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
    user: {
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
      default: false,
    },
    banned: {
      type: Boolean,
      default: false,
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
    timestamps: true,
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
