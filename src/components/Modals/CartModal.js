import React, { useState } from "react";
import { useCart } from "../../context/cartContext";
import { X, ShoppingCart } from "lucide-react";
import Toast from "../Toast";

const CartModal = ({ isOpen, onClose }) => {
  const { cart, totalPrice, removeFromCart, addToCart, decreaseQuantity } = useCart();
  const [toast, setToast] = useState(null);

  if (!isOpen) return null;

  const showToastMsg = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 1200);
  };

  const handleAdd = (item) => {
    addToCart(item.product, item.selectedStore, item.selectedSize);
    showToastMsg("Quantity increased");
  };

  const handleDecrease = (item) => {
    decreaseQuantity(item.product._id, item.selectedStore, item.selectedSize);
    showToastMsg("Quantity decreased");
  };

  const handleRemove = (item) => {
    removeFromCart(item.product._id, item.selectedStore, item.selectedSize);
    showToastMsg("Item removed", "error");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed z-50 inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative p-5">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-3 mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingCart className="text-purple-600" /> My Cart
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Empty Cart */}
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-gray-500 py-12">
              <img
                src="/empty_cart.svg"
                alt="Empty Cart"
                className="w-32 mb-3 opacity-80"
              />
              <p>Your cart is empty</p>
              <p className="text-sm text-gray-400">Start shopping 🛒</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {cart.map((item) => {
                const store = item.selectedStore;
                const size = item.selectedSize;
                const storeData = item.product?.stores?.find(
                  (s) => s.storeName === store
                );
                const sizeObj = storeData?.quantities?.find(
                  (q) => q.size === size
                );
                const image =
                  sizeObj?.images?.[0] ||
                  storeData?.quantities?.[0]?.images?.[0] ||
                  "/placeholder.jpg";
                const price = sizeObj?.cost ?? item.product.bestPrice?.cost ?? 0;

                return (
                  <div
                    key={item.product._id + store + size}
                    className="flex items-center justify-between border rounded-xl p-3 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={image}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-gray-800 text-sm">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ₹{price} • {size} • {store}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center border rounded-lg overflow-hidden text-sm">
                        <button
                          onClick={() => handleDecrease(item)}
                          disabled={item.quantity <= 1}
                          className="px-2 bg-purple-50 hover:bg-purple-100 text-purple-600 font-bold transition"
                        >
                          -
                        </button>
                        <span className="px-2">{item.quantity}</span>
                        <button
                          onClick={() => handleAdd(item)}
                          className="px-2 bg-purple-50 hover:bg-purple-100 text-purple-600 font-bold transition"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(item)}
                        className="text-red-500 text-xs hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          {cart.length > 0 && (
            <div className="mt-4 border-t pt-3">
              <div className="flex justify-between text-gray-700 text-sm mb-2">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={() => {
                  showToastMsg("Proceeding to checkout...");
                  setTimeout(() => onClose(), 800);
                }}
                className="w-full mt-3 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Checkout
              </button>
            </div>
          )}

          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CartModal;
