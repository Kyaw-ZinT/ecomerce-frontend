// frontend/src/screens/PlaceOrderScreen.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CheckoutSteps from "../components/CheckoutSteps";
import axios from "axios";

// Stripe Elements (for Payment Form)
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm"; // CheckoutForm ကို နောက်မှ ဖန်တီးပါမည်။

// Stripe Public Key ကို Load လုပ်ပါ။ (Stripe Dashboard က Publishable Key)
// Replace with your actual Stripe Publishable Key (starts with pk_test_)
const stripePromise = loadStripe(
  "pk_test_51RjczaIIYku6vEVIdzk4zJ544Id4iAlw8n47t7oQ0mdKohim6dxuicjBBZBs31iNtk7gw4PrXnuByo04tZij0wB400VCqb633X"
); // Replace with your actual key

function PlaceOrderScreen() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cartItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, clearCart } =
    useCart();

  const [orderError, setOrderError] = useState("");
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [clientSecret, setClientSecret] = useState(""); // For Stripe Payment Intent

  // Redirect if cart is empty or address/payment not set
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/shipping");
    } else if (cartItems.length === 0) {
      navigate("/cart");
    } else if (!shippingAddress.address) {
      navigate("/shipping");
    } else if (!paymentMethod) {
      navigate("/payment");
    }
  }, [isAuthenticated, cartItems, shippingAddress, paymentMethod, navigate]);

  // Create Payment Intent for Stripe
  useEffect(() => {
    const createIntent = async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          `http://localhost:5001/api/orders/create-payment-intent`, // Backend Port ကို မှန်ကန်စွာ ထည့်ပါ။
          { amount: Number(totalPrice) }, // Total price ကို ပို့မယ်
          config
        );
        setClientSecret(data.clientSecret);
      } catch (err) {
        setOrderError(err.response && err.response.data.message ? err.response.data.message : err.message);
      }
    };
    if (paymentMethod === "Stripe" && totalPrice > 0 && user?.token) {
      createIntent();
    }
  }, [paymentMethod, totalPrice, user]);

  const placeOrderHandler = async () => {
    setLoadingOrder(true);
    setOrderError("");

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:5001/api/orders", // Backend Port ကို မှန်ကန်စွာ ထည့်ပါ။
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        },
        config
      );

      clearCart(); // Order တင်ပြီးရင် Cart ကို ရှင်းမယ်
      navigate(`/order/${data._id}`); // Order Confirmation Page ကို သွားမယ်
    } catch (err) {
      setOrderError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoadingOrder(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 my-8">
      <CheckoutSteps step1 step2 step3 /> {/* Step 1, 2, 3 ကို Highlight လုပ်မယ် */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">Order Summary</h2>

          {/* Shipping Address */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Shipping</h3>
            <p className="text-gray-700">
              <span className="font-semibold">Address:</span> {shippingAddress.address}, {shippingAddress.city},{" "}
              {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Payment Method</h3>
            <p className="text-gray-700">
              <span className="font-semibold">Method:</span> {paymentMethod}
            </p>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Order Items</h3>
            {cartItems.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex items-center space-x-4 border-b pb-4 last:pb-0 last:border-b-0">
                    <img
                      src={`http://localhost:5001${item.image}`}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div>
                      <Link
                        to={`/products/${item.product}`}
                        className="text-lg font-semibold text-blue-600 hover:underline"
                      >
                        {item.name}
                      </Link>
                      <p className="text-gray-700">
                        {item.quantity} x ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Order Totals & Payment Section */}
        <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-lg h-fit">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">Order Totals</h3>
          <div className="flex justify-between items-center text-gray-700 mb-2">
            <span>Items:</span>
            <span className="font-semibold">${itemsPrice}</span>
          </div>
          <div className="flex justify-between items-center text-gray-700 mb-2">
            <span>Shipping:</span>
            <span className="font-semibold">${shippingPrice}</span>
          </div>
          <div className="flex justify-between items-center text-gray-700 mb-4 border-b pb-4">
            <span>Tax:</span>
            <span className="font-semibold">${taxPrice}</span>
          </div>
          <div className="flex justify-between items-center text-2xl font-bold text-gray-900 mb-6">
            <span>Total:</span>
            <span>${totalPrice}</span>
          </div>

          {orderError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              {orderError}
            </div>
          )}

          {/* Place Order Button */}
          {paymentMethod !== "Stripe" && ( // Stripe မဟုတ်ရင် ပုံမှန် Place Order Button
            <button
              onClick={placeOrderHandler}
              className="w-full bg-blue-600 text-white text-lg py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              disabled={cartItems.length === 0 || loadingOrder}
            >
              {loadingOrder ? "Placing Order..." : "Place Order"}
            </button>
          )}

          {/* Stripe Payment Form */}
          {paymentMethod === "Stripe" && clientSecret && (
            <Elements options={{ clientSecret }} stripe={stripePromise}>
              <CheckoutForm onOrderPlaced={placeOrderHandler} loadingOrder={loadingOrder} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlaceOrderScreen;
