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
  getCurrentInventoryMonth,
  getTargetInventoryDay,
  getCurrentInventoryDay,
  getD6Month,
} from "../services/api_D6.js";

const Dashboard6 = () => {
  const [selectedYear, setSelectedYear] = useState(""); // State to hold the selected year
  const [selectedMonth, setSelectedMonth] = useState(""); // State to hold the selected year
  const [selectedCategory, setSelectedCategory] = useState("999"); // State to hold the selected category id
  const [selectedButton, setSelectedButton] = useState(0); // Track selected button index
  const [currentBarView, setCurrentBarView] = useState(1); // State to toggle between card and graph view

  // Fetch available years using React Query
  const { data: yearsData, isLoading } = useQuery({
    queryKey: ["years"],
    queryFn: getYears,
  });

  const { data: monthData, isLoading: isLoadingMonth } = useQuery({
    queryKey: ["month", selectedYear],
    queryFn: () => getD6Month(selectedYear), // API call to fetch data
    enabled: Boolean(selectedYear), // Only run query if selectedYear is valid
  });

  // Extract month array from the API response
  const months = monthData?.MONTH || [];

  // Set the default year to the most recent one
  useEffect(() => {
    if (yearsData && yearsData.years.length > 0) {
      const mostRecentYear = Math.max(...yearsData.years); // Get the most recent year
      setSelectedYear(mostRecentYear.toString()); // Set as default selected year
    }
  }, [yearsData]);

  // Category labels
  // const categories = [
  //   "ทุกพัสดุ",
  //   "ผลิตภัณฑ์คอนกรีต",
  //   "หม้อแปลง",
  //   "มิเตอร์",
  //   "ลูกถ้วย และ เคเบิลสเปเซอร์",
  //   "สายไฟ",
  //   "อลูมิเนียมอินกอท",
  //   "ดรอพเอาท์ ฟิวส์คัทเอาท์",
  //   "ล่อฟ้า",
  //   "คาปาซิเตอร์",
  //   "รีโคลสเซอร์",
  //   "สวิตซ์",
  //   "พัสดุรอง/อุปกรณ์ประกอบ",
  //   "อื่นๆ",
  // ];

  // Fetch target inventory data for selected year, month and category using React Query
  const {
    data: previousMonthInventory,
    isLoading: isLoadingPreviousMonthInventory,
    isError: isErrorPreviousMonthInventory,
    error: errorPreviousMonthInventory,
  } = useQuery({
    queryKey: [
      "previousMonthInventory",
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
    previousMonthInventory?.inventory_data.map((item) => ({
      EKGRP: item.EKGRP, // Map EKGRP directly
      amtused_MT: item.total_AMTUSED / 1000000, // Convert amtused to millions
      amtused_MA: 0,
    })) || [];

  const {
    data: currentMonthInventory,
    isLoading: isLoadingCurrentMonthInventory,
    isError: isErrorCurrentMonthInventory,
    error: errorCurrentMonthInventory,
  } = useQuery({
    queryKey: [
      "currentMonthInventory",
      selectedYear,
      selectedMonth,
      selectedCategory,
    ], // Unique query key for caching
    queryFn: () =>
      getCurrentInventoryMonth(selectedYear, selectedMonth, selectedCategory), // API call to fetch data based on year and category are selected
    enabled:
      Boolean(selectedYear) &&
      Boolean(selectedMonth) &&
      Boolean(selectedCategory), // Only run query if year, month and category are selected
  });

  const dataCurrentMonthInventory =
    currentMonthInventory?.inventory_data.map((item) => ({
      EKGRP: item.EKGRP, // Map EKGRP directly
      amtused_MT: 0,
      amtused_MA: item.total_inventory / 1000000, // Convert amtused to millions
    })) || [];

  // Merge the two datasets by EKGRP
  const dataMonthInventory = [
    ...dataPreviousMonthInventory,
    ...dataCurrentMonthInventory,
  ].reduce((acc, curr) => {
    const existingItem = acc.find((item) => item.EKGRP === curr.EKGRP);
    if (existingItem) {
      existingItem.amtused_MT += curr.amtused_MT;
      existingItem.amtused_MA += curr.amtused_MA;
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);

  // get data for inventory day graph
  const {
    data: targetDayInventory,
    isLoading: isLoadingTargetDayInventory,
    isError: isErrorTargetDayInventory,
    error: errorTargetDayInventory,
  } = useQuery({
    queryKey: ["targetDayInventory", selectedYear, selectedCategory], // Unique query key for caching
    queryFn: () => getTargetInventoryDay(selectedYear, selectedCategory), // API call to fetch data based on year and category are selected
    enabled: Boolean(selectedYear) && Boolean(selectedCategory), // Only run query if year, month and category are selected
  });

  const dataTargetDayInventory =
    targetDayInventory?.inventory_data.map((item) => ({
      EKGRP: item.EKGRP, // Map EKGRP directly
      amtused_MT: item.total_AMTUSED / 1000000, // Convert amtused to millions
      amtused_MA: 0,
    })) || [];

  const {
    data: currentDayInventory,
    isLoading: isLoadingCurrentDayInventory,
    isError: isErrorCurrentDayInventory,
    error: errorCurrentDayInventory,
  } = useQuery({
    queryKey: ["currentDayInventory", selectedYear, selectedCategory], // Unique query key for caching
    queryFn: () => getCurrentInventoryDay(selectedYear, selectedCategory), // API call to fetch data based on year and category are selected
    enabled: Boolean(selectedYear) && Boolean(selectedCategory), // Only run query if year, month and category are selected
  });

  const dataCurrentDayInventory =
    currentDayInventory?.inventory_data.map((item) => ({
      EKGRP: item.EKGRP, // Map EKGRP directly
      amtused_MT: 0,
      amtused_MA: item.total_AMTUSED / 1000000, // Convert amtused to millions,
    })) || [];

  // Merge the two datasets by EKGRP
  const dataDayInventory = [
    ...dataTargetDayInventory,
    ...dataCurrentDayInventory,
  ].reduce((acc, curr) => {
    const existingItem = acc.find((item) => item.EKGRP === curr.EKGRP);
    if (existingItem) {
      existingItem.amtused_MT += curr.amtused_MT;
      existingItem.amtused_MA += curr.amtused_MA;
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);

  const handleViewChange = (view) => {
    setCurrentBarView(view); // Change to the selected view
  };

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
        <div className="chart-button-group">
          <button
            className={`chart-button ${currentBarView === 1 ? "active" : ""}`}
            onClick={() => handleViewChange(1)}
          >
            มูลค่าพัสดุคงคลังต่อวัน
          </button>
          <button
            className={`chart-button ${currentBarView === 2 ? "active" : ""}`}
            onClick={() => handleViewChange(2)}
          >
            มูลค่าพัสดุคงคลังต่อเดือน
          </button>
          {/* <button
            className={`chart-button ${currentBarView === 3 ? "active" : ""}`}
            onClick={() => handleViewChange(3)}
          >
            เรียงลำดับตามมูลค่าจัดซื้อต่อ PO
          </button> */}
        </div>
        <div className="D6-bar-chart-container">
          {currentBarView === 1 && (
            <>
              <D6BarGraphReV
                data={dataDayInventory}
                xAxisKey="EKGRP"
                barKeys={["amtused_MT", "amtused_MA"]}
                title={"รายงานมูลค่าพัสดุคงคลังต่อวัน"}
                height={330}
              />
              <p className="mat-legend">▬▬ เป้าหมายมูลค่าพัสดุคงคลัง</p>
              <p className="nonMat-legend">▬▬ มูลค่าพัสดุคงคลังปัจจุบัน</p>
            </>
          )}
          {currentBarView === 2 && (
            <>
              <div className="dropdown-download-container">
                <div className="dropdown-container">
                  {isLoadingMonth ? (
                    <p>Loading Month...</p>
                  ) : (
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      <option value="" disabled>
                        เลือกเดือนที่ต้องการ
                      </option>
                      {months.map((month, index) => (
                        <option key={index} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <D6BarGraphReV
                data={dataMonthInventory}
                xAxisKey="EKGRP"
                barKeys={["amtused_MT", "amtused_MA"]}
                title={"รายงานมูลค่าพัสดุคงคลังต่อเดือน"}
                height={330}
              />
              <p className="mat-legend">▬▬ เป้าหมายมูลค่าพัสดุคงคลัง</p>
              <p className="nonMat-legend">▬▬ มูลค่าพัสดุคงคลังปัจจุบัน</p>
            </>
          )}
        </div>
        <div className="D6-inventory-table"></div>
        <div className="D6-inflowoutflow-table"></div>
      </div>
    </div>
  );
};

export default Dashboard6;
