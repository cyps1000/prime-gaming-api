import express from "express";

/**
 * Imports Controllers
 */
import { createArticleController } from "./controllers/create-article";
import { getArticleController } from "./controllers/get-article";
import { deleteArticleController } from "./controllers/delete-article";
import { updateArticleController } from "./controllers/update-article";
import { getArticlesController } from "./controllers/get-articles";

/**
 * Defines the router
 */
const router = express.Router();

/**
 * Creates a new article
 */
router.post("/articles", createArticleController);

/**
 * Gets an article by id
 */
router.get("/articles/:id", getArticleController);

/**
 * Deletes an article by id
 */
router.delete("/articles/:id", deleteArticleController);

/**
 * Updates an article by id
 */
router.put("/articles/:id", updateArticleController);

/**
 * Gets a list of articles
 */
router.get("/articles", getArticlesController);

export { router as articlesRouter };
