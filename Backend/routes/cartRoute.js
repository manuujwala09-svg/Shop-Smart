// routes/cartRoute.js
import express from "express";
import protect from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// GET current user's cart (protected)
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");
    res.json({ items: user.cart || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// POST add item (protected)
router.post("/", protect, async (req, res) => {
  try {
    const { productId, selectedStore, selectedSize, quantity = 1 } = req.body;
    const user = await User.findById(req.user._id);

    const idx = user.cart.findIndex(
      (i) =>
        i.product.toString() === productId &&
        i.selectedStore === selectedStore &&
        i.selectedSize === selectedSize
    );

    if (idx >= 0) {
      user.cart[idx].quantity += quantity;
    } else {
      user.cart.push({
        product: productId,
        quantity,
        selectedStore,
        selectedSize,
      });
    }

    await user.save();
    const updated = await User.findById(req.user._id).populate("cart.product");
    res.json({ items: updated.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Add to cart failed" });
  }
});

// PUT update quantity (protected)
router.put("/:productId", protect, async (req, res) => {
  try {
    const { action, selectedStore, selectedSize } = req.body;
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    user.cart = user.cart
      .map((it) => {
        if (
          it.product.toString() === productId &&
          it.selectedStore === selectedStore &&
          it.selectedSize === selectedSize
        ) {
          if (action === "increment") it.quantity += 1;
          else if (action === "decrement")
            it.quantity = Math.max(0, it.quantity - 1);
        }
        return it;
      })
      .filter((i) => i.quantity > 0);

    await user.save();
    const updated = await User.findById(req.user._id).populate("cart.product");
    res.json({ items: updated.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update cart failed" });
  }
});

// DELETE item (protected)
router.delete("/:productId", protect, async (req, res) => {
  try {
    const { selectedStore, selectedSize } = req.body;
    const { productId } = req.params;
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { cart: { product: productId, selectedStore, selectedSize } },
    });
    const updated = await User.findById(req.user._id).populate("cart.product");
    res.json({ items: updated.cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Remove from cart failed" });
  }
});

// MERGE local cart into user cart (protected)
router.post("/merge", protect, async (req, res) => {
  try {
    const localCart = req.body.items || [];
    const user = await User.findById(req.user._id);

    for (const lc of localCart) {
      const idx = user.cart.findIndex(
        (i) =>
          i.product.toString() === lc.productId &&
          i.selectedStore === lc.selectedStore &&
          i.selectedSize === lc.selectedSize
      );
      if (idx >= 0) user.cart[idx].quantity += lc.quantity || 1;
      else
        user.cart.push({
          product: lc.productId,
          quantity: lc.quantity || 1,
          selectedStore: lc.selectedStore,
          selectedSize: lc.selectedSize,
        });
    }

    await user.save();
    const updated = await User.findById(req.user._id).populate("cart.product");
    res.json({ items: updated.cart });
  } catch (err) {
    console.error("Merge failed", err);
    res.status(500).json({ error: "Merge failed" });
  }
});

export default router;
