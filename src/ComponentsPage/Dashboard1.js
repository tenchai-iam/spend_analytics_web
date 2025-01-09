import React, { useState, useEffect } from "react";
import NavbarComponent from "../ComponentsPage/NavbarComponent";
import BubbleChart from "./BubbleChart.js";
import "../ComponentsStyles/Dashboard1.css"; // Updated to use Dashboard1.css
import YearDropdown from "./YearDropdown";
import MapChart from "./MapChart.js";
import LineGraphRe from "./LineGraphRe.js";
import LineGraphReNumPO from "./LineGraphReNumPO.js";
import BarGraphReV from "./BarGraphReV.js";
import DonutChartRe from "./DonutChartRe.js";
import TableD1Price from "./TableD1Price.js";
import TableD1Value from "./TableD1Value.js";
import { useQuery } from "@tanstack/react-query";
import { getYears, getCategory, getDateInfo } from "../services/api.js"; // Import your API service function
import {
  getD1Top10SpendDiff,
  getD1Top5POValue,
  getD1LineSpend,
  getD1BarSpend,
  getD1LinePOQuantity,
  getD1BarPurchaseQ,
  getD1LineSupplierQuantity,
  getD1BarSupplierQ,
  getD1CategorySpend,
  getD1DonutSpend,
  getD1PONumSpend,
} from "../services/api_D1.js";
import { CSVLink } from "react-csv"; // Import CSVLink from react-csv

const Dashboard1 = () => {
  const [selectedYear, setSelectedYear] = useState(""); // State to hold the selected year
  const [selectedCategory, setSelectedCategory] = useState(""); // State to hold the selected category

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

  const formatTotal = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value);

  // Fetch available years using React Query
  const { data: yearsData, isLoading } = useQuery({
    queryKey: ["years"],
    queryFn: getYears,
  });

  const { data: categoryData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["category"],
    queryFn: getCategory,
  });

  // Set the default year to the most recent one
  useEffect(() => {
    if (yearsData && yearsData.years.length > 0) {
      const mostRecentYear = Math.max(...yearsData.years); // Get the most recent year
      setSelectedYear(mostRecentYear.toString()); // Set as default selected year
    }
  }, [yearsData]);

  const {
    data: top10SpendDiff,
    isLoading: isLoadingTop10SpendDiff,
    isError: isErrorTop10SpendDiff,
    error: errorTop10SpendDiff,
  } = useQuery({
    queryKey: ["top10SpendDiff", selectedYear, selectedCategory], // Unique query key for caching
    queryFn: () => getD1Top10SpendDiff(selectedYear, selectedCategory), // API call to fetch data based on year
    enabled: Boolean(selectedYear) && Boolean(selectedCategory), // Only run query if year and category are selected
  });

  const dataTablePrice =
    top10SpendDiff?.map((item) => ({
      matNR: item.MATNR,
      matName: item.MAKTX,
      priceHQ: Number(item.PRICE_HQ),
      priceDistrict: Number(item.PRICE_REGION),
      priceDiff: Number(item.PRICE_DIFF) - 1,
    })) || [];

  const csvTablePriceHeaders = [
    { label: "รหัสพัสดุ", key: "matNR" },
    { label: "ชื่อพัสดุ", key: "matName" },
    { label: "ราคาที่ส่วนกลาง", key: "priceHQ" },
    { label: "ราคาเฉลี่ยที่ กฟข.", key: "priceDistrict" },
    { label: "% ราคาที่แตกต่าง", key: "priceDiff" },
  ];

  // Format the data for CSV
  const formatCSVTablePriceData = (data) =>
    data.map((item) => ({
      matNR: item.matNR,
      matName: item.matName,
      priceHQ: formatPrice(item.priceHQ),
      priceDistrict: formatPrice(item.priceDistrict),
      priceDiff: formatPercentage(item.priceDiff),
    }));

  const csvTablePriceData = formatCSVTablePriceData(dataTablePrice); // Use your table data as CSV data

  const {
    data: top5POValue,
    isLoading: isLoadingTop5POValue,
    isError: isErrorTop5POValue,
    error: errorTop5POValue,
  } = useQuery({
    queryKey: ["top5POValue", selectedYear], // Unique query key for caching
    queryFn: () => getD1Top5POValue(selectedYear), // API call to fetch data based on year
    enabled: !!selectedYear, // Only run query if year is selected
  });

  const dataTableValue =
    top5POValue?.map((item) => ({
      district: item.DISTRICT_NAME,
      lessThanQuantity: Number(item.PERCENT_PO_LESS),
      totalQuantity: Number(item.TOTAL_PO),
      percentQuantity: Number(item.PO_LESS_EQUAL_500K_QUANTITY) / 100,
    })) || [];

  const csvTableValueHeaders = [
    { label: "หน่วยงานจัดซื้อ", key: "district" },
    { label: "จำนวน PO มูลค่าไม่เกิน 500,000 บาท", key: "lessThanQuantity" },
    { label: "จำนวน PO ทั้งหมด", key: "totalQuantity" },
    { label: "% PO มูลค่าไม่เกิน 500,000 บาท", key: "percentQuantity" },
  ];

  // Format the data for CSV
  const formatCSVTableValueData = (data) =>
    data.map((item) => ({
      district: item.district,
      lessThanQuantity: formatQuantity(item.lessThanQuantity),
      totalQuantity: formatQuantity(item.totalQuantity),
      percentQuantity: formatPercentage(item.percentQuantity),
    }));

  const csvTableValueData = formatCSVTableValueData(dataTableValue); // Use your table data as CSV data

  // Data mappings
  const months = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];

  const {
    data: lineSpend,
    isLoading: isLoadingLineSpend,
    isError: isErrorLineSpend,
    error: errorLineSpend,
  } = useQuery({
    queryKey: ["lineSpend", selectedYear], // Unique query key for caching
    queryFn: () => getD1LineSpend(selectedYear), // API call to fetch data based on year
    enabled: !!selectedYear, // Only run query if year is selected
  });

  // Ensure lineSpend data exists before mapping
  const dataLineSpend =
    lineSpend?.monthlySpend?.map((item, index) => ({
      month: months[index], // Map months to Thai abbreviations
      mat: item.matSpend / 1000000, // Convert matSpend to millions
      nonMat: item.nonMatSpend / 1000000, // Convert nonMatSpend to millions
      matDistricts: item.districtsMat, // Include this in the dataset
      nonMatDistricts: item.districtsNonMat, // Include this in the dataset
    })) || [];

  const {
    data: barSpend,
    isLoading: isLoadingBarSpend,
    isError: isErrorBarSpend,
    error: errorBarSpend,
  } = useQuery({
    queryKey: ["barSpend", selectedYear], // Unique query key for caching
    queryFn: () => getD1BarSpend(selectedYear), // API call to fetch data based on year
    enabled: !!selectedYear, // Only run query if year is selected
  });

  const dataBarSpend = [
    {
      name: "พัสดุอุปกรณ์ไฟฟ้า (รหัส 100 - 108)",
      value: (barSpend?.TOTAL_SPEND_MAT || 0) / 1000000,
    },
    {
      name: "อื่นๆ",
      value: (barSpend?.TOTAL_SPEND_NON_MAT || 0) / 1000000,
    },
  ];

  const {
    data: linePOQuantity,
    isLoading: isLoadingLinePOQuantity,
    isError: isErrorLinePOQuantity,
    error: errorLinePOQuantity,
  } = useQuery({
    queryKey: ["linePoQuantity", selectedYear], // Unique query key for caching
    queryFn: () => getD1LinePOQuantity(selectedYear), // API call to fetch data based on year
    enabled: !!selectedYear, // Only run query if year is selected
  });

  // Ensure linePOQuantity data exists before mapping
  const dataLinePOQuantity =
    linePOQuantity?.monthlySpend?.map((item, index) => ({
      month: months[index], // Map months to Thai abbreviations
      mat: item.matPO,
      nonMat: item.nonMatPO,
      matDistricts: item.districtsMat,
      nonMatDistricts: item.districtsNonMat,
    })) || [];

  const {
    data: barPurchaseQ,
    isLoading: isLoadingbarPurchaseQ,
    isError: isErrorbarPurchaseQ,
    error: errorbarPurchaseQ,
  } = useQuery({
    queryKey: ["barPurchaseQ", selectedYear], // Unique query key for caching
    queryFn: () => getD1BarPurchaseQ(selectedYear), // API call to fetch data based on year
    enabled: !!selectedYear, // Only run query if year is selected
  });

  const dataBarPurchaseQ = [
    {
      name: "พัสดุอุปกรณ์ไฟฟ้า (รหัส 100 - 108)",
      value: barPurchaseQ?.TOTAL_PO_MAT || 0,
    },
    {
      name: "อื่นๆ",
      value: barPurchaseQ?.TOTAL_PO_NON_MAT || 0,
    },
  ];

  const {
    data: lineSupplierQuantity,
    isLoading: isLoadingLineSupplierQuantity,
    isError: isErrorLineSupplierQuantity,
    error: errorLineSupplierQuantity,
  } = useQuery({
    queryKey: ["lineSupplierQuantity", selectedYear], // Unique query key for caching
    queryFn: () => getD1LineSupplierQuantity(selectedYear), // API call to fetch data based on year
    enabled: !!selectedYear, // Only run query if year is selected
  });

  // Ensure lineSupplierQuantity data exists before mapping
  const dataLineSupplierQuantity =
    lineSupplierQuantity?.monthlySpend?.map((item, index) => ({
      month: months[index], // Map months to Thai abbreviations
      mat: item.matVenders,
      nonMat: item.nonMatVenders,
      matDistricts: item.districtsMat, // Include this in the dataset
      nonMatDistricts: item.districtsNonMat, // Include this in the dataset
    })) || [];

  const {
    data: barSupplierQ,
    isLoading: isLoadingbarSupplierQ,
    isError: isErrorbarSupplierQ,
    error: errorbarSupplierQ,
  } = useQuery({
    queryKey: ["barSupplierQ", selectedYear], // Unique query key for caching
    queryFn: () => getD1BarSupplierQ(selectedYear), // API call to fetch data based on year
    enabled: !!selectedYear, // Only run query if year is selected
  });

  const dataBarSupplierQ = [
    {
      name: "พัสดุอุปกรณ์ไฟฟ้า (รหัส 100 - 108)",
      value: barSupplierQ?.TOTAL_SUPPLIER_MAT || 0,
    },
    {
      name: "อื่นๆ",
      value: barSupplierQ?.TOTAL_SUPPLIER_NON_MAT || 0,
    },
  ];

  const {
    data: categorySpend,
    isLoading: isLoadingCategorySpend,
    isError: isErrorCategorySpend,
    error: errorCategorySpend,
  } = useQuery({
    queryKey: ["categorySpend", selectedYear], // Unique query key for caching
    queryFn: () => getD1CategorySpend(selectedYear), // API call to fetch data based on year is selected
    enabled: Boolean(selectedYear), // Only run query if year is selected
  });

  const dataCategorySpend =
    categorySpend?.map((item) => ({
      name: item.CATEGORY_NAME,
      value: item.TOTAL_SPEND / 1000000,
    })) || [];

  const {
    data: donutSpend,
    isLoading: isLoadingDonutSpend,
    isError: isErrorDonutSpend,
    error: errorDonutSpend,
  } = useQuery({
    queryKey: ["donutSpend", selectedYear], // Unique query key for caching
    queryFn: () => getD1DonutSpend(selectedYear), // API call to fetch data based on year
    enabled: !!selectedYear, // Only run query if year is selected
  });

  const dataDonutSpend = [
    {
      name: "ส่วนกลาง (ฝวห.)",
      value: donutSpend?.TOTAL_SPEND_HQ / 1000000 || 0,
    },
    {
      name: "ส่วนกลาง (อื่นๆ)",
      value: donutSpend?.TOTAL_SPEND_HQ_OTHER / 1000000 || 0,
    },
    {
      name: "กฟข. / กฟฟ. หน้างาน",
      value: donutSpend?.TOTAL_SPEND_REGION / 1000000 || 0,
    },
  ];

  // Fetch PO Number Spend data for MapChart
  const {
    data: PONumSpend,
    isLoading: isLoadingPONumSpend,
    isError: isErrorPONumSpend,
    error: errorPONumSpend,
  } = useQuery({
    queryKey: ["PONumSpend", selectedYear],
    queryFn: () => getD1PONumSpend(selectedYear),
    enabled: !!selectedYear,
  });

  // Transform data for MapChart
  const dataPONumSpend =
    PONumSpend?.map((item) => [
      {
        location: item.EKGRP,
        type: "TOTAL_PO_MAT",
        position: getLocationCoordinates(item.EKGRP),
        value: Number(item.TOTAL_PO_MAT || 0),
      },
      {
        location: item.EKGRP,
        type: "TOTAL_SPEND_MAT",
        position: getLocationCoordinates(item.EKGRP),
        value: Number(item.TOTAL_SPEND_MAT || 0) / 1_000_000,
      },
    ])?.flat() || [];

  const {
    data: PONumSpendCSV,
    isLoading: isLoadingPONumSpendCSV,
    isError: isErrorPONumSpendCSV,
    error: errorPONumSpendCSV,
  } = useQuery({
    queryKey: ["PONumSpendCSV", selectedYear],
    queryFn: () => getD1PONumSpend(selectedYear),
    enabled: !!selectedYear,
  });

  const dataPONumSpendCSV =
    PONumSpendCSV?.map((item) => [
      {
        location: item.EKGRP,
        valuePO: Number(item.TOTAL_PO_MAT || 0),
        valueSpend: Number(item.TOTAL_SPEND_MAT || 0) / 1_000_000,
      },
    ])?.flat() || [];

  const csvMapHeaders = [
    { label: "หน่วยงานจัดซื้อ", key: "location" },
    { label: "จำนวน PO สั่งซื้อพัสดุสะสม", key: "valuePO" },
    { label: "มูลค่าจัดซื้อพัสดุสะสม (ล้านบาท)", key: "valueSpend" },
  ];

  const LOCATION_NAMES = {
    A: "กฟน.1",
    B: "กฟน.2",
    C: "กฟน.3",
    D: "กฟฉ.1",
    E: "กฟฉ.2",
    F: "กฟฉ.3",
    G: "กฟก.1",
    H: "กฟก.2",
    I: "กฟก.3",
    J: "กฟต.1",
    K: "กฟต.2",
    L: "กฟต.3",
    U: "ตัวอย่าง", // Example text in Thai
    Z: "ส่วนกลาง",
  };

  // Format the data for CSV
  const formatCSVTableMapData = (data) =>
    data.map((item) => ({
      location: LOCATION_NAMES[item.location] || item.location,
      valuePO: formatQuantity(item.valuePO),
      valueSpend: formatTotal(item.valueSpend),
    }));

  const csvMapData = formatCSVTableMapData(dataPONumSpendCSV); // Use your table data as CSV data

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

  return (
    <div>
      <NavbarComponent />
      <div className="year-dropdown-container">
        <YearDropdown
          onSelectYear={setSelectedYear}
          selectedYear={selectedYear}
        />
      </div>
      <div className="dashboard1-container">
        <div className="table-container-L1">
          <div className="table-top-price-diff">
            <div className="dropdown-download-container">
              <div className="D1-dropdown-cat-group">
                {isCategoriesLoading ? (
                  <p>Loading categories...</p>
                ) : (
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">-- เลือกประเภทพัสดุ --</option>
                    {categoryData
                      ?.slice() // Create a shallow copy of the array to avoid modifying the original
                      .sort((a, b) => {
                        if (a.CATEGORY_ID === "100") return -1; // Move `100` to the top
                        if (b.CATEGORY_ID === "100") return 1;
                        return a.CATEGORY_ID.localeCompare(b.CATEGORY_ID); // Default alphabetical sort by ID
                      })
                      .map((category, index) => (
                        <option key={index} value={category.CATEGORY_ID}>
                          {`${category.CATEGORY_ID}: ${category.CATEGORY_NAME}`}
                        </option>
                      ))}
                  </select>
                )}
              </div>
              <div className="download-button">
                <CSVLink
                  data={csvTablePriceData}
                  headers={csvTablePriceHeaders}
                  filename={`HQvsDistrictPriceComparison_${selectedYear}_${selectedCategory}.csv`}
                  style={getButtonStyle(false)} // Apply the button style
                >
                  Download CSV
                </CSVLink>
              </div>
            </div>
            <TableD1Price
              title={`Top 10 รายการพัสดุที่มีราคาจัดซื้อระหว่างส่วนกลาง และ กฟข. แตกต่างกันมากที่สุด ปี ${selectedYear}`}
              data={dataTablePrice}
            />
            <div className="remark-container">
              <p> ⓘ หมายเหตุ:</p>
              <p>
                1. ราคาที่แสดงเป็นราคาเฉลี่ยในปีปัจจุบัน
                ยกเว้นหากไม่มีการจัดซื้อในปีที่เลือกแสดง
                จะใช้ราคาเฉลี่ยของปีก่อนหน้าที่มีการจัดซื้อ
              </p>
              <p>2. *คือพัสดุที่มีการจ้างรีดที่ส่วนกลางด้วยอลูมิเนียมอินกอท</p>
            </div>
          </div>
          <div className="table-top-povalue-count">
            <div className="download-container">
              <div className="download-button">
                <CSVLink
                  data={csvTableValueData}
                  headers={csvTableValueHeaders}
                  filename={`DistrictPOValueComparison_${selectedYear}.csv`}
                  style={getButtonStyle(false)} // Apply the button style
                >
                  Download CSV
                </CSVLink>
              </div>
            </div>
            <TableD1Value
              title={`การจัดซื้อที่มีมูลค่าไม่เกิน 500,000 บาท ปี ${selectedYear}`}
              data={dataTableValue}
            />
          </div>
        </div>
        <div className="top-D1-grid-container">
          <div className="left">
            <LineGraphRe
              data={dataLineSpend}
              xAxisKey="month" // X-axis is month
              lineKeys={["mat", "nonMat"]}
              title={`มูลค่าการจัดหาทั้งหมดของ กฟภ. (ล้านบาท) ในปี ${selectedYear}`}
              height={300} // Adjust height as needed
            />
          </div>
          <div className="right">
            <BarGraphReV
              data={dataBarSpend}
              xAxisKey="name"
              barKey="value"
              title={`มูลค่าการจัดหาทั้งหมดของ กฟภ. (ล้านบาท) ในปี ${selectedYear}`}
              height={330}
            />
            <p className="mat-legend">▬▬ พัสดุอุปกรณ์ไฟฟ้า (รหัส 100 - 108)</p>
            <p className="nonMat-legend">▬▬ อื่นๆ</p>
          </div>
        </div>
        <div className="top-D1-grid-container">
          <div className="left">
            <LineGraphReNumPO
              data={dataLinePOQuantity}
              xAxisKey="month"
              lineKeys={["mat", "nonMat"]}
              title={`จำนวนใบสั่งซื้อ (PO) ในปี ${selectedYear}`}
              height={230}
            />
          </div>
          <div className="right">
            <BarGraphReV
              data={dataBarPurchaseQ}
              xAxisKey="name"
              barKey="value"
              title={`จำนวนใบสั่งซื้อ (PO) ในปี ${selectedYear}`}
              height={330}
            />
            <p className="mat-legend">▬▬ พัสดุอุปกรณ์ไฟฟ้า (รหัส 100 - 108)</p>
            <p className="nonMat-legend">▬▬ อื่นๆ</p>
            <p>
              ⓘ หมายเหตุ: บาง PO มีการจัดซื้อทั้งพัสดุอุปกรณ์ไฟฟ้า และ อื่นๆ
              จึงทำให้ผลรวมคลาดเคลื่อนกับจำนวน PO จัดหาทั้งหมดของ กฟภ.
            </p>
          </div>
        </div>
        <div className="top-D1-grid-container">
          <div className="left">
            <LineGraphReNumPO
              data={dataLineSupplierQuantity}
              xAxisKey="month"
              lineKeys={["mat", "nonMat"]}
              title={`จำนวน Supplier ในปี ${selectedYear}`}
              height={230}
            />
            <p>
              ⓘ หมายเหตุ: นับเฉพาะ Supplier ที่เคยมีสัญญาจัดซื้อกับ กฟภ.
              อย่างน้อย 1 ครั้งในระยะเวลานั้นๆ; Supplier
              บางเจ้าอาจจะอยู่หลายเขตทำให้จำนวนรวมคลาดเคลื่อน
            </p>
          </div>
          <div className="right">
            <BarGraphReV
              data={dataBarSupplierQ}
              xAxisKey="name"
              barKey="value"
              title={`จำนวน Supplier ในปี ${selectedYear}`}
              height={330}
            />
            <p className="mat-legend">▬▬ พัสดุอุปกรณ์ไฟฟ้า (รหัส 100 - 108)</p>
            <p className="nonMat-legend">▬▬ อื่นๆ</p>
          </div>
        </div>
        <div className="middle-D1-container">
          <div className="bubble-graph">
            <h1 className="bubble-title">
              {`มูลค่าจัดซื้อตามประเภทพัสดุ (ล้านบาท) ในปี ${selectedYear}`}
            </h1>
            <BubbleChart
              style={{ width: "100%", height: "100%" }}
              data={dataCategorySpend}
            />
          </div>
          <div className="donut-Graph">
            <DonutChartRe
              data={dataDonutSpend}
              title={`มูลค่าจัดซื้อพัสดุตามหน่วยงานจัดซื้อ (ล้านบาท) ในปี ${selectedYear}`}
              height={700}
            />
          </div>
        </div>
        <div className="bottom-D1-container">
          <div className="D1-CSV-container">
            <div className="download-button">
              <CSVLink
                data={csvMapData}
                headers={csvMapHeaders}
                filename={`PurchaseUnitbyPONumAndValue_${selectedYear}.csv`}
                style={getButtonStyle(false)} // Apply the button style
              >
                Download CSV
              </CSVLink>
            </div>
          </div>
          <div className="map-wrapper">
            <div className="map-container">
              <MapChart data={dataPONumSpend} />
            </div>
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

// Helper function to map location keys to coordinates
const getLocationCoordinates = (key) => {
  const coordinates = {
    A: [98.9933, 18.7877], // Chiang Mai
    B: [100.2741, 16.8248], // Phitsanulok
    C: [100.9925, 15.87], // Lopburi
    D: [102.7896, 17.4157], // Udon Thani (Corrected from original)
    E: [104.85, 15.2381], // Ubon Ratchathani (Refined coordinates)
    F: [102.1339, 14.9799], // Nakhon Ratchasima
    G: [100.5777, 14.351], // Ayutthaya (Corrected)
    H: [101.4909, 13.3624], // Chonburi (Adjusted coordinates)
    I: [99.7741, 13.8199], // Nakhon Pathom (Adjusted)
    J: [99.6178, 13.1107], // Phetchaburi
    K: [99.963, 8.43], // Nakhon Si Thammarat (Corrected)
    L: [101.251, 6.5426], // Yala (Refined coordinates)
    U: [99.5, 18.0], // Example (Placeholder)
    Z: [100.5018, 13.7563], // Bangkok (Corrected)
  };
  return coordinates[key] || [100.9925, 13.7563]; // Default to Bangkok if key not found
};

export default Dashboard1;
