// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const protect = async (req, res, next) => {
  try {
    const token =
      req.cookies?.jwt ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);
    if (!token)
      return res.status(401).json({ error: "Not authorized, no token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "simplekey");
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ error: "Not authorized" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ error: "Not authorized or token invalid" });
  }
};

export default protect;
