// src/sections/CategoriesSection.js
import React from "react";
import { FaShoppingCart } from "react-icons/fa";

const CategoriesSection = ({ categories, products }) => {
  if (categories.length === 0) return null;

  return (
    <section className="my-8 px-4 md:px-10">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((cat, idx) => {
          const productImg = products.find((p) => p.category === cat)?.image;
          return (
            <div
              key={idx}
              className="bg-white rounded-lg shadow p-2 flex flex-col items-center"
            >
              {productImg && (
                <img
                  src={productImg}
                  alt={cat}
                  className="w-20 h-20 object-contain mb-2"
                />
              )}
              <p className="text-sm font-medium">{cat}</p>
              <div className="flex gap-2 mt-2">
                <button className="text-pink-600 border border-pink-500 px-2 py-1 text-xs rounded-full hover:bg-pink-50">
                  ❤️ Fav
                </button>
                <button className="text-pink-600 border border-pink-500 px-2 py-1 text-xs rounded-full hover:bg-pink-50">
                  <FaShoppingCart />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CategoriesSection;
