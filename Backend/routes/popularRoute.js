// inside routes/productRoute.js (bottom of file)
import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Existing routes here...

// 🟣 Popular products (mock: top 6 or based on rating/sales)
router.get("/popular", async (req, res) => {
  try {
    const products = await Product.find().limit(6);
    res.json({ success: true, products });
  } catch (err) {
    console.error("Popular route error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch popular" });
  }
});

export default router;
