import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const router = express.Router();

// 🧾 GET user cart
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate("items.product");

    if (!cart) return res.json({ items: [] });

    // 🧹 Remove invalid/deleted products
    cart.items = cart.items.filter((i) => i.product && i.product._id);
    await cart.save();

    res.json({ items: cart.items });
  } catch (err) {
    console.error("❌ Cart fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// ➕ Add item to cart
router.post("/", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const productExists = await Product.findById(productId);
    if (!productExists)
      return res.status(404).json({ error: "Product not found" });

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (item) {
      item.quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    const populatedCart = await cart.populate("items.product");

    // ✅ Fixed: send items only
    res.status(201).json({ items: populatedCart.items });
  } catch (err) {
    console.error("❌ Add to cart failed:", err);
    res.status(500).json({ error: "Failed to add item" });
  }
});

// 🔁 Update quantity
router.put("/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { action } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );
    if (!item) return res.status(404).json({ error: "Item not found in cart" });

    if (action === "increment") item.quantity += 1;
    else if (action === "decrement") {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        cart.items = cart.items.filter(
          (i) => i.product.toString() !== productId
        );
      }
    }

    await cart.save();
    const updatedCart = await cart.populate("items.product");

    // ✅ Fixed: send items only
    res.json({ items: updatedCart.items });
  } catch (err) {
    console.error("❌ Quantity update failed:", err);
    res.status(500).json({ error: "Failed to update item quantity" });
  }
});

// 🗑️ Remove item
router.delete("/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (i) => i.product.toString() !== productId
    );
    await cart.save();

    const updatedCart = await cart.populate("items.product");

    // ✅ Fixed: send items only
    res.json({ items: updatedCart.items });
  } catch (err) {
    console.error("❌ Remove item failed:", err);
    res.status(500).json({ error: "Failed to remove item" });
  }
});

export default router;
