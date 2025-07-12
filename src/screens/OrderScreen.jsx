// frontend/src/screens/OrderScreen.jsx

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function OrderScreen() {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5001";
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingPay, setLoadingPay] = useState(false);
  const [loadingDeliver, setLoadingDeliver] = useState(false); // New: Delivery Loading State

  // ဘာကြောင့်၊ ဘာအတွက် သုံးလဲ: User Login ဝင်ထားခြင်း ရှိမရှိ စစ်ဆေးပြီး မဝင်ထားရင် Login Page ကို Redirect လုပ်ဖို့။ Order Detail ကို Backend ကနေ ဆွဲယူဖို့။
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`${backendUrl}/api/orders/${orderId}`, config);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    // Order မရှိသေးရင် ဒါမှမဟုတ် Order ID ပြောင်းသွားရင် ဒါမှမဟုတ် Payment/Delivery Status ပြောင်းသွားရင် Fetch ပြန်လုပ်
    if (orderId && (!order || order._id !== orderId)) {
      fetchOrder();
    } else if (!orderId && !loading) {
      // If no orderId in URL
      setError("Order ID is missing in URL.");
      setLoading(false);
    }
  }, [orderId, isAuthenticated, user, navigate]);

  // ဘာကြောင့်၊ ဘာအတွက် သုံးလဲ: Order ကို Paid အဖြစ် မှတ်သားဖို့ (Testing / Admin အတွက်)။
  const payOrderHandler = async () => {
    if (window.confirm("Mark this order as paid? (For testing purposes)")) {
      try {
        setLoadingPay(true);
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const paymentResult = {
          id: "test_payment_id_manual",
          status: "succeeded",
          update_time: new Date().toISOString(),
          payer_email: user.email,
        };
        await axios.put(`${backendUrl}/api/orders/${orderId}/pay`, paymentResult, config);
        alert("Order marked as Paid!");
        setLoadingPay(false);
        setOrder((prevOrder) => ({ ...prevOrder, isPaid: true, paidAt: new Date().toISOString(), paymentResult })); // UI ကို Update လုပ်
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoadingPay(false);
      }
    }
  };

  // ဘာကြောင့်၊ ဘာအတွက် သုံးလဲ: Admin တွေအနေနဲ့ မှာယူမှုကို ပစ္စည်းပို့ဆောင်ပြီးပြီလို့ မှတ်သားဖို့။
  const deliverHandler = async () => {
    if (window.confirm("Mark this order as delivered?")) {
      try {
        setLoadingDeliver(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        await axios.put(`${backendUrl}/api/orders/${orderId}/deliver`, {}, config);
        alert("Order marked as delivered!");
        setLoadingDeliver(false);
        setOrder((prevOrder) => ({ ...prevOrder, isDelivered: true, deliveredAt: new Date().toISOString() })); // UI ကို Update လုပ်
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoadingDeliver(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 my-8">
      {loading ? (
        <div className="text-center text-blue-600">Loading Order Details...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Order {order._id}</h1>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow-lg">
              {/* Shipping Address */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">Shipping</h3>
                <p className="text-gray-700">
                  <span className="font-semibold">Name:</span> {order.user?.name} {/* Optional Chaining (?) */}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span>{" "}
                  <a href={`mailto:${order.user?.email}`} className="text-blue-600 hover:underline">
                    {order.user?.email}
                  </a>{" "}
                  {/* Optional Chaining (?) */}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Address:</span> {order.shippingAddress?.address},{" "}
                  {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                </p>
                {order.isDelivered ? (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-3">
                    Delivered on {order.deliveredAt?.substring(0, 10)} {/* Optional Chaining (?) */}
                  </div>
                ) : (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-3">
                    Not Delivered
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">Payment Method</h3>
                <p className="text-gray-700">
                  <span className="font-semibold">Method:</span> {order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-3">
                    Paid on {order.paidAt?.substring(0, 10)} {/* Optional Chaining (?) */}
                  </div>
                ) : (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-3">
                    Not Paid
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">Order Items</h3>
                {order.orderItems?.length === 0 ? ( // Optional Chaining (?)
                  <p className="text-gray-600">Order is empty.</p>
                ) : (
                  <ul className="space-y-4">
                    {order.orderItems?.map(
                      (
                        item,
                        index // Optional Chaining (?)
                      ) => (
                        <li
                          key={item.product}
                          className="flex items-center space-x-4 border-b pb-4 last:pb-0 last:border-b-0"
                        >
                          <img
                            src={`${backendUrl}${item.image}`}
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
                              {item.quantity} x ${item.price?.toFixed(2)} = ${(item.quantity * item.price)?.toFixed(2)}
                            </p>{" "}
                            {/* Optional Chaining (?) */}
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>
            </div>

            {/* Order Summary / Admin Actions */}
            <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-lg h-fit">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">Order Summary</h3>
              <div className="flex justify-between items-center text-gray-700 mb-2">
                <span>Items:</span>
                <span className="font-semibold">${order.itemsPrice?.toFixed(2)}</span> {/* Optional Chaining (?) */}
              </div>
              <div className="flex justify-between items-center text-gray-700 mb-2">
                <span>Shipping:</span>
                <span className="font-semibold">${order.shippingPrice?.toFixed(2)}</span> {/* Optional Chaining (?) */}
              </div>
              <div className="flex justify-between items-center text-gray-700 mb-4 border-b pb-4">
                <span>Tax:</span>
                <span className="font-semibold">${order.taxPrice?.toFixed(2)}</span> {/* Optional Chaining (?) */}
              </div>
              <div className="flex justify-between items-center text-2xl font-bold text-gray-900 mb-6">
                <span>Total:</span>
                <span className="font-semibold">${order.totalPrice?.toFixed(2)}</span> {/* Optional Chaining (?) */}
              </div>

              {/* Mark as Paid Button (For Admin or Testing) */}
              {user &&
                user.isAdmin &&
                order &&
                !order.isPaid && ( // order object ရှိမှသာ ပြပါ
                  <button
                    onClick={payOrderHandler}
                    className="w-full bg-green-600 text-white text-lg py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 mb-4"
                    disabled={loadingPay}
                  >
                    {loadingPay ? "Processing Payment..." : "Mark as Paid (Admin Test)"}
                  </button>
                )}

              {/* Mark as Delivered Button (Admin Only) */}
              {user &&
                user.isAdmin &&
                order &&
                order.isPaid &&
                !order.isDelivered && ( // order object ရှိမှသာ ပြပါ
                  <button
                    onClick={deliverHandler}
                    className="w-full bg-blue-600 text-white text-lg py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    disabled={loadingDeliver}
                  >
                    {loadingDeliver ? "Marking Delivered..." : "Mark as Delivered (Admin)"}
                  </button>
                )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default OrderScreen;
