import React, { createContext, useEffect, useState, useContext } from "react";
import { keycloak, setupTokenRefresh } from "./keycloak";

const KeycloakContext = createContext(null);

export const useKeycloak = () => useContext(KeycloakContext);

export const KeycloakProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    keycloak
      .init({
        onLoad: "login-required",
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
      })
      .then((authenticated) => {
        setAuthenticated(authenticated);
        setLoading(false);
        if (authenticated) setupTokenRefresh(); // Start token refresh
      })
      .catch((error) => {
        console.error("Keycloak initialization failed:", error);
        setLoading(false);
      });
  }, []);

  return (
    <KeycloakContext.Provider value={{ keycloak, authenticated }}>
      {loading ? <div>Loading...</div> : children}
    </KeycloakContext.Provider>
  );
};
