import mongoose from "mongoose";

/**
 * An interface that describes the properties
 * that are required to create a new user
 */
interface ArticleAttributes {
  title: string;
  content: string;
  createdAt?: Date;
  likes?: string[];
  shares?: string[];
  comments?: string[];
  authorId: string;
}

/**
 * An interface that describes the properties
 * that a user document has
 */
interface ArticleDocument extends mongoose.Document {
  title: string;
  content: string;
  createdAt: Date;
  likes: string[];
  shares: string[];
  comments: string[];
  authorId: string;
}

/**
 * An interface that describes the properties
 * that a user model has
 */
interface ArticleModel extends mongoose.Model<ArticleDocument> {
  build(attributes: ArticleAttributes): ArticleDocument;
}

/**
 * Builds the user schema
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
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
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

articleSchema.statics.build = (attributes: ArticleAttributes) => {
  return new Article(attributes);
};

const Article = mongoose.model<ArticleDocument, ArticleModel>(
  "Article",
  articleSchema
);

export { Article };
