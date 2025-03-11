import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import "../ComponentsStyles/Dashboard.css";
import "../ComponentsStyles/Dashboard5.css";
import NavbarComponent from "./NavbarComponent.js";
import YearDropdownD5 from "./YearDropdownD5.js";
import D5GroupBarRe from "./D5GroupBarRe.js";
import { getDateInfo } from "../services/api.js"; // Import your API service function
import {
  getYearsD5,
  getPlannedValue,
  getUnplannedValue,
} from "../services/api_D5.js";

const Dashboard5B = () => {
  const [selectedYear, setSelectedYear] = useState(""); // State to hold the selected year

  // Fetch available years using React Query
  const { data: yearsData, isLoading } = useQuery({
    queryKey: ["years"],
    queryFn: getYearsD5,
  });

  // Fetch planned value data for selected year using React Query
  const {
    data: plannedValue,
    isLoading: isLoadingPlannedValue,
    isError: isErrorPlannedValue,
    error: errorPlannedValue,
  } = useQuery({
    queryKey: ["plannedValue", selectedYear], // Unique query key for caching
    queryFn: () => getPlannedValue(selectedYear), // API call to fetch data based on year selected
    enabled: Boolean(selectedYear), // Only run query if year are selected
  });

  const dataPlannedValue = plannedValue
    ? {
        base: plannedValue.BASE / 1000000, // Convert BASE to millions
        normalized: plannedValue.NORMALIZED / 1000000, // Convert NORMALIZED to millions
        actual: plannedValue.ACTUAL / 1000000, // Convert ACTUAL to millions
      }
    : {}; // Default to an empty object if no data is fetched or available

  // Fetch planned value data for selected year using React Query
  const {
    data: unplannedValue,
    isLoading: isLoadingUnplannedValue,
    isError: isErrorUnplannedValue,
    error: errorUnplannedValue,
  } = useQuery({
    queryKey: ["unplannedValue", selectedYear], // Unique query key for caching
    queryFn: () => getUnplannedValue(selectedYear), // API call to fetch data based on year selected
    enabled: Boolean(selectedYear), // Only run query if year are selected
  });

  const dataUnplannedValue = unplannedValue
    ? {
        base: unplannedValue.BASE / 1000000, // Convert BASE to millions
        normalized: unplannedValue.NORMALIZED / 1000000, // Convert NORMALIZED to millions
        actual: unplannedValue.ACTUAL / 1000000, // Convert ACTUAL to millions
      }
    : {}; // Default to an empty object if no data is fetched or available

  return (
    <div>
      <NavbarComponent />
      <div className="text-dropdown-container">
        <h1 className="header-title">ติดตามมูลค่า Stage 5 งบ C</h1>
        <div className="year-dropdown-container">
          <YearDropdownD5
            onSelectYear={setSelectedYear}
            selectedYear={selectedYear}
          />
        </div>
      </div>
      <div className="dashboard-container">
        <div className="D6-bar-chart-container">
          {/* <D5GroupBarRe
            title={`มูลค่า Stage 5 - Planned ในปี ${selectedYear}`}
            data={dataPlannedValue}
            barKeys={["base", "normalized", "actual"]}
          /> */}
        </div>
        <div className="D6-bar-chart-container">
          {/* <D5GroupBarRe
            title={`มูลค่า Stage 5 - Unplanned ในปี ${selectedYear}`}
            data={dataUnplannedValue}
            barKeys={["base", "normalized", "actual"]}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard5B;
