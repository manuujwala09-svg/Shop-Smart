// src/sections/BannerSection.js
import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";

const BannerSection = ({ products }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (products.length === 0) return;
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % products.length),
      4000
    );
    return () => clearInterval(timer);
  }, [products]);

  if (products.length === 0) return null;

  const current = products[index];
  return (
    <section
      className="h-60 md:h-96 bg-center bg-cover flex items-center justify-center text-white"
      style={{ backgroundImage: `url(${current.image})` }}
    >
      <div className="text-center bg-black bg-opacity-40 p-4 rounded-md">
        <h2 className="text-xl md:text-3xl font-bold">{current.name}</h2>
        <p className="mt-2 text-sm md:text-lg">Starting at ₹{current.price}</p>
        <button className="mt-3 px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-full font-semibold flex items-center gap-2 mx-auto">
          Shop Now <FaArrowRight />
        </button>
      </div>
    </section>
  );
};

export default BannerSection;
