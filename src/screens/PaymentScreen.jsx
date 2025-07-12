// frontend/src/screens/PaymentScreen.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CheckoutSteps from "../components/CheckoutSteps";

function PaymentScreen() {
  const navigate = useNavigate();
  const { shippingAddress, paymentMethod, savePaymentMethod } = useCart();

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethod || "Stripe");

  const submitHandler = (e) => {
    e.preventDefault();
    savePaymentMethod(selectedPaymentMethod);
    navigate("/placeorder");
  };

  return (
    <div className="container mx-auto p-4 md:p-8 my-8 max-w-lg">
      <CheckoutSteps step1 step2 />
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Payment Method</h2>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Select Method</h3>
            <div className="flex items-center mb-4">
              <input
                type="radio"
                id="stripe"
                name="paymentMethod"
                value="Stripe"
                checked={selectedPaymentMethod === "Stripe"}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <label htmlFor="stripe" className="ml-3 text-gray-700 text-lg">
                Stripe (Credit Card)
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 w-full"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default PaymentScreen;
