// --- PaymentModal.js ---
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMoneyBillWave, FaCreditCard, FaCcVisa } from "react-icons/fa";
import { SiGooglepay } from "react-icons/si";

const PaymentModal = ({
  isOpen,
  close,
  totalPrice,
  customerDetails,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cashfree, setCashfree] = useState(null);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  // Load and initialize Cashfree SDK
  useEffect(() => {
    if (isOpen && !window.Cashfree) {
      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/checkout.js";
      script.async = true;
      script.onload = () => {
        try {
          const cf = new window.Cashfree();
          setCashfree(cf);
          console.log("✅ Cashfree SDK loaded and initialized.");
        } catch (e) {
          console.error("❌ Failed to initialize Cashfree SDK:", e);
        }
      };
      document.body.appendChild(script);

      return () => {
        const existingScript = document.querySelector(
          'script[src="https://sdk.cashfree.com/js/v3/checkout.js"]'
        );
        if (existingScript) existingScript.remove();
      };
    } else if (isOpen && window.Cashfree && !cashfree) {
      try {
        setCashfree(new window.Cashfree());
        console.log("♻️ Cashfree SDK re-initialized.");
      } catch (e) {
        console.error("Failed to re-initialize Cashfree SDK:", e);
      }
    }
  }, [isOpen, cashfree]);

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert("Please select a payment method 🪙");
      return;
    }

    setIsLoading(true);

    // --- Cash on Delivery ---
    if (selectedMethod === "cod") {
      console.log("Processing Cash on Delivery order...");
      alert("Order placed successfully with Cash on Delivery!");
      setIsLoading(false);
      onPaymentSuccess();
      close();
      return;
    }

    // --- Online Payments ---
    if (["upi", "credit", "debit"].includes(selectedMethod)) {
      if (!cashfree) {
        alert(
          "Payment SDK is still loading. Please wait a moment and try again."
        );
        setIsLoading(false);
        return;
      }

      try {
        const orderId = `ORDER_${Date.now()}`;
        const backendUrl =
          "https://us-central1-finance-249c0.cloudfunctions.net/createCashfreeOrder";

        console.log("🪙 Requesting payment session from backend...");

        const response = await fetch(backendUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderAmount: totalPrice,
            orderCurrency: "INR",
            orderId,
            customerDetails: {
              customerId: customerDetails.id,
              customerPhone: customerDetails.phone,
              customerEmail: customerDetails.email,
              customerName: customerDetails.name,
            },
          }),
        });

        if (!response.ok) {
          let errMsg = "Failed to create payment session";
          try {
            const err = await response.json();
            errMsg = err.message || errMsg;
          } catch {}
          throw new Error(errMsg);
        }

        const data = await response.json();
        const sessionId = data.paymentSessionId;

        if (!sessionId) {
          throw new Error("Invalid session ID received from backend");
        }

        console.log("✅ Session ID received. Launching Cashfree Drop-in...");

        cashfree
          .checkout({
            paymentSessionId: sessionId,
            mode: "drop",
          })
          .then((result) => {
            setIsLoading(false);
            if (result.error) {
              console.error("❌ Cashfree Payment Error:", result.error);
              alert(`Payment Failed: ${result.error.message}`);
            }
            if (result.payment) {
              console.log("💰 Cashfree Payment Success:", result.payment);
              onPaymentSuccess();
              close();
            }
          });
      } catch (error) {
        console.error("Payment initiation failed:", error);
        alert(`Error: ${error.message}`);
        setIsLoading(false);
      }
    }
  };

  const paymentOptions = [
    {
      id: "upi",
      label: "UPI",
      icon: <SiGooglepay className="text-3xl text-green-500" />,
    },
    {
      id: "credit",
      label: "Credit Card",
      icon: <FaCcVisa className="text-3xl text-blue-500" />,
    },
    {
      id: "debit",
      label: "Debit Card",
      icon: <FaCreditCard className="text-3xl text-purple-500" />,
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
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 p-6"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

            <h2 className="text-xl font-semibold text-purple-700 text-center mb-1">
              Select Payment Method
            </h2>
            <p className="text-gray-600 text-center mb-5">
              Payable Amount:{" "}
              <span className="font-bold text-gray-800">₹{totalPrice}</span>
            </p>

            <div className="grid grid-cols-2 gap-4">
              {paymentOptions.map((opt) => (
                <motion.div
                  key={opt.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => !isLoading && setSelectedMethod(opt.id)}
                  className={`cursor-pointer flex flex-col items-center justify-center p-4 border rounded-2xl transition-all duration-200 ${
                    selectedMethod === opt.id
                      ? "bg-purple-100 border-purple-600 shadow-md scale-105"
                      : "border-gray-200 hover:bg-gray-50"
                  } ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {opt.icon}
                  <span className="mt-2 font-medium text-gray-700">
                    {opt.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full bg-purple-600 text-white font-semibold py-3 rounded-2xl hover:bg-purple-700 shadow-lg hover:shadow-purple-300 transition-all disabled:opacity-50 disabled:cursor-wait"
              >
                {isLoading
                  ? "Processing..."
                  : selectedMethod === "cod"
                  ? "Place Order (COD)"
                  : selectedMethod
                  ? "Proceed to Pay"
                  : "Select Payment Method"}
              </motion.button>

              <button
                onClick={close}
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
