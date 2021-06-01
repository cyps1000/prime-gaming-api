import mongoose from "mongoose";

/**
 * An interface that describes the properties
 * that are required to create a new document
 */
export interface ArticleAttributes {
  title: string;
  content: string;
  likes?: string[];
  shares?: string[];
  comments?: string[];
  author: string;
}

/**
 * An interface that describes the properties
 * that a document has
 */
export interface ArticleDocument extends mongoose.Document {
  title: string;
  content: string;
  likes: string[];
  shares: string[];
  comments: string[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * An interface that describes the properties
 * that a model has
 */
export interface ArticleModel extends mongoose.Model<ArticleDocument> {
  build(attributes: ArticleAttributes): ArticleDocument;
}

/**
 * Builds the schema
 */
const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    shares: {
      type: Number,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
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
articleSchema.statics.build = (attributes: ArticleAttributes) => {
  return new Article(attributes);
};

/**
 * Defines the model
 */
const Article = mongoose.model<ArticleDocument, ArticleModel>(
  "Article",
  articleSchema
);

export { Article };
