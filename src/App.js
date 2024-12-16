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

const API_URL = "https://dev-spendi-tcc.pea.co.th/api";

function ProtectedRoute({ element: Component }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    keycloak
      .init({ onLoad: "check-sso" })
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        if (!authenticated) {
          // Redirect to backend login API if not authenticated
          window.location.href = `${API_URL}/login`;
        }
      })
      .catch((error) => {
        console.error("Keycloak authentication failed:", error);
        window.location.href = `${API_URL}/login`;
      });
  }, [location]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show a loader until authentication is resolved
  }

  return <Component />;
}

export default function App() {
  const queryClient = new QueryClient();

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
