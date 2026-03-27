import React, { useState, useEffect } from "react";
import CategoryNavbar from "../components/CategoryNavbar";
import ProductGrid from "../components/ProductGrid";
import BannerSection from "../components/BannerSection";
import CategoriesSection from "../components/CategoriesSection";
import DealsSection from "../components/DealsSection";
import FeaturesSection from "../components/FeaturesSection";
import { useCart } from "../context/cartContext";
import { FaShoppingCart, FaHeart } from "react-icons/fa";

const Home = ({ setCartOpen, setFavoritesOpen }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { totalItems, totalPrice } = useCart();

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        const productList = Array.isArray(data) ? data : data.products || [];
        setProducts(productList);
        setCategories([
          "All",
          ...new Set(productList.map((p) => p.category || "Others")),
        ]);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Filter products by selected category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (p) =>
            (p.category || "Others").toLowerCase() ===
            selectedCategory.toLowerCase()
        );

  return (
    <div className="home-page mt-20">
      {/* Category Navbar */}
      <CategoryNavbar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Banner & Sections */}
      <BannerSection products={products.filter((p) => p.isFeatured)} />
      <CategoriesSection categories={categories} products={products} />
      <DealsSection products={products} />

      {/* Product Grid (filtered) */}
      <ProductGrid
        selectedCategory={selectedCategory}
        setFavoritesOpen={setFavoritesOpen}
      />

      <FeaturesSection />

      {/* Floating Cart + Favorites Bar for Mobile */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-purple-600 text-white flex justify-between items-center px-4 py-3 shadow-lg z-[60]">
          <div className="flex items-center gap-3">
            <FaShoppingCart className="text-lg" />
            <span>
              {totalItems} item{totalItems > 1 ? "s" : ""}
            </span>
          </div>
          <div className="font-semibold">₹{totalPrice.toFixed(2)}</div>
          <div className="flex gap-2">
            <button
              onClick={() => setCartOpen(true)}
              className="bg-white text-purple-600 px-3 py-1 rounded-full font-medium hover:bg-gray-100 transition"
            >
              View Cart
            </button>
            <button
              onClick={() => setFavoritesOpen(true)}
              className="bg-white text-pink-600 px-3 py-1 rounded-full font-medium hover:bg-gray-100 transition flex items-center gap-1"
            >
              <FaHeart /> Favorites
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
