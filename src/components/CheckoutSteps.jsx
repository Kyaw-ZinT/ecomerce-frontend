// frontend/src/components/CheckoutSteps.jsx

import React from "react";
import { Link } from "react-router-dom";

function CheckoutSteps({ step1, step2, step3, step4 }) {
  return (
    <nav className="flex justify-center mb-8">
      <div className="flex space-x-4">
        {step1 ? (
          <Link to="/shipping" className="text-blue-600 hover:underline font-bold">
            Shipping
          </Link>
        ) : (
          <span className="text-gray-400 cursor-not-allowed">Shipping</span>
        )}

        <span className="text-gray-400"> &gt; </span>

        {step2 ? (
          <Link to="/payment" className="text-blue-600 hover:underline font-bold">
            Payment
          </Link>
        ) : (
          <span className="text-gray-400 cursor-not-allowed">Payment</span>
        )}

        <span className="text-gray-400"> &gt; </span>

        {step3 ? (
          <Link to="/placeorder" className="text-blue-600 hover:underline font-bold">
            Place Order
          </Link>
        ) : (
          <span className="text-gray-400 cursor-not-allowed">Place Order</span>
        )}

        {/* Optional: Step 4 for Order Confirmation / Success */}
        {/*
        <span className="text-gray-400"> &gt; </span>
        {step4 ? (
          <Link to="/order/:id" className="text-blue-600 hover:underline font-bold">
            Order
          </Link>
        ) : (
          <span className="text-gray-400 cursor-not-allowed">Order</span>
        )}
        */}
      </div>
    </nav>
  );
}

export default CheckoutSteps;
