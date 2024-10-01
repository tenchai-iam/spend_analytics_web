import React, { useState } from "react";
import "../ComponentsStyles/Dashboard2.css";
import BarGraphH from "./D2Chart"; // Import D2Chart component
import Card from "./D2Card.js"; // Import the Card component
import BackgroundComponent from "../BackgroundComponent";
import YearDropdown from "./YearDropdown";
import NavbarComponent from "../NavbarComponent";

const Dashboard2 = () => {
  // Dummy data for charts
  const chartData = [
    {
      title: "มูลค่าจัดซื้อ (บาท)",
      data: [30, 80, 45, 60, 20, 90, 55, 33, 50, 70],
    },
    {
      title: "จำนวน PO",
      data: [50, 40, 70, 85, 15, 100, 60, 40, 45, 80],
    },
    {
      title: "มูลค่าจัดซื้อต่อ PO (บาท)",
      data: [80, 30, 55, 65, 10, 70, 75, 25, 60, 95],
    },
  ];

  // Sample data for cards
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
    // Additional card data here
  ];

  // State to toggle between card and graph view
  const [isCardView, setIsCardView] = useState(true);

  const toggleView = () => {
    setIsCardView(!isCardView); // Toggle between true (card view) and false (chart view)
  };

  return (
    <div>
      <NavbarComponent />
      <BackgroundComponent />
      <div className="year-dropdown-container">
        <YearDropdown />
      </div>
      <div className="dashboard2-container">
        <div className="top-container">
          <h1 className="text-subtitle">เลือกกลุ่มพัสดุและปีที่ต้องการ</h1>
          <div className="btn-menu">
            {/* Button Controls */}
            <div className="button-group button">
              <button onClick={() => console.log("Button 1 clicked")}>
                เสาคอน คาน สมอบกคอนกรีต
              </button>
              <button onClick={() => console.log("Button 2 clicked")}>
                Pole line hardware
              </button>
              <button onClick={() => console.log("Button 3 clicked")}>
                สายไฟ
              </button>
              <button onClick={() => console.log("Button 4 clicked")}>
                ลูกถ้วย
              </button>
              <button onClick={() => console.log("Button 5 clicked")}>
                อุปกรณ์ป้องกัน และสวิตซ์
              </button>
              <button onClick={() => console.log("Button 6 clicked")}>
                หม้อแปลง แคแปซิเตอร์ โวลเตจเรกูเรเตอร์
              </button>
              <button onClick={() => console.log("Button 7 clicked")}>
                มิเตอร์ ซีที.พีที.
              </button>
              <button onClick={() => console.log("Button 8 clicked")}>
                อุปกรณ์ไฟถนน
              </button>
              <button onClick={() => console.log("Button 9 clicked")}>
                อุปกรณ์เดินสายภายในและภายนอกอาคาร
              </button>
              <button onClick={() => console.log("Button 10 clicked")}>
                พัสดุรอง/อุปกรณ์ประกอบ
              </button>
            </div>
          </div>
        </div>
        <div className="middle-container">
          <h1 className="container-title">ภาพรวมคู่ค้าของกฟภ.</h1>
          <h1 className="text-subtitle">
            จำนวนคู่ค้าทั้งหมดตามกลุ่มพัสดุที่เลือก
          </h1>
          <h1 className="text-subtitle">
            จำนวนคู่ค้า Active ตามกลุ่มพัสดุที่เลือก
          </h1>
        </div>
        <div className="bottom-container">
          <h1 className="container-title">Top 10 คู่ค้า</h1>
          {/* Toggle Button */}
          <button className="chart-button" onClick={toggleView}>
            {isCardView ? "Graph View" : "Card View"}
          </button>

          {/* Chart Container */}
          {isCardView ? (
            <div className="cards-grid-container">
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
              {chartData.map((chart, index) => (
                <div className="chart-wrapper" key={index}>
                  {/* Add Chart Title */}
                  <h1 className="chart-title">{chart.title}</h1>
                  <div className="chart-container">
                    <BarGraphH data={chart.data} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard2;
