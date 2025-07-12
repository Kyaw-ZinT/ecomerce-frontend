// frontend/src/screens/ShippingScreen.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CheckoutSteps from "../components/CheckoutSteps";

function ShippingScreen() {
  const { user } = useAuth();
  const { shippingAddress, saveShippingAddress } = useCart();

  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
  const [country, setCountry] = useState(shippingAddress.country || "");

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/shipping");
    }
  }, [user, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!address || !city || !postalCode || !country) {
      alert("Please fill in all shipping address fields.");
      return;
    }
    saveShippingAddress({ address, city, postalCode, country });
    navigate("/payment");
  };

  return (
    <div className="container mx-auto p-4 md:p-8 my-8 max-w-lg">
      <CheckoutSteps step1 />
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Shipping Address</h2>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
              Address
            </label>
            <input
              type="text"
              id="address"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">
              City
            </label>
            <input
              type="text"
              id="city"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="postalCode" className="block text-gray-700 text-sm font-bold mb-2">
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              placeholder="Enter postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="country" className="block text-gray-700 text-sm font-bold mb-2">
              Country
            </label>
            <input
              type="text"
              id="country"
              placeholder="Enter country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            />
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

export default ShippingScreen;
