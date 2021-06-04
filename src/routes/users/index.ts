import express from "express";

/**
 * Imports Controllers
 */
import { getUsersController } from "./controllers/get-users";
import { getUserController } from "./controllers/get-user";
import { deleteUserController } from "./controllers/delete-user";
import { suspendUserController } from "./controllers/suspend-user";
import { recoverUserController } from "./controllers/recover-user";
import { updateUserController } from "./controllers/update-user";

/**
 * Defines the router
 */
const router = express.Router();

/**
 * Gets a list of users
 */
router.get("/users", getUsersController);

/**
 * Gets a user by id
 */
router.get("/users/:id", getUserController);

/**
 * Deletes a user by id
 */
router.delete("/users/:id", deleteUserController);

/**
 * Updates a user by id
 */
router.put("/users/:id", updateUserController);

/**
 *  Suspends a user by id
 */
router.put("/users/:id/suspend", suspendUserController);

/**
 *  Recover a user by id
 */
router.put("/users/:id/recover", recoverUserController);

export { router as usersRouter };
