import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: String,
    desc: String,
    img: String,
    redirectTo: { type: String }, // e.g. "/deals" or "/category/fruits"
  },
  { timestamps: true }
);

export default mongoose.model("Banner", bannerSchema);
