import React from "react";
import MenuCard from "./MenuCard";
import "./ComponentsStyles/Home.css"; // Import CSS styles
import BackgroundComponent from "./BackgroundComponent";
import NavbarComponent from "./NavbarComponent";
import YearDropdown from "./ComponentsPage/YearDropdown";
import NewsTicker from "./ComponentsPage/NewsTicker.js"; // Import NewsTicker component
import D1 from "./pic/01 - Spend.png";
import D2 from "./pic/02 - Supplier.png";
import D3 from "./pic/03 - Price.png";
import D4 from "./pic/04 - Procurement.png";

const Home = () => {
  // Example news items for the ticker
  const newsItems = [
    "New budget allocations for Q4 have been approved.",
    "Supplier contracts are up for review next month.",
    "PEA dashboard maintenance scheduled for this weekend.",
    "New training sessions available for procurement team.",
  ];

  return (
    <div>
      <NavbarComponent />
      <BackgroundComponent />
      <div className="year-dropdown-container">
        <YearDropdown />
      </div>
      <div className="text-container">
        <div className="text-top">
          <label className="text">ยอดจัดซื้อทั้งหมด</label>
          <label className="text">000000000000</label>
        </div>
        <div className="text-bottom">
          <label className="text">จำนวนใบสั่งซื้อ</label>
          <label className="text">000000000000</label>
        </div>
      </div>
      <div>
        <div className="nav-container">
          {/* First Section */}
          <div className="nav-section">
            <h1 className="nav-title">Management</h1>
            <p className="nav-subtitle">Dashboard สำหรับผู้บริหาร</p>
            <div className="menu-grid">
              <MenuCard
                image={D1} // Replace with relevant images
                title="ภาพรวมค่าใช้จ่ายของกฟภ."
                description="Visualize the overall expenses"
                link="/dashboard1" // Link to Dashboard 1
              />
              <MenuCard
                image={D2}
                title="ภาพรวม Supplier ของกฟภ."
                description="Overview of all suppliers"
                link="/dashboard2" // Link to Dashboard 2
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
                link="/dashboard3" // Link to Dashboard 3
              />
              <MenuCard
                image={D4}
                title="ปรับแผนเพิ่มเติมระหว่างปี"
                description="Adjust purchasing budgets"
                link="/dashboard4" // Link to Dashboard 4
              />
            </div>
          </div>
        </div>
      </div>
      <NewsTicker data={newsItems} />
    </div>
  );
};

export default Home;
