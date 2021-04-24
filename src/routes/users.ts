import express, { Request, Response } from "express";
import { User } from "../models/User";
import mongoose from "mongoose";

const router = express.Router();

router.post("/users/new", async (req: Request, res: Response) => {
  const { email, age, name } = req.body;

  const user = User.build({
    email,
    age,
    name,
  });

  await user.save();
  res.status(201).send(user);
});

router.get("/users/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID provided." });
  }

  const foundUser = await User.findById(req.params.id);

  if (!foundUser) {
    return res.status(404).json({ message: "User not found." });
  }

  res.send(foundUser);
});

export { router as usersRouter };
