import React, { useState, useEffect, Suspense } from "react";
import MenuCard from "./ComponentsPage/MenuCard";
import "./ComponentsStyles/Home.css";
import BackgroundComponent from "./ComponentsPage/BackgroundComponent";
import NavbarComponent from "./ComponentsPage/NavbarComponent";
import YearDropdown from "./ComponentsPage/YearDropdown";
import NewsTicker from "./ComponentsPage/NewsTicker";
import D1 from "./pic/01 - Spend.png";
import D2 from "./pic/02 - Supplier.png";
import D3 from "./pic/03 - Price.png";
import D4 from "./pic/04 - Procurement.png";
import { useQuery } from "@tanstack/react-query";
import { getHomeData, getYears, getDateInfo } from "./services/api.js"; // Import your API service function

const Dashboard = ({ selectedYear }) => {
  // Use React Query's useQuery to fetch data for the selected year
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["dashboardData", selectedYear], // Unique query key for caching
    queryFn: () => getHomeData(selectedYear), // Fetch data based on the selected year
    enabled: !!selectedYear, // Only fetch data if a year is selected
  });

  if (!selectedYear) return <div>Please select a year to view data.</div>;
  if (isLoading) return <div>Loading dashboard data...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="text-container">
      <div className="text-top">
        <label className="text">ยอดจัดซื้อทั้งหมด (ล้านบาท)</label>
        <label className="text">
          {(data.TOTAL_SPEND / 1000000).toLocaleString("th-TH")}
        </label>
      </div>
      <div className="text-bottom">
        <label className="text">จำนวนใบสั่งซื้อ PO</label>
        <label className="text">{data.TOTAL_PO.toLocaleString("th-TH")}</label>
      </div>
    </div>
  );
};

// Main Home Component
const Home = () => {
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

  const newsItems = [
    "New budget allocations for Q4 have been approved.",
    "Supplier contracts are up for review next month.",
    "PEA dashboard maintenance scheduled for this weekend.",
    "New training sessions available for procurement team.",
  ];

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
      <NavbarComponent />
      <BackgroundComponent />
      <div className="year-dropdown-container">
        <YearDropdown
          onSelectYear={setSelectedYear}
          selectedYear={selectedYear}
        />
      </div>
      <Dashboard selectedYear={selectedYear} />
      <div>
        <div className="nav-container">
          {/* First Section */}
          <div className="nav-section">
            <h1 className="nav-title">Management</h1>
            <p className="nav-subtitle">Dashboard สำหรับผู้บริหาร</p>
            <div className="menu-grid">
              <MenuCard
                image={D1}
                title="ภาพรวมค่าใช้จ่ายของกฟภ."
                description="Visualize the overall expenses"
                link="/dashboard1"
              />
              <MenuCard
                image={D2}
                title="ภาพรวม Supplier ของกฟภ."
                description="Overview of all suppliers"
                link="/dashboard2"
              />
            </div>
          </div>
          <div className="nav-section">
            <h1 className="nav-title">Procurement</h1>
            <p className="nav-subtitle">Dashboard สำหรับกองวางแผน</p>
            <div className="menu-grid">
              <MenuCard
                image={D3}
                title="เปรียบเทียบราคาจัดซื้อพัสดุ"
                description="Compare procurement prices"
                link="/dashboard3"
              />
              <MenuCard
                image={D4}
                title="ปรับแผนเพิ่มเติมระหว่างปี"
                description="Adjust purchasing budgets"
                link="/dashboard4"
              />
            </div>
          </div>
          <div></div>
        </div>
        <div>
          <h1 className="data-date">
            ข้อมูล ณ วันที่ {dateInfoData?.day} เดือน {dateInfoData?.month} ปี{" "}
            {dateInfoData?.year}
          </h1>
        </div>
      </div>
      <NewsTicker data={newsItems} />
    </div>
  );
};

export default Home;
