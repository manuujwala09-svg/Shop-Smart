import React, { useState } from "react";
import Navbar from "./Navbar";
import AddressModal from "./Modals/AddressModal";
import LoginForm from "./auth/LoginForm";
import SignUp from "./auth/SignUp";
import { useCart } from "../context/cartContext";

const NavbarWrapper = ({ openCart, user, setUser }) => {
  const [authOpen, setAuthOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(true);
  const [addressModal, setAddressModal] = useState(false);
  const [address, setAddress] = useState("");

  const { cart } = useCart();

  return (
    <>
      <Navbar
        openLogin={() => {
          setIsSignup(false);
          setAuthOpen(true);
        }}
        openSignup={() => {
          setIsSignup(true);
          setAuthOpen(true);
        }}
        openCart={openCart}
        user={user}
        setUser={setUser}
        address={address}
        onOpenAddress={() => setAddressModal(true)}
      />

      {/* Address Modal */}
      <AddressModal
        show={addressModal}
        onClose={() => setAddressModal(false)}
        onSave={(addr) => setAddress(addr)}
        initialAddress={address}
      />

      {/* Auth Modal */}
      {authOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md relative">
            {isSignup ? (
              <SignUp
                onSuccess={(u) => {
                  setUser(u);
                  setAuthOpen(false);
                }}
                onSwitchToLogin={() => setIsSignup(false)}
              />
            ) : (
              <LoginForm
                onSuccess={(u) => {
                  setUser(u);
                  setAuthOpen(false);
                }}
                onSwitchToSignup={() => setIsSignup(true)}
              />
            )}

            <button
              onClick={() => setAuthOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarWrapper;
