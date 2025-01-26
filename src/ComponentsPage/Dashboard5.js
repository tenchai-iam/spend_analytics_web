import React, { useState, useEffect } from "react";
import NavbarComponent from "../ComponentsPage/NavbarComponent";
import YearDropdown from "./YearDropdown";

const Dashboard5 = () => {
  const [selectedYear, setSelectedYear] = useState(""); // State to hold the selected year

  return (
    <div>
      <NavbarComponent />
      <div className="text-dropdown-container">
        <h1 className="header-title">ติดตามมูลค่า Stage 5</h1>
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

export default Dashboard5;
