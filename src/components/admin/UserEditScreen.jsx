// frontend/src/components/admin/UserEditScreen.jsx

import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function UserEditScreen() {
  const { id: userId } = useParams(); // URL ကနေ User ID ကို ရယူပါ
  const navigate = useNavigate();
  const { user } = useAuth(); // Login ဝင်ထားတဲ့ Admin user data ကို ယူမယ်
  const backendUrl = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5001";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // Admin role status

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // Success message

  // ဘာကြောင့်၊ ဘာအတွက် သုံးလဲ: Admin မဟုတ်ရင် Login Page ကို Redirect လုပ်ဖို့နဲ့ User ရဲ့ အချက်အလက်တွေကို Backend ကနေ ဆွဲယူပြီး Form မှာ ပြသဖို့။
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`${backendUrl}/api/users/${userId}`, config); // Backend Port ကို မှန်ကန်စွာ ထည့်ပါ။

        // Fetch လုပ်လာတဲ့ User Data တွေကို State ထဲ ထည့်ပါ
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, user, navigate]); // userId, user, navigate ပြောင်းလဲရင် useEffect ပြန် run မယ်

  // ဘာကြောင့်၊ ဘာအတွက် သုံးလဲ: User Profile ကို Admin က ပြင်ဆင်ဖို့။
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      // User Profile ကို Backend မှာ Update လုပ်
      const { data } = await axios.put(
        `${backendUrl}/api/users/${userId}`, // Backend Port ကို မှန်ကန်စွာ ထည့်ပါ။
        { name, email, isAdmin }, // isAdmin status ကိုပါ ထည့်ပို့
        config
      );

      setMessage("User Updated Successfully!");
      setLoading(false);
      // Optional: Navigate back to user list after update
      // navigate('/admin/users');
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 my-8">
      <Link to="/admin/users" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Go Back to Users
      </Link>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Edit User</h2>

        {message && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            {message}
          </div>
        )}
        {loading && <div className="text-center text-blue-600 mb-4">Loading User...</div>}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            {error}
          </div>
        )}

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

          <div className="mb-6">
            <label className="flex items-center text-gray-700 text-sm font-bold">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <span className="ml-2">Is Admin</span>
            </label>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 w-full"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserEditScreen;
