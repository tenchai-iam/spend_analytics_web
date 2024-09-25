import React from "react";
import MenuCard from "./MenuCard";
import "./ComponentsStyles/Home.css"; // Import CSS styles
import HomeText from "./HomeText";
import BackgroundComponent from "./BackgroundComponent";
import NewsTicker from "./ComponentsPage/NewsTicker.js"; // Import NewsTicker component
import D1 from "./pic/D1_1.png";
import D2 from "./pic/D2_1.png";
import D3 from "./pic/D3_1.png";
import D4 from "./pic/D4_1.png";
import NavbarComponent from "./NavbarComponent";

const Home = () => {
  // Example news items for the ticker
  const newsItems = [
    "New budget allocations for Q4 have been approved.",
    "Supplier contracts are up for review next month.",
    "PEA dashboard maintenance scheduled for this weekend.",
    "New training sessions available for procurement team.",
  ];

  return (
    <div className="home-container">
      <BackgroundComponent />
      <NavbarComponent />
      {/* Add a container with relative positioning */}
      <div className="home-content">
        {/* New content wrapper */}
        <HomeText />
        {/* Flexbox Container for Two Sections */}
        <div className="home-sections-container">
          {/* First Section */}
          <div className="home-section">
            <h1 className="home-title">Management</h1>
            <p className="home-subtitle">Dashboard สำหรับผู้บริหาร</p>
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

          {/* Second Section */}
          <div className="home-section">
            <h1 className="home-title">Procurement</h1>
            <p className="home-subtitle">Dashboard สำหรับกองวางแผน</p>
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

      {/* Add NewsTicker at the bottom of the page */}
      <NewsTicker newsItems={newsItems} />
    </div>
  );
};

export default Home;
