// routes/authRoute.js
import express from "express";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ error: "Failed to get profile" });
  }
});

router.post("/logout", (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: "Logged out" });
});

export default router;
