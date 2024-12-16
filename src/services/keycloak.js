import Keycloak from "keycloak-js";

// Initialize Keycloak with your configuration
const keycloakConfig = {
  url: "https://sso2.pea.co.th/realms/pea-users/protocol/openid-connect/auth",
  realm: "pea-users",
  clientId: "pea-tcc-spend",
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
