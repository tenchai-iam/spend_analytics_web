import React from "react";
import { Navigate } from "react-router-dom";

const login_url = process.env.REACT_APP_LOGIN_URL;

const ProtectedRoute = ({ element: Component }) => {
  const token = sessionStorage.getItem("access_token");

  // If no token, redirect to the login route
  if (!token) {
    window.location.href = login_url;
    return null;
  }

  return <Component />;
};

export default ProtectedRoute;
