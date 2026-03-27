import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/cartContext";
import { AddressProvider } from "./context/addressContext"; // ✅ ADD THIS
import NavbarWrapper from "./components/NavbarWrapper";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import PaymentPage from "./pages/PaymentPage";
import CartPage from "./pages/CartPage";
import AddressPage from "./pages/AddressPage";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";
import CartDrawer from "./components/CartDrawer";
import { Toaster } from "react-hot-toast";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const handleSearch = (query) => {
    console.log("Search Query:", query);
  };

  return (
    <CartProvider>
      <AddressProvider>
        {" "}
        {/* ✅ Wrap entire app */}
        <Router>
          <div className={darkMode ? "app dark" : "app"}>
            {/* ✅ Navbar */}
            <NavbarWrapper
              onSearch={handleSearch}
              openCart={() => setCartOpen(true)}
              user={user}
              setUser={setUser}
            />

            {/* ✅ Routes */}
            <Routes>
              <Route path="/" element={<Home setCartOpen={setCartOpen} />} />
              <Route
                path="/product/:id"
                element={<ProductDetails setCartOpen={setCartOpen} />}
              />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route
                path="/address"
                element={<AddressPage user={user} setUser={setUser} />}
              />
              <Route path="/login" element={<LoginPage setUser={setUser} />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>

            {/* ✅ Footer */}
            <Footer />

            {/* ✅ Cart Drawer */}
            <CartDrawer
              isOpen={cartOpen}
              onClose={() => setCartOpen(false)}
              userId={user?._id || "guestUser"}
            />

            {/* ✅ Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  borderRadius: "10px",
                  background: "#333",
                  color: "#fff",
                },
              }}
            />
          </div>
        </Router>
      </AddressProvider>
    </CartProvider>
  );
}

export default App;
