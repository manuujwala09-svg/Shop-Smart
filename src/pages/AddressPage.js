// pages/AddressPage.js
import React, { useState } from "react";
import { useCart } from "../context/cartContext";
import { FaMapMarkerAlt, FaPlus, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";

const AddressPage = () => {
  const { user, setUser, address, setAddress, saveAddress } = useCart();
  const [detectedLocation, setDetectedLocation] = useState(null);

  if (!user)
    return (
      <p className="text-center mt-10">Please login to manage addresses.</p>
    );

  // Detect current location
  const handleDetectLocation = async () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();
        setAddress(data.display_name);
        setDetectedLocation({ lat: latitude, lng: longitude });
        toast.success("Location detected!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to detect location");
      }
    });
  };

  // Save as main address
  const handleSaveAddress = async (addr) => {
    const success = await saveAddress(addr);
    if (success) toast.success("Address saved!");
  };

  // Add new saved address to user.addresses
  const handleAddSavedAddress = async (label) => {
    if (!address?.trim()) return toast.error("Enter an address first");
    try {
      const payload = { label, address, ...detectedLocation };
      const res = await fetch(
        `http://localhost:5000/api/address/add/${user._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        toast.success("Saved address added!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add saved address");
    }
  };

  const handleSelectSaved = (addr) => {
    setAddress(addr.address);
    setDetectedLocation({ lat: addr.lat, lng: addr.lng });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Your Location
        </h2>

        {/* Address input */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-2 shadow-sm mb-4">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Search or enter address"
            className="w-full outline-none bg-transparent text-sm text-gray-700"
          />
        </div>

        {/* Detect location */}
        <button
          onClick={handleDetectLocation}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white rounded-xl px-4 py-3 mb-3 hover:bg-purple-700 transition"
        >
          <FaMapMarkerAlt /> Detect Current Location
        </button>

        {/* Save main address */}
        <button
          onClick={() => handleSaveAddress(address)}
          className="w-full flex items-center justify-center gap-2 bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 mb-4 hover:bg-gray-200 transition"
        >
          <FaPlus /> Save Address
        </button>

        {/* Add to saved addresses */}
        <button
          onClick={() => handleAddSavedAddress("Home")}
          className="w-full flex items-center justify-center gap-2 bg-green-100 border border-green-300 rounded-xl px-4 py-3 mb-4 hover:bg-green-200 transition"
        >
          <FaPlus /> Add to Saved Addresses
        </button>

        {/* Saved addresses list */}
        {user?.addresses?.length > 0 && (
          <div className="mt-4">
            <h3 className="text-gray-600 text-sm mb-2">Saved Addresses</h3>
            <div className="flex flex-col gap-2">
              {user.addresses.map((addr) => (
                <div
                  key={addr._id}
                  onClick={() => handleSelectSaved(addr)}
                  className="border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-800">{addr.label}</p>
                      <p className="text-sm text-gray-600">{addr.address}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressPage;
