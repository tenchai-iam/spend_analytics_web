import Keycloak from "keycloak-js";

// Initialize Keycloak with configuration
const keycloak = new Keycloak({
  url: "https://sso.pea.co.th/auth",
  realm: "idm",
  clientId: "pea-tcc-spend",
});

/**
 * Setup token refresh to keep the user logged in.
 */
const setupTokenRefresh = () => {
  setInterval(() => {
    keycloak
      .updateToken(30) // Refresh if token will expire in less than 30 seconds
      .then((refreshed) => {
        if (refreshed) console.log("Token refreshed:", keycloak.token);
      })
      .catch(() => {
        console.error("Failed to refresh token. Logging out...");
        keycloak.logout();
      });
  }, 60000); // Refresh every 60 seconds
};

export { keycloak, setupTokenRefresh };
