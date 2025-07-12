// frontend/src/components/ProductCard.jsx

import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { _id, name, image, price, description } = product;
  const backendUrl = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5001"; // id အစား _id, imageUrl အစား image
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    alert(`${name} added to cart!`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/products/${_id}`}>
        {/* _id ကို အသုံးပြုပါ */}
        <img
          src={`${backendUrl}${image}`} // Backend URL ကို ထည့်ပေးပါ
          alt={name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{name}</h3>
          <p className="text-gray-600 text-sm mb-2 h-12 overflow-hidden">
            {description.substring(0, 70)}
            {description.length > 70 ? "..." : ""}
          </p>
          <p className="text-xl font-bold text-blue-600 mb-4">${price.toFixed(2)}</p>
        </div>
      </Link>

      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
