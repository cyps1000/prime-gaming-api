import express from "express";
import { currentUserController } from "./current-user";
import { loginController } from "./login";
import { registerController } from "./register";
import { loginAdminController } from "./login-admin";
import { registerAdminController } from "./register-admin";

const router = express.Router();

router.get("/auth", currentUserController);

router.post("/auth/login", loginController);
router.post("/auth/register", registerController);

router.post("/auth/login-admin", loginAdminController);
router.post("/auth/register-admin", registerAdminController);

export { router as authRouter };
