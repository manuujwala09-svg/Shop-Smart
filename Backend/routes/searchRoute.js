import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET /api/search?q=...
router.get("/", async (req, res) => {
  try {
    const q = req.query.q?.trim() || "";

    let results = [];
    let suggestions = [];

    if (q) {
      // 🟢 Advanced search: name, brand, category, description
      const regex = new RegExp(q, "i");
      results = await Product.find({
        $or: [
          { name: regex },
          { category: regex },
          { description: regex },
          { "stores.brand": regex },
        ],
      })
        .limit(30)
        .sort({ "bestPrice.cost": 1 }); // cheapest first
    }

    // 🟡 Random/popular products fallback
    const count = await Product.countDocuments();
    const randomSkip = Math.max(
      0,
      Math.floor(Math.random() * Math.max(count - 10, 0))
    );
    suggestions = await Product.find()
      .skip(randomSkip)
      .limit(10)
      .sort({ "bestPrice.cost": 1 });

    // 🧹 Normalize results for frontend
    const normalize = (products) =>
      products.map((p) => {
        const cheapestStore =
          p.stores.find((s) =>
            s.quantities.some((q) => q.size === p.bestPrice?.size)
          ) || p.stores[0];

        const cheapestQuantity =
          cheapestStore?.quantities.find((q) => q.size === p.bestPrice?.size) ||
          cheapestStore?.quantities[0];

        return {
          id: p._id,
          name: p.name,
          category: p.category,
          price: p.bestPrice?.cost || 0,
          image:
            cheapestQuantity?.images[0] || "https://via.placeholder.com/150",
        };
      });

    res.json({
      success: true,
      results: normalize(results),
      suggestions: normalize(suggestions),
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ success: false, message: "Search failed" });
  }
});
// -------------------------------------------------------------
// ✅ POST /api/search/details — Get full product details by ID
// -------------------------------------------------------------
router.post("/details", async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // ✅ Extract fallback image safely
    let image = null;
    if (product.stores?.length > 0) {
      const firstStore = product.stores[0];
      const firstQuantity = firstStore.quantities?.[0];
      image =
        firstQuantity?.images?.[0] ||
        "https://via.placeholder.com/300x300.png?text=Product+Image";
    }

    res.json({
      success: true,
      product: {
        id: product._id,
        name: product.name,
        description: product.description || "",
        category: product.category,
        bestPrice: product.bestPrice,
        stores: product.stores,
        image,
      },
    });
  } catch (error) {
    console.error("❌ Product details fetch error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
});

export default router;
