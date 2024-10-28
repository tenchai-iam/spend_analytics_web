import React, { useState, useEffect } from "react";
import "../ComponentsStyles/Dashboard2.css";
import Card from "./D2Card.js"; // Import the Card component
import BackgroundComponent from "../ComponentsPage/BackgroundComponent";
import YearDropdown from "./YearDropdown";
import NavbarComponent from "../ComponentsPage/NavbarComponent";
import BarGraphReH from "./BarGraphReH";
import { useQuery } from "@tanstack/react-query";
import {
  getYears,
  getD2SummaryData,
  getD2TopSupplier,
  getD2CategorySpend,
  getD2CategoryPOQuantity,
  getD2CategoryAverageSpend,
} from "../services/api.js"; // Import your API service function

const Dashboard2 = () => {
  const [selectedYear, setSelectedYear] = useState(""); // State to hold the selected year
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState(1); // State to hold the selected category id
  const [selectedButton, setSelectedButton] = useState(0); // Track selected button index
  const [isCardView, setIsCardView] = useState(true); // State to toggle between card and graph view

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

  // Fetch summary data for selected year and category using React Query
  const {
    data: dashboardData,
    isLoading: isLoadingData,
    isError,
    error,
  } = useQuery({
    queryKey: ["dashboardData", selectedYear, selectedCategoryGroup], // Unique query key for caching
    queryFn: () => getD2SummaryData(selectedYear, selectedCategoryGroup), // API call to fetch data based on year and category
    enabled: !!selectedYear && selectedCategoryGroup !== null, // Only run query if both year and category_group are selected
  });

  // Fetch top supplier data for selected year and category using React Query
  const {
    data: topSuppliersData,
    isLoading: isLoadingSuppliers,
    isError: isErrorSuppliers,
    error: errorSuppliers,
  } = useQuery({
    queryKey: ["topSuppliers", selectedYear, selectedCategoryGroup],
    queryFn: () => getD2TopSupplier(selectedYear, selectedCategoryGroup),
    enabled: !!selectedYear && selectedCategoryGroup !== null, // Only run query if both year and category_group are selected
  });

  // Handle data mapping for top suppliers
  const renderTopSuppliers = () => {
    if (!topSuppliersData || !topSuppliersData.top_suppliers) return null;

    const topSuppliers = topSuppliersData.top_suppliers;

    // Debugging: Log top suppliers data before rendering
    console.log("Top Suppliers Data: ", topSuppliers);

    return Object.keys(topSuppliers).map((supplierId) => {
      const supplier = topSuppliers[supplierId]; // Get each supplier's data

      return (
        <Card
          key={supplierId}
          SUPPLIER_NAME={supplier.SUPPLIER_NAME}
          TOTAL_SPEND={supplier.TOTAL_SPEND}
          TOTAL_PO={supplier.TOTAL_PO}
          SPEND_PER_PO={supplier.SPEND_PER_PO}
        />
      );
    });
  };

  const {
    data: barCategorySpend,
    isLoading: isLoadingBarCategorySpend,
    isError: isErrorBarCategorySpend,
    error: errorBarCategorySpend,
  } = useQuery({
    queryKey: ["barCategorySpend", selectedYear, selectedCategoryGroup], // Unique query key for caching
    queryFn: () => getD2CategorySpend(selectedYear, selectedCategoryGroup), // API call to fetch data based on year and category_group are selected
    enabled: !!selectedYear && selectedCategoryGroup !== null, // Only run query if year and category_group are selected
  });

  const dataBarCategorySpend =
    barCategorySpend?.top_suppliers?.map((supplier) => ({
      name: supplier.SUPPLIER_NAME,
      value: supplier.TOTAL_SPEND / 1000000,
    })) || [];

  const {
    data: barCategoryPOQuantity,
    isLoading: isLoadingBarCategoryPOQuantity,
    isError: isErrorBarCategoryPOQuantity,
    error: errorBarCategoryPOQuantity,
  } = useQuery({
    queryKey: ["barCategoryPOQuantity", selectedYear, selectedCategoryGroup], // Unique query key for caching
    queryFn: () => getD2CategoryPOQuantity(selectedYear, selectedCategoryGroup), // API call to fetch data based on year and category_group are selected
    enabled: !!selectedYear && selectedCategoryGroup !== null, // Only run query if year and category_group are selected
  });

  const dataBarCategoryPOQuantity =
    barCategoryPOQuantity?.top_suppliers?.map((supplier) => ({
      name: supplier.SUPPLIER_NAME,
      value: supplier.TOTAL_PO,
    })) || [];

  const {
    data: barCategoryAverageSpend,
    isLoading: isLoadingBarCategoryAverageSpend,
    isError: isErrorBarCategoryAverageSpend,
    error: errorBarCategoryAverageSpend,
  } = useQuery({
    queryKey: ["barCategoryAverageSpend", selectedYear, selectedCategoryGroup], // Unique query key for caching
    queryFn: () =>
      getD2CategoryAverageSpend(selectedYear, selectedCategoryGroup), // API call to fetch data based on year and category_group are selected
    enabled: !!selectedYear && selectedCategoryGroup !== null, // Only run query if year and category_group are selected
  });

  const dataBarCategoryAverageSpend =
    barCategoryAverageSpend?.top_suppliers?.map((supplier) => ({
      name: supplier.SUPPLIER_NAME,
      value: supplier.SPEND_PER_PO,
    })) || [];

  const toggleView = () => {
    setIsCardView(!isCardView); // Toggle between true (card view) and false (chart view)
  };

  const handleCategorySelect = (index, categoryGroup) => {
    setSelectedButton(index); // Highlight the selected button
    setSelectedCategoryGroup(categoryGroup); // Use the calculated category ID for fetching data
    console.log(
      `Button ${index} selected with category Group: ${categoryGroup}`
    );
  };

  return (
    <div>
      <NavbarComponent />
      <BackgroundComponent />
      <div className="year-dropdown-container">
        <YearDropdown
          onSelectYear={setSelectedYear}
          selectedYear={selectedYear}
        />
      </div>
      <div className="dashboard2-container">
        <div className="top-container">
          <h1 className="text-subtitle">เลือกกลุ่มพัสดุและปีที่ต้องการ</h1>
          <div className="btn-menu">
            {/* Button Controls */}
            <div className="button-group">
              {categories.map((label, index) => {
                // Calculate the category ID based on the button index
                const categoryGroup = index < 12 ? 1 + index : 99; // 1-12 for first 9 buttons, 99 for the last button
                return (
                  <button
                    key={index}
                    onClick={() => handleCategorySelect(index, categoryGroup)} // Send calculated category ID on click
                    style={{
                      backgroundColor:
                        selectedButton === index ? "#8e44ad" : "#f0f0f0",
                      color: selectedButton === index ? "white" : "black",
                      margin: "5px",
                      padding: "10px 20px",
                      border: "1px solid #ddd",
                      cursor: "pointer",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {/* <div className="middle-container">
          <h1 className="container-title">ภาพรวมคู่ค้าของกฟภ.</h1>
          {/* Check if dashboard2Data is available before rendering the values */}
        {/* {dashboardData ? (
            <>
              <h1 className="text-subtitle">
                จำนวนคู่ค้าทั้งหมดตามกลุ่มพัสดุที่เลือก:{" "}
                {dashboardData.data.TOTAL_SUPPLIER.toLocaleString("th-TH")}
              </h1>
              <h1 className="text-subtitle">
                จำนวนคู่ค้า Active ตามกลุ่มพัสดุที่เลือก:{" "}
                {dashboardData.data.TOTAL_CONT_SUPPLIER.toLocaleString("th-TH")}
              </h1>
            </>
          ) : (
            <h1 className="text-subtitle">Fetching data...</h1> */}
        {/* )} */}
        {/* </div> */}
        <div className="bottom-container">
          <h1 className="text-subtitle">Top 10 Suppliers</h1>
          {/* Toggle Button */}
          <button className="chart-button" onClick={toggleView}>
            {isCardView ? "Graph View" : "Card View"}
          </button>

          {/* Chart Container */}
          {isCardView ? (
            <div className="cards-grid-container">
              {isLoadingSuppliers ? (
                <h1 className="text-subtitle">Loading Top Suppliers...</h1>
              ) : isErrorSuppliers ? (
                <h1 className="text-subtitle">
                  Error: {errorSuppliers.message}
                </h1>
              ) : (
                renderTopSuppliers()
              )}
            </div>
          ) : (
            <div className="charts-grid-container">
              <BarGraphReH
                data={dataBarCategorySpend}
                yAxisKey="name"
                barKey="value"
                title="ยอดจัดซื้อทั้งหมดแบ่งตามประเภทจัดซื้อ (ล้านบาท)"
                height={700}
              />
              <BarGraphReH
                data={dataBarCategoryPOQuantity}
                yAxisKey="name"
                barKey="value"
                title="จำนวนรายการ PO"
                height={700}
              />
              <BarGraphReH
                data={dataBarCategoryAverageSpend}
                yAxisKey="name"
                barKey="value"
                title="มูลค่าต่อ PO (บาท)"
                height={700}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard2;
