// frontend/src/components/Header.jsx

import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { getTotalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white shadow-md py-4 px-6 md:px-8">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Site Title */}
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition duration-300">
          My E-Shop
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600 transition duration-300">
            Products
          </Link>
          <Link to="/categories" className="text-gray-600 hover:text-blue-600 transition duration-300">
            Categories
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-600 transition duration-300">
            About Us
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition duration-300">
            Contact
          </Link>
        </nav>

        {/* Cart and User Icons (Desktop & Mobile) */}
        <div className="flex items-center space-x-4">
          {/* Cart Icon */}
          <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 transition duration-300">
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
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {getTotalItems()}
              </span>
            )}
          </Link>

          {/* User Authentication Status */}
          {isAuthenticated ? (
            <div className="relative group py-2">
              <button className="text-gray-600 hover:text-blue-600 transition duration-300 flex items-center space-x-1">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="hidden md:inline">{user.name || user.email}</span>
              </button>
              {/* Dropdown Menu for Profile, Orders, Logout & Admin Link */}
              <div className="absolute right-0 mt-0 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </Link>{" "}
                {/* User Profile Link */}
                <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  My Orders
                </Link>{" "}
                {/* My Orders Link (currently points to /orders, but can be managed via profile page) */}
                {user && user.isAdmin && (
                  <>
                    <Link to="/admin/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Admin: Products
                    </Link>
                    <Link to="/admin/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      {" "}
                      {/* New Admin User Management Link */}
                      Admin: Users
                    </Link>
                    <Link to="/admin/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      {" "}
                      {/* New Admin Order Management Link */}
                      Admin: Orders
                    </Link>
                  </>
                )}
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-gray-600 hover:text-blue-600 transition duration-300">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="hidden md:inline ml-1">Login</span>
            </Link>
          )}

          {/* Mobile Menu Button (Hamburger Icon) */}
          <button className="md:hidden text-gray-600 hover:text-blue-600 transition duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
