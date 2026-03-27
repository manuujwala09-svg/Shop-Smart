import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// -------------------------------------------------------------
// ✅ 1. Get all products (paginated)
// -------------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .select("name category bestPrice stores"); // only needed fields

    const total = await Product.countDocuments();

    res.json({ total, page, limit, products });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// -------------------------------------------------------------
// ✅ 2. Search products (by name, brand, or category)
// Example: /api/products/search?q=rozana
// -------------------------------------------------------------
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Query (q) is required" });
    }

    const regex = new RegExp(query, "i"); // case-insensitive

    const products = await Product.find({
      $or: [{ name: regex }, { "stores.brand": regex }, { category: regex }],
    })
      .select("name category bestPrice stores")
      .limit(30)
      .sort({ "bestPrice.cost": 1 }); // sort cheapest first

    // 🧹 Clean up response for frontend
    const cleanData = products.map((p) => ({
      id: p._id,
      name: p.name,
      category: p.category,
      bestPrice: p.bestPrice,
      cheapestAt: p.bestPrice?.storeName || "N/A",
      cost: p.bestPrice?.cost || 0,
      brands: [...new Set(p.stores.map((s) => s.brand))],
    }));

    res.json(cleanData);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// -------------------------------------------------------------
// ✅ 3. Get products by category
// -------------------------------------------------------------
router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category })
      .select("name bestPrice stores")
      .sort({ "bestPrice.cost": 1 });

    const cleanData = products.map((p) => ({
      id: p._id,
      name: p.name,
      cheapestAt: p.bestPrice?.storeName,
      price: p.bestPrice?.cost,
    }));

    res.json(cleanData);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// -------------------------------------------------------------
// ✅ 4. Best deals (optional filter: store, brand)
// -------------------------------------------------------------
router.get("/best-deals", async (req, res) => {
  try {
    const { store, brand } = req.query;

    let filter = {};
    if (store) filter["bestPrice.storeName"] = store;
    if (brand) filter["stores.brand"] = brand;

    const products = await Product.find(filter)
      .select("name category bestPrice stores")
      .sort({ "bestPrice.cost": 1 })
      .limit(30);

    const cleanData = products.map((p) => ({
      id: p._id,
      name: p.name,
      category: p.category,
      cheapestAt: p.bestPrice?.storeName || "N/A",
      cost: p.bestPrice?.cost || 0,
      size: p.bestPrice?.size || "N/A",
      brands: [...new Set(p.stores.map((s) => s.brand))],
    }));

    res.json(cleanData);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// -------------------------------------------------------------
// ✅ 5. Compare prices for one product
// -------------------------------------------------------------
router.get("/:id/compare", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id, {
      stores: 1,
      bestPrice: 1,
      name: 1,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const storeList = product.stores.map((s) => ({
      storeName: s.storeName,
      brand: s.brand,
      options: s.quantities.map((q) => ({
        size: q.size,
        cost: q.cost,
        offer: q.offer,
      })),
    }));

    res.json({
      name: product.name,
      bestPrice: product.bestPrice,
      storeCount: storeList.length,
      stores: storeList,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// -------------------------------------------------------------
// ✅ 6. Get single product by ID
// -------------------------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});
// -------------------------------------------------------------
// ✅ 7. Get popular products (top 6 or random 6)
// -------------------------------------------------------------
// -------------------------------------------------------------
// ✅ 7. Get popular products (auto-picks random top 6)
// -------------------------------------------------------------
router.get("/popular", async (req, res) => {
  try {
    // Get total count
    const total = await Product.countDocuments();

    // Random skip for variety (if enough items)
    const skip = total > 6 ? Math.floor(Math.random() * (total - 6)) : 0;

    // Pick 6 random or first 6
    const products = await Product.find().skip(skip).limit(6);

    // 🧹 Clean data for frontend
    const cleanData = products.map((p) => {
      // Get one fallback image (first image from first store)
      let image = null;
      if (p.stores?.length > 0) {
        const firstStore = p.stores[0];
        const firstQuantity = firstStore.quantities?.[0];
        image =
          firstQuantity?.images?.[0] ||
          "https://via.placeholder.com/300x300.png?text=Product+Image";
      }

      return {
        id: p._id,
        name: p.name,
        category: p.category,
        price: p.bestPrice?.cost || 0,
        cheapestAt: p.bestPrice?.storeName || "N/A",
        image,
      };
    });

    res.json({ success: true, products: cleanData });
  } catch (error) {
    console.error("❌ Popular route error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
});


export default router;
