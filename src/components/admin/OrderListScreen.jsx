// frontend/src/components/admin/OrderListScreen.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function OrderListScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5001";
  // ဘာကြောင့်၊ ဘာအတွက် သုံးလဲ: Admin မဟုတ်ရင် Login Page ကို Redirect လုပ်ဖို့နဲ့ မှာယူမှုတွေအားလုံးကို Backend ကနေ ဆွဲယူဖို့။
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`, // Admin Token ကို Request Headers မှာ ပို့မယ်
          },
        };
        const { data } = await axios.get(`${backendUrl}/api/orders`, config); // Backend Port ကို မှန်ကန်စွာ ထည့်ပါ။
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
        if (err.response && err.response.status === 401) {
          logout(); // Token invalid ဖြစ်ရင် logout လုပ်
        }
      }
    };

    fetchOrders();
  }, [user, navigate, logout]);

  return (
    <div className="p-4 md:p-8 my-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
      </div>

      {loading ? (
        <div className="text-center text-blue-600">Loading Orders...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
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
                  USER
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
                    {order.user ? order.user.name : "Deleted User"} {/* User ဖျက်လိုက်ရင် name မရှိနိုင်ဘူး */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.totalPrice.toFixed(2)}</td>
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
  );
}

export default OrderListScreen;
