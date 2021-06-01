import { Query as ParsedQs } from "express-serve-static-core";
import mongoose, { Model } from "mongoose";
import dotenv from "dotenv";

/**
 * Enables access to .env
 */
dotenv.config();

/**
 * Defines the Query Param type
 */
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
 * Defines the Pagination Config Interface
 */
export interface PaginationConfig {
  pagination: PaginationOptions;
  populate?: {
    path: any;
    select?: any;
    model?: string | Model<any, {}> | undefined;
    match?: any;
    populate?: PaginationConfig["populate"];
  };
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
   * Handles normalizing the query param
   */
  static normalize(
    query: QueryParam,
    defaultParam: string | number,
    formatter?: Function
  ) {
    if (query) {
      const stringQuery = query.toString();
      return formatter ? formatter(stringQuery) : stringQuery;
    }
    return defaultParam;
  }

  /**
   * Handles paginating the collection
   */
  static async paginate<Document extends mongoose.Document>(
    model: mongoose.Model<Document>,
    config: PaginationConfig
  ) {
    /**
     * Gets the pagination and the populate from the config
     * Renames pagination to query
     */
    const { pagination: query, populate } = config;

    /**
     * Defines the pagination options
     */
    const options = {
      page: this.normalize(query.page, this.DEFAULT_CURRENT_PAGE, parseInt),
      limit: this.normalize(query.limit, this.DEFAULT_LIMIT, parseInt),
      orderBy: this.normalize(query.orderBy, this.DEFAULT_ORDER_BY),
      orderDir: this.normalize(query.orderDir, this.DEFAULT_ORDER_DIR),
    };

    /**
     * Calculates how many documents to skip in the find
     */
    const calculateSkip = () => (options.page - 1) * options.limit;

    /**
     * Handles calculating the total number of pages
     */
    const calculateTotalPages = () => {
      const pages = (count + options.limit - 1) / options.limit;
      const totalPages = Math.floor(pages);

      return count < options.limit ? 1 : totalPages;
    };

    /**
     * Handles getting the sorting order
     */
    const getSortOrder = () => ({
      [options.orderBy]: options.orderDir,
    });

    /**
     * Gets the items
     */
    const items = await model
      .find({})
      .skip(calculateSkip())
      .limit(options.limit)
      .sort(getSortOrder())
      .populate(populate || undefined);

    /**
     * Gets the count
     */
    const count = await model.countDocuments();

    /**
     * Gets the total amount of pages
     */
    const pages = calculateTotalPages();

    return {
      items,
      count,
      pages,
      ...options,
    };
  }
}
