// frontend/src/components/admin/ProductListScreen.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; // Admin စစ်ဖို့ Auth Context ကိုသုံးမယ်

function ProductListScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth(); // Login ဝင်ထားတဲ့ user (admin) data ကို ယူမယ်
  const navigate = useNavigate();

  useEffect(() => {
    // Admin မဟုတ်ရင် Login Page ကို ပြန်ပို့မယ်
    if (!user || !user.isAdmin) {
      navigate("/login");
      return;
    }

    const fetchProducts = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`, // Admin Token ကို Request Headers မှာ ပို့မယ်
          },
        };
        const { data } = await axios.get("http://localhost:5001/api/products", config); // Backend Port ကို မှန်ကန်စွာ ထည့်ပါ။
        setProducts(data.products);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user, navigate]); // user သို့မဟုတ် navigate ပြောင်းလဲရင် useEffect ပြန် run မယ်

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true); // Delete လုပ်နေစဉ် Loading ပြပါ
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        await axios.delete(`http://localhost:5001/api/products/${id}`, config); // Backend Port ကို မှန်ကန်စွာ ထည့်ပါ။
        alert("Product Deleted Successfully!");
        setProducts(products.filter((p) => p._id !== id)); // List ကနေ ဖျက်လိုက်ပါ
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        setLoading(true);
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post("http://localhost:5001/api/products", {}, config); // Backend Port ကို မှန်ကန်စွာ ထည့်ပါ။
        alert("New Product Created! Now redirecting to edit page.");
        navigate(`/admin/products/${data._id}/edit`); // New Product ရဲ့ Edit Page ကို သွားပါ
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-4 md:p-8 my-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          onClick={createProductHandler}
          disabled={loading}
        >
          <i className="fas fa-plus mr-2"></i> Create Product
        </button>
      </div>

      {loading ? (
        <div className="text-center text-blue-600">Loading Products...</div>
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
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Brand
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
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
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
                      onClick={() => deleteHandler(product._id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={loading}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 inline-block"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
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

export default ProductListScreen;
