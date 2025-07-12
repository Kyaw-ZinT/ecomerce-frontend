// frontend/src/components/ProductDetail.jsx

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // useAuth ကို import လုပ်ပါ
import axios from "axios";

// --- Rating Component ---
// ဘာကြောင့်၊ ဘာအတွက် သုံးလဲ: Product ရဲ့ Rating (ကြယ်ပွင့်အရေအတွက်) ကို ပြသဖို့အတွက် ဒီ Component လေးကို သုံးပါတယ်။
// review တွေမှာ rating ပြသတဲ့နေရာတွေမှာလည်း ပြန်လည်အသုံးပြုနိုင်ပါတယ်။
const Rating = ({ value, text }) => {
  return (
    <div className="flex items-center text-yellow-500">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {value >= star ? ( // ကြယ်ပြည့်
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 fill-current"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
            </svg>
          ) : value >= star - 0.5 ? ( // ကြယ်တစ်ဝက်
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 fill-current"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              <path
                fillOpacity=".5"
                d="M10 2.927c-.3-.921-1.603-.921-1.902 0l-1.07 3.292a1 1 0 01-.95.69H3.586c-.969 0-1.371 1.24-.588 1.81l2.8 2.034a1 1 0 01.364 1.118l-1.07 3.292c-.3.921.755 1.688 1.538 1.118l2.8-2.034a1 1 0 011.175 0l2.8 2.034c.783-.57 1.838-.197 1.538-1.118l-1.07-3.292a1 1 0 01.364-1.118L17.02 8.72c.783-.57.381-1.81-.588-1.81h-3.462a1 1 0 01-.95-.69l-1.07-3.292z"
              />
            </svg>
          ) : (
            // ကြယ်အလွတ်
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 fill-current text-gray-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
            </svg>
          )}
        </span>
      ))}
      {text && <span className="ml-2 text-gray-600 text-sm">{text}</span>}
    </div>
  );
};

function ProductDetail() {
  const { productId } = useParams(); // URL ကနေ Product ID ကို ယူမယ် (Correctly named)
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth(); // useAuth ကို ဒီမှာ ခေါ်သုံးပါ

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");

  // --- Review Form States ---
  const [rating, setRating] = useState(0); // User ရွေးချယ်မယ့် Rating
  const [comment, setComment] = useState(""); // User ရေးမယ့် Comment
  const [reviewSuccess, setReviewSuccess] = useState(""); // Review Submit အောင်မြင်ရင် ပြသဖို့ Message
  const [reviewError, setReviewError] = useState(""); // Review Submit လုပ်တဲ့အခါ Error ဖြစ်ရင် ပြသဖို့ Message
  const [loadingReview, setLoadingReview] = useState(false); // Review Submit လုပ်နေစဉ် Loading Status
  const backendUrl = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5001";
  // --- Product Data Fetching Logic ---
  // ဘာကြောင့်၊ ဘာအတွက် သုံးလဲ: Product Detail Page ကို Load လုပ်တဲ့အခါ Product ရဲ့ အသေးစိတ်အချက်အလက်တွေနဲ့
  // Review တွေကို Backend ကနေ ဆွဲယူဖို့အတွက် ဒီ useEffect ကို သုံးပါတယ်။
  // `reviewSuccess` state ပြောင်းလဲတဲ့အခါမှာလည်း Product ကို ပြန် Fetch ပြီး Review အသစ်ကို ချက်ချင်း မြင်ရအောင် လုပ်ထားပါတယ်။
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${backendUrl}/api/products/${productId}`);
        setProduct(data);
        setMainImage(`${backendUrl}${data.image}`);
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };
    if (productId) {
      fetchProduct();
    } else {
      setError("Product ID is missing.");
      setLoading(false);
    }
  }, [productId, reviewSuccess]); // `reviewSuccess` ကို dependency ထဲ ထည့်ထားပါတယ်။

  // --- Submit Review Handler ---
  // ဘာကြောင့်၊ ဘာအတွက် သုံးလဲ: Customer က Review Form ကို ဖြည့်ပြီး "Submit Review" ခလုတ်ကို နှိပ်တဲ့အခါ ဒီ Function က အလုပ်လုပ်ပါတယ်။
  // Review Data (Rating, Comment) တွေကို Backend API ကို ပို့ပြီး Database မှာ သိမ်းဆည်းဖို့ပါ။
  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setLoadingReview(true); // Review Submit လုပ်နေကြောင်း ပြသဖို့ Loading စတင်
    setReviewError(""); // အရင် Error တွေ ရှင်း
    setReviewSuccess(""); // အရင် Success Message တွေ ရှင်း

    if (!rating || !comment) {
      // Rating နဲ့ Comment ဖြည့်ထားလား စစ်ဆေး
      setReviewError("Please select a rating and write a comment.");
      setLoadingReview(false);
      return;
    }

    try {
      const config = {
        // API Request အတွက် Header Configuration
        headers: {
          "Content-Type": "application/json", // JSON Data ပို့မည်ဟု သတ်မှတ်
          Authorization: `Bearer ${user.token}`, // Login ဝင်ထားတဲ့ User ရဲ့ Token ကို ပို့မယ် (Authenticated User မှသာ Review ရေးနိုင်မည်)
        },
      };
      await axios.post(
        // Backend Review API ကို POST Request ဖြင့် ခေါ်ဆိုခြင်း
        `${backendUrl}/api/products/${productId}/reviews`,
        { rating, comment }, // Rating နဲ့ Comment Data တွေ ပို့မယ်
        config
      );
      setReviewSuccess("Review submitted successfully!"); // Submit အောင်မြင်ကြောင်း Message ပြသ
      setRating(0); // Form Fields တွေကို ရှင်းလင်း
      setComment(""); // Form Fields တွေကို ရှင်းလင်း
      setLoadingReview(false); // Loading ပြီးဆုံး
      setReviewSuccess(Date.now()); // reviewSuccess ကို update လုပ်ခြင်းဖြင့် useEffect ကို ပြန် run စေကာ Product Data ကို Refresh လုပ် (Review အသစ် ချက်ချင်း မြင်ရအောင်)
      // Date.now() ကို သုံးခြင်းဖြင့် Unique value အမြဲရပြီး useEffect ကို Trigger လုပ်မှာပါ။
    } catch (err) {
      setReviewError(err.response && err.response.data.message ? err.response.data.message : err.message); // Error ဖြစ်ရင် Error Message ပြသ
      setLoadingReview(false); // Loading ပြီးဆုံး
    }
  };

  // --- Quantity Change Handler (No Change) ---
  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  // --- Add to Cart Handler (No Change) ---
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert(`${quantity} of "${product.name}" added to cart!`);
    }
  };

  // --- Check if User has already reviewed this product ---
  // ဘာကြောင့်၊ ဘာအတွက် သုံးလဲ: Login ဝင်ထားတဲ့ User က ဒီ Product ကို အရင်က Review ရေးပြီးပြီလားဆိုတာ စစ်ဆေးဖို့။
  // Review ရေးပြီးသားဆိုရင် Review Form ကို မပြတော့ဘဲ Message ပြသဖို့အတွက်ပါ။
  // (Note: To ensure user has *purchased* the product before reviewing,
  // you would need to fetch user's past orders from backend and check if this product ID is in it.
  // This is a more advanced step and not included in this basic review system for now.)
  const hasReviewed = product?.reviews?.some((review) => review.user.toString() === user?._id.toString());

  return (
    <div className="container mx-auto p-4 md:p-8 bg-white rounded-lg shadow-lg my-8">
      {loading ? ( // Product Data Loading လုပ်နေစဉ် Loading Message ပြသ
        <div className="text-center text-blue-600">Loading Product Details...</div>
      ) : error ? ( // Error ဖြစ်ရင် Error Message ပြသ
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      ) : (
        // Loading ပြီး Error မရှိရင် Product Detail & Reviews ကို ပြသ
        <>
          {/* --- Product Details Section --- */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Image Section */}
            <div className="lg:w-1/2 flex flex-col items-center">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full max-w-lg h-96 object-contain rounded-lg shadow-md"
              />
              <div className="flex space-x-2 mt-4 overflow-x-auto p-2">
                <img
                  src={`${backendUrl}${product.image}`}
                  alt={`${product.name} thumbnail`}
                  className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${
                    mainImage === `${backendUrl}${product.image}` ? "border-blue-600" : "border-transparent"
                  } hover:border-blue-500 transition-all duration-200`}
                  onClick={() => setMainImage(`${backendUrl}${product.image}`)}
                />
              </div>
            </div>

            {/* Product Information Section */}
            <div className="lg:w-1/2">
              <h1 className="text-4xl font-bold text-gray-800 mb-3">{product.name}</h1>
              <div className="mb-4">
                <Rating value={product.rating} text={`${product.numReviews} reviews`} />{" "}
                {/* Product Overall Rating ပြသခြင်း */}
              </div>
              <p className="text-3xl font-semibold text-blue-600 mb-6">${product.price.toFixed(2)}</p>

              <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 mb-6">
                <label htmlFor="quantity" className="block text-lg font-medium text-gray-700">
                  Quantity:
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-20 p-2 border border-gray-300 rounded-md text-center text-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full md:w-auto bg-blue-600 text-white text-lg py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2"
                disabled={product.countInStock === 0}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>{product.countInStock > 0 ? "Add to Cart" : "Out Of Stock"}</span>
              </button>
            </div>
          </div>

          {/* --- Customer Reviews Section --- */}
          <div className="mt-12 border-t pt-8 border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
            {product.reviews && product.reviews.length > 0 ? ( // Reviews ရှိမှ List ပြ
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review._id} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <p className="font-semibold text-lg text-gray-900 mr-3">{review.name}</p>
                      <Rating value={review.rating} /> {/* Review Rating ပြသခြင်း */}
                    </div>
                    <p className="text-gray-800">{review.comment}</p>
                    <p className="text-gray-500 text-sm mt-1">{review.createdAt.substring(0, 10)}</p>{" "}
                    {/* Review Date ပြသခြင်း */}
                  </div>
                ))}
              </div>
            ) : (
              // Reviews မရှိရင် Message ပြ
              <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            )}

            {/* --- Review Form --- */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Write a Customer Review</h3>
              {reviewSuccess && (
                <div
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
                  role="alert"
                >
                  {reviewSuccess}
                </div>
              )}
              {reviewError && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                  role="alert"
                >
                  {reviewError}
                </div>
              )}
              {loadingReview && <div className="text-center text-blue-600 mb-4">Submitting Review...</div>}

              {isAuthenticated ? ( // User Login ဝင်ထားမှ Review Form ကို ပြမယ်
                hasReviewed ? ( // User က ဒီ Product ကို Review ရေးပြီးပြီလား စစ်
                  <div
                    className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
                    role="alert"
                  >
                    You have already reviewed this product.
                  </div>
                ) : (
                  // Review မရေးရသေးရင် Form ကို ပြမယ်
                  <form onSubmit={submitReviewHandler}>
                    <div className="mb-4">
                      <label htmlFor="rating" className="block text-gray-700 text-sm font-bold mb-2">
                        Rating
                      </label>
                      <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                        required
                      >
                        <option value="">Select...</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="comment" className="block text-gray-700 text-sm font-bold mb-2">
                        Comment
                      </label>
                      <textarea
                        id="comment"
                        rows="3"
                        placeholder="Write a comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
                      disabled={loadingReview}
                    >
                      Submit Review
                    </button>
                  </form>
                )
              ) : (
                // Login မဝင်ထားရင် Message ပြ
                <div
                  className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  Please{" "}
                  <Link to="/login" className="font-bold hover:underline">
                    sign in
                  </Link>{" "}
                  to write a review.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProductDetail;
