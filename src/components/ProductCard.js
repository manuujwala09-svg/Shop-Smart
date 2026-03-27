import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/cartContext";
import { FaHeart } from "react-icons/fa";

const ProductCard = ({ product, setFavoritesOpen }) => {
  const { cart, addToCart, decreaseQuantity } = useCart();

  // ✅ Pick first available store & quantity
  const firstStore = product.stores?.[0];
  const firstQuantity = firstStore?.quantities?.[0];
  const imageUrl = firstQuantity?.images?.[0] || "/placeholder.png";
  const price = firstQuantity?.cost || product.bestPrice?.cost || 0;
  const unit = firstQuantity?.size || product.bestPrice?.size || "";

  // ✅ Find product in cart
  const cartItem = cart?.find((item) => item.product?._id === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => addToCart(product);
  const handleIncrease = () => addToCart(product);
  const handleDecrease = () => decreaseQuantity(product._id);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-3 flex flex-col">
      <Link to={`/product/${product._id}`}>
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-36 object-contain mb-3 rounded-lg"
        />
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1">{unit}</p>
      </Link>

      <div className="flex items-center justify-between mt-2">
        <div>
          <p className="text-sm font-semibold text-gray-800">₹{price}</p>
        </div>

        {quantity === 0 ? (
          <button
            onClick={handleAdd}
            className="text-pink-600 border border-pink-500 px-4 py-1 text-sm font-semibold rounded-full hover:bg-pink-50 transition-all"
          >
            ADD
          </button>
        ) : (
          <div className="flex items-center gap-2 border border-pink-500 rounded-full px-3 py-1">
            <button
              onClick={handleDecrease}
              className="text-pink-600 font-bold"
            >
              −
            </button>
            <span className="text-gray-800 font-semibold">{quantity}</span>
            <button
              onClick={handleIncrease}
              className="text-pink-600 font-bold"
            >
              +
            </button>
          </div>
        )}
      </div>

      {setFavoritesOpen && (
        <button
          onClick={() => setFavoritesOpen(true)}
          className="mt-2 w-full flex items-center justify-center gap-1 text-white bg-pink-600 py-1 rounded-full hover:bg-pink-700 transition-all text-sm"
        >
          <FaHeart /> Favorite
        </button>
      )}
    </div>
  );
};

export default ProductCard;
