// src/components/Footer.js
import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-purple-100 text-gray-700 mt-10 relative">
      {/* Desktop / Tablet Footer */}
      <div className="hidden md:grid max-w-7xl mx-auto px-6 py-10 grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h3 className="text-lg font-semibold mb-3">About SimpleSpend</h3>
          <p className="text-sm text-gray-600">
            One-stop shop for groceries, essentials, and more — delivered fast.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-purple-600 transition">Home</a></li>
            <li><a href="/shop" className="hover:text-purple-600 transition">Shop</a></li>
            <li><a href="/deals" className="hover:text-purple-600 transition">Deals</a></li>
            <li><a href="/about" className="hover:text-purple-600 transition">About Us</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/faq" className="hover:text-purple-600 transition">FAQs</a></li>
            <li><a href="/contact" className="hover:text-purple-600 transition">Contact Us</a></li>
            <li><a href="/delivery" className="hover:text-purple-600 transition">Delivery Info</a></li>
            <li><a href="/returns" className="hover:text-purple-600 transition">Returns</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Subscribe</h3>
          <p className="text-sm text-gray-600 mb-3">Get latest deals and updates straight to your inbox.</p>
          <form className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 rounded-md border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
              />
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition">
                Subscribe
              </button>
            </div>
          </form>
          <div className="flex gap-3 mt-4">
            <a href="/" className="p-2 bg-white rounded-full shadow hover:bg-purple-600 hover:text-white transition">
              <FaFacebookF />
            </a>
            <a href="/" className="p-2 bg-white rounded-full shadow hover:bg-purple-600 hover:text-white transition">
              <FaTwitter />
            </a>
            <a href="/" className="p-2 bg-white rounded-full shadow hover:bg-purple-600 hover:text-white transition">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Floating Footer */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 shadow-md flex justify-around py-2 text-gray-700">
        <a href="/" className="flex flex-col items-center text-sm hover:text-purple-600 transition">
          <FaFacebookF className="mb-1" /> Facebook
        </a>
        <a href="/" className="flex flex-col items-center text-sm hover:text-purple-600 transition">
          <FaTwitter className="mb-1" /> Twitter
        </a>
        <a href="/" className="flex flex-col items-center text-sm hover:text-purple-600 transition">
          <FaInstagram className="mb-1" /> Instagram
        </a>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-200 mt-10 py-4 text-center text-sm text-gray-500 md:mt-0">
        © 2025 SimpleSpend. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
