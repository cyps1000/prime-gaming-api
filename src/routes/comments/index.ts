import express from "express";

/**
 * Imports Controllers
 */
import { getCommentsController } from "./controllers/get-comments";
import { createCommentController } from "./controllers/create-comment";
import { deleteCommentController } from "./controllers/delete-comment";
import { banCommentController } from "./controllers/ban-comment";
import { unbanCommentController } from "./controllers/unban-comment";
import { updateCommentController } from "./controllers/update-comment";
import { getCommentController } from "./controllers/get-comment";
import { moderateCommentController } from "./controllers/moderate-comment";

/**
 * Defines the router
 */
const router = express.Router();

/**
 * Creates a new comment
 */
router.post("/comments", createCommentController);

/**
 * Gets a list of comments
 */
router.get("/comments", getCommentsController);

/**
 * Deletes a comment by id
 */
router.delete("/comments/:id", deleteCommentController);

/**
 * Bans / Suspends a comment by id
 */
router.put("/comments/:id/ban", banCommentController);

/**
 * Unban / Recover a comment by id
 */
router.put("/comments/:id/unban", unbanCommentController);

/**
 * Updates a comment by id
 */
router.put("/comments/:id", updateCommentController);

/**
 * Gets comment by id
 */
router.get("/comments/:id", getCommentController);

/**
 * Moderates a comment by id
 */
router.put("/comments/:id/moderate", moderateCommentController);

export { router as commentsRouter };
