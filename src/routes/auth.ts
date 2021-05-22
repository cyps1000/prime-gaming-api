import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Admin } from "../models/Admin";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import { validateRequest, currentUser } from "../middlewares";
import { BadRequestError } from "../services/error";
import { PasswordManager } from "../services/password-manager";

const router = express.Router();

router.post(
  "/auth/register-admin",
  [
    body("username")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please provide your username"),
    body("password")
      .trim()
      .not()
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
      .withMessage(
        "Password must include one lowercase character, one uppercase character, a number, and a special character."
      ),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const existingAdmin = await Admin.findOne({});

    if (existingAdmin) {
      throw new BadRequestError(
        "An admin account already exists, contact your system administrator."
      );
    }

    const admin = Admin.build({ username, password, role: "prime-admin" });
    await admin.save();

    const adminJWT = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: adminJWT,
    };

    res.status(201).send(admin);
  }
);

router.post(
  "/auth/register",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("firstName")
      .not()
      .isEmpty()
      .withMessage("Please provide your first name"),
    body("lastName")
      .not()
      .isEmpty()
      .withMessage("Please provide your last name"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password, firstName, lastName });
    await user.save();

    const userJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJWT,
    };

    res.status(201).send(user);
  }
);

router.post(
  "/auth/login",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must provide a password."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError("Invalid credentials.");
    }

    const passwordsMatch = await PasswordManager.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials.");
    }

    const userJWT = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJWT,
    };

    res.status(200).send(existingUser);
  }
);

router.post(
  "/auth/login-admin",
  [
    body("username")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Please provide a username"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must provide a password."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const existingAdmin = await Admin.findOne({ username });

    if (!existingAdmin) {
      throw new BadRequestError("Invalid credentials.");
    }

    const passwordsMatch = await PasswordManager.compare(
      existingAdmin.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials.");
    }

    const adminJWT = jwt.sign(
      { id: existingAdmin.id, username: existingAdmin.username },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: adminJWT,
    };

    res.status(200).send(existingAdmin);
  }
);

router.get("/auth", currentUser, (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as authRouter };
