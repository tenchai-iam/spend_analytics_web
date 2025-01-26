import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import "../ComponentsStyles/Dashboard.css";
import "../ComponentsStyles/Dashboard7.css";
import NavbarComponent from "../ComponentsPage/NavbarComponent";
import YearDropdown from "./YearDropdown";

const Dashboard7 = () => {
  const [selectedYear, setSelectedYear] = useState(""); // State to hold the selected year

  return (
    <div>
      <NavbarComponent />
      <div className="text-dropdown-container">
        <h1 className="header-title">ปรับแผนเพิ่มเติมระหว่างปี (งบ C)</h1>
        <div className="year-dropdown-container">
          <YearDropdown
            onSelectYear={setSelectedYear}
            selectedYear={selectedYear}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard7;
