const API_URL = "http://localhost:5000/api/products";

export const fetchAllProducts = async () => {
  const res = await fetch(API_URL);
  return res.json();
};

export const fetchProductsByCategory = async (category) => {
  const res = await fetch(
    `${API_URL}/category/${encodeURIComponent(category)}`
  );
  return res.json();
};

export const fetchProductById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
};
