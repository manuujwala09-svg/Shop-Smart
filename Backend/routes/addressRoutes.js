// backend/routes/addressRoutes.js
import express from "express";
import Address from "../models/Address.js";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js"; // adjust path if needed

const router = express.Router();

// Get all addresses for current user
router.get("/me", protect, async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    return res.json({ success: true, addresses });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch addresses" });
  }
});

// Add new address for current user
router.post("/", protect, async (req, res) => {
  try {
    const { name, phone, pincode, addressLine, city, state, isDefault } =
      req.body;
    const doc = new Address({
      userId: req.user._id.toString(),
      name,
      phone,
      pincode,
      addressLine,
      city,
      state,
      isDefault: !!isDefault,
    });

    // if isDefault true, unset others
    if (doc.isDefault) {
      await Address.updateMany(
        { userId: req.user._id },
        { $set: { isDefault: false } }
      );
    }
    await doc.save();
    return res.status(201).json({ success: true, address: doc });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create address" });
  }
});

// Update an address
router.put("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    if (update.isDefault) {
      // unset previous defaults
      await Address.updateMany(
        { userId: req.user._id },
        { $set: { isDefault: false } }
      );
    }
    const updated = await Address.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { $set: update },
      { new: true }
    );
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    return res.json({ success: true, address: updated });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update address" });
  }
});

// Delete address
router.delete("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Address.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });
    if (!removed)
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    return res.json({ success: true, message: "Deleted", address: removed });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete address" });
  }
});

// Set address as default
router.put("/set-default/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    await Address.updateMany(
      { userId: req.user._id },
      { $set: { isDefault: false } }
    );
    const updated = await Address.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { $set: { isDefault: true } },
      { new: true }
    );
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    return res.json({ success: true, address: updated });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to set default" });
  }
});

export default router;
