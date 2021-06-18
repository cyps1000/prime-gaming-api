import express from "express";

/**
 * Imports Controllers
 */
import { currentUserController } from "./controllers/current-user";
import { logoutController } from "./controllers/logout";
import { loginController } from "./controllers/login";
import { registerController } from "./controllers/register";
import { loginAdminController } from "./controllers/login-admin";
import { registerAdminController } from "./controllers/register-admin";
import { refreshTokenController } from "./controllers/refresh-token";
import { changePasswordController } from "./controllers/change-password";

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

/**
 * Change password
 */
router.put("/auth/change-password", changePasswordController);

export { router as authRouter };
