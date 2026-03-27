import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cartContext";
import api from "../../api";

const SearchModal = ({ isOpen, onClose, initialQuery = "" }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({}); // { productId: {store, size} }

  useEffect(() => {
    if (!isOpen) return;
    setQuery(initialQuery);
    setSelectedVariants({});
    if (initialQuery) fetchResults(initialQuery);
  }, [isOpen, initialQuery]);

  const fetchResults = async (q) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.data.success) setResults(res.data.results || []);
      else setResults([]);
    } catch (err) {
      console.error("❌ Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim() !== "") fetchResults(val);
    else setResults([]);
  };

  const handleSelect = async (id) => {
    try {
      console.log("👉 Selected product:", id);
      const res = await api.post("/api/search/details", { productId: id });
      if (res.data.success && res.data.product) {
        navigate(`/product/${id}`, { state: { product: res.data.product } });
      } else {
        alert("Product not available");
      }
      onClose();
    } catch (error) {
      console.error("❌ Product details fetch failed:", error);
      alert("Product not available");
    }
  };

  const handleVariantChange = (productId, field, value) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  const handleQuickAdd = async (product) => {
    const variant = selectedVariants[product.id];
    if (!variant?.store || !variant?.size) {
      alert("Please select store and size");
      return;
    }
    await addToCart(product, variant.store, variant.size);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-4 mt-16">
        {/* Search input */}
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={query}
            onChange={handleChange}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none"
          />
          <button
            onClick={onClose}
            className="ml-3 text-gray-600 hover:text-gray-800"
          >
            <FaTimes />
          </button>
        </div>

        {/* Results */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : results.length === 0 ? (
          <p className="text-center text-gray-400">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
            {results.map((p) => {
              const selected = selectedVariants[p.id] || {};
              return (
                <div
                  key={p.id}
                  className="border rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 hover:shadow-md transition"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-20 h-20 object-cover rounded-md cursor-pointer"
                    onClick={() => handleSelect(p.id)}
                  />

                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => handleSelect(p.id)}
                  >
                    <h3 className="font-medium text-gray-800">{p.name}</h3>
                    <p className="text-gray-600">₹{p.price}</p>
                  </div>

                  {/* Variant selectors */}
                  {p.stores?.length > 0 && (
                    <div className="flex gap-2 flex-col sm:flex-row items-start sm:items-center">
                      {/* Store select */}
                      <select
                        value={selected.store || ""}
                        onChange={(e) =>
                          handleVariantChange(p.id, "store", e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value="">Select Store</option>
                        {p.stores.map((s) => (
                          <option key={s.storeName} value={s.storeName}>
                            {s.storeName}
                          </option>
                        ))}
                      </select>

                      {/* Size select */}
                      <select
                        value={selected.size || ""}
                        onChange={(e) =>
                          handleVariantChange(p.id, "size", e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                        disabled={!selected.store}
                      >
                        <option value="">Select Size</option>
                        {p.stores
                          .find((s) => s.storeName === selected.store)
                          ?.quantities.map((q) => (
                            <option key={q.size} value={q.size}>
                              {q.size} - ₹{q.cost}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  <button
                    onClick={() => handleQuickAdd(p)}
                    className="bg-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700 transition text-sm"
                  >
                    Add
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
