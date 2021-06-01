import { Query as ParsedQs } from "express-serve-static-core";
import mongoose, { Model } from "mongoose";
import dotenv from "dotenv";

/**
 * Enables access to .env
 */
dotenv.config();

export type QueryParam = string | ParsedQs | string[] | ParsedQs[] | undefined;

/**
 * Defines the Pagination Options Interface
 */
export interface PaginationOptions {
  page?: QueryParam;
  limit?: QueryParam;
  orderBy?: QueryParam;
  orderDir?: QueryParam;
}

/**
 * Defines the auth service
 */
export class PaginationService {
  static DEFAULT_CURRENT_PAGE = 1;
  static DEFAULT_LIMIT = 15;
  static DEFAULT_ORDER_BY = "createdAt";
  static DEFAULT_ORDER_DIR = "desc";

  /**
   * Handles paginating the collection
   */
  static async paginate<Document extends mongoose.Document>(
    model: mongoose.Model<Document>,
    config: {
      pagination: PaginationOptions;
      populate?: {
        path: any;
        select?: any;
        model?: string | Model<any, {}> | undefined;
        match?: any;
      };
    }
  ) {
    const { pagination, populate } = config;

    const query = pagination;

    /**
     * Defines the pagination options
     */
    const options = {
      page:
        query && query.page
          ? parseInt(query.page.toString())
          : this.DEFAULT_CURRENT_PAGE,
      limit:
        query && query.limit
          ? parseInt(query.limit.toString())
          : this.DEFAULT_LIMIT,
      orderBy:
        query && query.orderBy
          ? query.orderBy.toString()
          : this.DEFAULT_ORDER_BY,
      orderDir:
        query && query.orderDir
          ? query.orderDir.toString()
          : this.DEFAULT_ORDER_DIR,
    };

    /**
     * Calculates how many documents to skip in the find
     */
    const calculateSkip = () => (options.page - 1) * options.limit;

    /**
     * Handles calculating the total number of pages
     */
    const calculateTotalPages = () => {
      /**
       * Defines the total pages
       */
      const totalPages = Math.floor(
        (count + options.limit - 1) / options.limit
      );

      return count < options.limit ? 1 : totalPages;
    };

    /**
     * Handles getting the sorting order
     */
    const getSortOrder = () => ({
      [options.orderBy]: options.orderDir,
    });

    const items = await model
      .find({})
      .skip(calculateSkip())
      .limit(options.limit)
      .sort(getSortOrder())
      .populate(populate || undefined);

    const count = await model.countDocuments();

    const pages = calculateTotalPages();

    return {
      items,
      count,
      pages,
      ...options,
    };
  }
}
