// src/pages/CartPage.js
import React, { useState, useEffect } from "react";
import AddressModal from "../components/Modals/AddressModal";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const CartPage = ({ user }) => {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [tempAddress, setTempAddress] = useState("");
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    if (user?._id) fetchAddress();
  }, [user]);

  const fetchAddress = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/address/get/${user._id}`
      );
      if (res.data.success) setUserAddress(res.data.address);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDetectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectedLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => toast.error("Failed to detect location")
    );
  };

  const handleSaveAddress = async ({ address, lat, lng }) => {
    try {
      const res = await axios.put(
        `http://localhost:5001/api/address/update/${user._id}`,
        {
          address,
          lat,
          lng,
        }
      );
      if (res.data.success) {
        toast.success("Address saved successfully!");
        setUserAddress(address);
      }
    } catch (err) {
      toast.error("Failed to save address");
    }
  };

  return (
    <div className="p-4">
      {/* 🏠 Address Section */}
      <div className="bg-white rounded-2xl shadow-md p-4 mb-4 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-gray-800">
            {userAddress ? "Deliver to:" : "No Address Saved"}
          </h3>
          <p className="text-gray-600 text-sm">
            {userAddress || "Please add your delivery address"}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddressModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition"
        >
          {userAddress ? "Change" : "+ Add"}
        </motion.button>
      </div>

      {/* 🛍️ Rest of your cart UI here */}
      <div className="text-gray-700">🛒 Your cart items go here...</div>

      {showAddressModal && (
        <AddressModal
          tempAddress={tempAddress}
          setTempAddress={setTempAddress}
          handleDetectLocation={handleDetectLocation}
          handleSaveAddress={handleSaveAddress}
          setShowAddressModal={setShowAddressModal}
          detectedLocation={detectedLocation}
        />
      )}
    </div>
  );
};

export default CartPage;
