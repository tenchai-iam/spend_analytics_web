import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { downloadXLSX, formatters } from "../utils/downloadXLSX";


import NavbarComponent from "../ComponentsPage/NavbarComponent";
import YearDropdown from "./YearDropdown";
import D6BarGraphReV from "./D6BarGraphReV.js";
import { getYears, getDateInfo } from "../services/api.js"; // Import your API service function
import {
  getTargetInventoryMonth,
  getCurrentInventoryMonth,
  getTargetInventoryMonthPlant,
  getCurrentInventoryMonthPlant,
  getTargetInventoryDay,
  getCurrentInventoryDay,
  getTargetInventoryDayPlant,
  getCurrentInventoryDayPlant,
  getD6Month,
} from "../services/api_D6.js";

import "../ComponentsStyles/Dashboard.css";
import "../ComponentsStyles/Dashboard6.css";

const Dashboard6 = () => {
  const [selectedYear, setSelectedYear] = useState(""); // State to hold the selected year
  const [selectedMonth, setSelectedMonth] = useState(""); // State to hold the selected year
  const [selectedCategory, setSelectedCategory] = useState("999"); // State to hold the selected category id
  const [selectedButton, setSelectedButton] = useState(0); // Track selected button index
  const [currentBarView, setCurrentBarView] = useState(1); // State to toggle between card and graph view

  const formatValue = formatters.quantity;

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

  const options = [
    { label: "กฟน.1", value: "A" },
    { label: "กฟน.2", value: "B" },
    { label: "กฟน.3", value: "C" },
    { label: "กฟฉ.1", value: "D" },
    { label: "กฟฉ.2", value: "E" },
    { label: "กฟฉ.3", value: "F" },
    { label: "กฟก.1", value: "G" },
    { label: "กฟก.2", value: "H" },
    { label: "กฟก.3", value: "I" },
    { label: "กฟต.1", value: "J" },
    { label: "กฟต.2", value: "K" },
    { label: "กฟต.3", value: "L" },
    { label: "ส่วนกลาง", value: "Z" },
  ];

  const ekgrpLabelMap = options.reduce((acc, cur) => {
    acc[cur.value] = cur.label;
    return acc;
  }, {});

  const [selectedDistrict, setSelectedDistrict] = useState("");

  const handleChangeDistrict = (event) => {
    setSelectedDistrict(event.target.value);
  };

  // Fetch target inventory data for selected year, month and category using React Query
  const {
    data: targetInventoryMonth,
    isLoading: isLoadingTargetInventoryMonth,
    isError: isErrorTargetInventoryMonth,
    error: errorTargetInventoryMonth,
  } = useQuery({
    queryKey: ["targetInventoryMonth", selectedYear], // Unique query key for caching
    queryFn: () => getTargetInventoryMonth(selectedYear), // API call to fetch data based on year and category are selected
    enabled: Boolean(selectedYear), // Only run query if year, month and category are selected
  });

  const dataTargetInventoryMonth =
    targetInventoryMonth?.inventory_data.map((item) => ({
      EKGRP: item.EKGRP, // Map EKGRP directly
      amtused_MT: item.amtused / 1000000, // Convert amtused to millions
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

    const dataMonthInventory = [
      ...dataTargetInventoryMonth,
      ...dataCurrentMonthInventory,
    ].reduce((acc, curr) => {
      const existingItem = acc.find((item) => item.EKGRP === curr.EKGRP);
      if (existingItem) {
        existingItem.amtused_MT += curr.amtused_MT;
        existingItem.amtused_MA += curr.amtused_MA;
      } else {
        acc.push({
          ...curr,
          // label: ekgrpLabelMap[curr.EKGRP] || curr.EKGRP, // Add label here
        });
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
    queryKey: ["targetDayInventory", selectedYear], // Unique query key for caching
    queryFn: () => getTargetInventoryDay(selectedYear), // API call to fetch data based on year and category are selected
    enabled: Boolean(selectedYear), // Only run query if year, month and category are selected
  });

  const dataTargetDayInventory =
    targetDayInventory?.inventory_data.map((item) => ({
      EKGRP: item.EKGRP, // Map EKGRP directly
      amtused_MT: item.amtused / 1000000, // Convert amtused to millions
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

  const {
    data: targetInventoryMonthPlant,
    isLoading: isLoadingTargetInventoryMonthPlant,
    isError: isErrorTargetInventoryMonthPlant,
    error: errorTargetInventoryMonthPlant,
  } = useQuery({
    queryKey: ["targetInventoryMonthPlant", selectedYear, selectedDistrict], // Unique query key for caching
    queryFn: () => getTargetInventoryMonthPlant(selectedYear, selectedDistrict), // API call to fetch data based on year and district are selected
    enabled:
      Boolean(selectedYear) &&
      Boolean(selectedMonth) &&
      Boolean(selectedDistrict), // Only run query if year, month and district are selected
  });

  const dataTargetInventoryMonthPlant =
    targetInventoryMonthPlant?.inventory_data.map((item) => ({
      EKGRP: item.EKGRP, // Map EKGRP directly
      amtused_MT: item.amtused / 1000000, // Convert amtused to millions
      amtused_MA: 0,
    })) || [];

  const {
    data: currentMonthInventoryPlant,
    isLoading: isLoadingCurrentMonthInventoryPlant,
    isError: isErrorCurrentMonthInventoryPlant,
    error: errorCurrentMonthInventoryPlant,
  } = useQuery({
    queryKey: [
      "currentMonthInventoryPlant",
      selectedYear,
      selectedMonth,
      selectedCategory,
      selectedDistrict,
    ], // Unique query key for caching
    queryFn: () =>
      getCurrentInventoryMonthPlant(
        selectedYear,
        selectedMonth,
        selectedCategory,
        selectedDistrict
      ), // API call to fetch data based on year and category are selected
    enabled:
      Boolean(selectedYear) &&
      Boolean(selectedMonth) &&
      Boolean(selectedCategory) &&
      Boolean(selectedDistrict), // Only run query if year, month and category are selected
  });

  const dataCurrentMonthInventoryPlant =
    currentMonthInventoryPlant?.inventory_data.map((item) => ({
      EKGRP: item.EKGRP, // Map EKGRP directly
      amtused_MT: 0,
      amtused_MA: item.total_inventory / 1000000, // Convert amtused to millions
    })) || [];

  // Merge the two datasets by EKGRP
  const dataMonthInventoryPlant = [
    ...dataTargetInventoryMonthPlant,
    ...dataCurrentMonthInventoryPlant,
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
    data: targetDayInventoryPlant,
    isLoading: isLoadingTargetDayInventoryPlant,
    isError: isErrorTargetDayInventoryPlant,
    error: errorTargetDayInventoryPlant,
  } = useQuery({
    queryKey: ["targetDayInventoryPlant", selectedYear, selectedDistrict], // Unique query key for caching
    queryFn: () => getTargetInventoryDayPlant(selectedYear, selectedDistrict), // API call to fetch data based on year and category are selected
    enabled: Boolean(selectedYear) && Boolean(selectedDistrict), // Only run query if year, month and category are selected
  });

  const dataTargetDayInventoryPlant =
    targetDayInventoryPlant?.inventory_data.map((item) => ({
      EKGRP: item.EKGRP, // Map EKGRP directly
      amtused_MT: item.amtused / 1000000, // Convert amtused to millions
      amtused_MA: 0,
    })) || [];

  const {
    data: currentDayInventoryPlant,
    isLoading: isLoadingCurrentDayInventoryPlant,
    isError: isErrorCurrentDayInventoryPlant,
    error: errorCurrentDayInventoryPlant,
  } = useQuery({
    queryKey: [
      "currentDayInventoryPlant",
      selectedYear,
      selectedCategory,
      selectedDistrict,
    ], // Unique query key for caching
    queryFn: () =>
      getCurrentInventoryDayPlant(
        selectedYear,
        selectedCategory,
        selectedDistrict
      ), // API call to fetch data based on year and category are selected
    enabled:
      Boolean(selectedYear) &&
      Boolean(selectedCategory) &&
      Boolean(selectedDistrict), // Only run query if year, month and category are selected
  });

  const dataCurrentDayInventoryPlant =
    currentDayInventoryPlant?.inventory_data.map((item) => ({
      EKGRP: item.EKGRP, // Map EKGRP directly
      amtused_MT: 0,
      amtused_MA: item.total_inventory / 1000000, // Convert amtused to millions,
    })) || [];

  // Merge the two datasets by EKGRP
  const dataDayInventoryPlant = [
    ...dataTargetDayInventoryPlant,
    ...dataCurrentDayInventoryPlant,
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

  // ###########################################################


  const dayInvHeaders = [
    { label: "สังกัด", key: "EKGRP" },
    { label: `เป้าหมายมูลค่าพัสดุคงคลังโดยใช้ 86% ของมูลค่าพัสดุของเดือน ${dateInfoData?.month} ปี ${selectedYear - 1}`, key: "amtused_MT" },
    { label: `มูลค่าพัสดุคงคลัง ณ วันที่ ${dateInfoData?.day}/${dateInfoData?.month}/${dateInfoData?.year}`, key: "amtused_MA" },
  ];

  const downloadXLSX_DayInv = (data, headers, fileName, dateInfoData) => {
    downloadXLSX({
      data: data, // Use raw unformatted data
      headers,
      fileName,
      title: `รายงานมูลค่าพัสดุคงคลังรายวัน (ล้านบาท)`,
      filters: [],
      dateInfo: dateInfoData,
      preserveRawNumbers: true,
      columnTypes: {
        0: "text",     // สังกัด
        1: "number",   // เป้าหมายมูลค่าพัสดุคงคลัง
        2: "number",   // มูลค่าพัสดุคงคลัง
      },
    });
  };

// ###########################################################

const monthInvHeaders = [
  { label: "สังกัด", key: "EKGRP" },
  { label: `เป้าหมายมูลค่าพัสดุคงคลัง ณ สิ้นปี ${dateInfoData?.year}`, key: "amtused_MT" },
  { label: `มูลค่าพัสดุคงคลัง ณ สิ้นเดือน ${selectedMonth}`, key: "amtused_MA" },
];

const downloadXLSX_MonthInv = (data, headers, fileName, dateInfoData) => {
  downloadXLSX({
    data: data, // Use raw unformatted data
    headers,
    fileName,
    title: `รายงานมูลค่าพัสดุคงคลัง ณ สิ้นเดือน ${selectedMonth}/${dateInfoData?.year} (ล้านบาท)`,
    filters: [],
    dateInfo: dateInfoData,
    preserveRawNumbers: true,
    columnTypes: {
      0: "text",     // สังกัด
      1: "number",   // เป้าหมายมูลค่าพัสดุคงคลัง
      2: "number",   // มูลค่าพัสดุคงคลัง
    },
  });
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
            <div className="download-container">
          <button
            onClick={() =>
              downloadXLSX_DayInv(
                dataDayInventory, // Data
                dayInvHeaders, // Headers
                `DayInv_${selectedYear}`, // File Name
                dateInfoData // Date Info
              )
            }
            style={getButtonStyle(false)} // Apply button style
          >
            Download XLSX
          </button>
        </div>
              <D6BarGraphReV
                data={dataDayInventory}
                xAxisKey="EKGRP"
                barKeys={["amtused_MT", "amtused_MA"]}
                title={"รายงานมูลค่าพัสดุคงคลังรายวัน (ล้านบาท)"}
                height={330}
              />
              <p className="mat-legend">
                ▬▬ เป้าหมายมูลค่าพัสดุคงคลังโดยใช้ 86% ของมูลค่าพัสดุของเดือน{" "}
                {dateInfoData?.month} ปี {selectedYear - 1}
              </p>
              <p className="nonMat-legend">
                ▬▬ มูลค่าพัสดุคงคลัง ณ วันที่ {dateInfoData?.day}/
                {dateInfoData?.month}/{dateInfoData?.year}
              </p>
              <div className="select-container">
                <select
                  value={selectedDistrict}
                  onChange={handleChangeDistrict}
                  className="border rounded-lg px-4 py-2"
                >
                  <option value="" disabled selected>
                    เลือกการไฟฟ้าเขต...
                  </option>
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <D6BarGraphReV
                data={dataDayInventoryPlant}
                xAxisKey="EKGRP"
                barKeys={["amtused_MT", "amtused_MA"]}
                title={"รายงานมูลค่าพัสดุคงคลังตามคลังพัสดุรายวัน (ล้านบาท)"}
                height={330}
              />
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
                <button
            onClick={() =>
              downloadXLSX_MonthInv(
                dataMonthInventory, // Data
                monthInvHeaders, // Headers
                `MonthInventory_${selectedMonth}_${dateInfoData?.year}`, // File Name
                dateInfoData // Date Info
              )
            }
            style={getButtonStyle(false)} // Apply button style
          >
            Download XLSX
          </button>
              </div>
              <D6BarGraphReV
                data={dataMonthInventory}
                xAxisKey="EKGRP"
                barKeys={["amtused_MT", "amtused_MA"]}
                title={"รายงานมูลค่าพัสดุคงคลังรายเดือน (ล้านบาท)"}
                height={330}
              />
              <p className="mat-legend">
                ▬▬ เป้าหมายมูลค่าพัสดุคงคลัง ณ สิ้นปี {selectedYear}
              </p>
              <p className="nonMat-legend">
                ▬▬ มูลค่าพัสดุคงคลังปัจจุบัน ณ สิ้นเดือน {selectedMonth} ปี{" "}
                {selectedYear}
              </p>
              <div className="select-container">
                <select
                  value={selectedDistrict}
                  onChange={handleChangeDistrict}
                  className="border rounded-lg px-4 py-2"
                >
                  <option value="" disabled selected>
                    เลือกการไฟฟ้าเขต...
                  </option>
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <D6BarGraphReV
                data={dataMonthInventoryPlant}
                xAxisKey="EKGRP"
                barKeys={["amtused_MT", "amtused_MA"]}
                title={"รายงานมูลค่าพัสดุคงคลังตามคลังพัสดุรายเดือน (ล้านบาท)"}
                height={330}
              />
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
