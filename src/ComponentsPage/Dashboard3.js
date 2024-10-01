import React, { useState } from "react";
import "../ComponentsStyles/Dashboard3.css"; // Updated to use Dashboard3.css
import BarChart from "./BarChart"; // Import the BarChart component
import BackgroundComponent from "../BackgroundComponent";
import YearDropdown from "./YearDropdown";
import NavbarComponent from "../NavbarComponent";
import { Dropdown } from "react-bootstrap";

const Dashboard3 = () => {
  // Dummy data for charts
  const data1 = [
    { name: "กราฟที่ 1 - หมวด 1", value: 130 },
    { name: "กราฟที่ 1 - หมวด 2", value: 80 },
    { name: "กราฟที่ 1 - หมวด 3", value: 120 },
  ];

  const data2 = [
    { name: "กราฟที่ 2 - หมวด 1", value: 90 },
    { name: "กราฟที่ 2 - หมวด 2", value: 60 },
    { name: "กราฟที่ 2 - หมวด 3", value: 150 },
  ];

  // State to toggle between the charts
  const [showFirstChart, setShowFirstChart] = useState(true);

  const toggleChart = () => {
    setShowFirstChart(!showFirstChart); // Toggle between true and false
  };

  return (
    <div>
      <NavbarComponent />
      <BackgroundComponent />
      <div className="year-dropdown-container">
        <YearDropdown />
      </div>
      <div className="dashboard3-container">
        {/* Left Container */}
        <div className="top-container">
          <h1 className="text-title">
            เปรียบเทียบราคาจัดซื้อพัสดุส่วนกลาง vs. หน้างาน
          </h1>
          <div className="dropdown-group">
            <p className="text-subtitle">เลือกรายการพัสดุที่ต้องการดูราคา</p>
            <select>
              <option value="102 สายไฟและ">102 สายไฟและ</option>
              {/* Additional options */}
            </select>
            <select>
              <option value="1020010009 COND.">1020010009 COND.,</option>
              {/* Additional options */}
            </select>
          </div>
        </div>

        {/* Right Container */}
        <div className="bottom-container">
          <h1 className="text-title">เปรียบเทียบราคาจัดซื้อ (บาท)</h1>

          {/* Toggle Button */}
          <button className="chart-button" onClick={toggleChart}>
            {showFirstChart ? "แยกตามการไฟฟ้า" : "แยกตามเขต"}
          </button>

          {/* Chart Container */}

          {showFirstChart ? (
            <div>
              <div className="price-summary">
                <div>
                  <p className="text-subtitle">ราคาต่ำสุด: 100,000 บาท</p>
                </div>
                <div>
                  <p className="text-subtitle">ราคาเฉลี่ย: 128,614 บาท</p>
                </div>
                <div>
                  <p className="text-subtitle">ราคาสูงสุด: 140,000 บาท</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="dropdown-group">
                <p className="text-subtitle">เลือกเขตที่ต้องการแสดง</p>
                <select>
                  <option value="102 สายไฟและ">กฟส.1</option>
                  {/* Additional options */}
                </select>
              </div>
              <div className="price-summary">
                <div>
                  <p className="text-subtitle">ราคาต่ำสุด: 100,000 บาท</p>
                </div>
                <div>
                  <p className="text-subtitle">ราคาเฉลี่ย: 128,614 บาท</p>
                </div>
                <div>
                  <p className="text-subtitle">ราคาสูงสุด: 140,000 บาท</p>
                </div>
              </div>
            </div>
          )}

          <div className="chart-container">
            {showFirstChart ? (
              <div>
                <h1 className="chart-title">ข้อมูลราคาตามการเขต</h1>
                <BarChart
                  style={{ width: "100%", height: "100%" }}
                  data={data1}
                />
              </div>
            ) : (
              <div>
                <h1 className="chart-title">ข้อมูลราคาตามการไฟฟ้า</h1>
                <BarChart
                  style={{ width: "100%", height: "100%" }}
                  data={data2}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard3;
