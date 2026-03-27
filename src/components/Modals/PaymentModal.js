// --- PaymentModal.js ---
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { load } from "@cashfreepayments/cashfree-js";
import { FaMoneyBillWave } from "react-icons/fa";
import { SiPhonepe } from "react-icons/si";

// This must match your Firebase Cloud Function URL exactly
const BACKEND_BASE_URL = "https://us-central1-finance-249c0.cloudfunctions.net";

// ✅ CRITICAL FIX: Destructure onPaymentSuccess here
const PaymentModal = ({ 
  isOpen, 
  close, 
  totalPrice, 
  customerDetails, 
  onPaymentSuccess = () => {} // Default empty function to prevent crashes
}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cashfree SDK instance
  let cashfree;

  const initializeCashfree = async () => {
    try {
      cashfree = await load({
        mode: "sandbox", // Switch to "production" when you go live
      });
    } catch (err) {
      console.error("Failed to load Cashfree SDK", err);
    }
  };

  useEffect(() => {
    initializeCashfree();
  }, []);

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert("Please select a payment method 🪙");
      return;
    }

    // -------------------------
    // CASE 1: Cash on Delivery
    // -------------------------
    if (selectedMethod === "cod") {
      const codOrderId = `COD_ORDER_${Date.now()}`;
      // Call the success function passed from parent
      onPaymentSuccess(codOrderId);
      close();
      return;
    }

    // -------------------------
    // CASE 2: Online Payment (Cashfree)
    // -------------------------
    setLoading(true);
    setError("");

    try {
      const orderId = `ORDER_${Date.now()}`;

      // 1. Create Order via your Firebase Backend
      const response = await fetch(`${BACKEND_BASE_URL}/createCashfreeOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderAmount: totalPrice,
          orderCurrency: "INR",
          orderId: orderId,
          customerDetails: {
            customerId: customerDetails?.id || "guest",
            customerPhone: customerDetails?.phone || "9999999999",
            customerEmail: customerDetails?.email || "guest@example.com",
            customerName: customerDetails?.name || "Guest",
          },
        }),
      });

      const data = await response.json();

      if (!data.paymentSessionId) {
        throw new Error("Failed to generate payment session from backend");
      }

      // 2. Ensure Cashfree is loaded
      if (!cashfree) {
        await initializeCashfree();
      }

      // 3. Start Checkout
      // This will redirect the user to the payment page
      const checkoutOptions = {
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self", // Redirects the current tab
        returnUrl: `${window.location.origin}/payment-status/${orderId}`, // Where to go after payment
      };

      cashfree.checkout(checkoutOptions);

    } catch (err) {
      console.error("Payment Error:", err);
      setError("Failed to initiate payment. Server might be down.");
      setLoading(false);
    }
  };

  // UI Options
  const paymentOptions = [
    {
      id: "online",
      label: "Pay Online (UPI, Cards, NetBanking)",
      icon: <SiPhonepe className="text-3xl text-purple-600" />,
    },
    {
      id: "cod",
      label: "Cash on Delivery",
      icon: <FaMoneyBillWave className="text-3xl text-yellow-500" />,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dim background */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          {/* Bottom Sheet Modal */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 p-6"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            {/* Handle bar */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

            <h2 className="text-xl font-semibold text-purple-700 text-center mb-1">
              Select Payment Method
            </h2>
            <p className="text-gray-600 text-center mb-5">
              Payable Amount:{" "}
              <span className="font-bold text-gray-800">₹{totalPrice}</span>
            </p>

            {/* Options List */}
            <div className="flex flex-col gap-3">
              {paymentOptions.map((opt) => (
                <motion.div
                  key={opt.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMethod(opt.id)}
                  className={`cursor-pointer flex items-center gap-4 p-4 border rounded-2xl transition-all duration-200 ${
                    selectedMethod === opt.id
                      ? "bg-purple-50 border-purple-600 shadow-sm"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {opt.icon}
                  <span className="font-medium text-gray-700 text-lg">
                    {opt.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-center mt-4 text-sm font-medium">
                {error}
              </p>
            )}

            {/* Buttons */}
            <div className="mt-8">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handlePayment}
                disabled={loading}
                className={`w-full text-white font-semibold py-3 rounded-2xl shadow-lg transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 hover:shadow-purple-300"
                }`}
              >
                {loading
                  ? "Processing..."
                  : selectedMethod === "cod"
                  ? "Place Order (COD)"
                  : "Proceed to Pay"}
              </motion.button>

              <button
                onClick={close}
                disabled={loading}
                className="mt-3 w-full text-gray-500 hover:text-red-600 font-semibold"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;