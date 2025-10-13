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
  getPlannedCValue,
  getPlannedCValueSummary,
  getUnplannedCValue,
  getUnplannedCValueSummary,
} from "../services/api_D5.js";

const API_URL = process.env.REACT_APP_API_URL; // Ensure it's defined

const Dashboard5B = () => {
  const [selectedYear, setSelectedYear] = useState(""); // State to hold the selected year

  // Fetch available years using React Query
  const { data: yearsData, isLoading } = useQuery({
    queryKey: ["YEARS"],
    queryFn: getYearsD5,
  });

  // Fetch planned value data for selected year using React Query
  const {
    data: plannedCValue,
    isLoading: isLoadingPlannedCValue,
    isError: isErrorPlannedCValue,
    error: errorPlannedCValue,
  } = useQuery({
    queryKey: ["plannedCValue", selectedYear], // Unique query key for caching
    queryFn: () => getPlannedCValue(selectedYear), // API call to fetch data based on year selected
    enabled: Boolean(selectedYear), // Only run query if year are selected
  });

  const dataPlannedCValue = plannedCValue
    ? {
        base: plannedCValue.BASE / 1000000, // Convert BASE to millions
        normalized: plannedCValue.NORMALIZED / 1000000, // Convert NORMALIZED to millions
        actual: plannedCValue.ACTUAL / 1000000, // Convert ACTUAL to millions
      }
    : {}; // Default to an empty object if no data is fetched or available

  // Fetch planned value data for selected year using React Query
  const {
    data: plannedCValueS,
    isLoading: isLoadingPlannedCValueS,
    isError: isErrorPlannedCValueS,
    error: errorPlannedCValueS,
  } = useQuery({
    queryKey: ["plannedCValueS", selectedYear], // Unique query key for caching
    queryFn: () => getPlannedCValueSummary(selectedYear), // API call to fetch data based on year selected
    enabled: Boolean(selectedYear), // Only run query if year are selected
  });

  const dataPlannedCValueSummary = plannedCValueS
    ? plannedCValueS.map((item) => ({
        base: item.BASE / 1_000_000, // Convert BASE to millions
        normalized: item.NORMALIZED / 1_000_000, // Convert NORMALIZED to millions
        actual: item.ACTUAL / 1_000_000, // Convert ACTUAL to millions
        diff_base_nor: item.DIFF_NORMALIZED_BASE / 1_000_000,
        diff_actual_nor: item.DIFF_ACTUAL_NORMALIZED / 1_000_000,
        cat_group: item.cat_group,
      }))
    : []; // Default to an empty array if no data is available

  // Fetch planned value data for selected year using React Query
  const {
    data: unplannedCValue,
    isLoading: isLoadingUnplannedCValue,
    isError: isErrorUnplannedCValue,
    error: errorUnplannedCValue,
  } = useQuery({
    queryKey: ["unplannedCValue", selectedYear], // Unique query key for caching
    queryFn: () => getUnplannedCValue(selectedYear), // API call to fetch data based on year selected
    enabled: Boolean(selectedYear), // Only run query if year are selected
  });

  const dataUnplannedCValue = unplannedCValue
    ? {
        base: unplannedCValue.BASE / 1000000, // Convert BASE to millions
        normalized: unplannedCValue.NORMALIZED / 1000000, // Convert NORMALIZED to millions
        actual: unplannedCValue.ACTUAL / 1000000, // Convert ACTUAL to millions
      }
    : {}; // Default to an empty object if no data is fetched or available

  // Fetch planned value data for selected year using React Query
  const {
    data: unplannedCValueS,
    isLoading: isLoadingUnplannedCValueS,
    isError: isErrorUnplannedCValueS,
    error: errorUnplannedCValueS,
  } = useQuery({
    queryKey: ["unplannedCValueS", selectedYear], // Unique query key for caching
    queryFn: () => getUnplannedCValueSummary(selectedYear), // API call to fetch data based on year selected
    enabled: Boolean(selectedYear), // Only run query if year are selected
  });

  console.log(unplannedCValueS);

  const dataUnplannedCValueSummary = Array.isArray(unplannedCValueS)
    ? unplannedCValueS.map((item) => ({
        base: item.BASE / 1_000_000,
        normalized: item.NORMALIZED / 1_000_000,
        actual: item.ACTUAL / 1_000_000,
        diff_base_nor: item.DIFF_NORMALIZED_BASE / 1_000_000,
        diff_actual_nor: item.DIFF_ACTUAL_NORMALIZED / 1_000_000,
        cat_group: item.cat_group,
      }))
    : [];

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
      const response = await fetch(`${API_URL}/planned_C_stage5_value_detail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ year: selectedYear }), // Send selected year in the request body
      });

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
        `${API_URL}/unplanned_C_stage5_value_detail`,
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

  const datadate = 1;

  // Fetch summary data for selected year and category using React Query
  const {
    data: dateInfoData,
    isLoading: isLoadingDateInfoData,
    isError,
    error,
  } = useQuery({
    queryKey: ["dateInfoData", datadate], // Unique query key for caching
    queryFn: () => getDateInfo(datadate), // API call to fetch data based on datadate
    enabled: !!selectedYear, // Only run query if both year and category_group are selected
  });

  return (
    <div>
      <NavbarComponent />
      <div className="text-dropdown-container">
        <h1 className="header-title">ติดตามมูลค่า Stage 5 งบ C และอื่นๆ</h1>
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
        <div>
          <h1 className="data-date">
            ข้อมูล ณ วันที่ {dateInfoData?.day}/{dateInfoData?.month}/
            {dateInfoData?.year}
          </h1>
          <p className="data-date">
            หมายเหตุ: ข้อมูลภายในระบบ Spend Insight เป็นข้อมูลภายในของกฟภ.
            ห้ามเผยแพร่ให้กับผู้ใช้งานภายนอก
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard5B;
