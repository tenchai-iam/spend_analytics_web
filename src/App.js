import "./styles.css";
import React from "react";
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

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home page route */}
          <Route path="/" element={<Home />} />
          {/* Dashboard routes */}
          <Route path="/dashboard1" element={<Dashboard1 />} />
          <Route path="/dashboard2" element={<Dashboard2 />} />
          <Route path="/dashboard3" element={<Dashboard3 />} />
          <Route path="/dashboard4" element={<Dashboard4 />} />

          {/* Upload route */}
          <Route path="/upload" element={<Upload />} />

          {/* Redirect any undefined route to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}
