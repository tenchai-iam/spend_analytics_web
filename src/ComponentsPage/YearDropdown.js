import React, { useState } from "react";
import "../ComponentsStyles/YearDropdown.css";

const YearDropdown = ({ startYear = 2022, endYear }) => {
  const [selectedYear, setSelectedYear] = useState("");

  // Set the default end year to the current year if not provided
  const currentYear = new Date().getFullYear();
  const years = [];

  // Generate the list of years dynamically
  for (let i = startYear; i <= (endYear || currentYear); i++) {
    years.push(i);
  }

  const handleChange = (e) => {
    setSelectedYear(e.target.value);
  };

  return (
    <div>
      <label htmlFor="year-select">เลือกปีที่แสดง</label>
      <select id="year-select" value={selectedYear} onChange={handleChange}>
        <option value="" disabled>
          -- Select a Year --
        </option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      {selectedYear && <p>You selected: {selectedYear}</p>}
    </div>
  );
};

export default YearDropdown;
