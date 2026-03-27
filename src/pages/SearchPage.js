import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaSearch, FaStar } from "react-icons/fa";
import api from "../api"; // your axios instance

const ProductCard = ({ product, onClick }) => (
  <div
    className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition cursor-pointer"
    onClick={onClick}
  >
    <img
      src={product.image || "/placeholder.png"}
      alt={product.name}
      className="w-full h-40 object-cover rounded-md mb-2"
    />
    <p className="font-semibold text-gray-800 truncate">{product.name}</p>
    <p className="text-sm text-gray-500 mt-1">₹{product.price}</p>
  </div>
);

const SearchPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const query = params.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(query);
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("relevance");

  // Fetch search results + suggestions
  const fetchResults = async (q) => {
    if (!q) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.data.success) {
        setResults(res.data.results || []);
        setSuggestions(res.data.suggestions || []);
      }
    } catch (err) {
      console.error("Search fetch failed:", err);
      setResults([]);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) fetchResults(query);
  }, [query]);

  // Handle search submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  // Sort results
  const sortedResults = [...results].sort((a, b) => {
    if (sortOption === "price_low") return a.price - b.price;
    if (sortOption === "price_high") return b.price - a.price;
    if (sortOption === "name_asc") return a.name.localeCompare(b.name);
    return 0; // relevance
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Search Header */}
      <div className="sticky top-0 bg-white z-40 border-b shadow-sm">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full flex-1">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search for products, brands and more"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none w-full text-gray-700"
            />
          </div>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-gray-100 px-3 py-2 rounded-full text-sm text-gray-700"
          >
            <option value="relevance">Relevance</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="name_asc">Name: A-Z</option>
          </select>
        </form>
      </div>

      {/* Results Section */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        {query && (
          <>
            <h2 className="text-lg font-semibold mb-3">
              Showing results for "<span className="text-purple-600">{query}</span>"
            </h2>

            {loading ? (
              <p className="text-center text-gray-500 mt-10">Loading...</p>
            ) : sortedResults.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">
                No products found for "{query}"
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {sortedResults.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onClick={() => navigate(`/product/${p.id}`)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Suggestions Section */}
        {suggestions.length > 0 && (
          <>
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center mt-10">
              <FaStar className="text-yellow-400 mr-2" /> You might also like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {suggestions.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onClick={() => navigate(`/product/${p.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
