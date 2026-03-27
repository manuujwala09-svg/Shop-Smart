// server.js (or index.js)
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

import cartRoute from "./routes/cartRoute.js";
import signupRoute from "./routes/signUpRoute.js";
import loginRoute from "./routes/loginRoute.js";
import productRoute from "./routes/productRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import searchRoute from "./routes/searchRoute.js";
import authRoute from "./routes/authRoute.js"; // I'll include this below

const app = express();

// CORS + cookies must be configured before routes
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// -------------------------------------------------------------
// 🧠 MongoDB Connection
// -------------------------------------------------------------
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/simplespend")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

// -------------------------------------------------------------
// Routes
// -------------------------------------------------------------
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/signup", signupRoute);
app.use("/api/login", loginRoute);
app.use("/api/auth", authRoute); // profile + logout
app.use("/api/address", addressRoutes);
app.use("/api/search", searchRoute);

// -------------------------------------------------------------
// 💰 PAYMENT MOCK
// -------------------------------------------------------------
app.post("/api/payment", async (req, res) => {
  const { address, paymentMethod, totalAmount, items } = req.body;
  console.log("💰 Payment Request:", {
    address,
    paymentMethod,
    totalAmount,
    items,
  });
  return res.status(200).json({ message: "Payment Successful" });
});

// -------------------------------------------------------------
// 🚀 START SERVER
// -------------------------------------------------------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
