const CART_KEY = "cart";
const FAVORITES_KEY = "favorites";

// -------- CART --------
export const getCart = () => {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
};

export const addToCart = (product) => {
  const cart = getCart();
  const existing = cart.find((item) => item._id === product._id);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
};

export const removeFromCart = (productId) => {
  const cart = getCart();
  const updated = cart.filter((item) => item._id !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(updated));
  return updated;
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};

// -------- FAVORITES --------
export const getFavorites = () => {
  const data = localStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
};

export const addFavorite = (product) => {
  const favorites = getFavorites();
  const exists = favorites.find((item) => item._id === product._id);
  if (!exists) {
    favorites.push(product);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return favorites;
};

export const removeFavorite = (productId) => {
  const favorites = getFavorites();
  const updated = favorites.filter((item) => item._id !== productId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
};

// -------- PRODUCTS FETCH --------
const API_URL = "http://localhost:5000/api/products"; // <-- only once

// Helper to flatten product data
const formatProduct = (product) => {
  const store = product.stores?.[0];
  const quantity = store?.quantities?.[0];

  return {
    ...product,
    price: quantity?.cost || 0,
    unit: quantity?.size || "",
    image: quantity?.images?.[0] || "/placeholder.png",
    brand: store?.brand || "",
  };
};

// Normalize response to always return an array
const normalizeProducts = async (res) => {
  const data = await res.json();
  if (Array.isArray(data)) return data;
  if (data.products && Array.isArray(data.products)) return data.products;
  return [];
};

export const fetchAllProducts = async () => {
  const res = await fetch(API_URL);
  const data = await res.json();
  const productList = Array.isArray(data) ? data : data.products || [];
  return productList.map(formatProduct);
};

export const fetchProductsByCategory = async (category) => {
  const res = await fetch(
    `${API_URL}?category=${encodeURIComponent(category)}`
  );
  const data = await res.json();
  const productList = Array.isArray(data) ? data : data.products || [];
  return productList.map(formatProduct);
};

export const fetchProductById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  const data = await res.json();
  return formatProduct(data);
};
