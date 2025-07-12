// frontend/src/components/PrivateRoute.jsx

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Access the AuthContext

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth(); // Check authentication status

  // If the user is authenticated, render the child routes (Outlet)
  // Otherwise, redirect them to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
