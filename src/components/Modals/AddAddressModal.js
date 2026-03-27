// src/components/Modals/AddAddressModal.js
import React, { useState } from "react";

const AddAddressModal = ({ closeModal, onSave }) => {
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");

  const handleSave = () => {
    if (name && details) {
      onSave({ name, details });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-5 w-[90%] max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add Delivery Address</h2>

        <input
          type="text"
          placeholder="Name (e.g. Home, Work)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <textarea
          placeholder="Enter full address..."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full border rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={3}
        />

        <div className="flex justify-end gap-3">
          <button onClick={closeModal} className="text-gray-600 font-medium">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAddressModal;
