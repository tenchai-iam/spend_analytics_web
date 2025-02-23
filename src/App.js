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
import Dashboard2 from "./ComponentsPage/Dashboard2X";
import Dashboard3 from "./ComponentsPage/Dashboard3";
import Dashboard4 from "./ComponentsPage/Dashboard4N";
import Dashboard5 from "./ComponentsPage/Dashboard5";
import Dashboard6 from "./ComponentsPage/Dashboard6";
import Dashboard7 from "./ComponentsPage/Dashboard7";
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
              <Route path="/" element={<Home />} />
              {/* <Route path="/" element={<ProtectedRoute element={Home} />} /> */}
              <Route
                path="/dashboard1"
                element={<ProtectedRoute element={Dashboard1} />}
              />
              <Route
                path="/dashboard2"
                element={<ProtectedRoute element={Dashboard2} />}
              />

              {/* Restrict access to Dashboard3 and Dashboard4 for user_level "B" */}
              <Route
                path="/dashboard3"
                element={
                  <ProtectedRoute element={Dashboard3} allowedLevels={["B"]} />
                }
              />
              <Route
                path="/dashboard4"
                element={
                  <ProtectedRoute element={Dashboard4} allowedLevels={["B"]} />
                }
              />

              <Route path="/dashboard5" element={<Dashboard5 />} />

              {/* <Route
                path="/dashboard5"
                element={<ProtectedRoute element={Dashboard5} />}
              /> */}

              <Route path="/dashboard6" element={<Dashboard6 />} />

              {/* <Route
                path="/dashboard6"
                element={<ProtectedRoute element={Dashboard6} />}
              /> */}
              <Route
                path="/dashboard7"
                element={
                  <ProtectedRoute element={Dashboard7} allowedLevels={["B"]} />
                }
              />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute element={Upload} allowedLevels={["B"]} />
                }
              />
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
