import React, { useState, useEffect } from "react";
import MenuCard from "./ComponentsPage/MenuCard";
import "./ComponentsStyles/Home.css";
import NavbarComponent from "./ComponentsPage/NavbarComponent";
import YearDropdown from "./ComponentsPage/YearDropdown";
import D1 from "./pic/01 - Spend.png";
import D2 from "./pic/02 - Supplier.png";
import D3 from "./pic/03 - Price.png";
import D4 from "./pic/04 - Procurement.png";
import { useQuery } from "@tanstack/react-query";
import { getHomeData, getYears, getDateInfo } from "./services/api.js"; // Import API service functions

const Dashboard = ({ selectedYear }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["dashboardData", selectedYear],
    queryFn: () => getHomeData(selectedYear),
    enabled: !!selectedYear,
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
  const [selectedYear, setSelectedYear] = useState("");
  const userLevel = sessionStorage.getItem("user_level"); // Fetch user level

  const { data: yearsData, isLoading } = useQuery({
    queryKey: ["years"],
    queryFn: getYears,
  });

  useEffect(() => {
    if (yearsData && yearsData.years.length > 0) {
      const mostRecentYear = Math.max(...yearsData.years);
      setSelectedYear(mostRecentYear.toString());
    }
  }, [yearsData]);

  const datadate = 1;

  const {
    data: dateInfoData,
    isLoading: isLoadingDateInfoData,
    isError,
    error,
  } = useQuery({
    queryKey: ["dateInfoData", datadate],
    queryFn: () => getDateInfo(datadate),
    enabled: !!selectedYear,
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
          {/* General Section */}
          <div className="nav-section">
            <h1 className="nav-title">General</h1>
            <p className="nav-subtitle">Dashboard ทั่วไป</p>
            <div className="menu-grid-general">
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
              <MenuCard
                image={D1}
                buttonTitle="ติดตามมูลค่า Stage 5"
                link="/dashboard5"
              />
              <MenuCard
                image={D2}
                buttonTitle="ภาพรวมมูลค่าพัสดุคงคลัง"
                link="/dashboard6"
              />
            </div>
          </div>

          {/* Procurement Planning - Only show if user level is "B" */}
          {(userLevel === "B" || userLevel === "C") && (
            <div className="nav-section">
              <h1 className="nav-title">Procurement Planning</h1>
              <p className="nav-subtitle">Dashboard สำหรับผู้จัดทำแผนพัสดุ</p>
              <div className="menu-grid-procurement">
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
                <MenuCard
                  image={D4}
                  buttonTitle="ปรับแผนเพิ่มเติมระหว่างปี (งบ C)"
                  link="/dashboard7"
                />
              </div>
            </div>
          )}
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
