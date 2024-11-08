import React, { useState } from "react";
import "../ComponentsStyles/table.css";

const TableD42 = ({ title, data }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const formatQuantity = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const handleSort = (key) => {
    // Skip sorting for "matGrade"
    if (key === "matGrade") return;

    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.key === "matName") {
      return sortConfig.direction === "ascending"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "ascending"
        ? aValue - bValue
        : bValue - aValue;
    }
    return 0;
  });

  const renderSortArrow = (columnKey) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === "ascending" ? "▲" : "▼";
    }
    return "";
  };

  return (
    <div className="table-container">
      <h2 className="table-title">{title}</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("matNum")}>
                รหัสพัสดุ {renderSortArrow("matNum")}
              </th>
              <th onClick={() => handleSort("matName")}>
                ชื่อพัสดุ {renderSortArrow("matName")}
              </th>
              <th onClick={() => handleSort("usableMonth")}>
                ใช้งานได้ (เดือน) {renderSortArrow("usableMonth")}
              </th>
              <th>ความเสี่ยง</th> {/* No sorting or arrow for matGrade */}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr key={index}>
                <td>{row.matNum}</td>
                <td>{row.matName}</td>
                <td>{formatQuantity(row.usableMonth)}</td>
                <td>
                  <span className={`priority ${row.matGrade.toLowerCase()}`}>
                    {row.matGrade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableD42;
