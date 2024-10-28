import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { keycloak } from "./keycloak";

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    keycloak
      .init({ onLoad: "login-required" })
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Keycloak initialization failed:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
