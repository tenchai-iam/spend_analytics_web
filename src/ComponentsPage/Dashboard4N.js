import React from "react";
import NavbarComponent from "../NavbarComponent";
import BackgroundComponent from "../BackgroundComponent";
import "../ComponentsStyles/Dashboard4.css"; // Updated to use Dashboard3.css
import YearDropdown from "./YearDropdown";
import Table4 from "./Table4.js";
import DonutChart from "./DonutChart.js";
import TableD42 from "./TableD42.js";
import BarChart from "./BarChart";

const Dashboard4 = () => {
  const data4 = [
    {
      region: "กฟน.1",
      usage: 4863,
      stock: 4287,
      contract: 9751,
      awaiting: 1000,
      totalStock: 15038,
      monthsLeft: 3,
      ordered: 43767,
      delivered: 14589,
      totalRegion: 29178,
    },
    {
      region: "กฟน.2",
      usage: 4473,
      stock: 11462,
      contract: 840,
      awaiting: 1000,
      totalStock: 13302,
      monthsLeft: 3,
      ordered: 40257,
      delivered: 13419,
      totalRegion: 26838,
    },
    {
      region: "กฟน.3",
      usage: 3399,
      stock: 3608,
      contract: 1486,
      awaiting: 1000,
      totalStock: 6094,
      monthsLeft: 2,
      ordered: 33990,
      delivered: 13596,
      totalRegion: 20394,
    },
    {
      region: "กฟฉ.1",
      usage: 3000,
      stock: 12309,
      contract: 19211,
      awaiting: 0,
      totalStock: 31520,
      monthsLeft: 11,
      ordered: 3000,
      delivered: 3000,
      totalRegion: 0,
    },
    {
      region: "กฟฉ.2",
      usage: 5724,
      stock: 7545,
      contract: 2231,
      awaiting: 1000,
      totalStock: 10776,
      monthsLeft: 2,
      ordered: 57240,
      delivered: 22896,
      totalRegion: 34344,
    },
    {
      region: "กฟฉ.3",
      usage: 5133,
      stock: 8245,
      contract: 40,
      awaiting: 1000,
      totalStock: 9285,
      monthsLeft: 2,
      ordered: 51330,
      delivered: 20532,
      totalRegion: 30798,
    },
    {
      region: "กฟก.1",
      usage: 6158,
      stock: 19833,
      contract: 725,
      awaiting: 1000,
      totalStock: 21558,
      monthsLeft: 4,
      ordered: 49624,
      delivered: 12316,
      totalRegion: 36948,
    },
    {
      region: "กฟก.2",
      usage: 6257,
      stock: 7344,
      contract: 2054,
      awaiting: 1000,
      totalStock: 10478,
      monthsLeft: 5,
      ordered: 49767,
      delivered: 6257,
      totalRegion: 5610,
    },
  ];

  const dataD42 = [
    {
      itemCode: "1020050000",
      description: "CABLE, AERIAL AL 22 KV, 1X50 SQ.MM",
      usage: "2 เดือน",
      priority: "High",
    },
    {
      itemCode: "1020050100",
      description: "CABLE, AERIAL AL 33 KV, 1X50 SQ.MM",
      usage: "3 เดือน",
      priority: "High",
    },
    {
      itemCode: "1020070004",
      description: "CABLE, AL 750 V, 95 SQ.MM, TIS 293",
      usage: "8 เดือน",
      priority: "Medium",
    },
    {
      itemCode: "1060050009",
      description: "METER, WATTHOUR 1 P, 2 W 15(45) A",
      usage: "1 เดือน",
      priority: "High",
    },
  ];

  const chartData = [
    { name: "กราฟที่ 1 - หมวด 1", value: 130 },
    { name: "กราฟที่ 1 - หมวด 2", value: 80 },
  ];

  const savings = 50000000; // ค่าใช้จ่ายที่ลดได้

  return (
    <div>
      <NavbarComponent />
      <BackgroundComponent />
      <div className="year-dropdown-container">
        <YearDropdown />
      </div>
      <div className="dashboard4-container">
        {/*----------------------------------------------------------------*/}
        <div className="btn-container-L1">
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
          {/*-------------------------------------------------------.*/}
          <div className="lead-time">
            <p className="text-subtitle">ระยะเวลาจัดซื้อโดยส่วนกลาง</p>

            <div className="button-group button">
              <button onClick={() => console.log("Button 1 clicked")}>
                3 เดือน
              </button>
              <button onClick={() => console.log("Button 1 clicked")}>
                6 เดือน
              </button>
              <button onClick={() => console.log("Button 1 clicked")}>
                9 เดือน
              </button>
            </div>
          </div>
          {/*-------------------------------------------------------.*/}
          <div className="demand-time">
            <p className="text-subtitle">ระยะเวลาที่ต้องการใช้พัสดุ</p>

            <div className="button-group button">
              <button onClick={() => console.log("Button 1 clicked")}>
                6 เดือน
              </button>
              <button onClick={() => console.log("Button 1 clicked")}>
                9 เดือน
              </button>
              <button onClick={() => console.log("Button 1 clicked")}>
                12 เดือน
              </button>
            </div>
          </div>
        </div>
        {/*----------------------------------------------------------------*/}
        <div className="summary-container-L1">
          <div className="donutChart">
            <h1 className="text-title">ภาพรวมสถานะพัสดุ</h1>
            <DonutChart />
          </div>
          <div className="text-summary">
            <h1 className="text-label">รายพัสดุที่ต้องจัดสรรเพิ่มเติม</h1>
            <h1 className="text-label">20 รายการ</h1>
          </div>
          <div className="table-summary">
            <h1 className="text-title">ตารางข้อมูล</h1>
            <TableD42 data={dataD42} />
          </div>
        </div>
        {/*----------------------------------------------------------------*/}
        <div className="table-container-L1">
          <div className="table-compare">
            <h1 className="text-title">ตารางจำลองแผนจัดสรรเพิ่มเติม</h1>
            <Table4 data={data4} />
          </div>
          <div className="BarGraphV">
            <h1 className="text-title">ประมาณการ Value</h1>
            <BarChart
              style={{ width: "100%", height: "100%" }}
              data={chartData}
            />
          </div>
        </div>

        {/*----------------------------------------------------------------*/}
      </div>
    </div>
  );
};

export default Dashboard4;
