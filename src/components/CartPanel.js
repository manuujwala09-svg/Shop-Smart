import React from "react";
import { useCart } from "../context/cartContext";

const CartPanel = () => {
  const { cart, isOpen, setIsOpen, removeFromCart } = useCart();

  return (
    <div
      className={`fixed top-0 right-0 w-96 h-full bg-white shadow-lg p-4 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Cart</h2>
        <button onClick={() => setIsOpen(false)}>✖</button>
      </div>

      {cart.length === 0 ? (
        <p className="text-gray-500">No items yet</p>
      ) : (
        cart.map((item) => (
          <div key={item.product._id} className="flex justify-between mb-2">
            <div>
              <p>{item.product.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <button
              className="text-red-500"
              onClick={() => removeFromCart(item.product._id)}
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default CartPanel;
