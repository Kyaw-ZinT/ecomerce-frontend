// frontend/src/components/CartItem.jsx

import React from "react";
import { useCart } from "../context/CartContext";

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    updateQuantity(item.id, newQuantity);
  };

  const handleRemoveClick = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-4">
      <div className="flex items-center space-x-4">
        {/* Item Image */}
        <img
          src={`http://localhost:5001${item.image}`} // item.imageUrl အစား item.image ကိုသုံးပြီး Backend URL ကို ထည့်ပေးပါ
          alt={item.name}
          className="w-24 h-24 object-cover rounded-md"
        />

        {/* Item Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
          <p className="text-blue-600 font-medium">${item.price.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Quantity Selector */}
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={handleQuantityChange}
          className="w-20 p-2 border border-gray-300 rounded-md text-center"
        />

        {/* Total Price for this item */}
        <p className="text-lg font-bold text-gray-800 w-24 text-right">${(item.price * item.quantity).toFixed(2)}</p>

        {/* Remove Button */}
        <button
          onClick={handleRemoveClick}
          className="text-red-500 hover:text-red-700 transition-colors duration-300"
          title="Remove item"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default CartItem;
