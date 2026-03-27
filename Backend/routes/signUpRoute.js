// routes/signupRoute.js
import express from "express";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { username, phone, email, password } = req.body;
    if (!username || !phone || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const newUser = new User({ username, phone, email, password });
    await newUser.save();

    generateToken(res, newUser._id);

    res.status(201).json({
      message: "Registration successful",
      user: newUser.sanitize(),
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
