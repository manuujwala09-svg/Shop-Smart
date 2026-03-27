// src/components/ProductGrid.js
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useCart } from "../context/cartContext";
import { fetchAllProducts } from "../services/dbService";
import { motion, AnimatePresence } from "framer-motion";

const ProductGrid = ({ selectedCategory, setFavoritesOpen }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart } = useCart();

  // Fetch all products once
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchAllProducts();
        const productList = Array.isArray(data) ? data : data.products || [];
        setProducts(productList);
        setFilteredProducts(productList);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Filter products when selectedCategory changes
  useEffect(() => {
    if (!selectedCategory || selectedCategory === "All") {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((p) => {
      const productCategory = (p.category || "Others").toLowerCase();
      const selected = selectedCategory.toLowerCase();
      return productCategory === selected;
    });

    setFilteredProducts(filtered);
  }, [selectedCategory, products]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500 animate-pulse">
        Loading products...
      </div>
    );
  }

  if (!filteredProducts.length) {
    return (
      <p className="text-center mt-10 text-gray-500">
        No products available for {selectedCategory}.
      </p>
    );
  }

  return (
    <section className="px-4 md:px-10 py-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory} // re-triggers animation when category changes
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              setFavoritesOpen={setFavoritesOpen}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default ProductGrid;
