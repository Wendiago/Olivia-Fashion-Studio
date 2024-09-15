import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  console.log("protected route:", user);

  if (!user) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.includes("admin") && user.isAdmin) {
    return <Outlet />;
  } else if (allowedRoles.includes("customer") && !user.isAdmin) {
    return <Outlet />;
  }
};

export default ProtectedRoute;
