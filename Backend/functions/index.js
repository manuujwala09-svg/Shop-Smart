// --- functions/index.js ---
const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.createCashfreeOrder = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { orderAmount, orderCurrency, orderId, customerDetails } = req.body;

    if (!orderAmount || !orderCurrency || !orderId || !customerDetails) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🔒 Use environment variables for your Cashfree credentials
    const CASHFREE_APP_ID = functions.config().cashfree.app_id;
    const CASHFREE_SECRET_KEY = functions.config().cashfree.secret_key;

    // 🧠 Set the environment ("TEST" for sandbox or "PROD" for live)
    const CASHFREE_ENV = "TEST"; // Change to "PROD" for production
    const baseURL =
      CASHFREE_ENV === "TEST"
        ? "https://sandbox.cashfree.com/pg/orders"
        : "https://api.cashfree.com/pg/orders";

    console.log("Creating Cashfree order for:", customerDetails.customerEmail);

    // --- Create order in Cashfree ---
    const response = await fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
        "x-api-version": "2022-09-01",
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: orderAmount,
        order_currency: orderCurrency,
        customer_details: {
          customer_id: customerDetails.customerId,
          customer_email: customerDetails.customerEmail,
          customer_phone: customerDetails.customerPhone,
          customer_name: customerDetails.customerName,
        },
      }),
    });

    const data = await response.json();
    console.log("Cashfree Response:", data);

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ message: data.message || "Failed to create Cashfree order" });
    }

    return res.status(200).json({
      paymentSessionId: data.payment_session_id,
      orderId: data.order_id,
    });
  } catch (error) {
    console.error("Error creating Cashfree order:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});
