// frontend/src/pages/AboutUsPage.jsx

import React from "react";
import { Link } from "react-router-dom";

function AboutUsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 my-8 max-w-3xl bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">About My E-Shop</h1>

      <p className="text-gray-700 leading-relaxed mb-6">
        Welcome to My E-Shop, your number one source for all things electronics, gadgets, and more. We're dedicated to
        providing you the very best of products, with an emphasis on quality, customer service, and uniqueness.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Founded in [Year, e.g., 2023], My E-Shop has come a long way from its beginnings. When we first started out, our
        passion for "eco-friendly tech products" drove us to start our own business.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments,
        please don't hesitate to contact us.
      </p>

      <p className="text-gray-700 leading-relaxed text-right font-semibold">
        Sincerely, <br />
        The My E-Shop Team
      </p>

      <div className="text-center mt-12">
        <Link
          to="/"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default AboutUsPage;
