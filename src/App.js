import "./styles.css";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./Home";
import Dashboard1 from "./ComponentsPage/Dashboard1";
import Dashboard2 from "./ComponentsPage/Dashboard2X";
import Dashboard3 from "./ComponentsPage/Dashboard3";
import Dashboard4 from "./ComponentsPage/Dashboard4N";
import Upload from "./ComponentsPage/Upload";
import ProtectedRoute from "./services/ProtectedRoute.js";
import Callback from "./services/Callback.js";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<ProtectedRoute element={Home} />} />
            <Route path="/dashboard1" element={<ProtectedRoute element={Dashboard1} />} />
            <Route path="/dashboard2" element={<ProtectedRoute element={Dashboard2} />} />
            <Route path="/dashboard3" element={<ProtectedRoute element={Dashboard3} />} />
            <Route path="/dashboard4" element={<ProtectedRoute element={Dashboard4} />} />
            <Route path="/upload" element={<ProtectedRoute element={Upload} />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}
