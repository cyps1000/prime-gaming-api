import express from "express";
import { getArticlesController } from "./get-articles";
import { createArticleController } from "./create-article";

const router = express.Router();

router.get("/articles", getArticlesController);

router.post("/articles", createArticleController);

export { router as articlesRouter };
