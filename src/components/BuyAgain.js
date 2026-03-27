import React, { useEffect, useState } from "react";

const BuyAgain = () => {
  const [categories, setCategories] = useState([]);

  // Fetch categories from backend (MongoDB later)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-purple-50 to-white py-4 px-4 md:px-10 rounded-lg shadow-sm mt-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Buy Again</h2>

      <div className="flex gap-5 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="flex flex-col items-center min-w-[80px] cursor-pointer"
          >
            <div className="bg-white border border-gray-200 p-3 rounded-full shadow hover:shadow-md transition-all duration-200">
              <img
                src={cat.img}
                alt={cat.name}
                className="w-10 h-10 object-contain"
              />
            </div>
            <p className="text-xs mt-2 text-gray-700 text-center whitespace-nowrap">
              {cat.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BuyAgain;
