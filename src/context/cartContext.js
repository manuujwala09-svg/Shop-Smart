// src/context/cartContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import API from "../api";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // user persisted locally for quick UI. We still rely on cookie for server auth.
  const storedUser =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [address, setAddress] = useState(
    user?.address || user?.addresses?.[0]?.address || ""
  );

  // Save user locally when changed
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // fetch cart from server if authenticated, else from guest localStorage
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      if (!user) {
        const guest = localStorage.getItem("guestCart");
        setCart(guest ? JSON.parse(guest) : []);
      } else {
        const { data } = await API.get("/cart");
        setCart(data.items || []);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // On app load try to auto-login by fetching profile if cookie exists
  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get("/auth/profile");
        if (data?.user) {
          setUser(data.user);
          setAddress(
            data.user.address || data.user.addresses?.[0]?.address || ""
          );
        }
      } catch (err) {
        // no valid cookie or profile not accessible, silently ignore
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Merge guest cart into user cart
  const mergeLocalCart = async (localItems) => {
    try {
      if (!user || !localItems || localItems.length === 0) return;
      await API.post("/cart/merge", { items: localItems });
      localStorage.removeItem("guestCart");
      await fetchCart();
    } catch (err) {
      console.error("Merge failed", err);
    }
  };

  // if user changed from null -> logged in, merge existing guest cart
  useEffect(() => {
    const guestJson = localStorage.getItem("guestCart");
    const localItems = guestJson ? JSON.parse(guestJson) : [];
    if (user && localItems.length > 0) {
      mergeLocalCart(localItems);
    } else if (user) {
      // also refresh profile & cart
      (async () => {
        try {
          const { data } = await API.get("/auth/profile");
          setUser(data.user);
          setAddress(
            data.user.address || data.user.addresses?.[0]?.address || ""
          );
          await fetchCart();
        } catch (err) {
          console.error("Sync profile failed", err);
        }
      })();
    } else {
      setAddress("");
      // keep guestCart as-is
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // guest helper
  const saveGuestCart = (items) =>
    localStorage.setItem("guestCart", JSON.stringify(items));

  // addToCart
  const addToCart = async (product, selectedStore, selectedSize) => {
    if (!product || !selectedStore || !selectedSize) return;
    if (!user) {
      const local = localStorage.getItem("guestCart");
      const arr = local ? JSON.parse(local) : [];
      const idx = arr.findIndex(
        (i) =>
          i.productId === product._id &&
          i.selectedStore === selectedStore &&
          i.selectedSize === selectedSize
      );
      if (idx >= 0) arr[idx].quantity += 1;
      else
        arr.push({
          productId: product._id,
          selectedStore,
          selectedSize,
          quantity: 1,
          product,
        });
      saveGuestCart(arr);
      setCart(arr);
      return;
    }

    try {
      // optimistic update
      setCart((prev) => {
        const idx = prev.findIndex(
          (i) =>
            i.product._id === product._id &&
            i.selectedStore === selectedStore &&
            i.selectedSize === selectedSize
        );
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx].quantity += 1;
          return copy;
        }
        return [...prev, { product, selectedStore, selectedSize, quantity: 1 }];
      });

      await API.post("/cart", {
        productId: product._id,
        selectedStore,
        selectedSize,
        quantity: 1,
      });
      await fetchCart();
    } catch (err) {
      console.error("Add to cart failed:", err);
      await fetchCart();
    }
  };

  const increaseQuantity = async (productId, store, size) => {
    if (!user) {
      const arr = cart.map((item) =>
        item.productId === productId &&
        item.selectedStore === store &&
        item.selectedSize === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      saveGuestCart(arr);
      setCart(arr);
      return;
    }
    try {
      setCart((prev) =>
        prev.map((item) =>
          item.product._id === productId &&
          item.selectedStore === store &&
          item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      await API.put(`/cart/${productId}`, {
        action: "increment",
        selectedStore: store,
        selectedSize: size,
      });
      await fetchCart();
    } catch (err) {
      console.error(err);
      await fetchCart();
    }
  };

  const decreaseQuantity = async (productId, store, size) => {
    if (!user) {
      const arr = cart
        .map((item) =>
          item.productId === productId &&
          item.selectedStore === store &&
          item.selectedSize === size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((i) => i.quantity > 0);
      saveGuestCart(arr);
      setCart(arr);
      return;
    }
    try {
      setCart((prev) =>
        prev
          .map((item) =>
            item.product._id === productId &&
            item.selectedStore === store &&
            item.selectedSize === size
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((i) => i.quantity > 0)
      );
      await API.put(`/cart/${productId}`, {
        action: "decrement",
        selectedStore: store,
        selectedSize: size,
      });
      await fetchCart();
    } catch (err) {
      console.error(err);
      await fetchCart();
    }
  };

  const removeFromCart = async (productId, store, size) => {
    if (!user) {
      const arr = cart.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.selectedStore === store &&
            item.selectedSize === size
          )
      );
      saveGuestCart(arr);
      setCart(arr);
      return;
    }
    try {
      setCart((prev) =>
        prev.filter(
          (item) =>
            !(
              item.product._id === productId &&
              item.selectedStore === store &&
              item.selectedSize === size
            )
        )
      );
      await API.delete(`/cart/${productId}`, {
        data: { selectedStore: store, selectedSize: size },
      });
      await fetchCart();
    } catch (err) {
      console.error(err);
      await fetchCart();
    }
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
      setCart([]);
      setUser(null);
      localStorage.removeItem("user");
      // keep guestCart if you want guest to continue
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const totalItems = cart.reduce((sum, i) => sum + (i.quantity || 0), 0);
  const totalPrice = cart.reduce((sum, i) => {
    const prod = i.product || i.product;
    if (!prod?.stores) return sum;
    const store = prod.stores?.find((s) => s.storeName === i.selectedStore);
    const sizeObj = store?.quantities?.find((q) => q.size === i.selectedSize);
    const price = sizeObj?.cost ?? prod.bestPrice?.cost ?? 0;
    return sum + price * (i.quantity || 0);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        totalItems,
        totalPrice,
        refreshCart: fetchCart,
        user,
        setUser,
        logout,
        address,
        setAddress,
        selectedAddress: address,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
