// frontend/src/components/ShoppingCart.jsx

import React from "react";
import { useCart } from "../context/CartContext"; // useCart Hook ကို Import လုပ်ခြင်း
import CartItem from "./CartItem"; // CartItem Component ကို Import လုပ်ခြင်း
import { Link, useNavigate } from "react-router-dom";

function ShoppingCart() {
  const { cartItems, getSubtotal, getTotalItems } = useCart();
  const navigate = useNavigate();
  const handleCheckout = () => {
    alert("Proceeding to checkout! (This is a placeholder for actual checkout logic)");
    navigate("/shipping"); // Checkout လုပ်ရန် Shipping Screen သို့ ဦးတည်ပါမည်။
  };

  return (
    <div className="container mx-auto p-4 md:p-8 my-8">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <p className="text-gray-600 text-xl mb-4">Your cart is empty.</p>
          <Link to="/" className="text-blue-600 hover:underline text-lg">
            Start shopping now!
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="lg:w-2/3">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-lg h-fit">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">Order Summary</h2>
            <div className="flex justify-between items-center text-gray-700 mb-2">
              <span>Items ({getTotalItems()}):</span>
              <span className="font-semibold">${getSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-700 mb-4 border-b pb-4">
              <span>Shipping:</span>
              <span className="font-semibold">Free</span> {/* ယာယီ Free Shipping ထားထားပါတယ် */}
            </div>
            <div className="flex justify-between items-center text-2xl font-bold text-gray-900 mb-6">
              <span>Total:</span>
              <span>${getSubtotal().toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white text-lg py-3 rounded-lg hover:bg-green-700 transition-colors duration-300"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingCart;
