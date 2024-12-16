import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ element: Component }) => {
  const location = useLocation();

  // Define public routes that do not require authentication
  const publicRoutes = ["/callback"];

  // Skip protection for public routes
  if (publicRoutes.includes(location.pathname)) {
    return <Component />;
  }

  // Example: Replace this with your actual authentication check
  const isAuthenticated = !!localStorage.getItem("accessToken");

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    return <Navigate to="/api/login" replace />;
  }

  // Render the protected component if authenticated
  return <Component />;
};

export default ProtectedRoute;
