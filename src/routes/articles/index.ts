import express from "express";
import { getArticlesController } from "./get-articles";
import { getArticleController } from "./get-article";
import { createArticleController } from "./create-article";
import { updateArticleController } from "./update-article";
import { deleteArticleController } from "./delete-article";

const router = express.Router();

router.get("/articles", getArticlesController);
router.get("/articles/:id", getArticleController);
router.put("/articles/:id", updateArticleController);
router.delete("/articles/:id", deleteArticleController);

router.post("/articles", createArticleController);

export { router as articlesRouter };
