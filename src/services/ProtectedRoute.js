import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component }) => {
  const token = sessionStorage.getItem("access_token");

  // If no token, redirect to the login route
  if (!token) {
    window.location.href = "https://spendi-tcc.pea.co.th/api/login";
    return null;
  }

  return <Component />;
};

export default ProtectedRoute;
