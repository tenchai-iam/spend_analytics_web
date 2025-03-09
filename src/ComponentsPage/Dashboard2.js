import React, { useState, useEffect } from "react";
import "../ComponentsStyles/Dashboard2.css";
import Card from "./D2Card.js"; // Import the Card component
import YearDropdown from "./YearDropdown.js";
import NavbarComponent from "./NavbarComponent.js";
import BarGraphReH from "./BarGraphReH.js";
import { useQuery } from "@tanstack/react-query";
import { getYears, getDateInfo } from "../services/api.js"; // Import your API service function
import {
  getD2TopSupplier,
  getD2CategorySpendByValue,
  getD2CategoryPOQuantityByValue,
  getD2CategoryAverageSpendByValue,
  getD2CategorySpendByPO,
  getD2CategoryPOQuantityByPO,
  getD2CategoryAverageSpendByPO,
  getD2CategorySpendByAveragePO,
  getD2CategoryPOQuantityByAveragePO,
  getD2CategoryAverageSpendByAveragePO,
} from "../services/api_D2.js";

const Dashboard2 = () => {
  const [selectedYear, setSelectedYear] = useState(""); // State to hold the selected year
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState(0); // State to hold the selected category id
  const [selectedButton, setSelectedButton] = useState(0); // Track selected button index
  const [isCardView, setIsCardView] = useState(true); // State to toggle between card and graph view
  const [currentBarView, setCurrentBarView] = useState(1); // State to toggle between card and graph view

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
    queryFn: () =>
      getD2CategorySpendByValue(selectedYear, selectedCategoryGroup), // API call to fetch data based on year and category_group are selected
    enabled: !!selectedYear && selectedCategoryGroup !== null, // Only run query if year and category_group are selected
  });

  const dataBarCategorySpend =
    barCategorySpend?.top_suppliers?.map((supplier) => ({
      name: supplier.SUPPLIER_NAME,
      valueHQ: supplier.TOTAL_SPEND_HQ / 1000000,
      valueDistrict: supplier.TOTAL_SPEND_DISTRICT / 1000000,
    })) || [];

  const {
    data: barCategoryPOQuantity,
    isLoading: isLoadingBarCategoryPOQuantity,
    isError: isErrorBarCategoryPOQuantity,
    error: errorBarCategoryPOQuantity,
  } = useQuery({
    queryKey: ["barCategoryPOQuantity", selectedYear, selectedCategoryGroup], // Unique query key for caching
    queryFn: () =>
      getD2CategoryPOQuantityByValue(selectedYear, selectedCategoryGroup), // API call to fetch data based on year and category_group are selected
    enabled: !!selectedYear && selectedCategoryGroup !== null, // Only run query if year and category_group are selected
  });

  const dataBarCategoryPOQuantity =
    barCategoryPOQuantity?.top_suppliers_po?.map((supplier) => ({
      name: supplier.SUPPLIER_NAME,
      valueHQ: Number(supplier.PO_HQ),
      valueDistrict: Number(supplier.PO_DISTRICT),
    })) || [];

  const {
    data: barCategoryAverageSpend,
    isLoading: isLoadingBarCategoryAverageSpend,
    isError: isErrorBarCategoryAverageSpend,
    error: errorBarCategoryAverageSpend,
  } = useQuery({
    queryKey: ["barCategoryAverageSpend", selectedYear, selectedCategoryGroup], // Unique query key for caching
    queryFn: () =>
      getD2CategoryAverageSpendByValue(selectedYear, selectedCategoryGroup), // API call to fetch data based on year and category_group are selected
    enabled: !!selectedYear && selectedCategoryGroup !== null, // Only run query if year and category_group are selected
  });

  const dataBarCategoryAverageSpend =
    barCategoryAverageSpend?.top_suppliers_spend_by_po?.map((supplier) => ({
      name: supplier.SUPPLIER_NAME,
      valueHQ: supplier.SPEND_BY_PO_HQ,
      valueDistrict: supplier.SPEND_BY_PO_DISTRICT,
    })) || [];

  const {
    data: barCategorySpendByPO,
    isLoading: isLoadingBarCategorySpendByPO,
    isError: isErrorBarCategorySpendByPO,
    error: errorBarCategorySpendByPO,
  } = useQuery({
    queryKey: ["barCategorySpendByPO", selectedYear, selectedCategoryGroup], // Unique query key for caching
    queryFn: () => getD2CategorySpendByPO(selectedYear, selectedCategoryGroup), // API call to fetch data based on year and category_group are selected
    enabled: !!selectedYear && selectedCategoryGroup !== null, // Only run query if year and category_group are selected
  });

  const dataBarCategorySpendByPO =
    barCategorySpendByPO?.top_suppliers?.map((supplier) => ({
      name: supplier.SUPPLIER_NAME,
      valueHQ: supplier.TOTAL_SPEND_HQ / 1000000,
      valueDistrict: supplier.TOTAL_SPEND_DISTRICT / 1000000,
    })) || [];

  const {
    data: barCategoryPOQuantityByPO,
    isLoading: isLoadingBarCategoryPOQuantitydByPO,
    isError: isErrorBarCategoryPOQuantityByPO,
    error: errorBarCategoryPOQuantityByPO,
  } = useQuery({
    queryKey: [
      "barCategoryPOQuantityByPO",
      selectedYear,
      selectedCategoryGroup,
    ], // Unique query key for caching
    queryFn: () =>
      getD2CategoryPOQuantityByPO(selectedYear, selectedCategoryGroup), // API call to fetch data based on year and category_group are selected
    enabled: !!selectedYear && selectedCategoryGroup !== null, // Only run query if year and category_group are selected
  });

  const dataBarCategoryPOQuantityByPO =
    barCategoryPOQuantityByPO?.top_suppliers_po?.map((supplier) => ({
      name: supplier.SUPPLIER_NAME,
      valueHQ: supplier.PO_HQ,
      valueDistrict: supplier.PO_DISTRICT,
    })) || [];

  // View 2.3 Average PO Rank by Average PO

  const {
    data: barCategoryAverageSpendByPO,
    isLoading: isLoadingBarCategoryAverageSpendByPO,
    isError: isErrorBarCategoryAverageSpendByPO,
    error: errorBarCategoryAverageSpendByPO,
  } = useQuery({
    queryKey: [
      "barCategoryAverageSpendByPO",
      selectedYear,
      selectedCategoryGroup,
    ], // Unique query key for caching
    queryFn: () =>
      getD2CategoryAverageSpendByPO(selectedYear, selectedCategoryGroup), // API call to fetch data based on year and category_group are selected
    enabled: !!selectedYear && selectedCategoryGroup !== null, // Only run query if year and category_group are selected
  });

  const dataBarCategoryAverageSpendByPO =
    barCategoryAverageSpendByPO?.top_suppliers_spend_by_po?.map((supplier) => ({
      name: supplier.SUPPLIER_NAME,
      valueHQ: supplier.SPEND_BY_PO_HQ,
      valueDistrict: supplier.SPEND_BY_PO_DISTRICT,
    })) || [];

  // View 3.1 Average PO Value Rank by Average PO

  const {
    data: barCategoryAverageSpendByAveragePO,
    isLoading: isLoadingBarCategoryAverageSpendByAveragePO,
    isError: isErrorBarCategoryAverageSpendByAveragePO,
    error: errorBarCategoryAverageSpendByAveragePO,
  } = useQuery({
    queryKey: [
      "barCategoryAverageSpendByAveragePO",
      selectedYear,
      selectedCategoryGroup,
    ], // Unique query key for caching
    queryFn: () =>
      getD2CategoryAverageSpendByAveragePO(selectedYear, selectedCategoryGroup), // API call to fetch data based on year and category_group are selected
    enabled: !!selectedYear && selectedCategoryGroup !== null, // Only run query if year and category_group are selected
  });

  const dataBarCategoryAverageSpendByAveragePO =
    barCategoryAverageSpendByAveragePO?.top_suppliers_spend_by_po?.map(
      (supplier) => ({
        name: supplier.SUPPLIER_NAME,
        valueHQ: supplier.SPEND_BY_PO_HQ,
        valueDistrict: supplier.SPEND_BY_PO_DISTRICT,
      })
    ) || [];

  // View 3.2 Spend Rank by Average PO

  const {
    data: barCategorySpendByAveragePO,
    isLoading: isLoadingBarCategorySpendByAveragePO,
    isError: isErrorBarCategorySpendByAveragePO,
    error: errorBarCategorySpendByAveragePO,
  } = useQuery({
    queryKey: [
      "barCategorySpendByAveragePO",
      selectedYear,
      selectedCategoryGroup,
    ], // Unique query key for caching
    queryFn: () =>
      getD2CategorySpendByAveragePO(selectedYear, selectedCategoryGroup), // API call to fetch data based on year and category_group are selected
    enabled: !!selectedYear && selectedCategoryGroup !== null, // Only run query if year and category_group are selected
  });

  const dataBarCategorySpendByAveragePO =
    barCategorySpendByAveragePO?.top_suppliers?.map((supplier) => ({
      name: supplier.SUPPLIER_NAME,
      valueHQ: supplier.TOTAL_SPEND_HQ / 1000000,
      valueDistrict: supplier.TOTAL_SPEND_DISTRICT / 1000000,
    })) || [];

  // View 3.3 PO Quantity Rank by Average PO

  const {
    data: barCategoryPOQuantityByAveragePO,
    isLoading: isLoadingBarCategoryPOQuantitydByAveragePO,
    isError: isErrorBarCategoryPOQuantityByAveragePO,
    error: errorBarCategoryPOQuantityByAveragePO,
  } = useQuery({
    queryKey: [
      "barCategoryPOQuantityByAveragePO",
      selectedYear,
      selectedCategoryGroup,
    ], // Unique query key for caching
    queryFn: () =>
      getD2CategoryPOQuantityByAveragePO(selectedYear, selectedCategoryGroup), // API call to fetch data based on year and category_group are selected
    enabled: !!selectedYear && selectedCategoryGroup !== null, // Only run query if year and category_group are selected
  });

  const dataBarCategoryPOQuantityByAveragePO =
    barCategoryPOQuantityByAveragePO?.top_suppliers_po?.map((supplier) => ({
      name: supplier.SUPPLIER_NAME,
      valueHQ: supplier.PO_HQ,
      valueDistrict: supplier.PO_DISTRICT,
    })) || [];

  const toggleView = () => {
    setIsCardView(!isCardView); // Toggle between true (card view) and false (chart view)
  };

  const handleViewChange = (view) => {
    setCurrentBarView(view); // Change to the selected view
  };

  const handleCategorySelect = (index, categoryGroup) => {
    setSelectedButton(index); // Highlight the selected button
    setSelectedCategoryGroup(categoryGroup); // Use the calculated category ID for fetching data
    console.log(
      `Button ${index} selected with category Group: ${categoryGroup}`
    );
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

  return (
    <div>
      <NavbarComponent />
      <div className="text-dropdown-container">
        <h1 className="header-title">ภาพรวม Supplier</h1>
        <div className="year-dropdown-container">
          <YearDropdown
            onSelectYear={setSelectedYear}
            selectedYear={selectedYear}
          />
        </div>
      </div>
      <div className="dashboard2-container">
        <div className="btn-container">
          <h1 className="text-subtitle">
            Top 20 suppliers ตามมูลค่าจัดซื้อทั้งหมด จำนวนใบสั่งซื้อ และ
            มูลค่าจัดซื้อต่อ PO
          </h1>
          <div className="btn-menu">
            {/* Button Controls */}
            <div className="D2-button-group">
              {categories.map((label, index) => {
                // Calculate the category ID based on the button index
                const categoryGroup = index < 12 ? 0 + index : 99; // 0-12 for first 10 buttons, 99 for the last button
                return (
                  <button
                    key={index}
                    onClick={() => handleCategorySelect(index, categoryGroup)} // Send calculated category ID on click
                    className={selectedButton === index ? "active" : ""}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="bottom-container">
          <p>หมายเหตุ: หน่วยมูลค่าจัดซื้อเป็นหน่วยล้านบาท</p>
          <div className="select-switch-container">
            {/* Buttons for View Selection */}
            {isCardView ? (
              <div className="chart-button-group">
                <button
                  className={`chart-button ${
                    currentBarView === 1 ? "active" : ""
                  }`}
                  onClick={() => handleViewChange(1)}
                >
                  เรียงลำดับตามมูลค่าจัดซื้อ
                </button>
                <button
                  className={`chart-button ${
                    currentBarView === 2 ? "active" : ""
                  }`}
                  onClick={() => handleViewChange(2)}
                >
                  เรียงลำดับตามจำนวนใบสั่งซื้อ(PO)
                </button>
                <button
                  className={`chart-button ${
                    currentBarView === 3 ? "active" : ""
                  }`}
                  onClick={() => handleViewChange(3)}
                >
                  เรียงลำดับตามมูลค่าจัดซื้อต่อ PO
                </button>
              </div>
            ) : (
              <>
                <div className="select-switch-container"></div>
              </>
            )}
            {/* Toggle Button */}
            <button className="switch-button" onClick={toggleView}>
              {isCardView ? "มุมมอง Card" : "มุมมอง Graph"}
            </button>
          </div>

          {/* Chart Container */}
          {isCardView ? (
            <div className="charts-grid-container">
              {currentBarView === 1 && (
                <>
                  <BarGraphReH
                    data={dataBarCategorySpend}
                    yAxisKey="name"
                    title={`มูลค่าจัดซื้อในปี ${selectedYear}`}
                    height={600}
                  />
                  <BarGraphReH
                    data={dataBarCategoryPOQuantity}
                    yAxisKey="name"
                    title={`จำนวนใบสั่งซื้อ (PO) ในปี ${selectedYear}`}
                    height={600}
                  />
                  <BarGraphReH
                    data={dataBarCategoryAverageSpend}
                    yAxisKey="name"
                    title={`มูลค่าจัดซื้อต่อ PO ในปี ${selectedYear}`}
                    height={600}
                  />
                  <p>
                    หมายเหตุ: มูลค่าจัดซื้อต่อ PO
                    เป็นค่าเฉลี่ยคิดแยกจากยอดส่วนกลาง และยอดส่วนภูมิภาคมาบวกกัน
                    ไม่ได้แสดงถึงยอดมูลค่าจัดซื้อต่อ PO รวม{" "}
                  </p>
                </>
              )}
              {currentBarView === 2 && (
                <>
                  <BarGraphReH
                    data={dataBarCategoryPOQuantityByPO}
                    yAxisKey="name"
                    title={`จำนวนใบสั่งซื้อ (PO) ในปี ${selectedYear}`}
                    height={600}
                  />
                  <BarGraphReH
                    data={dataBarCategorySpendByPO}
                    yAxisKey="name"
                    title={`มูลค่าจัดซื้อในปี ${selectedYear}`}
                    height={600}
                  />
                  <BarGraphReH
                    data={dataBarCategoryAverageSpendByPO}
                    yAxisKey="name"
                    title={`มูลค่าจัดซื้อต่อ PO ในปี ${selectedYear}`}
                    height={600}
                  />
                  <p>
                    หมายเหตุ: มูลค่าจัดซื้อต่อ PO
                    เป็นค่าเฉลี่ยคิดแยกจากยอดส่วนกลาง และยอดส่วนภูมิภาคมาบวกกัน
                    ไม่ได้แสดงถึงยอดมูลค่าจัดซื้อต่อ PO รวม{" "}
                  </p>
                </>
              )}
              {currentBarView === 3 && (
                <>
                  <BarGraphReH
                    data={dataBarCategoryAverageSpendByAveragePO}
                    yAxisKey="name"
                    title={`มูลค่าจัดซื้อต่อ PO ในปี ${selectedYear}`}
                    height={600}
                  />
                  <p>
                    หมายเหตุ: มูลค่าจัดซื้อต่อ PO
                    เป็นค่าเฉลี่ยคิดแยกจากยอดส่วนกลาง และยอดส่วนภูมิภาคมาบวกกัน
                    ไม่ได้แสดงถึงยอดมูลค่าจัดซื้อต่อ PO รวม{" "}
                  </p>
                  <BarGraphReH
                    data={dataBarCategorySpendByAveragePO}
                    yAxisKey="name"
                    title={`มูลค่าจัดซื้อในปี ${selectedYear}`}
                    height={600}
                  />
                  <BarGraphReH
                    data={dataBarCategoryPOQuantityByAveragePO}
                    yAxisKey="name"
                    title={`จำนวนใบสั่งซื้อ (PO) ในปี ${selectedYear}`}
                    height={600}
                  />
                </>
              )}
            </div>
          ) : (
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
          )}
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

export default Dashboard2;
