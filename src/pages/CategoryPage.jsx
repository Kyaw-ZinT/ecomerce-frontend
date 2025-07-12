// frontend/src/pages/CategoryPage.jsx

import React from "react";
import { Link } from "react-router-dom";

function CategoryPage() {
  const categories = [
    { name: "Electronics", description: "Smartphones, Laptops, Wearables, and more." },
    { name: "Audio", description: "Headphones, Speakers, and Audio Accessories." },
    { name: "Computer Accessories", description: "Keyboards, Mice, Webcams, and Peripherals." },
    { name: "Bags & Luggage", description: "Backpacks, Travel Bags, and Wallets." },
    { name: "Accessories", description: "Fashion Accessories and Small Gadgets." },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8 my-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Product Categories</h1>
      <p className="text-center text-gray-600 mb-8">Explore our wide range of products across various categories.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">{category.name}</h2>
            <p className="text-gray-700 mb-4">{category.description}</p>
            <Link to={`/?category=${category.name}`} className="text-blue-600 hover:underline font-semibold">
              View {category.name} Products &rarr;
            </Link>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          to="/"
          className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-300"
        >
          Back to All Products
        </Link>
      </div>
    </div>
  );
}

export default CategoryPage;
