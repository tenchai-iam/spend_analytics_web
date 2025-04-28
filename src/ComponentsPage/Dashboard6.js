import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";


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

  const formatValue = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value);

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

  // Function to format data for CSV export
  const formatDayInvCSVData = (data) => {
    if (!Array.isArray(data)) {
      console.error("Expected an array but received:", data);
      return []; // Avoid errors by returning an empty array
    }

    return data
    .filter((item) => item.EKGRP && item.amtused_MT != null && item.amtused_MA != null) // Ensure valid entries
      .map((item) => ({
        EKGRP: item.EKGRP,
        amtused_MT: formatValue(item.amtused_MT), // Material Number
        amtused_MA: formatValue(item.amtused_MA), // Convert "-" values to "0"

      }));
  };

  // Format CSV Data
  const csvTableDayInvData = formatDayInvCSVData(dataDayInventory);

  const csvTableDayInvHeaders = [
    { label: "สังกัด", key: "EKGRP" },
    { label: `เป้าหมายมูลค่าพัสดุคงคลังโดยใช้ 86% ของมูลค่าพัสดุของเดือน ${dateInfoData?.month} ปี ${selectedYear - 1}`, key: "amtused_MT" },
    { label: `มูลค่าพัสดุคงคลัง ณ วันที่ ${dateInfoData?.day}/${dateInfoData?.month}/${dateInfoData?.year}`, key: "amtused_MA" },
  ];

  const downloadXLSX_DayInv = (data, headers, fileName, dateInfoData) => {
    // Format data with headers
    const formattedData = data.map((item) =>
      headers.reduce((acc, header) => {
        acc[header.label] = item[header.key];
        return acc;
      }, {})
    );

    // Define the number of extra rows
    const extraRowsAbove = Array(3).fill({}); // 7 rows above the table
    const extraRowsBelow = Array(2).fill({}); // 2 rows below the table

    // Combine all rows: extra rows above, header, data, and extra rows below
    const headerRow = headers.reduce((acc, header) => {
      acc[header.label] = header.label; // Add headers as keys
      return acc;
    }, {});
    const fullData = [
      ...extraRowsAbove,
      headerRow,
      ...formattedData,
      ...extraRowsBelow,
    ];

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(fullData, { skipHeader: true });
    const workbook = XLSX.utils.book_new();

    // Add merges for title row and rows below
    const numColumns = headers.length; // Number of columns in the dataset
    worksheet["!merges"] = [
      { s: { r: 1, c: 0 }, e: { r: 1, c: numColumns - 1 } }, // Merge title row
      {
        s: { r: fullData.length - 1, c: 0 },
        e: { r: fullData.length - 1, c: numColumns - 1 },
      }, // Merge info row
    ];

    // Add text to extra rows above
    worksheet["A2"] = { v: `รายงานมูลค่าพัสดุคงคลังรายวัน (ล้านบาท)` };
    // worksheet["A4"] = { v: `รหัสพัสดุ : ${selectedMaterial || "-"}` };

    // Style extra rows above
    const styleRowsAbove = [1, 3, 4, 5];
    styleRowsAbove.forEach((rowIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: 0 });
      worksheet[cellAddress].s = {
        font: { bold: rowIndex === 1, sz: rowIndex === 1 ? 16 : 12 },
        alignment: {
          horizontal: rowIndex === 1 ? "center" : "left",
          vertical: "center",
        },
      };
    });

    // Add and style rows below
    const infoRowIndex = fullData.length - 1; // Index of the last row
    worksheet[`A${infoRowIndex + 1}`] = {
      v: `ข้อมูล ณ วันที่ ${dateInfoData?.day || "-"} / ${
        dateInfoData?.month || "-"
      } / ${dateInfoData?.year || "-"} เวลา 0${dateInfoData?.hour}:${
        dateInfoData?.minute
      }0 น.`,
    };
    worksheet[`A${infoRowIndex + 1}`].s = {
      font: { sz: 12 },
      alignment: {
        horizontal: "left",
        vertical: "center",
      },
    };

    // Style headers
    const headerRowIndex = extraRowsAbove.length;
    for (let C = 0; C < headers.length; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: headerRowIndex, c: C });
      if (!worksheet[cellAddress]) {
        worksheet[cellAddress] = { v: headers[C]?.label || "" };
      }
      worksheet[cellAddress].s = {
        font: { bold: true },
        alignment: {
          horizontal: "center",
          vertical: "center",
          wrapText: true,
        },
        fill: { fgColor: { rgb: "D9D9D9" } },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    }

    // Style data cells
    for (
      let R = headerRowIndex + 1;
      R < fullData.length - extraRowsBelow.length;
      ++R
    ) {
      for (let C = 0; C < headers.length; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) continue;

        const alignRight = C > 0; // Right-align for columns after the first
        worksheet[cellAddress].s = {
          alignment: {
            horizontal: alignRight ? "right" : "center",
            vertical: "center",
            wrapText: true,
          },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      }
    }

    // Dynamically calculate column widths
    const colWidths = headers.map((header) => {
      const columnData = [
        header.label,
        ...formattedData.map((row) => row[header.label]?.toString() || ""),
      ];
      const maxLength = columnData.reduce(
        (max, value) => Math.max(max, value.length),
        0
      );
      return { wch: maxLength + 1 }; // Add a small buffer
    });
    worksheet["!cols"] = colWidths;

    // Append worksheet to workbook and trigger download
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const xlsxData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([xlsxData], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  };

// ###########################################################

// Function to format data for CSV export
const formatMonthInvCSVData = (data) => {
  if (!Array.isArray(data)) {
    console.error("Expected an array but received:", data);
    return []; // Avoid errors by returning an empty array
  }

  return data
  .filter((item) => item.EKGRP && item.amtused_MT != null && item.amtused_MA != null) // Ensure valid entries
    .map((item) => ({
      EKGRP: item.EKGRP,
      amtused_MT: formatValue(item.amtused_MT), // Material Number
      amtused_MA: formatValue(item.amtused_MA), // Convert "-" values to "0"

    }));
};

// Format CSV Data
const csvTableMonthInvData = formatMonthInvCSVData(dataMonthInventory);

const csvTableMonthInvHeaders = [
  { label: "สังกัด", key: "EKGRP" },
  { label: `เป้าหมายมูลค่าพัสดุคงคลัง ณ สิ้นปี ${dateInfoData?.year}`, key: "amtused_MT" },
  { label: `มูลค่าพัสดุคงคลัง ณ สิ้นเดือน ${selectedMonth}`, key: "amtused_MA" },
];

const downloadXLSX_MonthInv = (data, headers, fileName, dateInfoData) => {
  // Format data with headers
  const formattedData = data.map((item) =>
    headers.reduce((acc, header) => {
      acc[header.label] = item[header.key];
      return acc;
    }, {})
  );

  // Define the number of extra rows
  const extraRowsAbove = Array(3).fill({}); // 7 rows above the table
  const extraRowsBelow = Array(2).fill({}); // 2 rows below the table

  // Combine all rows: extra rows above, header, data, and extra rows below
  const headerRow = headers.reduce((acc, header) => {
    acc[header.label] = header.label; // Add headers as keys
    return acc;
  }, {});
  const fullData = [
    ...extraRowsAbove,
    headerRow,
    ...formattedData,
    ...extraRowsBelow,
  ];

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(fullData, { skipHeader: true });
  const workbook = XLSX.utils.book_new();

  // Add merges for title row and rows below
  const numColumns = headers.length; // Number of columns in the dataset
  worksheet["!merges"] = [
    { s: { r: 1, c: 0 }, e: { r: 1, c: numColumns - 1 } }, // Merge title row
    {
      s: { r: fullData.length - 1, c: 0 },
      e: { r: fullData.length - 1, c: numColumns - 1 },
    }, // Merge info row
  ];

  // Add text to extra rows above
  worksheet["A2"] = { v: `รายงานมูลค่าพัสดุคงคลัง ณ สิ้นเดือน ${selectedMonth}/${dateInfoData?.year} (ล้านบาท)` };
  // worksheet["A4"] = { v: `รหัสพัสดุ : ${selectedMaterial || "-"}` };

  // Style extra rows above
  const styleRowsAbove = [1, 3, 4, 5];
  styleRowsAbove.forEach((rowIndex) => {
    const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: 0 });
    worksheet[cellAddress].s = {
      font: { bold: rowIndex === 1, sz: rowIndex === 1 ? 16 : 12 },
      alignment: {
        horizontal: rowIndex === 1 ? "center" : "left",
        vertical: "center",
      },
    };
  });

  // Add and style rows below
  const infoRowIndex = fullData.length - 1; // Index of the last row
  worksheet[`A${infoRowIndex + 1}`] = {
    v: `ข้อมูล ณ วันที่ ${dateInfoData?.day || "-"} / ${
      dateInfoData?.month || "-"
    } / ${dateInfoData?.year || "-"} เวลา 0${dateInfoData?.hour}:${
      dateInfoData?.minute
    }0 น.`,
  };
  worksheet[`A${infoRowIndex + 1}`].s = {
    font: { sz: 12 },
    alignment: {
      horizontal: "left",
      vertical: "center",
    },
  };

  // Style headers
  const headerRowIndex = extraRowsAbove.length;
  for (let C = 0; C < headers.length; C++) {
    const cellAddress = XLSX.utils.encode_cell({ r: headerRowIndex, c: C });
    if (!worksheet[cellAddress]) {
      worksheet[cellAddress] = { v: headers[C]?.label || "" };
    }
    worksheet[cellAddress].s = {
      font: { bold: true },
      alignment: {
        horizontal: "center",
        vertical: "center",
        wrapText: true,
      },
      fill: { fgColor: { rgb: "D9D9D9" } },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };
  }

  // Style data cells
  for (
    let R = headerRowIndex + 1;
    R < fullData.length - extraRowsBelow.length;
    ++R
  ) {
    for (let C = 0; C < headers.length; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[cellAddress]) continue;

      const alignRight = C > 0; // Right-align for columns after the first
      worksheet[cellAddress].s = {
        alignment: {
          horizontal: alignRight ? "right" : "center",
          vertical: "center",
          wrapText: true,
        },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    }
  }

  // Dynamically calculate column widths
  const colWidths = headers.map((header) => {
    const columnData = [
      header.label,
      ...formattedData.map((row) => row[header.label]?.toString() || ""),
    ];
    const maxLength = columnData.reduce(
      (max, value) => Math.max(max, value.length),
      0
    );
    return { wch: maxLength + 1 }; // Add a small buffer
  });
  worksheet["!cols"] = colWidths;

  // Append worksheet to workbook and trigger download
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const xlsxData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([xlsxData], { type: "application/octet-stream" });
  saveAs(blob, `${fileName}.xlsx`)};

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
                csvTableDayInvData, // Data
                csvTableDayInvHeaders, // Headers
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
                csvTableMonthInvData, // Data
                csvTableMonthInvHeaders, // Headers
                `MonthInventory_${selectedMonth}_${dateInfoData?.Year}`, // File Name
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
