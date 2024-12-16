import React, { createContext, useContext, useEffect, useState } from "react";
import keycloak from "./keycloak";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    keycloak
      .init({
        onLoad: "check-sso",
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
      })
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        setLoading(false);
        if (authenticated) {
          // Store tokens for token refresh
          localStorage.setItem("kc_token", keycloak.token);
          localStorage.setItem("kc_refreshToken", keycloak.refreshToken);
          startTokenRefresh();
        } else {
          window.location.href = `${process.env.REACT_APP_API_URL}/login`;
        }
      })
      .catch((error) => {
        console.error("Keycloak initialization failed:", error);
        setIsAuthenticated(false);
        setLoading(false);
      });
  }, []);

  const startTokenRefresh = () => {
    const refreshInterval = setInterval(() => {
      keycloak
        .updateToken(30) // Refresh if token expires within 30 seconds
        .then((refreshed) => {
          if (refreshed) {
            localStorage.setItem("kc_token", keycloak.token);
            localStorage.setItem("kc_refreshToken", keycloak.refreshToken);
          }
        })
        .catch(() => {
          console.error("Failed to refresh token, logging out");
          clearInterval(refreshInterval);
          keycloak.logout();
        });
    }, 60000); // Check every minute
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
