import React, { useState, useEffect, useRef } from "react";
import { FaShoppingCart, FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/cartContext";
import { useAddress } from "../context/addressContext";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001";

const Navbar = ({
  openLogin,
  openSignup,
  openCart,
  user,
  setUser,
  onOpenAddress,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("Search essentials...");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ kept and used now

  const { totalItems } = useCart();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { selectedAddress } = useAddress();

  // Rotate placeholder (like Zepto)
  useEffect(() => {
    const list = [
      "Search bread & butter...",
      "Find rice & atta...",
      "Buy daily groceries...",
      "Search fresh milk...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      setPlaceholder(list[i++ % list.length]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/search?q=${searchQuery}`);
        if (res.data.success) {
          const combined = [...res.data.results, ...res.data.suggestions];
          setResults(combined);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-6 py-3 gap-3">
        {/* Left Section: Logo + Address */}
        <div className="flex items-center gap-4 cursor-pointer">
          <h1
            onClick={() => navigate("/")}
            className="text-2xl font-extrabold text-purple-700"
          >
            SimpleSpend
          </h1>
          <div
            className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full text-sm text-purple-700 cursor-pointer hover:bg-purple-100 transition"
            onClick={onOpenAddress}
          >
            <FaMapMarkerAlt />
            <span className="truncate max-w-[160px]">
              {selectedAddress
                ? `Delivering to ${selectedAddress.city || "your location"}`
                : "Set delivery location"}
            </span>
          </div>
        </div>

        {/* Center: Search */}
        <div className="relative flex-1 max-w-md" ref={dropdownRef}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full border border-purple-200 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600" />

          {/* ✅ Loading indicator */}
          {loading && (
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2 text-xs text-purple-500">
              Searching...
            </div>
          )}

          {/* Dropdown */}
          {showDropdown && results.length > 0 && (
            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-auto z-50">
              {results.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 cursor-pointer"
                  onClick={() => {
                    navigate(`/product/${p.id}`);
                    setShowDropdown(false);
                    setSearchQuery("");
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-gray-500 text-xs">{p.category}</p>
                  </div>
                  <p className="text-purple-700 font-semibold">₹{p.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Cart + Auth */}
        <div className="flex items-center gap-3 text-sm font-medium">
          <button
            onClick={openCart}
            className="relative flex items-center gap-1 text-gray-700 hover:text-purple-700 transition"
          >
            <FaShoppingCart />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {user ? (
            <>
              <span className="text-gray-700 hidden sm:block">
                {user.username}
              </span>
              <button
                onClick={() => setUser(null)}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={openLogin}
                className="text-gray-700 hover:text-purple-700"
              >
                Login
              </button>
              <button
                onClick={openSignup}
                className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition"
              >
                Signup
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
