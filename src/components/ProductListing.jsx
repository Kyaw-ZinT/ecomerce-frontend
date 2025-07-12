// frontend/src/components/ProductListing.jsx

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // useLocation ကို import လုပ်ပါ
import ProductCard from "./ProductCard";
import SearchBar from "./SearchBar";
import ProductFilters from "./ProductFilters";
import Pagination from "./Pagination"; // Pagination Component ကို import လုပ်ပါ
import axios from "axios";
function ProductListing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const navigate = useNavigate();
  // Filtering States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const location = useLocation(); // URL Query Parameters တွေကို ရယူဖို့

  // Available Categories ကို Backend ကနေ ရလာတဲ့ products ကနေ ထုတ်ယူခြင်း
  const availableCategories = [...new Set(products.map((product) => product.category))];

  useEffect(() => {
    // URL Query Parameters တွေကို Parse လုပ်မယ်
    const queryParams = new URLSearchParams(location.search);
    const keywordParam = queryParams.get("keyword") || "";
    const categoryParam = queryParams.get("category") || "";
    const minPriceParam = queryParams.get("minPrice") || "";
    const maxPriceParam = queryParams.get("maxPrice") || "";
    const pageNumberParam = queryParams.get("pageNumber") || "1";

    // State တွေကို URL Query Param အတိုင်း Update လုပ်မယ် (ဒါမှ Browser Refresh လုပ်ရင်လည်း Query Param အတိုင်း ရှိနေမယ်)
    setSearchTerm(keywordParam);
    setSelectedCategory(categoryParam);
    setMinPrice(minPriceParam);
    setMaxPrice(maxPriceParam);
    setPage(Number(pageNumberParam));

    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Backend API ကို Query Parameters တွေနဲ့ ပို့မယ်
        const { data } = await axios.get(
          `http://localhost:5001/api/products?pageNumber=${pageNumberParam}&keyword=${keywordParam}&category=${categoryParam}&minPrice=${minPriceParam}&maxPrice=${maxPriceParam}`
        );
        setProducts(data.products);
        setPage(data.page);
        setPages(data.pages);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]); // URL query parameter ပြောင်းလဲတိုင်း useEffect ပြန် run မယ်
  const filteredProducts = products;
  return (
    <section className="py-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Our Products</h2>

      {/* Search Bar */}
      <SearchBar
        onSearch={(term) => {
          const queryParams = new URLSearchParams(location.search);
          if (term) {
            queryParams.set("keyword", term);
          } else {
            queryParams.delete("keyword");
          }
          queryParams.set("pageNumber", "1"); // Search/Filter လုပ်တိုင်း Page 1 ကို ပြန်သွားပါ
          navigate(`?${queryParams.toString()}`); // URL ကို Update လုပ်ပါ
        }}
      />

      {/* Product Filters */}
      <ProductFilters
        categories={availableCategories}
        selectedCategory={selectedCategory}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onCategoryChange={(cat) => {
          const queryParams = new URLSearchParams(location.search);
          if (cat) {
            queryParams.set("category", cat);
          } else {
            queryParams.delete("category");
          }
          queryParams.set("pageNumber", "1");
          navigate(`?${queryParams.toString()}`);
        }}
        onMinPriceChange={(val) => {
          const queryParams = new URLSearchParams(location.search);
          if (val) {
            queryParams.set("minPrice", val);
          } else {
            queryParams.delete("minPrice");
          }
          queryParams.set("pageNumber", "1");
          navigate(`?${queryParams.toString()}`);
        }}
        onMaxPriceChange={(val) => {
          const queryParams = new URLSearchParams(location.search);
          if (val) {
            queryParams.set("maxPrice", val);
          } else {
            queryParams.delete("maxPrice");
          }
          queryParams.set("pageNumber", "1");
          navigate(`?${queryParams.toString()}`);
        }}
      />

      {loading ? (
        <div className="text-center text-blue-600">Loading Products...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      ) : filteredProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          {/* Pagination Component */}
          <Pagination
            pages={pages}
            page={page}
            keyword={searchTerm}
            category={selectedCategory}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        </>
      ) : (
        <p className="text-center text-gray-600 text-xl mt-12">No products found matching your criteria.</p>
      )}
    </section>
  );
}

export default ProductListing;
