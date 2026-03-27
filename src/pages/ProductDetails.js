// src/pages/ProductDetails.js
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/cartContext";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaArrowLeft,
  FaShoppingCart,
} from "react-icons/fa";

const ACCENT = "text-[#6B46C1]";
const ADD_BTN =
  "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, increaseQuantity, decreaseQuantity } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);

  const [selectedStore, setSelectedStore] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [price, setPrice] = useState(0);

  // fetch product
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        setProduct(data);
        if (data.stores?.length) {
          setSelectedStore(data.stores[0].storeName);
          setSelectedSize(data.stores[0].quantities?.[0]?.size || "");
          setPrice(
            data.stores[0].quantities?.[0]?.cost || data.bestPrice?.cost || 0
          );
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // update price when store/size change
  useEffect(() => {
    if (!product) return;
    const store = product.stores.find((s) => s.storeName === selectedStore);
    const qty = store?.quantities.find((q) => q.size === selectedSize);
    setPrice(qty?.cost ?? product.bestPrice?.cost ?? 0);
  }, [selectedStore, selectedSize, product]);

  if (loading) return <div className="p-6 mt-10">Loading...</div>;
  if (!product)
    return <div className="p-6 mt-10 text-red-500">Product not found</div>;

  // cart item match for selected store+size
  const cartItem = cart.find(
    (it) =>
      it.product._id === product._id &&
      it.selectedStore === selectedStore &&
      it.selectedSize === selectedSize
  );
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="flex flex-col items-center px-4 md:px-12 relative pt-24 md:pt-20 pb-10 min-h-screen bg-gray-50">
      {/* Cart Icon */}
      <div
        className="fixed top-5 right-5 z-50 cursor-pointer"
        onClick={() => navigate("/cart")}
      >
        <FaShoppingCart className="text-2xl text-[#6B46C1]" />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {cart.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        )}
      </div>

      <div className="bg-white shadow-xl rounded-2xl max-w-5xl w-full grid md:grid-cols-2 overflow-hidden border border-gray-200">
        {/* Left */}
        <div className="p-6 flex flex-col items-center border-r border-gray-100 relative bg-gradient-to-b from-white to-gray-50">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
          >
            <FaArrowLeft className="text-gray-700" />
          </button>

          <button
            onClick={() => setIsFav(!isFav)}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
          >
            {isFav ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart className="text-gray-600" />
            )}
          </button>

          <AnimatePresence>
            <motion.img
              key={product._id}
              src={
                product.stores?.[0]?.quantities?.[0]?.images?.[0] ||
                "/placeholder.png"
              }
              alt={product.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-md h-auto rounded-2xl object-cover shadow-lg"
            />
          </AnimatePresence>

          <div className="mt-6 max-w-md text-center">
            <h2 className="text-xl font-semibold">{product.name}</h2>
          </div>
        </div>

        {/* Right - store picker + sizes */}
        <div className="p-6">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <FaStar className="text-yellow-400" />
            <span className="text-gray-700 font-medium">4.6</span>
            <span className="text-sm text-gray-500">(250k reviews)</span>
          </div>

          {/* ---------- HORIZONTAL STORE PICKER (futuristic cards) ---------- */}
          <div className="mt-6">
            <label className="text-sm text-gray-600 mb-2 block">
              Choose Store
            </label>
            <div className="flex gap-3 overflow-x-auto py-2 -mx-2 px-2 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300">
              {product.stores.map((store) => (
                <button
                  key={store.storeName}
                  onClick={() => {
                    setSelectedStore(store.storeName);
                    setSelectedSize(store.quantities?.[0]?.size || "");
                  }}
                  className={`min-w-[160px] flex-shrink-0 p-3 rounded-2xl border transition-shadow hover:shadow-lg transform hover:-translate-y-1 ${
                    selectedStore === store.storeName
                      ? "bg-gradient-to-br from-[#6B46C1] to-[#8B5CF6] text-white border-transparent"
                      : "bg-white text-gray-800 border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{store.storeName}</div>
                      <div className="text-xs text-gray-200 opacity-80 mt-1">
                        {store.brand || ""}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">from</div>
                      <div className="text-lg font-bold">
                        ₹{Math.min(...store.quantities.map((q) => q.cost))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs opacity-80">
                    {store.quantities.slice(0, 3).map((q) => (
                      <span key={q.size} className="inline-block mr-2">
                        {q.size} • ₹{q.cost}
                      </span>
                    ))}
                    {store.quantities.length > 3 && (
                      <span className="text-gray-200">
                        +{store.quantities.length - 3}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ---------- SIZE CHIPS ---------- */}
          <div className="mt-6">
            <label className="text-sm text-gray-600 mb-2 block">
              Choose Size
            </label>
            <div className="flex gap-2 flex-wrap">
              {product.stores
                .find((s) => s.storeName === selectedStore)
                ?.quantities.map((q) => (
                  <button
                    key={q.size}
                    onClick={() => setSelectedSize(q.size)}
                    className={`px-3 py-1 rounded-full border ${
                      selectedSize === q.size
                        ? "bg-[#6B46C1] text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {q.size} • ₹{q.cost}
                  </button>
                ))}
            </div>
          </div>

          {/* Price & Add Controls */}
          <div className="mt-6 flex items-center justify-between">
            <div>
              <div className={`text-lg font-semibold ${ACCENT}`}>₹{price}</div>
              <div className="text-xs text-gray-500">Inclusive of taxes</div>
            </div>

            <div>
              {quantity > 0 ? (
                <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-2">
                  <button
                    onClick={() =>
                      decreaseQuantity(product._id, selectedStore, selectedSize)
                    }
                    className="bg-white px-3 py-1 rounded-full text-lg font-bold"
                  >
                    -
                  </button>
                  <span className="font-semibold">{quantity}</span>
                  <button
                    onClick={() =>
                      addToCart(product, selectedStore, selectedSize)
                    }
                    className="bg-white px-3 py-1 rounded-full text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() =>
                    addToCart(product, selectedStore, selectedSize)
                  }
                  className={`px-6 py-2 ${ADD_BTN} text-white rounded-lg shadow-lg transition`}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <strong>Selected:</strong> {selectedStore} — {selectedSize}
            <p className="text-sm text-gray-500 mt-2">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
