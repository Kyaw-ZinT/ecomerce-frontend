// frontend/src/App.jsx

import "./index.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext"; // No need to import useAuth here anymore
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductListing from "./components/ProductListing";
import ProductDetail from "./components/ProductDetail";
import ShoppingCart from "./components/ShoppingCart";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";

import AdminRoute from "./components/AdminRoute";
import ProductListScreen from "./components/admin/ProductListScreen";
import ProductEditScreen from "./components/admin/ProductEditScreen";

import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";

import CategoryPage from "./pages/CategoryPage";
import AboutUsPage from "./pages/AboutUsPage";
import ContactPage from "./pages/ContactPage";

import UserProfileScreen from "./screens/UserProfileScreen";
import PrivateRoute from "./components/PrivateRoute"; //
//
// // Admin User Management Screens များကို import လုပ်ခြင်း
import UserListScreen from "./components/admin/UserListScreen";
import UserEditScreen from "./components/admin/UserEditScreen";
import OrderListScreen from "./components/admin/OrderListScreen";
function App() {
  // REMOVE: const { isAuthenticated } = useAuth(); // This line should be removed from here.
  return (
    <Router>
      <AuthProvider>
        {" "}
        {/* AuthProvider must wrap all components that use AuthContext */}
        <CartProvider>
          {" "}
          {/* CartProvider must wrap all components that use CartContext */}
          <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow container mx-auto p-4">
              <Routes>
                <Route path="/" element={<ProductListing />} />
                <Route path="/products/:productId" element={<ProductDetail />} />
                <Route path="/cart" element={<ShoppingCart />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Static Pages Routes */}
                <Route path="/categories" element={<CategoryPage />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Checkout Routes */}
                {/* Wrap these in PrivateRoute because they require login */}
                <Route path="" element={<PrivateRoute />}>
                  {" "}
                  {/* PrivateRoute will check if user is authenticated */}
                  <Route path="/shipping" element={<ShippingScreen />} />
                  <Route path="/payment" element={<PaymentScreen />} />
                  <Route path="/placeorder" element={<PlaceOrderScreen />} />
                  <Route path="/order/:id" element={<OrderScreen />} />
                  <Route path="/profile" element={<UserProfileScreen />} /> {/* Protected by PrivateRoute now */}
                </Route>

                {/* Admin Routes (Protected by AdminRoute - which is also a PrivateRoute internally) */}
                <Route path="" element={<AdminRoute />}>
                  <Route path="/admin/products" element={<ProductListScreen />} />
                  <Route path="/admin/products/:id/edit" element={<ProductEditScreen />} />
                  {/* Admin User Management Routes */}
                  <Route path="/admin/users" element={<UserListScreen />} />
                  <Route path="/admin/users/:id/edit" element={<UserEditScreen />} />
                  <Route path="/admin/orders" element={<OrderListScreen />} />
                </Route>
              </Routes>
            </main>

            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
