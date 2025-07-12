// frontend/src/components/AdminRoute.jsx

import React from "react";
import { Navigate, Outlet } from "react-router-dom"; // Navigate နဲ့ Outlet ကို import လုပ်ပါ
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { isAuthenticated, user } = useAuth(); // Auth Context မှ isAuthenticated နှင့် user ကို ရယူပါ

  // User Login ဝင်ထားပြီး Admin ဖြစ်မှသာ Outlet (Protected Child Route) ကို ပြပါ
  // မဟုတ်ရင် Login Page ကို Redirect လုပ်ပါ
  return isAuthenticated && user && user.isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;
