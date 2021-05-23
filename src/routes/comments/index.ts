import express from "express";
import { getCommentsController } from "./get-comments";
import { createCommentController } from "./create-comment";

const router = express.Router();

router.get("/comments", getCommentsController);

router.post("/comments", createCommentController);

export { router as commentsRouter };
