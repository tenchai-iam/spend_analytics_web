import React from "react";
import NavbarComponent from "../NavbarComponent.js";
import BackgroundComponent from "../BackgroundComponent.js";
import BubbleChart from "./BubbleChart.js";
import LineGraph from "./LineGraph.js";
import "../ComponentsStyles/Dashboard1.css"; // Updated to use Dashboard1.css
import "../ComponentsStyles/LineGraph.css";
import YearDropDown from "./YearDropdown";
import YearDropdown from "./YearDropdown";

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

  return (
    <div>
      <NavbarComponent />
      <BackgroundComponent />
      <div className="year-dropdown-container">
        <YearDropdown />
      </div>
      <div className="dashboard1-container">
        <div className="top-grid-container">
          <div className="top-left-grid-container">
            <div className="left"></div>
            <div className="middle"></div>
            <div className="left"></div>
            <div className="middle"></div>
            <div className="left"></div>
            <div className="middle"></div>
          </div>
          <div className="top-right-grid-container">
            <div className="left"></div>
          </div>
        </div>
        <div className="middle-grid-container">
          <div className="donut-graph-container"></div>
          <div className="map-graph-container"></div>
        </div>
        <div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard1;
