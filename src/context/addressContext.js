// ✅ src/context/addressContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../api";
import { useCart } from "./cartContext";

const AddressContext = createContext();
export const useAddress = () => useContext(AddressContext);

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { user, setUser } = useCart(); // link to global user state

  // 🧩 Load addresses when user logs in/out
  useEffect(() => {
    if (user && user._id) {
      loadAddresses();
    } else {
      // when logged out, clear addresses
      setAddresses([]);
      setSelectedAddress(null);
      localStorage.removeItem("selectedAddress");
    }
    // eslint-disable-next-line
  }, [user]);

  // 🧩 Persist selected address locally
  useEffect(() => {
    if (selectedAddress) {
      localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
    } else {
      const saved =
        typeof window !== "undefined" &&
        localStorage.getItem("selectedAddress");
      if (saved) setSelectedAddress(JSON.parse(saved));
    }
  }, [selectedAddress]);

  // 🔹 Fetch addresses from backend
  const loadAddresses = async () => {
    try {
      const { data } = await API.get("/address/me");
      if (data?.success) {
        setAddresses(data.addresses || []);
        const defaultAddr = data.addresses?.find((a) => a.isDefault);
        const pick = defaultAddr || data.addresses?.[0] || null;
        setSelectedAddress(pick);
      }
    } catch (err) {
      console.error("Failed to load addresses", err);
    }
  };

  // 🔹 Add new address
  const addAddress = async (payload) => {
    try {
      const { data } = await API.post("/address", payload);
      if (data?.success) {
        const newList = [data.address, ...addresses];
        setAddresses(newList);
        setSelectedAddress(data.address);

        // optionally sync user profile address for cartContext
        setUser((prev) =>
          prev ? { ...prev, addresses: newList, address: data.address } : prev
        );

        return data.address;
      }
    } catch (err) {
      console.error("addAddress failed", err);
      throw err;
    }
  };

  // 🔹 Update existing address
  const updateAddress = async (id, payload) => {
    try {
      const { data } = await API.put(`/address/${id}`, payload);
      if (data?.success) {
        const updated = addresses.map((a) => (a._id === id ? data.address : a));
        setAddresses(updated);
        if (selectedAddress?._id === id) setSelectedAddress(data.address);
        return data.address;
      }
    } catch (err) {
      console.error("updateAddress failed", err);
      throw err;
    }
  };

  // 🔹 Delete address
  const deleteAddress = async (id) => {
    try {
      const { data } = await API.delete(`/address/${id}`);
      if (data?.success) {
        const filtered = addresses.filter((a) => a._id !== id);
        setAddresses(filtered);
        if (selectedAddress?._id === id)
          setSelectedAddress(filtered[0] || null);
      }
    } catch (err) {
      console.error("deleteAddress failed", err);
      throw err;
    }
  };

  // 🔹 Set address as default
  const setAsDefault = async (id) => {
    try {
      const { data } = await API.put(`/address/set-default/${id}`);
      if (data?.success) {
        await loadAddresses();
        setSelectedAddress(data.address);
      }
    } catch (err) {
      console.error("setAsDefault failed", err);
      throw err;
    }
  };

  const selectAddress = (addr) => {
    setSelectedAddress(addr);
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        loadAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setAsDefault,
        selectAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};
