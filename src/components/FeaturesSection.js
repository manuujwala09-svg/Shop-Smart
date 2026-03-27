// src/components/FeaturesSection.js
import React from "react";
import { FaTruck, FaTags, FaShoppingCart } from "react-icons/fa";

const features = [
  {
    icon: <FaTruck className="text-pink-600 text-3xl mb-2" />,
    title: "Fast Delivery",
    desc: "Get your orders delivered in minutes!",
  },
  {
    icon: <FaTags className="text-pink-600 text-3xl mb-2" />,
    title: "Best Offers",
    desc: "Exciting deals every day.",
  },
  {
    icon: <FaShoppingCart className="text-pink-600 text-3xl mb-2" />,
    title: "Wide Range",
    desc: "Thousands of products to choose from.",
  },
];

const FeaturesSection = () => (
  <section className="my-8 px-4 md:px-10">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
      {features.map((f, i) => (
        <div key={i} className="p-4 bg-white rounded-lg shadow">
          <div className="mx-auto">{f.icon}</div>
          <h3 className="font-semibold">{f.title}</h3>
          <p className="text-sm text-gray-500">{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default FeaturesSection;
