// frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from local storage", error);
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Failed to save user to local storage", error);
    }
  }, [user]);

  const login = (userData) => {
    setUser({ ...userData, name: userData.email.split("@")[0] });
    alert(`Welcome back, ${userData.email.split("@")[0]}!`);
    navigate("/");
  };

  const register = (userData) => {
    setUser({ ...userData, name: userData.email.split("@")[0] });
    alert(`Account created for ${userData.email.split("@")[0]}!`);
    navigate("/");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    // Call a function to clear other user-specific data from context/localStorage
    // This function will be provided by a consumer (e.g., CartContext)
    // For now, let's just make it a general hook that other contexts can subscribe to.
    window.dispatchEvent(new Event("logout")); // Custom event dispatch

    alert("You have been logged out.");
    navigate("/login");
  };

  // New: Function to subscribe to logout event (for other contexts)
  // This is a simple event listener approach.
  const subscribeToLogout = (callback) => {
    window.addEventListener("logout", callback);
    return () => window.removeEventListener("logout", callback);
  };

  const isAuthenticated = !!user;

  const contextValue = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    subscribeToLogout, // Provide this function via context
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
