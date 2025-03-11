import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import "../ComponentsStyles/Dashboard.css";
import "../ComponentsStyles/Dashboard5.css";
import NavbarComponent from "./NavbarComponent.js";
import YearDropdownD5 from "./YearDropdownD5.js";
import D5GroupBarRe from "./D5GroupBarRe.js";
import TableD5Value from "./TableD5Value.js";
import { getDateInfo } from "../services/api.js"; // Import your API service function
import {
  getYearsD5,
  getPlannedValue,
  getPlannedValueSummary,
  getUnplannedValue,
  getUnplannedValueSummary,
} from "../services/api_D5.js";

const API_URL = process.env.REACT_APP_API_URL; // Ensure it's defined

const Dashboard5A = () => {
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
    data: plannedValueS,
    isLoading: isLoadingPlannedValueS,
    isError: isErrorPlannedValueS,
    error: errorPlannedValueS,
  } = useQuery({
    queryKey: ["plannedValueS", selectedYear], // Unique query key for caching
    queryFn: () => getPlannedValueSummary(selectedYear), // API call to fetch data based on year selected
    enabled: Boolean(selectedYear), // Only run query if year are selected
  });

  const dataPlannedValueSummary = plannedValueS
    ? plannedValueS.map((item) => ({
        base: item.BASE / 1_000_000, // Convert BASE to millions
        normalized: item.NORMALIZED / 1_000_000, // Convert NORMALIZED to millions
        actual: item.ACTUAL / 1_000_000, // Convert ACTUAL to millions
        diff_base_nor: item.DIF_NORMALIZED_BASE / 1_000_000,
        diff_actual_nor: item.DIFF_ACTUAL_NORMALIZED / 1_000_000,
        cat_group: item.cat_group,
      }))
    : []; // Default to an empty array if no data is available

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

  // Fetch planned value data for selected year using React Query
  const {
    data: unplannedValueS,
    isLoading: isLoadingUnplannedValueS,
    isError: isErrorUnplannedValueS,
    error: errorUnplannedValueS,
  } = useQuery({
    queryKey: ["unplannedValueS", selectedYear], // Unique query key for caching
    queryFn: () => getUnplannedValueSummary(selectedYear), // API call to fetch data based on year selected
    enabled: Boolean(selectedYear), // Only run query if year are selected
  });

  const dataUnplannedValueSummary = unplannedValueS
    ? unplannedValueS.map((item) => ({
        base: item.BASE / 1_000_000, // Convert BASE to millions
        normalized: item.NORMALIZED / 1_000_000, // Convert NORMALIZED to millions
        actual: item.ACTUAL / 1_000_000, // Convert ACTUAL to millions
        diff_base_nor: item.DIF_NORMALIZED_BASE / 1_000_000,
        diff_actual_nor: item.DIFF_ACTUAL_NORMALIZED / 1_000_000,
        cat_group: item.cat_group,
      }))
    : []; // Default to an empty array if no data is available

  const getButtonStyle = (isSelected) => ({
    backgroundColor: isSelected ? "#8e44ad" : "#f0f0f0",
    color: isSelected ? "white" : "black",
    textDecoration: "none", // Remove underline
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "10px 15px",
    cursor: "pointer",
    textAlign: "center",
    display: "inline-block", // Ensure button-like appearance
  });

  const handleDownloadPlan = async () => {
    try {
      const response = await fetch(
        `${API_URL}/planned_PI_stage5_value_detail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ year: selectedYear }), // Send selected year in the request body
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Planned_PI_data_${selectedYear}.xlsx`; // Name file with year
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleDownloadUnplan = async () => {
    try {
      const response = await fetch(
        `${API_URL}/unplanned_PI_stage5_value_detail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ year: selectedYear }), // Send selected year in the request body
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Unplanned_PI_data_${selectedYear}.xlsx`; // Name file with year
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div>
      <NavbarComponent />
      <div className="text-dropdown-container">
        <h1 className="header-title">ติดตามมูลค่า Stage 5 งบ P&I และอื่นๆ</h1>
        <div className="year-dropdown-container">
          <YearDropdownD5
            onSelectYear={setSelectedYear}
            selectedYear={selectedYear}
          />
        </div>
      </div>
      <div className="dashboard-container">
        <div className="D6-bar-chart-container">
          <div className="download-container">
            <div className="download-button">
              <button
                onClick={handleDownloadPlan}
                style={getButtonStyle(false)}
              >
                Download Planned Data
              </button>
            </div>
          </div>
          <D5GroupBarRe
            title={`มูลค่า Stage 5 - Planned ในปี ${selectedYear} (ล้านบาท)`}
            data={dataPlannedValue}
            barKeys={["base", "normalized", "actual"]}
          />
          <TableD5Value data={dataPlannedValueSummary} />
        </div>
        <div className="D6-bar-chart-container">
          <div className="download-container">
            <div className="download-button">
              <button
                onClick={handleDownloadUnplan}
                style={getButtonStyle(false)}
              >
                Download Unplanned Data
              </button>
            </div>
          </div>
          <D5GroupBarRe
            title={`มูลค่า Stage 5 - Unplanned ในปี ${selectedYear} (ล้านบาท)`}
            data={dataUnplannedValue}
            barKeys={["base", "normalized", "actual"]}
          />
          <TableD5Value data={dataUnplannedValueSummary} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard5A;
