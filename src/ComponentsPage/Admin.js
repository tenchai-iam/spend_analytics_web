import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import "../ComponentsStyles/Dashboard.css";
import "../ComponentsStyles/Admin.css";
import NavbarComponent from "../ComponentsPage/NavbarComponent";

const Admin = () => {
  return (
    <div>
      <NavbarComponent />
      <div className="text-dropdown-container">
        <h1 className="header-title">ดูแลระบบ</h1>
      </div>
    </div>
  );
};

export default Admin;
