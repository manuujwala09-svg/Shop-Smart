import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AddressSubSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Home" },
    address: { type: String, required: true },
    lat: Number,
    lng: Number,
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 }, // ✅ strong password
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        selectedStore: String,
        selectedSize: String,
      },
    ],
    address: { type: String, default: "" },
    addresses: [AddressSubSchema],
  },
  { timestamps: true }
);

// ✅ Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Remove sensitive fields
userSchema.methods.sanitize = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", userSchema);
