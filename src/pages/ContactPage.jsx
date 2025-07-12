// frontend/src/pages/ContactPage.jsx

import React from "react";
import { Link } from "react-router-dom";

function ContactPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 my-8 max-w-xl bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Contact Us</h1>

      <p className="text-gray-700 leading-relaxed mb-6 text-center">
        Have questions? We're here to help! Please fill out the form below or reach us directly.
      </p>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">Our Details:</h3>
        <p className="text-gray-700">
          <span className="font-semibold">Email:</span> support@myeshop.com
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Phone:</span> +1 (555) 123-4567
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Address:</span> 123 E-Shop Lane, Tech City, 12345
        </p>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Send Us a Message:</h3>
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            placeholder="Your Name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            placeholder="Your Email"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-1">
            Message
          </label>
          <textarea
            id="message"
            rows="5"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
            placeholder="Your message..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 w-full"
        >
          Send Message
        </button>
      </form>

      <div className="text-center mt-8">
        <Link to="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default ContactPage;
