import React, { useState, useEffect } from "react";
import NavbarComponent from "../ComponentsPage/NavbarComponent";
import BackgroundComponent from "../ComponentsPage/BackgroundComponent";
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
import {
  getYears,
  getD1Top10SpendDiff,
  getD1Top5POValue,
  getD1BarSpend,
  getD1BarPurchaseQ,
  getD1BarSupplierQ,
  getD1LineSpend,
  getD1LinePOQuantity,
  getD1LineSupplierQuantity,
  getD1DonutSpend,
  getD1PONumSpend,
  getD1CategorySpend,
  getCategory,
  getDateInfo,
} from "../services/api.js"; // Import your API service function

const Dashboard1 = () => {
  const [selectedYear, setSelectedYear] = useState(""); // State to hold the selected year
  const [selectedCategory, setSelectedCategory] = useState(""); // State to hold the selected category

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
      percentQuantity: Number(item.PO_LESS_EQUAL_500K_QUANTITY),
    })) || [];

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
      name: "เขต/หน้างาน",
      value: donutSpend?.TOTAL_SPEND_REGION / 1000000 || 0,
    },
  ];

  const query = useQuery({
    queryKey: ["PONumSpend", selectedYear],
    queryFn: () => getD1PONumSpend(selectedYear),
    enabled: !!selectedYear, // Ensure query runs only if a year is selected
  });

  const {
    data: PONumSpend,
    isLoadingPONumbSpend,
    isErrorPONumSpend,
    errorPONumSpend,
  } = query;

  if (isLoadingPONumbSpend) return <div>Loading map data...</div>;
  if (isErrorPONumSpend) return <div>Error: {error.message}</div>;

  // Safely access EKGRP_RESULTS or use an empty object if unavailable
  const ekgrpResults = PONumSpend?.EKGRP_RESULTS || {};

  // Transform the data for the MapChart
  const dataPONumSpend = Object.entries(ekgrpResults).flatMap(
    ([key, value]) => [
      {
        location: key,
        type: "TOTAL_PO_MAT",
        position: getLocationCoordinates(key),
        value: Number(value?.TOTAL_PO_MAT || 0), // Default to 0 if undefined
      },
      {
        location: key,
        type: "TOTAL_SPEND_MAT",
        position: getLocationCoordinates(key),
        value: Number(value?.TOTAL_SPEND_MAT) / 1000000 || 0, // Default to 0 if undefined
      },
    ]
  );

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
      <BackgroundComponent />
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
            <div className="dropdown-cat-group">
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
            <TableD1Price
              title={`Top 10 รายการพัสดุที่มีราคาจัดซื้อระหว่างส่วนกลาง และ กฟข. แตกต่างกันมากที่สุด ปี ${selectedYear}`}
              data={dataTablePrice}
            />
            <p>
              หมายเหตุ: ราคาที่แสดงเป็นราคาเฉลี่ยในปีปัจจุบัน
              ยกเว้นหากไม่มีการจัดซื้อในปีที่เลือกแสดง
              จะใช้ราคาเฉลี่ยของปีก่อนหน้าที่มีการจัดซื้อ{" "}
            </p>
          </div>
          <div className="table-top-povalue-count">
            <p></p>
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
            <p>
              หมายเหตุ: พัสดุอุปกรณ์ไฟฟ้าคือพัสดุหลัก พัสดุรองที่มีรหัสพัสดุ
              (รหัส 100 - 108) อื่นๆ หมายถึงงานจ้างบริการต่างๆ งานจัดซื้ออะไหล่
              และ งานเช่า เป็นต้น
            </p>
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
          </div>
        </div>
        <div className="top-D1-grid-container">
          <div className="left">
            <LineGraphRe
              data={dataLineSupplierQuantity}
              xAxisKey="month"
              lineKeys={["mat", "nonMat"]}
              title={`จำนวน Supplier ในปี ${selectedYear}`}
              height={230}
            />
            <p>
              หมายเหตุ: นับเฉพาะ Supplier ที่เคยมีสัญญาจัดซื้อกับ กฟภ. อย่างน้อย
              1 ครั้งในระยะเวลานั้นๆ
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
              height={800}
            />
          </div>
        </div>
        <div className="bottom-D1-container">
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
            ห้ามเผยแพร่ให้กับผู้ภายนอก
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