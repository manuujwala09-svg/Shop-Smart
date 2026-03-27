// src/sections/DealsSection.js
import React from "react";
import ProductCard from "../components/ProductCard";

const DealsSection = ({ products }) => {
  const deals = products.filter((p) => p.discountPrice > 0);
  if (deals.length === 0) return null;

  return (
    <section className="my-8 px-4 md:px-10">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Hot Deals 🔥</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {deals.map((deal) => (
          <ProductCard key={deal._id} product={deal} />
        ))}
      </div>
    </section>
  );
};

export default DealsSection;
