import React, { useState, useEffect } from "react";
import NavbarComponent from "../ComponentsPage/NavbarComponent";
import BackgroundComponent from "../ComponentsPage/BackgroundComponent";
import BubbleChart from "./BubbleChart.js";
import "../ComponentsStyles/Dashboard1.css"; // Updated to use Dashboard1.css
import YearDropdown from "./YearDropdown";
import MapChart from "./MapChart.js";
import LineGraphRe from "./LineGraphRe.js";
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
} from "../services/api.js"; // Import your API service function

const Dashboard1 = () => {
  const [selectedYear, setSelectedYear] = useState(""); // State to hold the selected year

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

  const dataBubble = [
    { name: "สายไฟและอุปกรณ์ประกอบ", value: 6168 },
    { name: "หม้อแปลง แคแปซิเตอร์ โวลเตจเรกูเรเตอร์", value: 4003 },
    { name: "ลูกถ้วยและอุปกรณ์ประกอบ", value: 1767 },
    { name: "เสา คอน คาน สมอบกคอนกรีต", value: 1645 },
    { name: "อุปกรณ์ป้องกันและสวิตซ์", value: 2138 },
    { name: "Pole line hardware", value: 1428 },
    { name: "มิเตอร์ ซีที. พีที.", value: 1380 },
    { name: "อื่นๆ", value: 926 },
  ];

  const {
    data: top10SpendDiff,
    isLoading: isLoadingTop10SpendDiff,
    isError: isErrorTop10SpendDiff,
    error: errorTop10SpendDiff,
  } = useQuery({
    queryKey: ["top10SpendDiff", selectedYear], // Unique query key for caching
    queryFn: () => getD1Top10SpendDiff(selectedYear), // API call to fetch data based on year
    enabled: !!selectedYear, // Only run query if year is selected
  });

  const dataTablePrice =
    top10SpendDiff?.map((item) => ({
      matNR: item.MATNR,
      matName: item.MAKTX,
      priceDiff: `${(Number(item.PRICE_DIFF) * 100).toFixed(2)}%`,
      priceDistrict: Number(item.PRICE_REGION),
      priceHQ: Number(item.PRICE_HQ),
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
      percentQuantity: `${Number(item.PO_LESS_EQUAL_500K_QUANTITY).toFixed(
        2
      )}%`,
      lessThanQuantity: Number(item.PERCENT_PO_LESS),
      totalQuantity: Number(item.TOTAL_PO),
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
    lineSpend?.TOTAL_SPEND_MONTHLY?.map((value, index) => ({
      month: months[index],
      value: value / 1000000, // Format the value as a localized string for Thailand
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
    { name: "พัสดุ", value: (barSpend?.TOTAL_SPEND_MAT || 0) / 1000000 },
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
    linePOQuantity?.TOTAL_PO_MONTHLY?.map((value, index) => ({
      month: months[index],
      value: value, // Format the value as a localized string for Thailand
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
    { name: "พัสดุ", value: barPurchaseQ?.TOTAL_PO_MAT || 0 },
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
    lineSupplierQuantity?.TOTAL_SUPPLIER_MONTHLY?.map((value, index) => ({
      month: months[index],
      value: value, // Format the value as a localized string for Thailand
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
    { name: "พัสดุ", value: barSupplierQ?.TOTAL_SUPPLIER_MAT || 0 },
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
            <TableD1Price
              title="Top 10 พัสดุที่มีราคาจัดซื้อระหว่างกฟข. และ ส่วนกลางแตกต่างกันมากที่สุด"
              data={dataTablePrice}
            />
          </div>
          <div className="table-top-povalue-count">
            <TableD1Value
              title="Top 5 เขตที่มีการจัดซื้อมูลค่าไม่เกิน 500,000 มากที่สุด"
              data={dataTableValue}
            />
          </div>
        </div>
        <div className="top-D1-grid-container">
          <div className="left">
            <LineGraphRe
              data={dataLineSpend}
              xAxisKey="month"
              lineKey="value"
              title="ยอดจัดซื้อทั้งหมด (ล้านบาท)"
              height={230}
            />
          </div>
          <div className="right">
            <BarGraphReV
              data={dataBarSpend}
              xAxisKey="name"
              barKey="value"
              title="ยอดจัดซื้อทั้งหมดแบ่งตามประเภทจัดซื้อ (ล้านบาท)"
              height={330}
            />
          </div>
        </div>
        <div className="top-D1-grid-container">
          <div className="left">
            <LineGraphRe
              data={dataLinePOQuantity}
              xAxisKey="month"
              lineKey="value"
              title="จำนวนใบสั่งซื้อ (PO) (รายการ)"
              height={230}
            />
          </div>
          <div className="right">
            <BarGraphReV
              data={dataBarPurchaseQ}
              xAxisKey="name"
              barKey="value"
              title="จำนวนใบสั่งซื้อ (PO) แบ่งตามประเภทการจัดซื้อ(รายการ)"
              height={330}
            />
          </div>
        </div>
        <div className="top-D1-grid-container">
          <div className="left">
            <LineGraphRe
              data={dataLineSupplierQuantity}
              xAxisKey="month"
              lineKey="value"
              title="จำนวน Supplier ทั้งหมด"
              height={230}
            />
            <h1 className="text-subtitle">
              หมายเหตุ: นับเฉพาะ Supplier ที่เคยมีการจัดซื้อกับกฟภ.อย่างน้อย 1
              ครั้ง
            </h1>
          </div>
          <div className="right">
            <BarGraphReV
              data={dataBarSupplierQ}
              xAxisKey="name"
              barKey="value"
              title="จำนวน Supplier ทั้งหมดแบ่งตามประเภทจัดซื้อ (ราย)"
              height={330}
            />
          </div>
        </div>
        <div className="middle-D1-container">
          <div className="bubble-graph">
            <h1 className="text-title">
              ประเภทพัสดุตามมูลค่าจัดซื้อ (ล้านบาท)
            </h1>
            <BubbleChart
              style={{ width: "100%", height: "90%" }}
              data={dataCategorySpend}
            />
          </div>
          <div className="donut-Graph">
            <DonutChartRe
              data={dataDonutSpend}
              title="ยอดพัสดุตามหน่วยงาน (ล้านบาท)"
              height={500}
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
