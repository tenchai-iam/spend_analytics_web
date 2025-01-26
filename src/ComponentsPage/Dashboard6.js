import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import "../ComponentsStyles/Dashboard.css";
import "../ComponentsStyles/Dashboard6.css";
import NavbarComponent from "../ComponentsPage/NavbarComponent";
import YearDropdown from "./YearDropdown";
import D6BarGraphReV from "./D6BarGraphReV.js";
import { getYears, getDateInfo } from "../services/api.js"; // Import your API service function
import {
  getPreviousInventoryMonth,
  getInventoryMonth,
} from "../services/api_D6.js";

const Dashboard6 = () => {
  const [selectedYear, setSelectedYear] = useState("2025"); // State to hold the selected year
  const [selectedMonth, setSelectedMonth] = useState("1"); // State to hold the selected year
  const [selectedCategory, setSelectedCategory] = useState("100"); // State to hold the selected category id
  const [selectedButton, setSelectedButton] = useState(0); // Track selected button index
  const [isMonthView, setIsMonthView] = useState(true); // State to toggle between card and graph view

  // Fetch available years using React Query
  const { data: yearsData, isLoading } = useQuery({
    queryKey: ["years"],
    queryFn: getYears,
  });

  // Set the default year to the most recent one
  useEffect(() => {
    if (yearsData && yearsData.years.length > 0) {
      const mostRecentYear = Math.max(...yearsData.years); // Get the most recent year
      setSelectedYear(mostRecentYear.toString()); // Set as default selected year
    }
  }, [yearsData]);

  // Category labels
  const categories = [
    "ทุกพัสดุ",
    "ผลิตภัณฑ์คอนกรีต",
    "หม้อแปลง",
    "มิเตอร์",
    "ลูกถ้วย และ เคเบิลสเปเซอร์",
    "สายไฟ",
    "อลูมิเนียมอินกอท",
    "ดรอพเอาท์ ฟิวส์คัทเอาท์",
    "ล่อฟ้า",
    "คาปาซิเตอร์",
    "รีโคลสเซอร์",
    "สวิตซ์",
    "พัสดุรอง/อุปกรณ์ประกอบ",
    "อื่นๆ",
  ];

  // Fetch target inventory data for selected year, month and category using React Query
  const {
    data: PreviousMonthInventory,
    isLoading: isLoadingPreviousMonthInventory,
    isError: isErrorPreviousMonthInventory,
    error: errorPreviousMonthInventory,
  } = useQuery({
    queryKey: [
      "PreviousMonthInventory",
      selectedYear,
      selectedMonth,
      selectedCategory,
    ], // Unique query key for caching
    queryFn: () =>
      getPreviousInventoryMonth(selectedYear, selectedMonth, selectedCategory), // API call to fetch data based on year and category are selected
    enabled:
      Boolean(selectedYear) &&
      Boolean(selectedMonth) &&
      Boolean(selectedCategory), // Only run query if year, month and category are selected
  });

  const dataPreviousMonthInventory =
    PreviousMonthInventory?.inventory_data.map((item) => ({
      EKGRP: item.EKGRP, // Map EKGRP directly
      amtused: item.amtused / 1000000, // Convert amtused to millions
    })) || [];

  return (
    <div>
      <NavbarComponent />
      <div className="text-dropdown-container">
        <h1 className="header-title">ภาพรวมมูลค่าพัสดุคงคลัง</h1>
        <div className="year-dropdown-container">
          <YearDropdown
            onSelectYear={setSelectedYear}
            selectedYear={selectedYear}
          />
        </div>
      </div>
      <div className="dashboard-container">
        {/* <div className="btn-container"></div> */}
        <div className="D6-bar-chart-container">
          <p>หมายเหตุ: หน่วยมูลค่าจัดซื้อเป็นหน่วยล้านบาท</p>
          <D6BarGraphReV
            data={dataPreviousMonthInventory}
            xAxisKey="EKGRP"
            barKey="amtused"
            title={" "}
            height={330}
          />
        </div>
        <div className="D6-inventory-table"></div>
        <div className="D6-inflowoutflow-table"></div>
      </div>
    </div>
  );
};

export default Dashboard6;
