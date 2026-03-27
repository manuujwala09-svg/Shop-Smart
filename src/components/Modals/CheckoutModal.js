// src/components/Modals/CheckoutModal.js
import React, { useState } from "react";
import { FaMapMarkerAlt, FaCreditCard } from "react-icons/fa";

const CheckoutModal = ({ isOpen, onClose, onProceed }) => {
  const [address, setAddress] = useState("");
  const [savedAddress, setSavedAddress] = useState("");

  if (!isOpen) return null;

  const handleProceed = () => {
    if (!savedAddress) return alert("Please add your delivery address");
    onProceed();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-2xl p-5 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">Delivery Details</h2>

        {/* Address Section */}
        <div className="mb-5">
          <h3 className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
            <FaMapMarkerAlt /> Delivery Address
          </h3>

          {savedAddress ? (
            <div className="bg-gray-100 p-3 rounded-lg mb-3">
              <p className="text-sm text-gray-700">{savedAddress}</p>
              <button
                onClick={() => setSavedAddress("")}
                className="text-blue-500 text-sm mt-1"
              >
                Change Address
              </button>
            </div>
          ) : (
            <>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your delivery address"
                className="w-full border rounded-lg p-2 text-sm"
              ></textarea>
              <button
                onClick={() => {
                  if (!address.trim()) return alert("Please enter your address");
                  setSavedAddress(address);
                  setAddress("");
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg p-2 mt-2"
              >
                Save Address
              </button>
            </>
          )}
        </div>

        <button
          onClick={handleProceed}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded-lg"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default CheckoutModal;
