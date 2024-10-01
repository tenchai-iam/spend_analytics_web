import React from "react";
import NavbarComponent from "../NavbarComponent.js";
import BackgroundComponent from "../BackgroundComponent.js";
import BubbleChart from "./BubbleChart.js";
import BarChart from "./BarChart.js";
import DonutChart from "./DonutChart.js";
import LineChart from "./LineChart.js";
import "../ComponentsStyles/Dashboard1.css"; // Updated to use Dashboard1.css
import YearDropdown from "./YearDropdown";
import MapChart from "./MapChart.js";

const Dashboard1 = () => {
  const dataBubble = [
    { name: "Category 1", value: 30 },
    { name: "Category 2", value: 70 },
    { name: "Category 3", value: 50 },
    { name: "Category 4", value: 90 },
    { name: "Category 5", value: 20 },
    { name: "Category 6", value: 100 },
  ];

  const dataLine1 = [
    { date: new Date(2024, 0, 1), value: 57 },
    { date: new Date(2024, 1, 1), value: 62 },
    { date: new Date(2024, 2, 1), value: 58 },
    { date: new Date(2024, 3, 1), value: 65 },
    { date: new Date(2024, 4, 1), value: 67 },
  ];

  const dataBar1 = [
    { name: "กราฟที่ 1 - หมวด 1", value: 130 },
    { name: "กราฟที่ 1 - หมวด 2", value: 80 },
  ];

  const sampleData = [
    { x: 1, y: 30 },
    { x: 2, y: 40 },
    { x: 3, y: 50 },
    { x: 4, y: 60 },
    { x: 5, y: 70 },
  ];

  return (
    <div>
      <NavbarComponent />
      <BackgroundComponent />
      <div className="year-dropdown-container">
        <YearDropdown />
      </div>
      <div className="dashboard1-container">
        <div className="top-grid-container">
          <div className="top-1-grid-container">
            <div className="left">
              <h1 className="text-title">ค่าใช้จ่าย ล้านบาท</h1>
              <LineChart data={sampleData} />
            </div>
            <div className="right">
              <h1 className="text-title">ค่าใช้จ่ายทั้งหมด (ล้านบาท)</h1>
              <BarChart data={dataBar1} />
            </div>
          </div>
          <div className="top-2-grid-container">
            <div className="left">
              <h1 className="text-title">จำนวนรายการ PO</h1>
              <LineChart data={sampleData} />
            </div>
            <div className="right">
              <h1 className="text-title">จำนวน PO ทั้งหมด (รายการ)</h1>
              <BarChart data={dataBar1} />
            </div>
          </div>
          <div className="top-3-grid-container">
            <div className="left">
              <h1 className="text-title">จำนวนคู่ค้า ราย</h1>
              <LineChart data={sampleData} />
            </div>
            <div className="right">
              <h1 className="text-title">จำนวนคู่ค้าทั้งหมด (ราย)</h1>
              <BarChart data={dataBar1} />
            </div>
          </div>
        </div>
        <div className="middle-D1-container">
          <div className="bubble-graph">
            <h1 className="text-title">ประเภทพัสดุตามมูลค่าจัดซื้อ (บาท)</h1>
            <BubbleChart
              style={{ width: "100%", height: "100%" }}
              data={dataBubble}
            />
          </div>
          <div className="bar-graph">
            <h1 className="text-title">สัดส่วน PO เฉพาะเจาะจง</h1>
            <BarChart
              style={{ width: "100%", height: "100%" }}
              data={dataBar1}
            />
          </div>
        </div>
        <div className="bottom-D1-container">
          <div className="donut-Graph">
            <h1 className="text-title">ค่าใช้จ่ายพัสดุตามหน่วยงาน (บาท)</h1>
            <DonutChart style={{ width: "100%", height: "100%" }} />
          </div>
          <div className="map-wrapper">
            <div className="map-container">
              <MapChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard1;
