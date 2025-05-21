import React, { useState, useEffect } from "react";
import "../ComponentsStyles/Dashboard.css"; // Updated to use Dashboard3.css
import "../ComponentsStyles/Dashboard3.css"; // Updated to use Dashboard3.css
import YearDropdown from "./YearDropdown";
import NavbarComponent from "../ComponentsPage/NavbarComponent";
import D3BarGraphReV from "./D3BarGraphReV";
import TableD3Price from "./TableD3Price";
import Select from "react-select"; // Import react-select
import { useQuery } from "@tanstack/react-query";
import { getYears, getDateInfo } from "../services/api.js"; // Import your API service function
import {
  getD3Categories,
  getD3Materials,
  getD3Districts,
  getD3CategoryPriceTable,
  getD3CategoryPriceTable12M,
  getD3MaterialPriceGroupDistrict,
  getD3MaterialPriceByDistrict,
  getD3MaterialPriceGroupEKGRP,
  getD3MaterialPriceByEKGRP,
} from "../services/api_D3.js";
import XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

const Dashboard3 = () => {
  const [selectedYear, setSelectedYear] = useState(""); // State to hold the selected year
  const [selectedCategory, setSelectedCategory] = useState(""); // State to hold the selected category
  const [selectedMaterial, setSelectedMaterial] = useState(""); // State to hold the selected material
  const [selectedDistrict, setSelectedDistrict] = useState(""); // State to hold the selected material
  const [showFirstChart, setShowFirstChart] = useState(true); // State to toggle between the charts
  const [selectedButton, setSelectedButton] = useState("first"); // Track selected button index

  const priceFormatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const formatQuantity = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatPercentage = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  // Fetch available years using React Query
  const { data: yearsData, isLoading: isYearsLoading } = useQuery({
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

  const { data: categoryData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getD3Categories,
  });

  const {
    data: materialD3Data,
    isLoading: isLoadingMaterialD3Data,
    isError: isErrorMaterialD3Data,
    error: errorMaterialD3Data,
  } = useQuery({
    queryKey: ["materials", selectedYear, selectedCategory], // Unique query key for caching
    queryFn: () => getD3Materials(selectedYear, selectedCategory), // API call to fetch data based on year
    enabled: Boolean(selectedYear) && Boolean(selectedCategory), // Only run query if year and category are selected
  });

  // Map material data to options for react-select
  const materialD3Options = materialD3Data?.map((materialD3) => ({
    value: materialD3.MATNR,
    label: `${materialD3.MATNR} ${materialD3.MAKTX}`,
  }));

  const {
    data: districtData,
    isLoading: isLoadingDistrictData,
    isError: isErrorDistrictData,
    error: errorDistrictData,
  } = useQuery({
    queryKey: ["districts", selectedYear, selectedMaterial], // Unique query key for caching
    queryFn: () => getD3Districts(selectedYear, selectedMaterial), // API call to fetch data based on year
    enabled: Boolean(selectedYear) && Boolean(selectedMaterial), // Only run query if year is selected
  });

  const {
    data: categoryPriceTable,
    isLoading: isLoadingCategoryPriceTable,
    isError: isErrorCategoryPriceTable,
    error: errorCategoryPriceTable,
  } = useQuery({
    queryKey: ["categoryPriceTable", selectedYear, selectedCategory], // Unique query key for caching
    queryFn: () => getD3CategoryPriceTable(selectedYear, selectedCategory), // API call to fetch data based on year and category are selected
    enabled: Boolean(selectedYear) && Boolean(selectedCategory), // Only run query if year and category are selected
  });

  const dataTablePrice =
    categoryPriceTable?.data?.map((item) => ({
      matNR: item.MATNR,
      matName: item.MAKTX,
      priceHQ: Number(item.PRICE_HQ),
      priceDistrict: Number(item.PRICE_REGION),
      priceDiff: Number(item.PRICE_DIFF) - 1,
      quantityHQ: Number(item.QUANTITY_HQ),
      quantityRegion: Number(item.QUANTITY_REGION),
    })) || [];

  const csvTablePriceHeaders = [
    { label: "รหัสพัสดุ", key: "matNR" },
    { label: "ชื่อพัสดุ", key: "matName" },
    { label: "ราคาที่ส่วนกลาง", key: "priceHQ" },
    { label: "ราคาเฉลี่ยที่ กฟข.", key: "priceDistrict" },
    { label: "% ราคาที่แตกต่าง", key: "priceDiff" },
    { label: "จำนวนพัสดุเฉลี่ยต่อ PO ที่ส่วนกลาง", key: "quantityHQ" },
    { label: "จำนวนพัสดุเฉลี่ยต่อ PO ที่ กฟข.", key: "quantityRegion" },
  ];

  // Format the data for CSV
  const formatCSVTablePriceData = (data) =>
    data.map((item) => ({
      matNR: item.matNR,
      matName: item.matName,
      priceHQ: formatPrice(item.priceHQ),
      priceDistrict: formatPrice(item.priceDistrict),
      priceDiff: formatPercentage(item.priceDiff),
      quantityHQ: formatQuantity(item.quantityHQ),
      quantityRegion: formatQuantity(item.quantityRegion),
    }));

  const csvTablePriceData = formatCSVTablePriceData(dataTablePrice); // Use your table data as CSV data

  const downloadXLSX_catPrice = (
    data,
    headers,
    fileName,
    selectedYear,
    selectedCategory,
    dateInfoData
  ) => {
    // Format data with headers
    const formattedData = data.map((item) =>
      headers.reduce((acc, header) => {
        acc[header.label] = item[header.key];
        return acc;
      }, {})
    );

    // Define the number of extra rows
    const extraRowsAbove = Array(5).fill({}); // 3 rows above the table
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
      { s: { r: 3, c: 0 }, e: { r: 3, c: numColumns - 1 } }, // Merge row 4
      {
        s: { r: fullData.length - 1, c: 0 },
        e: { r: fullData.length - 1, c: numColumns - 1 },
      }, // Merge info row
    ];

    // Add text to extra rows above
    worksheet["A2"] = {
      v: `ตารางเปรียบเทียบราคาและจำนวนจัดซื้อส่วนกลาง vs. กฟข. ในปี ${selectedYear}`,
    };
    worksheet["A4"] = { v: `กลุ่มพัสดุ : ${selectedCategory || "-"}` };

    // Style extra rows above
    const styleRowsAbove = [1];
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

        // Determine horizontal alignment based on column index
        const alignRight = C > 0; // Right-align for columns after the first
        const alignLeft = C === 1; // Left-align for the second column
        const horizontalAlignment = alignLeft
          ? "left"
          : alignRight
          ? "right"
          : "center";

        // Apply cell styles
        worksheet[cellAddress].s = {
          alignment: {
            horizontal: horizontalAlignment,
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

  const {
    data: categoryPriceTable12M,
    isLoading: isLoadingCategoryPriceTable12M,
    isError: isErrorCategoryPriceTable12M,
    error: errorCategoryPriceTable12M,
  } = useQuery({
    queryKey: ["categoryPriceTable12M", selectedCategory], // Unique query key for caching
    queryFn: () => getD3CategoryPriceTable12M(selectedCategory), // API call to fetch data based on year and category are selected
    enabled: Boolean(selectedCategory), // Only run query if year and category are selected
  });

  const dataTablePrice24M =
    categoryPriceTable12M?.data?.map((item) => ({
      matNR: item.MATNR,
      matName: item.MAKTX,
      priceHQ: Number(item.PRICE_HQ),
      priceDistrict: Number(item.PRICE_REGION),
      priceDiff: Number(item.PRICE_DIFF) - 1,
      quantityHQ: Number(item.QUANTITY_HQ),
      quantityRegion: Number(item.QUANTITY_REGION),
    })) || [];

  const {
    data: materialPriceGroupDistrict,
    isLoading: isLoadingMaterialPriceGroupDistrict,
    isError: isErrorMaterialPriceGroupDistrict,
    error: errorMaterialPriceGroupDistrict,
  } = useQuery({
    queryKey: ["materialPriceGroupDistrict", selectedYear, selectedMaterial], // Unique query key for caching
    queryFn: () =>
      getD3MaterialPriceGroupDistrict(selectedYear, selectedMaterial), // API call to fetch data based on year and material are selected
    enabled: Boolean(selectedYear) && Boolean(selectedMaterial), // Only run query if year and material are selected
  });

  const {
    data: materialPriceByDistrict,
    isLoading: isLoadingMaterialPriceByDistrict,
    isError: isErrorMaterialPriceByDistrict,
    error: errorMaterialPriceByDistrict,
  } = useQuery({
    queryKey: ["materialPriceByDistrict", selectedYear, selectedMaterial], // Unique query key for caching
    queryFn: () => getD3MaterialPriceByDistrict(selectedYear, selectedMaterial), // API call to fetch data based on year and material are selected
    enabled: Boolean(selectedYear) && Boolean(selectedMaterial), // Only run query if year and material are selected
  });

  const dataMaterialPriceByDistrict =
    materialPriceByDistrict?.map((district) => ({
      name: district?.DISTRICT_NAME,
      maxPrice: district?.PRICE_MAX_REGION,
      averagePrice: district?.PRICE_AVERAGE_REGION,
      minPrice: district?.PRICE_MIN_REGION,
      maxQuantity: district?.QUANTITY_MAX_DISTRICT,
      minQuantity: district?.QUANTITY_MIN_DISTRICT,
    })) || [];

  const csvBarDistrictHeaders = [
    { label: "หน่วยจัดซื้อ", key: "name" },
    { label: "ราคาเฉลี่ย", key: "averagePrice" },
    { label: "ราคาสูงสุด", key: "maxPrice" },
    { label: "ราคาต่ำสุด", key: "minPrice" },
  ];

  // Format the data for CSV
  const formatCSVBarDistrictData = (data) =>
    data.map((item) => ({
      name: item.name,
      averagePrice: formatPrice(item.averagePrice),
      maxPrice: formatPrice(item.maxPrice),
      minPrice: formatPrice(item.minPrice),
    }));

  const csvBarDistrictData = formatCSVBarDistrictData(
    dataMaterialPriceByDistrict
  ); // Use your table data as CSV data

  const downloadXLSX_barDistrict = (
    data,
    headers,
    fileName,
    selectedYear,
    selectedCategory,
    selectedMaterial,
    dateInfoData
  ) => {
    // Format data with headers
    const formattedData = data.map((item) =>
      headers.reduce((acc, header) => {
        acc[header.label] = item[header.key];
        return acc;
      }, {})
    );

    // Define the number of extra rows
    const extraRowsAbove = Array(6).fill({}); // 3 rows above the table
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
      { s: { r: 3, c: 0 }, e: { r: 3, c: numColumns - 1 } }, // Merge row 4
      { s: { r: 4, c: 0 }, e: { r: 4, c: numColumns - 1 } }, // Merge row 5
      {
        s: { r: fullData.length - 1, c: 0 },
        e: { r: fullData.length - 1, c: numColumns - 1 },
      }, // Merge info row
    ];

    // Add text to extra rows above
    worksheet["A2"] = {
      v: `ตารางเปรียบเทียบราคาจัดซื้อพัสดุตามกฟข. ในปี ${selectedYear}`,
    };
    worksheet["A4"] = { v: `กลุ่มพัสดุ : ${selectedCategory || "-"}` };
    worksheet["A5"] = { v: `รหัสพัสดุ : ${selectedMaterial || "-"}` };

    // Style extra rows above
    const styleRowsAbove = [1];
    styleRowsAbove.forEach((rowIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: 0 });
      worksheet[cellAddress].s = {
        font: { bold: rowIndex === 1, sz: rowIndex === 1 ? 16 : 12 },
        alignment: {
          horizontal: rowIndex === 1 ? "left" : "left",
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

        // Determine horizontal alignment based on column index
        const alignRight = C > 0; // Right-align for columns after the second
        const horizontalAlignment = alignRight ? "right" : "center";

        // Apply cell styles
        worksheet[cellAddress].s = {
          alignment: {
            horizontal: horizontalAlignment,
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

  const {
    data: materialPriceGroupEKGRP,
    isLoading: isLoadingMaterialPriceGroupEKGRP,
    isError: isErrorMaterialPriceGroupEKGRP,
    error: errorMaterialPriceGroupEKGRP,
  } = useQuery({
    queryKey: [
      "materialPriceGroupEKGRP",
      selectedYear,
      selectedMaterial,
      setSelectedDistrict,
    ], // Unique query key for caching
    queryFn: () =>
      getD3MaterialPriceGroupEKGRP(
        selectedYear,
        selectedMaterial,
        selectedDistrict
      ), // API call to fetch data based on year, material, district are selected
    enabled:
      Boolean(selectedYear) &&
      Boolean(selectedMaterial) &&
      Boolean(selectedDistrict), // Only run query if year, material, district are selected
  });

  const {
    data: materialPriceByEKGRP,
    isLoading: isLoadingMaterialPriceByEKGRP,
    isError: isErrorMaterialPriceByEKGRP,
    error: errorMaterialPriceByEKGRP,
  } = useQuery({
    queryKey: [
      "materialPriceByEKGRP",
      selectedYear,
      selectedMaterial,
      selectedDistrict,
    ], // Unique query key for caching
    queryFn: () =>
      getD3MaterialPriceByEKGRP(
        selectedYear,
        selectedMaterial,
        selectedDistrict
      ), // API call to fetch data based on year and material are selected
    enabled:
      Boolean(selectedYear) &&
      Boolean(selectedMaterial) &&
      Boolean(selectedDistrict), // Only run query if year and material are selected
  });

  const dataMaterialPriceByEKGRP =
    materialPriceByEKGRP?.map((ekgrp) => ({
      name: ekgrp?.EKGRP_NAME,
      maxPrice: ekgrp?.PRICE_MAX_EKGRP,
      averagePrice: ekgrp?.PRICE_AVERAGE_EKGRP,
      minPrice: ekgrp?.PRICE_MIN_EKGRP,
      maxQuantity: ekgrp?.QUANTITY_MAX_EKGRP,
      minQuantity: ekgrp?.QUANTITY_MIN_EKGRP,
    })) || [];

  const csvBarEKGRPHeaders = [
    { label: "หน่วยจัดซื้อ", key: "name" },
    { label: "ราคาเฉลี่ย", key: "averagePrice" },
    { label: "ราคาสูงสุด", key: "maxPrice" },
    { label: "ราคาต่ำสุด", key: "minPrice" },
  ];

  // Format the data for CSV
  const formatCSVBarEKGRPData = (data) =>
    data.map((item) => ({
      name: item.name,
      averagePrice: formatPrice(item.averagePrice),
      maxPrice: formatPrice(item.maxPrice),
      minPrice: formatPrice(item.minPrice),
    }));

  const csvBarEKGRPData = formatCSVBarEKGRPData(dataMaterialPriceByEKGRP); // Use your table data as CSV data

  const downloadXLSX_barEKGRP = (
    data,
    headers,
    fileName,
    selectedYear,
    selectedCategory,
    selectedMaterial,
    selectedDistrict,
    dateInfoData
  ) => {
    // Format data with headers
    const formattedData = data.map((item) =>
      headers.reduce((acc, header) => {
        acc[header.label] = item[header.key];
        return acc;
      }, {})
    );

    // Define the number of extra rows
    const extraRowsAbove = Array(7).fill({}); // 3 rows above the table
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
      { s: { r: 3, c: 0 }, e: { r: 3, c: numColumns - 1 } }, // Merge row 4
      { s: { r: 4, c: 0 }, e: { r: 4, c: numColumns - 1 } }, // Merge row 5
      {
        s: { r: fullData.length - 1, c: 0 },
        e: { r: fullData.length - 1, c: numColumns - 1 },
      }, // Merge info row
    ];

    // Add text to extra rows above
    worksheet["A2"] = {
      v: `ตารางเปรียบเทียบราคาจัดซื้อพัสดุตามกฟฟ. ในปี ${selectedYear}`,
    };
    worksheet["A4"] = { v: `กลุ่มพัสดุ : ${selectedCategory || "-"}` };
    worksheet["A5"] = { v: `รหัสพัสดุ : ${selectedMaterial || "-"}` };
    worksheet["A6"] = { v: `การไฟฟ้าเขต : ${selectedDistrict || "-"}` };

    // Style extra rows above
    const styleRowsAbove = [1];
    styleRowsAbove.forEach((rowIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: 0 });
      worksheet[cellAddress].s = {
        font: { bold: rowIndex === 1, sz: rowIndex === 1 ? 16 : 12 },
        alignment: {
          horizontal: rowIndex === 1 ? "left" : "left",
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

        // Determine horizontal alignment based on column index
        const alignRight = C > 0; // Right-align for columns after the second
        const horizontalAlignment = alignRight ? "right" : "center";

        // Apply cell styles
        worksheet[cellAddress].s = {
          alignment: {
            horizontal: horizontalAlignment,
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

  const handleButtonClick = (button) => {
    setSelectedButton(button); // Update the active button state
    setShowFirstChart(button === "first"); // Toggle the chart based on the button
  };

  const handleShowFirstChart = () => {
    setShowFirstChart(true);
  };

  const handleShowSecondChart = () => {
    setShowFirstChart(false);
  };

  const datadate = 1;

  // Fetch summary data for selected year and category using React Query
  const {
    data: dateInfoData,
    isLoading: isLoadingDateInfoData,
    isError: isErrorDateInfoData,
    error: errorDateInfoData,
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

  return (
    <div>
      <NavbarComponent />
      <div className="text-dropdown-container">
        <h1 className="header-title">เปรียบเทียบราคาจัดซื้อ</h1>
        <div className="year-dropdown-container">
          <YearDropdown
            onSelectYear={setSelectedYear}
            selectedYear={selectedYear}
          />
        </div>
      </div>
      <div className="dashboard3-container">
        {/* Left Container */}
        <div className="top-container">
          <div className="dropdown-download-container">
            <div className="D3-dropdown-cat-group">
              {isCategoriesLoading ? (
                <p>Loading categories...</p>
              ) : (
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">-- เลือกกลุ่มพัสดุ --</option>
                  {categoryData
                    ?.filter((category) => category.CATEGORY_ID !== "999") // Exclude CATEGORY_ID 999
                    .map((category, index) => (
                      <option key={index} value={category.CATEGORY_ID}>
                        {`${category.CATEGORY_ID}: ${category.CATEGORY_NAME}`}
                      </option>
                    ))}
                </select>
              )}
            </div>
            <div className="download-button">
              <button
                onClick={() =>
                  downloadXLSX_catPrice(
                    csvTablePriceData, // Data
                    csvTablePriceHeaders, // Headers
                    `HQvsDistrictPriceAndQuantityComparison_${selectedYear}_${selectedCategory}`,
                    selectedYear, // File Name
                    selectedCategory,
                    dateInfoData // Date Info
                  )
                }
                style={getButtonStyle(false)} // Apply button style
              >
                Download XLSX
              </button>
            </div>
          </div>
          <TableD3Price
            title={`เปรียบเทียบราคาและจำนวนจัดซื้อส่วนกลาง vs. กฟข. ในปี ${selectedYear}`}
            data={dataTablePrice}
          />
          <TableD3Price
            title={`เปรียบเทียบราคาและจำนวนจัดซื้อส่วนกลาง vs. กฟข. ย้อนหลัง 24 เดือน`}
            data={dataTablePrice24M}
          />
          <div className="remark-container">
            <p>ⓘ หมายเหตุ:</p>
            <p>
              1. หากไม่มีการจัดซื้อเกิดขึ้น ณ หน่วยงานจัดซื้อนั้นๆในช่วงที่กำหนด
              จะไม่มีการแสดงผลราคาเฉลี่ย
            </p>
            <p>2. * คือพัสดุที่มีการจ้างรีดที่ส่วนกลางด้วยอลูมิเนียมอินกอต</p>
          </div>
        </div>
        <div className="bottom-container">
          <h1 className="text-title">
            {`เปรียบเทียบราคาจัดซื้อพัสดุตามหน่วยงานจัดซื้อ ในปี ${selectedYear}`}
          </h1>
          <div className="dropdown-container">
            <div className="D3-dropdown-cat-group">
              {isLoadingMaterialD3Data ? (
                <p>Loading materials...</p>
              ) : isErrorMaterialD3Data ? (
                <p>Error fetching materials: {errorMaterialD3Data.message}</p>
              ) : (
                <Select
                  options={materialD3Options}
                  value={materialD3Options?.find(
                    (option) => option.value === selectedMaterial
                  )}
                  onChange={(selectedOption) => {
                    console.log("Selected MATNR:", selectedOption?.value);
                    setSelectedMaterial(selectedOption?.value);
                  }}
                  placeholder="เลือกรายการพัสดุ..."
                  isClearable
                  isSearchable
                />
              )}
            </div>
          </div>

          {/* Toggle Button */}
          <div className="chart-button-group">
            <button
              className={`chart-button ${
                selectedButton === "first" ? "active" : ""
              }`}
              disabled={!selectedMaterial}
              onClick={() => handleButtonClick("first")}
            >
              แยกตามการไฟฟ้าเขต
            </button>
            <button
              className={`chart-button ${
                selectedButton === "second" ? "active" : ""
              }`}
              disabled={!selectedMaterial}
              onClick={() => handleButtonClick("second")}
            >
              แยกตามการไฟฟ้าหน้างาน{" "}
            </button>
          </div>

          {/* Chart Container */}

          {showFirstChart ? (
            <div className="dropdown-container"> </div>
          ) : (
            <div>
              <div className="dropdown-container">
                {isLoadingDistrictData ? (
                  <p>Loading districts...</p>
                ) : (
                  <select
                    value={selectedDistrict}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      setSelectedDistrict(selectedValue);
                      console.log("Selected District:", selectedValue);
                    }}
                  >
                    <option value="">-- เลือกเขต --</option>
                    {districtData.districts.map((district, index) => (
                      <option key={index} value={district.DISTRICT}>
                        {`${district.DISTRICT}: ${district.DISTRICT_NAME}`}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          )}
          <div className="D3BarChart-container">
            {showFirstChart ? (
              <>
                <div className="dropdown-download-container">
                  <div>
                    <p className="text-subtitle">
                      หน่วย: บาท ต่อ {materialPriceGroupDistrict?.UOM}
                    </p>
                  </div>
                  <div className="download-button">
                    <button
                      onClick={() =>
                        downloadXLSX_barDistrict(
                          csvBarDistrictData, // Data
                          csvBarDistrictHeaders, // Headers
                          `PriceBreakdownByDistrict_${selectedYear}_${selectedMaterial}`,
                          selectedYear, // File Name
                          selectedCategory,
                          selectedMaterial,
                          dateInfoData // Date Info
                        )
                      }
                      style={getButtonStyle(false)} // Apply button style
                    >
                      Download XLSX
                    </button>
                  </div>
                </div>
                <D3BarGraphReV
                  data={dataMaterialPriceByDistrict}
                  xAxisKey="name"
                  barKey="averagePrice"
                  title="ข้อมูลราคาเฉลี่ยตามหน่วยงานจัดซื้อ"
                />
              </>
            ) : (
              <>
                <div className="dropdown-download-container">
                  <div>
                    <p className="text-subtitle">
                      หน่วย: บาท ต่อ {materialPriceGroupEKGRP?.UOM}
                    </p>
                  </div>
                  <div className="download-button">
                    <button
                      onClick={() =>
                        downloadXLSX_barEKGRP(
                          csvBarEKGRPData, // Data
                          csvBarEKGRPHeaders, // Headers
                          `PriceBreakdownByEKGRP_${selectedYear}_${selectedMaterial}`,
                          selectedYear, // File Name
                          selectedCategory,
                          selectedMaterial,
                          selectedDistrict,
                          dateInfoData // Date Info
                        )
                      }
                      style={getButtonStyle(false)} // Apply button style
                    >
                      Download XLSX
                    </button>
                  </div>
                </div>
                <D3BarGraphReV
                  data={dataMaterialPriceByEKGRP}
                  xAxisKey="name"
                  barKey="averagePrice"
                  title="ข้อมูลราคาเฉลี่ยตามหน่วยงานจัดซื้อ"
                />
              </>
            )}
            <h1 className="text-subtitle">
              หมายเหตุ: หากไม่มีการจัดซื้อเกิดขึ้น ณ
              หน่วยงานจัดซื้อนั้นๆในปีที่เลือกแสดง จะไม่มีการแสดงผลราคาเฉลี่ย
            </h1>
          </div>
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

export default Dashboard3;
