// src/components/CategoryNavbar.js
import React from "react";
import { 
  FaAppleAlt, FaCarrot, FaMedkit, FaUtensils, FaLeaf, FaShoppingBag, FaOm, FaHeartbeat, FaDumbbell 
} from "react-icons/fa";

const categoriesList = [
  { name: "All", icon: <FaShoppingBag /> },
  { name: "Temple", icon: <FaOm /> },
  { name: "Diabetic", icon: <FaHeartbeat /> },
  { name: "Gym", icon: <FaDumbbell /> },
  { name: "Fruits", icon: <FaAppleAlt /> },
  { name: "Vegetables", icon: <FaCarrot /> },
  { name: "Groceries", icon: <FaLeaf /> },
  { name: "Medical", icon: <FaMedkit /> },
  { name: "Restaurant", icon: <FaUtensils /> },
];

const CategoryNavbar = ({ onSelectCategory, selectedCategory }) => {
  return (
    <div className="bg-purple-100 shadow-inner mt-[72px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex gap-4 overflow-x-auto scrollbar-hide">
        {categoriesList.map((cat, idx) => {
          const isActive = selectedCategory === cat.name;
          return (
            <button
              key={idx}
              onClick={() => onSelectCategory(cat.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border font-medium shadow-sm whitespace-nowrap transition
                ${isActive 
                  ? "bg-purple-600 text-white border-purple-700" 
                  : "bg-white/80 text-gray-700 border-purple-200 hover:bg-purple-600 hover:text-white"}`}
            >
              <span className={`text-lg ${isActive ? "text-white" : "text-purple-600"}`}>
                {cat.icon}
              </span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNavbar;
