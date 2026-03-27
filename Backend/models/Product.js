import mongoose from "mongoose";

const quantitySchema = new mongoose.Schema({
  size: { type: String, required: true },
  cost: { type: Number, required: true },
  offer: { type: String },
  barcode: { type: String },
  images: {
    type: [String], // [image1Url, image2Url, image3Url, image4Url]
    default: []
  },
});

const storeInfoSchema = new mongoose.Schema({
  storeName: { type: String, required: true }, // e.g. "shop1", "shop22"
  brand: { type: String },
  quantities: [quantitySchema],
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "Basmati rice rozana"
    description: { type: String },
    category: { type: String, default: "Rice" }, // optional
    stores: [storeInfoSchema], // All stores where this product is available
    bestPrice: {
      cost: Number,
      storeName: String,
      size: String,
    }, // Auto-calculated cheapest
  },
  { timestamps: true }
);

// Before saving, compute best price automatically
productSchema.pre("save", function (next) {
  let min = { cost: Infinity, storeName: "", size: "" };
  this.stores.forEach((store) => {
    store.quantities.forEach((q) => {
      if (q.cost < min.cost) {
        min = { cost: q.cost, storeName: store.storeName, size: q.size };
      }
    });
  });
  this.bestPrice = min.cost !== Infinity ? min : null;
  next();
});

export default mongoose.model("Product", productSchema);
