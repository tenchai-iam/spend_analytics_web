import "./styles.css";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./Home";
import Dashboard1 from "./ComponentsPage/Dashboard1";
import Dashboard2 from "./ComponentsPage/Dashboard2X";
import Dashboard3 from "./ComponentsPage/Dashboard3";
import Dashboard4 from "./ComponentsPage/Dashboard4N";
import Upload from "./ComponentsPage/Upload";
import keycloak from "../src/services/keycloak.js";

const queryClient = new QueryClient();

function ProtectedRoute({ element: Component }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    keycloak
      .init({
        onLoad: "check-sso",
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
      })
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        if (!authenticated) {
          // Save the target path and redirect to Keycloak login
          keycloak.login({ redirectUri: window.location.href });
        }
      })
      .catch((error) => {
        console.error("Keycloak authentication failed:", error);
        keycloak.login({ redirectUri: window.location.href });
      });
  }, [location]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show a loader until authentication is resolved
  }

  return <Component />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            {/* Home page route */}
            <Route path="/" element={<Home />} />

            {/* Dashboard routes with authentication */}
            <Route
              path="/dashboard1"
              element={<ProtectedRoute element={Dashboard1} />}
            />
            <Route
              path="/dashboard2"
              element={<ProtectedRoute element={Dashboard2} />}
            />
            <Route
              path="/dashboard3"
              element={<ProtectedRoute element={Dashboard3} />}
            />
            <Route
              path="/dashboard4"
              element={<ProtectedRoute element={Dashboard4} />}
            />

            {/* Upload route with authentication */}
            <Route
              path="/upload"
              element={<ProtectedRoute element={Upload} />}
            />

            {/* Redirect any undefined route to Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}
