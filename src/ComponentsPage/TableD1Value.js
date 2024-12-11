import React, { useState } from "react";
import "../ComponentsStyles/D1table.css";

const TableD1Value = ({ title, data }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const formatQuantity = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatPercentage = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>
                หน่วยงานจัดซื้อ
              </th>
              <th onClick={() => handleSort("lessThanQuantity")}>
                จำนวน PO มูลค่าไม่เกิน 500,000 บาท{" "}
                {renderSortArrow("lessThanQuantity")}
              </th>
              <th onClick={() => handleSort("totalQuantity")}>
                จำนวน PO ทั้งหมด {renderSortArrow("totalQuantity")}
              </th>
              <th onClick={() => handleSort("percentQuantity")}>
                % PO มูลค่าไม่เกิน 500,000 บาท{" "}
                {renderSortArrow("percentQuantity")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr key={index}>
                <td>{row.district}</td>
                <td>{formatQuantity(row.lessThanQuantity)}</td>
                <td>{formatQuantity(row.totalQuantity)}</td>
                <td>{formatPercentage(row.percentQuantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableD1Value;
