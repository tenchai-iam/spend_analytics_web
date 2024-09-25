import React, { useState } from "react";
import "../ComponentsStyles/Dashboard2.css"; // Updated to use Dashboard3.css
import BarChart from "./BarChart"; // Import the BarChart component
import BackgroundComponent from "../BackgroundComponent";
import YearDropdown from "./YearDropdown";
import NavbarComponent from "../NavbarComponent";
import D2Chart from "./D2Chart"; // Import D2Chart component
import Card from "./D2Card.js"; // Import the Card component

const Dashboard2 = () => {
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
  const [isCardView, setIsCardView] = useState(true); // State to toggle between card and graph view

  const toggleView = () => {
    setIsCardView(!isCardView); // Toggle between true (card view) and false (chart view)
  };

  const chartData = [
    [30, 80, 45, 60, 20, 90, 55, 33, 50, 70], // Data for first chart
    [50, 40, 70, 85, 15, 100, 60, 40, 45, 80], // Data for second chart
    [80, 30, 55, 65, 10, 70, 75, 25, 60, 95], // Data for third chart
  ];

  // Sample data for 10 cards
  const cardsData = [
    {
      company: "Bangkok Cable Co., Ltd.",
      purchaseValue: "1,500 ล้านบาท",
      poCount: "10 รายการ",
      avgPoValue: "150 ล้านบาท",
    },
    {
      company: "Company 2",
      purchaseValue: "1,200 ล้านบาท",
      poCount: "8 รายการ",
      avgPoValue: "140 ล้านบาท",
    },
    {
      company: "Company 3",
      purchaseValue: "1,300 ล้านบาท",
      poCount: "12 รายการ",
      avgPoValue: "110 ล้านบาท",
    },
    {
      company: "Company 4",
      purchaseValue: "1,100 ล้านบาท",
      poCount: "5 รายการ",
      avgPoValue: "220 ล้านบาท",
    },
    {
      company: "Company 5",
      purchaseValue: "1,600 ล้านบาท",
      poCount: "15 รายการ",
      avgPoValue: "106 ล้านบาท",
    },
    {
      company: "Company 6",
      purchaseValue: "1,700 ล้านบาท",
      poCount: "9 รายการ",
      avgPoValue: "189 ล้านบาท",
    },
    {
      company: "Company 7",
      purchaseValue: "1,800 ล้านบาท",
      poCount: "13 รายการ",
      avgPoValue: "138 ล้านบาท",
    },
    {
      company: "Company 8",
      purchaseValue: "1,900 ล้านบาท",
      poCount: "7 รายการ",
      avgPoValue: "271 ล้านบาท",
    },
    {
      company: "Company 9",
      purchaseValue: "2,000 ล้านบาท",
      poCount: "11 รายการ",
      avgPoValue: "182 ล้านบาท",
    },
    {
      company: "Company 10",
      purchaseValue: "1,400 ล้านบาท",
      poCount: "6 รายการ",
      avgPoValue: "233 ล้านบาท",
    },
  ];

  return (
    <div>
      <NavbarComponent />
      <BackgroundComponent />
      <div className="dashboard3-container">
        {/* Top Container */}
        <div className="top-container">
          <h3>เลือกกลุ่มพัสดุและปีที่ต้องการ</h3>
          <div className="btn-menu">
            {/* Button Controls */}
            <div className="button-group button">
              <button onClick={() => console.log("Button 1 clicked")}>
                สายไฟ
              </button>
              <button onClick={() => console.log("Button 2 clicked")}>
                สายไฟ
              </button>
              <button onClick={() => console.log("Button 3 clicked")}>
                หม้อแปลง
              </button>
              <button onClick={() => console.log("Button 4 clicked")}>
                มิเตอร์
              </button>
              <button onClick={() => console.log("Button 5 clicked")}>
                ลูกถ้วย
              </button>
              <button onClick={() => console.log("Button 6 clicked")}>
                พัสดุรอง
              </button>
            </div>
          </div>

          <div>
            <YearDropdown />
          </div>
        </div>

        {/* Bottom Container */}
        <div className="bottom-container">
          {/* Toggle Button */}
          <button className="chart-button" onClick={toggleView}>
            {isCardView ? "Graph View" : "Card View"}
          </button>

          {/* Chart Container */}
          <div className="chart-container">
            {isCardView ? (
              <div className="cards-container">
                {cardsData.map((card, index) => (
                  <Card
                    key={index}
                    company={card.company}
                    purchaseValue={card.purchaseValue}
                    poCount={card.poCount}
                    avgPoValue={card.avgPoValue}
                  />
                ))}
              </div>
            ) : (
              <div className="charts-grid-container">
                {chartData.map((data, index) => (
                  <div className="chart-item" key={index}>
                    <D2Chart data={data} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard2;
