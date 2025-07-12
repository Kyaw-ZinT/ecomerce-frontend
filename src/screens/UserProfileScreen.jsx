// frontend/src/screens/UserProfileScreen.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useCart } from "../context/CartContext"; // Cart context မှ order details အတွက်

function UserProfileScreen() {
  const navigate = useNavigate();
  const { user, isAuthenticated, login: authLogin } = useAuth(); // login ကို authLogin အဖြစ် alias ပေး (name conflict ရှောင်ရန်)
  const { clearCart } = useCart(); // Optional: Order history ကို clear လုပ်ဖို့ (လိုအပ်လျှင်)

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(""); // Success/Error Message for profile update
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [orders, setOrders] = useState([]); // User's orders
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5001";
  // ဘာကြောင့်၊ ဘာအတွက် သုံးလဲ: User Login ဝင်ထားခြင်း ရှိမရှိ စစ်ဆေးပြီး မဝင်ထားရင် Login Page ကို Redirect လုပ်ဖို့။ User Login ဝင်ထားရင် သူ့ရဲ့ Profile အချက်အလက်တွေကို Backend ကနေ ဆွဲယူဖို့။
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      const fetchUserProfile = async () => {
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          // User Profile ကို ဆွဲယူ
          const { data } = await axios.get(`${backendUrl}/api/users/profile`, config);
          setName(data.name);
          setEmail(data.email);
          setLoading(false);
        } catch (err) {
          setError(err.response && err.response.data.message ? err.response.data.message : err.message);
          setLoading(false);
          // Optional: Token expired or invalid, logout user
          // logout();
        }
      };

      const fetchMyOrders = async () => {
        try {
          setLoadingOrders(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          // User ရဲ့ Order History ကို ဆွဲယူ
          const { data } = await axios.get(`${backendUrl}/api/orders/myorders`, config);
          setOrders(data);
          setLoadingOrders(false);
        } catch (err) {
          setErrorOrders(err.response && err.response.data.message ? err.response.data.message : err.message);
          setLoadingOrders(false);
        }
      };

      fetchUserProfile();
      fetchMyOrders();
    }
  }, [isAuthenticated, user, navigate]); // isAuthenticated, user, navigate ပြောင်းလဲရင် Effect ပြန် run မယ်

  // ဘာကြောင့်၊ ဘာအတွက် သုံးလဲ: Profile Update Form ကို Submit လုပ်တဲ့အခါ User Profile ကို Backend မှာ ပြင်ဆင်ဖို့။
  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      // User Profile ကို Backend မှာ Update လုပ်
      const { data } = await axios.put(`${backendUrl}/api/users/profile`, { name, email, password }, config);

      setMessage("Profile Updated Successfully!");
      authLogin(data); // Auth Context မှာ User Info ကို Update လုပ် (token လည်း ပြောင်းနိုင်လို့)
      setLoading(false);
      setPassword(""); // Password Fields တွေကို ရှင်းလင်း
      setConfirmPassword("");
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 my-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Profile Update Form */}
        <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3 text-center">User Profile</h2>
          {message && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              {error}
            </div>
          )}
          {loading && <div className="text-center text-blue-600 mb-4">Updating Profile...</div>}

          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 w-full"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>

        {/* Order History Table */}
        <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">My Orders</h2>
          {loadingOrders ? (
            <div className="text-center text-blue-600">Loading Orders...</div>
          ) : errorOrders ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {errorOrders}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      DATE
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      TOTAL
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      PAID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      DELIVERED
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.createdAt.substring(0, 10)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.isPaid ? (
                          <svg
                            className="h-6 w-6 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0a9 9 0 0118 0z"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            className="h-6 w-6 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0a9 9 0 0118 0z"
                            ></path>
                          </svg>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.isDelivered ? (
                          <svg
                            className="h-6 w-6 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2l4-4m6 2a9 9 0 11-18 0a9 9 0 0118 0z"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            className="h-6 w-6 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0a9 9 0 0118 0z"
                            ></path>
                          </svg>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/order/${order._id}`} className="text-indigo-600 hover:text-indigo-900">
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfileScreen;
