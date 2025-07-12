// frontend/src/components/admin/ProductEditScreen.jsx

import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function ProductEditScreen() {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5001";
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState(""); // Image URL ကို သိမ်းဖို့
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false); // Image Uploading State
  const [uploadError, setUploadError] = useState(""); // Image Upload Error State

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/login");
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`${backendUrl}/api/products/${productId}`, config);

        setName(data.name);
        setPrice(data.price);
        setImage(data.image); // Product ရဲ့ Image URL ကို ယူလာမယ်
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `${backendUrl}/api/products/${productId}`,
        { name, price, image, brand, category, countInStock, description }, // image URL ကိုပါ ပို့မယ်
        config
      );

      alert("Product Updated Successfully!");
      setLoading(false);
      navigate("/admin/products");
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoading(false);
    }
  };

  // Image Upload Handler Function
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]; // ရွေးလိုက်တဲ့ ပုံကို ယူမယ်
    const formData = new FormData(); // FormData Object ကို ဖန်တီးမယ်
    formData.append("image", file); // 'image' ဆိုတဲ့ Key နဲ့ ပုံကို ထည့်မယ်
    setUploading(true);
    setUploadError(""); // Clear previous upload error

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data", // Image Upload အတွက် Content-Type ကို ပြောင်းပါ
          Authorization: `Bearer ${user.token}`, // Admin Token ကို ပို့ပါ
        },
      };

      const { data } = await axios.post(`${backendUrl}/api/upload`, formData, config); // Backend Upload API ကို ခေါ်ဆိုခြင်း

      setImage(data); // Backend ကနေ ပြန်လာတဲ့ Image Path ကို setImage မှာ ထည့်မယ်
      setUploading(false);
      alert("Image uploaded successfully!");
    } catch (err) {
      setUploadError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setUploading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 my-8">
      <Link to="/admin/products" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Go Back to Products
      </Link>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Edit Product</h2>

        {loading && <div className="text-center text-blue-600 mb-4">Loading Product...</div>}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler}>
          {/* ... Name, Price, Brand, Category, Count In Stock, Description Fields (No Change) ... */}
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
            <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
              Price
            </label>
            <input
              type="number"
              id="price"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
              Image URL
            </label>
            <input
              type="text"
              id="image"
              placeholder="Enter image url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            />
            {/* Image Upload Input Field */}
            <input
              type="file"
              id="image-file"
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={uploadFileHandler}
            />
            {uploading && <div className="text-center text-blue-600 mt-2">Uploading image...</div>}
            {uploadError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-2"
                role="alert"
              >
                {uploadError}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="brand" className="block text-gray-700 text-sm font-bold mb-2">
              Brand
            </label>
            <input
              type="text"
              id="brand"
              placeholder="Enter brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="countInStock" className="block text-gray-700 text-sm font-bold mb-2">
              Count In Stock
            </label>
            <input
              type="number"
              id="countInStock"
              placeholder="Enter count in stock"
              value={countInStock}
              onChange={(e) => setCountInStock(parseInt(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
              Category
            </label>
            <input
              type="text"
              id="category"
              placeholder="Enter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows="3"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 w-full"
            disabled={loading || uploading} // Update/Upload လုပ်နေရင် Button ကို Disabled လုပ်ပါ
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductEditScreen;
