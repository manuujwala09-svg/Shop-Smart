import express from "express";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Logged out" });
});

// get current user profile
router.get("/profile", protect, async (req, res) => {
  res.json({ user: req.user });
});

export default router;
