// frontend/src/components/LoginPage.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios"; // axios ကို import လုပ်ခြင်း

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Error Message ပြသရန် State
  const [loading, setLoading] = useState(false); // Loading State
  const { login } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5001";
  const handleSubmit = async (e) => {
    // async function ဖြစ်အောင် ပြောင်းပါ
    e.preventDefault();
    setError(""); // Error ကို ရှင်းလင်းပါ
    setLoading(true); // Loading စတင်ပါ

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Backend Login API ကို ခေါ်ဆိုခြင်း
      const { data } = await axios.post(
        `${backendUrl}/api/users/login`, // သင့် Backend Port (5001) ကို မှန်ကန်စွာ ထည့်ပါ။
        { email, password },
        config
      );

      // Login အောင်မြင်ရင် Auth Context ကို ခေါ်သုံးခြင်း
      login(data);
      // login function က navigate('/) လုပ်ပေးထားပြီးသားမို့ ဒီမှာ ထပ်လုပ်စရာမလို။
    } catch (err) {
      // Error ဖြစ်ရင် Error Message ကို ပြသခြင်း
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoading(false); // Loading ပြီးဆုံးပါ
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            {error}
          </div>
        )}
        {loading && <div className="text-center text-blue-600 mb-4">Loading...</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 w-full"
              disabled={loading} // Loading ဖြစ်နေရင် Button ကို Disabled လုပ်ပါ
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline font-bold">
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
