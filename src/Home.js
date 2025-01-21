import React, { useState, useEffect, Suspense } from "react";
import MenuCard from "./ComponentsPage/MenuCard";
import "./ComponentsStyles/Home.css";
import NavbarComponent from "./ComponentsPage/NavbarComponent";
import YearDropdown from "./ComponentsPage/YearDropdown";
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
      <div className="text-subcontainer">
        <label className="text">มูลค่าจัดซื้อทั้งหมด</label>
        <label className="home-number">
          {data.TOTAL_SPEND.toLocaleString("th-TH")}
          {" บาท"}
        </label>
      </div>
      <div className="text-subcontainer">
        <label className="text">จำนวนใบสั่งซื้อ (PO)</label>
        <label className="home-number">
          {data.TOTAL_PO.toLocaleString("th-TH")}
        </label>
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
      <div className="text-dropdown-container">
        <h1 className="header-title">หน้าหลัก</h1>
        <div className="year-dropdown-container">
          <YearDropdown
            onSelectYear={setSelectedYear}
            selectedYear={selectedYear}
          />
        </div>
      </div>
      <Dashboard selectedYear={selectedYear} />
      <div>
        <div className="nav-container">
          {/* First Section */}
          <div className="nav-section">
            <h1 className="nav-title">General</h1>
            <p className="nav-subtitle">Dashboard ทั่วไป</p>
            <div className="menu-grid">
              <MenuCard
                image={D1}
                buttonTitle="ภาพรวมค่าใช้จ่าย"
                link="/dashboard1"
              />
              <MenuCard
                image={D2}
                buttonTitle="ภาพรวม Supplier"
                link="/dashboard2"
              />
            </div>
          </div>
          <div className="nav-section">
            <h1 className="nav-title">Procurement Planning</h1>
            <p className="nav-subtitle">Dashboard สำหรับผู้จัดทำแผนพัสดุ</p>
            <div className="menu-grid">
              <MenuCard
                image={D3}
                buttonTitle="เปรียบเทียบราคาจัดซื้อ"
                link="/dashboard3"
              />
              <MenuCard
                image={D4}
                buttonTitle="ปรับแผนเพิ่มเติมระหว่างปี"
                link="/dashboard4"
              />
            </div>
          </div>
          <div></div>
        </div>
        <div>
          <h1 className="data-date">
            ข้อมูล ณ วันที่ {dateInfoData?.day}/{dateInfoData?.month}/
            {dateInfoData?.year}
          </h1>
          <p className="data-date-home">
            หมายเหตุ: ข้อมูลภายในระบบ Spend Insight เป็นข้อมูลภายในของกฟภ.
            ห้ามเผยแพร่ให้กับผู้ใช้งานภายนอก
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
