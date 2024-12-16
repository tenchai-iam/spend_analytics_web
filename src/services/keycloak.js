import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: "https://sso2.pea.co.th/realms/pea-users",
  realm: "pea-users",
  clientId: "pea-tcc-spend",
};

const keycloak = new Keycloak(keycloakConfig);

// Handle token expiration
keycloak.onTokenExpired = () => {
  keycloak
    .updateToken(30) // Refresh token if it will expire in 30 seconds
    .then((refreshed) => {
      if (refreshed) {
        localStorage.setItem("kc_token", keycloak.token);
        localStorage.setItem("kc_refreshToken", keycloak.refreshToken);
      } else {
        console.warn(
          "Token refresh failed; user might need to reauthenticate."
        );
      }
    })
    .catch(() => {
      console.error("Failed to refresh token; logging out.");
      keycloak.logout();
    });
};

export default keycloak;
