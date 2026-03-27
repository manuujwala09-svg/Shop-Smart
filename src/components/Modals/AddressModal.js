// src/components/Modals/AddressModal.jsx
import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaPlus,
  FaTimes,
  FaTrash,
  FaStar,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAddress } from "../../context/addressContext";
import toast from "react-hot-toast";

const ConfirmModal = ({ show, onConfirm, onCancel, message }) => {
  if (!show) return null;
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Action
            </h3>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                onClick={onConfirm}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AddressModal = ({ show, onClose, initialAddress }) => {
  const {
    addresses,
    loadAddresses,
    addAddress,
    deleteAddress,
    setAsDefault,
    selectAddress,
  } = useAddress();

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    pincode: "",
    addressLine: "",
    city: "",
    state: "",
    isDefault: false,
  });
  const [loadingDetect, setLoadingDetect] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (show) loadAddresses();
    // eslint-disable-next-line
  }, [show]);

  useEffect(() => {
    if (initialAddress) selectAddress(initialAddress);
    // eslint-disable-next-line
  }, [initialAddress]);

  const handleDetect = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");
    setLoadingDetect(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          setForm((f) => ({
            ...f,
            addressLine: data.display_name || f.addressLine,
          }));
          toast.success("Location detected");
        } catch (err) {
          toast.error("Failed to detect location");
        } finally {
          setLoadingDetect(false);
        }
      },
      () => {
        toast.error("Location permission denied");
        setLoadingDetect(false);
      }
    );
  };

  const handleSaveNew = async () => {
    if (!form.addressLine?.trim()) return toast.error("Enter full address");
    try {
      await addAddress(form);
      toast.success("Saved");
      setForm({
        name: "",
        phone: "",
        pincode: "",
        addressLine: "",
        city: "",
        state: "",
        isDefault: false,
      });
      setIsAdding(false);
    } catch {
      toast.error("Save failed");
    }
  };

  const handleSelect = (addr) => {
    selectAddress(addr);
    onClose();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteAddress(deleteId);
    toast.success("Deleted");
    setConfirmVisible(false);
    setDeleteId(null);
    loadAddresses();
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FaMapMarkerAlt className="text-purple-600" /> Saved addresses
            </h3>
            <button onClick={onClose} className="p-1">
              <FaTimes />
            </button>
          </div>

          <div className="p-4 max-h-[60vh] overflow-auto space-y-3">
            {addresses?.length > 0 ? (
              addresses.map((a) => (
                <div
                  key={a._id}
                  className="flex items-center justify-between border rounded-lg p-3"
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => handleSelect(a)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{a.name || "Address"}</div>
                      {a.isDefault && (
                        <span className="text-xs text-yellow-600 flex items-center gap-1">
                          <FaStar /> Default
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">{a.addressLine}</div>
                    <div className="text-xs text-gray-400">
                      {a.city} • {a.state} • {a.pincode}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 ml-3">
                    <button
                      className="text-sm text-purple-600"
                      onClick={() =>
                        setAsDefault(a._id).then(() =>
                          toast.success("Set as default")
                        )
                      }
                    >
                      Set default
                    </button>
                    <button
                      className="text-sm text-red-500"
                      onClick={() => {
                        setDeleteId(a._id);
                        setConfirmVisible(true);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No saved addresses yet.</div>
            )}

            {isAdding ? (
              <div className="space-y-2 border-t pt-3">
                <input
                  placeholder="Label (Home, Work...)"
                  className="w-full border rounded p-2"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  placeholder="Phone"
                  className="w-full border rounded p-2"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <input
                  placeholder="Pincode"
                  className="w-full border rounded p-2"
                  value={form.pincode}
                  onChange={(e) =>
                    setForm({ ...form, pincode: e.target.value })
                  }
                />
                <textarea
                  placeholder="Full address"
                  className="w-full border rounded p-2"
                  rows={3}
                  value={form.addressLine}
                  onChange={(e) =>
                    setForm({ ...form, addressLine: e.target.value })
                  }
                />
                <div className="flex gap-2">
                  <input
                    placeholder="City"
                    className="flex-1 border rounded p-2"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                  <input
                    placeholder="State"
                    className="flex-1 border rounded p-2"
                    value={form.state}
                    onChange={(e) =>
                      setForm({ ...form, state: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex-1 bg-purple-600 text-white py-2 rounded"
                    onClick={handleSaveNew}
                  >
                    Save address
                  </button>
                  <button
                    className="flex-1 border py-2 rounded"
                    onClick={() => setIsAdding(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-3 border-t">
                <button
                  className="w-full flex items-center gap-2 justify-center py-3 bg-purple-50 text-purple-700 rounded"
                  onClick={() => setIsAdding(true)}
                >
                  <FaPlus /> Add new address
                </button>
                <button
                  className="w-full mt-2 flex items-center gap-2 justify-center py-3 border rounded"
                  onClick={handleDetect}
                >
                  {loadingDetect ? "Detecting..." : "Detect my location"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Confirm Delete Modal */}
      <ConfirmModal
        show={confirmVisible}
        message="Are you sure you want to delete this address?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmVisible(false)}
      />
    </>
  );
};

export default AddressModal;
