import React, { useState } from "react";
import "../ComponentsStyles/table.css";

const TableD5Value = ({ title, data }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const formatQuantity = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatValue = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value);

  const sortedData = [...data].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === "string") {
        return sortConfig.direction === "ascending"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortConfig.direction === "ascending"
          ? aValue - bValue
          : bValue - aValue;
      }
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const renderSortArrow = (columnKey) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === "ascending" ? "▲" : "▼";
    }
    return "";
  };

  return (
    <div className="table-container">
      <h2 className="table-title">{title}</h2>
      <div className="tableUser-wrapper">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("totalQuantity")}>
                กลุ่มพัสดุ {renderSortArrow("totalQuantity")}
              </th>
              <th onClick={() => handleSort("percentQuantity")}>
                มูลค่า Baseline {renderSortArrow("percentQuantity")}
              </th>
              <th onClick={() => handleSort("percentQuantity")}>
                ส่วนต่าง Normalized - Baseline{" "}
                {renderSortArrow("percentQuantity")}
              </th>
              <th onClick={() => handleSort("percentQuantity")}>
                มูลค่า Normalized {renderSortArrow("percentQuantity")}
              </th>
              <th onClick={() => handleSort("percentQuantity")}>
                ส่วนต่าง Actual - Normalized{" "}
                {renderSortArrow("percentQuantity")}
              </th>
              <th onClick={() => handleSort("percentQuantity")}>
                มูลค่า Actual {renderSortArrow("percentQuantity")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr key={index}>
                <td>{row.cat_group}</td>
                <td className="number">{formatValue(row.base)}</td>
                <td className="number">{formatValue(row.diff_base_nor)}</td>
                <td className="number">{formatValue(row.normalized)}</td>
                <td className="number">{formatValue(row.diff_actual_nor)}</td>
                <td className="number">{formatValue(row.actual)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableD5Value;
