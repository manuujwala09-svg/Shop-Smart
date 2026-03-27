import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/cartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const { cart, addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
        // default selections
        if (res.data.stores?.length > 0)
          setSelectedStore(res.data.stores[0].storeName);
        if (res.data.stores?.[0]?.quantities?.length > 0)
          setSelectedSize(res.data.stores[0].quantities[0].size);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  const cartItem = cart.find(
    (item) =>
      item.product._id === product._id &&
      item.selectedStore === selectedStore &&
      item.selectedSize === selectedSize
  );

  return (
    <div className="p-4">
      <img
        src={product.stores[0]?.quantities[0]?.images[0] || "/placeholder.jpg"}
        alt={product.name}
        className="w-64 h-64 object-cover rounded-xl"
      />
      <h2 className="text-2xl font-bold mt-2">{product.name}</h2>
      <p className="text-gray-500">₹{product.price}</p>

      {/* Store selection */}
      <select
        value={selectedStore}
        onChange={(e) => setSelectedStore(e.target.value)}
        className="mt-2 p-2 border rounded"
      >
        {product.stores.map((s) => (
          <option key={s.storeName} value={s.storeName}>
            {s.storeName}
          </option>
        ))}
      </select>

      {/* Size selection */}
      <select
        value={selectedSize}
        onChange={(e) => setSelectedSize(e.target.value)}
        className="mt-2 p-2 border rounded ml-2"
      >
        {product.stores
          .find((s) => s.storeName === selectedStore)
          ?.quantities.map((q) => (
            <option key={q.size} value={q.size}>
              {q.size}
            </option>
          ))}
      </select>

      <button
        onClick={() => addToCart(product, selectedStore, selectedSize)}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-xl"
      >
        {cartItem ? "Added to Cart" : "Add to Cart"}
      </button>
    </div>
  );
};

export default ProductDetails;
