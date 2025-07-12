// frontend/src/components/admin/UserListScreen.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function UserListScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth(); // Login ဝင်ထားတဲ့ user (admin) data ကို ယူမယ်
  const navigate = useNavigate();

  useEffect(() => {
    // Admin မဟုတ်ရင် Login Page ကို ပြန်ပို့မယ်
    if (!user || !user.isAdmin) {
      navigate("/login");
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`, // Admin Token ကို Request Headers မှာ ပို့မယ်
          },
        };
        const { data } = await axios.get("http://localhost:5001/api/users", config); // Backend Port ကို မှန်ကန်စွာ ထည့်ပါ။
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
        // Optional: Token expired or invalid, logout admin
        if (err.response && err.response.status === 401) {
          logout();
        }
      }
    };

    fetchUsers();
  }, [user, navigate, logout]); // user, navigate, logout ပြောင်းလဲရင် useEffect ပြန် run မယ်

  // ဘာကြောင့်၊ ဘာအတွက် သုံးလဲ: User တစ်ယောက်ကို ဖျက်ဖို့အတွက်။
  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        setLoading(true); // Delete လုပ်နေစဉ် Loading ပြပါ
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        await axios.delete(`http://localhost:5001/api/users/${id}`, config); // Backend Port ကို မှန်ကန်စွာ ထည့်ပါ။
        alert("User Deleted Successfully!");
        setUsers(users.filter((u) => u._id !== id)); // List ကနေ ဖျက်လိုက်ပါ
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-4 md:p-8 my-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Users</h1>
      </div>

      {loading ? (
        <div className="text-center text-blue-600">Loading Users...</div>
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
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ADMIN
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(
                (
                  userItem // 'user' prop နာမည် conflict ဖြစ်နိုင်လို့ 'userItem' လို့ ပြောင်းထားပါတယ်
                ) => (
                  <tr key={userItem._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{userItem._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{userItem.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a href={`mailto:${userItem.email}`} className="text-blue-600 hover:underline">
                        {userItem.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {userItem.isAdmin ? (
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
                      <Link
                        to={`/admin/users/${userItem._id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 inline-block"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-3.586 3.586L10.586 7.586 2 16.172V17h.828L11.586 7.414z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => deleteHandler(userItem._id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={loading}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 inline-block"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserListScreen;
