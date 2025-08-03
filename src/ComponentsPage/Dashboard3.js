import React, { useState, useEffect } from "react";
import "../ComponentsStyles/Dashboard.css"; // Updated to use Dashboard3.css
import "../ComponentsStyles/Dashboard3.css"; // Updated to use Dashboard3.css
import YearDropdown from "./YearDropdown";
import NavbarComponent from "../ComponentsPage/NavbarComponent";
import D3BarGraphReV from "./D3BarGraphReV";
import TableD3Price from "./TableD3Price";
import TableD3Allocation from "./TableD3Allocation.js"
import Select from "react-select"; // Import react-select
import { useQuery } from "@tanstack/react-query";
import { getYears, getDateInfo } from "../services/api.js"; // Import your API service function
import {
  getD3Categories,
  getD3Materials,
  getD3Districts,
  getD3CategoryPriceTable,
  getD3CategoryPriceTable12M,
  getD3PlanAllocation,
  getD3MaterialPriceGroupDistrict,
  getD3MaterialPriceByDistrict,
  getD3MaterialPriceGroupEKGRP,
  getD3MaterialPriceByEKGRP,
} from "../services/api_D3.js";
import { downloadXLSX, formatters } from "../utils/downloadXLSX";

const Dashboard3 = () => {
  const [selectedYear, setSelectedYear] = useState(""); // State to hold the selected year
  const [selectedCategory, setSelectedCategory] = useState(""); // State to hold the selected category
  const [selectedMaterial, setSelectedMaterial] = useState(""); // State to hold the selected material
  const [selectedDistrict, setSelectedDistrict] = useState(""); // State to hold the selected material
  const [showFirstChart, setShowFirstChart] = useState(true); // State to toggle between the charts
  const [selectedButton, setSelectedButton] = useState("first"); // Track selected button index

  const formatPrice = formatters.price;
  const formatQuantity = formatters.quantity;
  const formatPercentage = formatters.percentage;

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

  const tableHeaders = [
    { label: "รหัสพัสดุ", key: "matNR" },
    { label: "ชื่อพัสดุ", key: "matName" },
    { label: "ราคาที่ส่วนกลาง", key: "priceHQ" },
    { label: "ราคาเฉลี่ยที่ กฟข.", key: "priceDistrict" },
    { label: "% ราคาที่แตกต่าง", key: "priceDiff" },
    { label: "จำนวนพัสดุเฉลี่ยต่อ PO ที่ส่วนกลาง", key: "quantityHQ" },
    { label: "จำนวนพัสดุเฉลี่ยต่อ PO ที่ กฟข.", key: "quantityRegion" },
  ];


  const downloadXLSX_catPrice = (
    data,
    headers,
    fileName,
    selectedYear,
    selectedCategory,
    dateInfoData
  ) => {
    downloadXLSX({
      data: dataTablePrice, // Use raw unformatted data
      headers,
      fileName,
      title: `ตารางเปรียบเทียบราคาและจำนวนจัดซื้อส่วนกลาง vs. กฟข. ในปี ${selectedYear}`,
      filters: [`กลุ่มพัสดุ : ${selectedCategory || "-"}`],
      dateInfo: dateInfoData,
      preserveRawNumbers: true,
      columnTypes: {
        0: "text",     // รหัสพัสดุ
        1: "text",     // ชื่อพัสดุ  
        2: "currency", // ราคาที่ส่วนกลาง
        3: "currency", // ราคาเฉลี่ยที่ กฟข.
        4: "percentage", // % ราคาที่แตกต่าง
        5: "number",   // จำนวนพัสดุเฉลี่ยต่อ PO ที่ส่วนกลาง
        6: "number"    // จำนวนพัสดุเฉลี่ยต่อ PO ที่ กฟข.
      },
      columnAlignment: {
        0: "center",
        1: "left",
        2: "right",
        3: "right",
        4: "right",
        5: "right",
        6: "right"
      }
    });
  };

  const {
    data: categoryPriceTable24M,
    isLoading: isLoadingCategoryPriceTable24M,
    isError: isErrorCategoryPriceTable24M,
    error: errorCategoryPriceTable24M,
  } = useQuery({
    queryKey: ["categoryPriceTable24M", selectedCategory], // Unique query key for caching
    queryFn: () => getD3CategoryPriceTable12M(selectedCategory), // API call to fetch data based on year and category are selected
    enabled: Boolean(selectedCategory), // Only run query if year and category are selected
  });

  const dataTablePrice24M =
    categoryPriceTable24M?.data?.map((item) => ({
      matNR: item.MATNR,
      matName: item.MAKTX,
      priceHQ: Number(item.PRICE_HQ),
      priceDistrict: Number(item.PRICE_REGION),
      priceDiff: Number(item.PRICE_DIFF) - 1,
      quantityHQ: Number(item.QUANTITY_HQ),
      quantityRegion: Number(item.QUANTITY_REGION),
    })) || [];



  const downloadXLSX_catPrice24M = (
    data,
    headers,
    fileName,
    selectedCategory,
    dateInfoData
  ) => {
    downloadXLSX({
      data: dataTablePrice24M, // Use raw unformatted data
      headers,
      fileName,
      title: `ตารางเปรียบเทียบราคาและจำนวนจัดซื้อส่วนกลาง vs. กฟข. ย้อนหลัง 24 เดือน`,
      filters: [`กลุ่มพัสดุ : ${selectedCategory || "-"}`],
      dateInfo: dateInfoData,
      preserveRawNumbers: true,
      columnTypes: {
        0: "text",     // รหัสพัสดุ
        1: "text",     // ชื่อพัสดุ  
        2: "currency", // ราคาที่ส่วนกลาง
        3: "currency", // ราคาเฉลี่ยที่ กฟข.
        4: "percentage", // % ราคาที่แตกต่าง
        5: "number",   // จำนวนพัสดุเฉลี่ยต่อ PO ที่ส่วนกลาง
        6: "number"    // จำนวนพัสดุเฉลี่ยต่อ PO ที่ กฟข.
      },
      columnAlignment: {
        0: "center",
        1: "left",
        2: "right",
        3: "right",
        4: "right",
        5: "right",
        6: "right"
      }
    });
  };

    const {
    data: planAllocation,
    isLoading: isLoadingPlanAllocation,
    isError: isErrorPlanAllocation,
    error: errorPlanAllocation,
  } = useQuery({
    queryKey: ["planAllocation", selectedCategory], // Unique query key for caching
    queryFn: () => getD3PlanAllocation(selectedCategory), // API call to fetch data based on year and category are selected
    // enabled: Boolean(selectedCategory), // Only run query if category are selected
  });

  const dataTablePlanAllocation =
    planAllocation?.data?.map((item) => ({
      matNR: item.matnr,
      matName: item.mat_name,
      priceHQ: Number(item.hq_price),
      priceDistrict: Number(item.district_price),
      quantityHQ: Number(item.hq_volume),
      quantityRegion: Number(item.district_volume),
      quantityTotal: Number(item.hq_volume+item.district_volume),
      budgetHQ: Number(item.hq_budget),
      budgetRegion: Number(item.district_budget),
      budgetTotal: Number(item.hq_budget+item.district_budget)
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

  const barDistrictHeaders = [
    { label: "หน่วยจัดซื้อ", key: "name" },
    { label: "ราคาเฉลี่ย", key: "averagePrice" },
    { label: "ราคาสูงสุด", key: "maxPrice" },
    { label: "ราคาต่ำสุด", key: "minPrice" },
  ];


  const downloadXLSX_barDistrict = (
    data,
    headers,
    fileName,
    selectedYear,
    selectedCategory,
    selectedMaterial,
    dateInfoData
  ) => {
    downloadXLSX({
      data: dataMaterialPriceByDistrict, // Use raw unformatted data
      headers,
      fileName,
      title: `ตารางเปรียบเทียบราคาจัดซื้อพัสดุตามกฟข. ในปี ${selectedYear}`,
      filters: [
        `กลุ่มพัสดุ : ${selectedCategory || "-"}`,
        `รหัสพัสดุ : ${selectedMaterial || "-"}`
      ],
      dateInfo: dateInfoData,
      preserveRawNumbers: true,
      columnTypes: {
        0: "text",     // หน่วยจัดซื้อ
        1: "currency", // ราคาเฉลี่ย
        2: "currency", // ราคาสูงสุด
        3: "currency"  // ราคาต่ำสุด
      },
      columnAlignment: {
        0: "center",
        1: "right",
        2: "right",
        3: "right"
      }
    });
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

  const barEKGRPHeaders = [
    { label: "หน่วยจัดซื้อ", key: "name" },
    { label: "ราคาเฉลี่ย", key: "averagePrice" },
    { label: "ราคาสูงสุด", key: "maxPrice" },
    { label: "ราคาต่ำสุด", key: "minPrice" },
  ];


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
    downloadXLSX({
      data: dataMaterialPriceByEKGRP, // Use raw unformatted data
      headers,
      fileName,
      title: `ตารางเปรียบเทียบราคาจัดซื้อพัสดุตามกฟฟ. ในปี ${selectedYear}`,
      filters: [
        `กลุ่มพัสดุ : ${selectedCategory || "-"}`,
        `รหัสพัสดุ : ${selectedMaterial || "-"}`,
        `การไฟฟ้าเขต : ${selectedDistrict || "-"}`
      ],
      dateInfo: dateInfoData,
      preserveRawNumbers: true,
      columnTypes: {
        0: "text",     // หน่วยจัดซื้อ
        1: "currency", // ราคาเฉลี่ย
        2: "currency", // ราคาสูงสุด
        3: "currency"  // ราคาต่ำสุด
      },
      columnAlignment: {
        0: "center",
        1: "right",
        2: "right",
        3: "right"
      }
    });
  };

  const planAllocationHeaders = [
    { label: "รหัสพัสดุ", key: "matNR" },
    { label: "ชื่อพัสดุ", key: "matName" },
    { label: "ราคาที่ส่วนกลาง", key: "priceHQ" },
    { label: "ราคาเฉลี่ยที่ กฟข.", key: "priceDistrict" },
    { label: "จำนวนจัดซื้อโดยส่วนกลาง", key: "quantityHQ" },
    { label: "จำนวนจัดซื้อโดย กฟข.", key: "quantityRegion" },
    { label: "จำนวนจัดซื้อรวม", key: "quantityTotal" },
    { label: "งบประมาณส่วนกลาง", key: "budgetHQ" },
    { label: "งบประมาณ กฟข.", key: "budgetRegion" },
    { label: "งบประมาณรวม", key: "budgetTotal" }
  ];

  const downloadXLSX_planAllocation = (
    data,
    headers,
    fileName,
    selectedCategory,
    dateInfoData
  ) => {
    downloadXLSX({
      data: dataTablePlanAllocation, // Use raw unformatted data
      headers,
      fileName,
      title: `ตารางเปรียบเทียบจำนวนจัดซื้อส่วนกลาง vs. กฟข. เพื่อจัดทำแผน (คำนวณจากราคาย้อนหลัง 24 เดือน)`,
      filters: [`กลุ่มพัสดุ : ${selectedCategory || "-"}`],
      dateInfo: dateInfoData,
      preserveRawNumbers: true,
      columnTypes: {
        0: "text",     // รหัสพัสดุ
        1: "text",     // ชื่อพัสดุ
        2: "currency", // ราคาที่ส่วนกลาง
        3: "currency", // ราคาเฉลี่ยที่ กฟข.
        4: "number",   // จำนวนจัดซื้อโดยส่วนกลาง
        5: "number",   // จำนวนจัดซื้อโดย กฟข.
        6: "number",   // จำนวนจัดซื้อรวม
        7: "currency", // งบประมาณส่วนกลาง
        8: "currency", // งบประมาณ กฟข.
        9: "currency"  // งบประมาณรวม
      },
      columnAlignment: {
        0: "center",
        1: "left",
        2: "right",
        3: "right",
        4: "right",
        5: "right",
        6: "right",
        7: "right",
        8: "right",
        9: "right"
      }
    });
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
                    dataTablePrice, // Data
                    tableHeaders, // Headers
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
          <div className="download-button">
            <button
              onClick={() =>
                downloadXLSX_catPrice24M(
                  dataTablePrice24M, // Data
                  tableHeaders, // Headers
                  `HQvsDistrictPriceAndQuantityComparison24M_${selectedCategory}`,
                  selectedCategory,
                  dateInfoData // Date Info
                )
              }
              style={getButtonStyle(false)} // Apply button style
            >
              Download XLSX
            </button>
          </div>
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
        <div className="top-container">
                  <div className="download-button">
            <button
              onClick={() =>
                downloadXLSX_planAllocation(
                  dataTablePlanAllocation, // Data
                  planAllocationHeaders, // Headers
                  `PlanAllocation_${selectedCategory}`,
                  selectedCategory,
                  dateInfoData // Date Info
                )
              }
              style={getButtonStyle(false)} // Apply button style
            >
              Download XLSX
            </button>
          </div>
            <TableD3Allocation
            title={`เปรียบเทียบจำนวนจัดซื้อส่วนกลาง vs. กฟข. เพื่อจัดทำแผน (คำนวณจากราคาย้อนหลัง 24 เดือน)`}
            data={dataTablePlanAllocation}
          />
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
                          dataMaterialPriceByDistrict, // Data
                          barDistrictHeaders, // Headers
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
                          dataMaterialPriceByEKGRP, // Data
                          barEKGRPHeaders, // Headers
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
