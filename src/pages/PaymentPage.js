// --- PaymentPage.js ---
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentModal from "../components/Modals/PaymentModal"; // Make sure path is correct

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Get data passed from Cart or Checkout
  const {
    totalPrice = 0,
    cartItems = [],
    user,
    address,
  } = location.state || {};

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. Prepare Customer Details (Required for Cashfree)
  const customerDetails = {
    id: user?.uid || "guest_user_" + Date.now(),
    name: user?.name || "Guest User",
    phone: user?.phone || "9999999999", // Cashfree needs a phone number
    email: user?.email || "guest@example.com",
  };

  // 3. Define the Success Handler
  // This function runs when the Modal says "Payment Done"
  const handlePaymentSuccess = (orderId) => {
    console.log("Payment Successful! Order ID:", orderId);
    alert(`✅ Payment Success! Order ID: ${orderId}`);
    
    // Navigate to Order Tracking or Home
    // You can pass the orderId to the tracking page if needed
    navigate("/order-tracking", { state: { orderId } });
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 flex flex-col gap-5">
        <h2 className="text-2xl font-semibold text-center text-purple-700">
          Complete Your Order
        </h2>

        {/* Address Display */}
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Delivering To:</h3>
          {address ? (
            <p className="text-gray-700">{address}</p>
          ) : (
            <p className="text-gray-500">No address selected</p>
          )}
          
          <div className="mt-3 pt-3 border-t border-gray-300">
            <h3 className="font-semibold mb-1">Customer:</h3>
            <p className="text-gray-600 text-sm">{customerDetails.name}</p>
            <p className="text-gray-600 text-sm">{customerDetails.phone}</p>
          </div>
        </div>

        {/* Total Amount */}
        <div className="text-center mt-4">
          <p className="text-lg text-gray-700">
            Total Payable:{" "}
            <span className="font-bold text-2xl text-purple-800">
              ₹{totalPrice}
            </span>
          </p>
        </div>

        {/* Pay Now Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-3 rounded-xl text-white font-semibold bg-purple-600 hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
        >
          Pay Now
        </button>
      </div>

      {/* 4. Render the Payment Modal 
         CRITICAL: We pass 'handlePaymentSuccess' into the 'onPaymentSuccess' prop
      */}
      <PaymentModal
        isOpen={isModalOpen}
        close={() => setIsModalOpen(false)}
        totalPrice={totalPrice}
        customerDetails={customerDetails}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default PaymentPage;