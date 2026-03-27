import React, { useState } from "react";
import { X, MapPin } from "lucide-react";
import { useCart } from "../context/cartContext";
import Toast from "./Toast";
import AddressModal from "./Modals/AddressModal";
import PaymentModal from "./Modals/PaymentModal";
import API from "../api";
import { useAddress } from "../context/addressContext";

const CartDrawer = ({ isOpen, onClose }) => {
  // cart state (keep cartContext responsibilities)
  const {
    cart,
    totalPrice,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    user,
    setAddress,
  } = useCart();

  // address state from addressContext
  const { selectedAddress, addresses, addAddress, selectAddress } =
    useAddress();

  const [toast, setToast] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const showToastMsg = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 1500);
  };

  // Save address: if user logged in -> use addAddress (backend), else fallback to local setAddress
  const handleSaveAddressBackend = async (newAddressPayload) => {
    try {
      if (user) {
        // use addressContext's addAddress (persists to backend & selects it)
        await addAddress(newAddressPayload);
      } else {
        // guest: keep in cartContext local address (fallback)
        setAddress(newAddressPayload);
      }
      showToastMsg("Address saved successfully!");
      setShowAddressModal(false);
    } catch (err) {
      console.error(err);
      showToastMsg("Failed to save address", "error");
    }
  };

  const handleProceed = () => {
    // if neither logged-in-selected address nor guest address, show modal
    const guestAddress = !user
      ? typeof window !== "undefined" && localStorage.getItem("guestAddress")
        ? JSON.parse(localStorage.getItem("guestAddress"))
        : null
      : null;
    if (!selectedAddress && !guestAddress) {
      setShowAddressModal(true);
      return;
    }
    setShowPayment(true);
  };

  if (!isOpen) return null;

  const deliveryFee = totalPrice > 199 ? 0 : 25;
  const smallCartFee = totalPrice < 99 ? 10 : 0;
  const totalPayable = totalPrice + deliveryFee + smallCartFee;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 z-50 w-full sm:w-[450px] h-full bg-white shadow-2xl flex flex-col rounded-l-3xl pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 rounded-tl-3xl flex justify-between items-center shadow-md">
          <h2 className="text-xl font-semibold">My Cart</h2>
          <button onClick={onClose} className="hover:text-gray-200 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <img
                src="/empty_cart.svg"
                alt="Empty cart"
                className="w-48 opacity-70 mb-4 pointer-events-none"
              />
              <p>Your cart is empty</p>
              <p className="text-sm text-gray-400">
                Start adding some items 🛒
              </p>
            </div>
          ) : (
            cart.map((item) => {
              const product = item.product || {};
              const storeData = product.stores?.find(
                (s) => s.storeName === item.selectedStore
              );
              const sizeObj = storeData?.quantities?.find(
                (q) => q.size === item.selectedSize
              );
              const image =
                sizeObj?.images?.[0] ||
                storeData?.quantities?.[0]?.images?.[0] ||
                "/placeholder.jpg";
              const price = sizeObj?.cost || product.bestPrice?.cost || 0;

              return (
                <div
                  key={product._id + item.selectedStore + item.selectedSize}
                  className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {product.name || "Unnamed Product"}
                      </p>
                      <p className="text-sm text-gray-500">
                        ₹{price} • {item.selectedSize} • {item.selectedStore}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          decreaseQuantity(
                            product._id,
                            item.selectedStore,
                            item.selectedSize
                          )
                        }
                        className="px-2 bg-purple-100 text-purple-700 font-bold hover:bg-purple-200 transition"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        onClick={() =>
                          addToCart(
                            product,
                            item.selectedStore,
                            item.selectedSize
                          )
                        }
                        className="px-2 bg-purple-100 text-purple-700 font-bold hover:bg-purple-200 transition"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() =>
                        removeFromCart(
                          product._id,
                          item.selectedStore,
                          item.selectedSize
                        )
                      }
                      className="text-red-500 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bill + Address */}
        {cart.length > 0 && (
          <div className="p-4 bg-white m-4 rounded-xl shadow-inner space-y-3">
            <div className="border border-purple-100 bg-purple-50 p-3 rounded-lg flex justify-between items-start">
              <div className="flex items-start gap-2">
                <MapPin className="text-purple-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-700">
                    {selectedAddress
                      ? `${selectedAddress.addressLine}, ${selectedAddress.city}`
                      : "No address selected."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddressModal(true)}
                className="text-purple-600 text-sm font-medium hover:underline"
              >
                {selectedAddress ? "Change" : "Add"}
              </button>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Small Cart Fee</span>
              <span>{smallCartFee > 0 ? `₹${smallCartFee}` : "—"}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-lg text-gray-800">
              <span>Total Payable</span>
              <span>₹{totalPayable.toFixed(2)}</span>
            </div>

            <button
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition"
              onClick={handleProceed}
            >
              {selectedAddress ? "Proceed to Payment" : "Set Delivery Address"}
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

        {/* Modals */}
        <AddressModal
          show={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          initialAddress={selectedAddress}
        />
        <PaymentModal
          isOpen={showPayment}
          close={() => setShowPayment(false)}
          totalPrice={totalPayable}
        />
      </div>
    </>
  );
};

export default CartDrawer;
