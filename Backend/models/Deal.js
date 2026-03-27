import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    discountText: { type: String, required: true }, // e.g. "Up to 50% OFF"
    image: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // link to featured products
  },
  { timestamps: true }
);

export default mongoose.model("Deal", dealSchema);
