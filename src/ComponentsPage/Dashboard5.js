import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import "../ComponentsStyles/Dashboard.css";
import "../ComponentsStyles/Dashboard5.css";
import NavbarComponent from "../ComponentsPage/NavbarComponent";
import YearDropdown from "./YearDropdown";
import D5GroupBarRe from "../ComponentsPage/D5GroupBarRe";
import { getYears, getDateInfo } from "../services/api.js"; // Import your API service function
import { getPlannedValue, getUnplannedValue } from "../services/api_D5.js";

const Dashboard5 = () => {
  const [selectedYear, setSelectedYear] = useState(""); // State to hold the selected year

  // Fetch available years using React Query
  const { data: yearsData, isLoading } = useQuery({
    queryKey: ["years"],
    queryFn: getYears,
  });

  const dataPlannedValue = {
    base: 100,
    normalized: 50,
    actual: 25,
  };

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
      <div className="dashboard-container">
        <div className="D6-bar-chart-container">
          <D5GroupBarRe
            title="มูลค่า Stage 5 - Planned"
            data={dataPlannedValue}
            barKeys={["base", "normalized", "actual"]}
          />
        </div>
        <div className="D6-bar-chart-container">
          <D5GroupBarRe
            title="มูลค่า Stage 5 - Unplanned"
            data={dataPlannedValue}
            barKeys={["base", "normalized", "actual"]}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard5;
