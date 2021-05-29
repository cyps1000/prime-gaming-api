import express from "express";

/**
 * Imports Controllers
 */
import { currentUserController } from "./current-user";
import { logoutController } from "./logout";
import { loginController } from "./login";
import { registerController } from "./register";
import { loginAdminController } from "./login-admin";
import { registerAdminController } from "./register-admin";
import { refreshTokenController } from "./refresh-token";

/**
 * Defines the router
 */
const router = express.Router();

/**
 * Current user
 */
router.get("/auth", currentUserController);

/**
 * Refresh token
 */
router.get("/auth/refresh-token", refreshTokenController);

/**
 * Logout
 */
router.post("/auth/logout", logoutController);

/**
 * Login
 */
router.post("/auth/login", loginController);

/**
 * Register
 */
router.post("/auth/register", registerController);

/**
 * Login admin
 */
router.post("/auth/login-admin", loginAdminController);

/**
 * Register admin
 */
router.post("/auth/register-admin", registerAdminController);

export { router as authRouter };
