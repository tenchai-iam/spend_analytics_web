import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const login_url = process.env.REACT_APP_LOGIN_URL;

const ProtectedRoute = ({ element: Component, allowedLevels = [] }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  // If no user or token, redirect to login page
  if (!user) {
    window.location.href = login_url;
    return null;
  }

  // Check if user level is restricted
  if (allowedLevels.length > 0 && !allowedLevels.includes(user.user_level)) {
    return <Navigate to="/" replace />;
  }

  return <Component />;
};

export default ProtectedRoute;
