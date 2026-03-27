import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SearchResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/search?q=${query}`
        );
        setResults(res.data);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (results.length === 0)
    return <p className="text-center mt-10">No results found for "{query}"</p>;

  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {results.map((item) => (
        <div key={item._id} className="border rounded-lg p-3 shadow-sm">
          <img
            src={item.stores[0]?.quantities[0]?.images[0]}
            alt={item.name}
            className="w-full h-40 object-cover rounded-md"
          />
          <h3 className="mt-2 font-semibold text-sm">{item.name}</h3>
          <p className="text-gray-600 text-xs">{item.category}</p>
          <p className="font-bold mt-1">₹{item.bestPrice?.cost}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchResultsPage;
