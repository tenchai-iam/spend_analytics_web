import "./styles.css";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./services/AuthContext.js"; // Ensure correct import
import ProtectedRoute from "./services/ProtectedRoute";

import Home from "./Home";
import Dashboard1 from "./ComponentsPage/Dashboard1";
import Dashboard2 from "./ComponentsPage/Dashboard2.js";
import Dashboard3 from "./ComponentsPage/Dashboard3";
import Dashboard4A from "./ComponentsPage/Dashboard4A.js";
import Dashboard4B from "./ComponentsPage/Dashboard4B.js";
import Dashboard5A from "./ComponentsPage/Dashboard5A.js";
import Dashboard5B from "./ComponentsPage/Dashboard5B.js";
import Dashboard6 from "./ComponentsPage/Dashboard6";
import Admin from "./ComponentsPage/Admin";
import Upload from "./ComponentsPage/Upload";
import Callback from "./services/Callback.js";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {" "}
        {/* Ensure AuthProvider wraps the entire app */}
        <Router>
          <div className="App">
            <Routes>
              {/* <Route path="/" element={<Home />} /> */}
              <Route path="/" element={<ProtectedRoute element={Home} />} />
              {/* <Route path="/dashboard1" element={<Dashboard1 />} /> */}
              <Route
                path="/dashboard1"
                element={<ProtectedRoute element={Dashboard1} />}
              />
              <Route
                path="/dashboard2"
                element={<ProtectedRoute element={Dashboard2} />}
              />
              {/* Restrict access to Dashboard3 and Dashboard4 for user_level "B" */}
              <Route path="/dashboard3" element={<Dashboard3 />} />
              {/* <Route
                path="/dashboard3"
                element={
                  <ProtectedRoute
                    element={Dashboard3}
                    allowedLevels={["B", "C"]}
                  />
                }
              /> */}
              <Route
                path="/dashboard4A"
                element={
                  <ProtectedRoute
                    element={Dashboard4A}
                    allowedLevels={["B", "C"]}
                  />
                }
              />
              <Route
                path="/dashboard4B"
                element={
                  <ProtectedRoute
                    element={Dashboard4B}
                    allowedLevels={["B", "C"]}
                  />
                }
              />
              {/* <Route path="/dashboard5A" element={<Dashboard5A />} /> */}
              <Route
                path="/dashboard5A"
                element={
                  <ProtectedRoute
                    element={Dashboard5A}
                    allowedLevels={["B", "C"]}
                  />
                }
              />
              {/* <Route path="/dashboard5B" element={<Dashboard5B />} /> */}
              <Route
                path="/dashboard5B"
                element={
                  <ProtectedRoute
                    element={Dashboard5B}
                    allowedLevels={["B", "C"]}
                  />
                }
              />
              <Route path="/dashboard6" element={<Dashboard6 />} />
              {/* <Route
                path="/dashboard6"
                element={
                  <ProtectedRoute
                    element={Dashboard6}
                    allowedLevels={["B", "C"]}
                  />
                }
              /> */}
              {/* <Route path="/upload" element={<Upload />} /> */}
              <Route
                path="/upload"
                element={
                  <ProtectedRoute element={Upload} allowedLevels={["B", "C"]} />
                }
              />
              {/* <Route path="/admin" element={<Admin />} /> */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute element={Admin} allowedLevels={["C"]} />
                }
              />
              <Route path="/callback" element={<Callback />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
