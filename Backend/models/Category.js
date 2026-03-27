import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, required: true },
    bannerImage: { type: String }, // optional category banner
    slug: { type: String, unique: true }, // e.g. "fruits-vegetables"
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
