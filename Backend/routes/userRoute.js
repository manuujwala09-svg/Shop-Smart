import express from "express";
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// update address (simple single address or push to addresses)
router.put("/address", protect, async (req, res) => {
  try {
    const { address, label, lat, lng } = req.body;
    const user = await User.findById(req.user._id);

    // keep both: set main "address" and push to addresses array
    if (address) user.address = address;
    if (address || label) {
      user.addresses.unshift({ label: label || "Home", address, lat, lng });
      // keep only latest N addresses if you want, e.g. user.addresses = user.addresses.slice(0,5)
    }
    await user.save();
    res.json({ user: user.sanitize() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update address" });
  }
});

export default router;
