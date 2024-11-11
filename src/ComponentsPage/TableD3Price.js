import React, { useState } from "react";
import "../ComponentsStyles/table.css";

const TableD3Price = ({ title, data }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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
              <th onClick={() => handleSort("matNR")}>
                รหัสพัสดุ {renderSortArrow("matNR")}
              </th>
              <th onClick={() => handleSort("matName")}>
                ชื่อพัสดุ {renderSortArrow("matName")}
              </th>
              <th onClick={() => handleSort("priceHQ")}>
                ราคาที่ส่วนกลาง (บาท) {renderSortArrow("priceHQ")}
              </th>
              <th onClick={() => handleSort("priceDistrict")}>
                ราคาเฉลี่ยที่กฟข. (บาท) {renderSortArrow("priceDistrict")}
              </th>
              <th onClick={() => handleSort("priceDiff")}>
                % ราคาที่แตกต่าง {renderSortArrow("priceDiff")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr key={index}>
                <td>{row.matNR}</td>
                <td>{row.matName}</td>
                <td>
                  <span
                    className={row.priceHQ < row.priceDistrict ? "lower" : ""}
                  >
                    {formatPrice(row.priceHQ)}
                  </span>
                </td>
                <td>
                  <span
                    className={row.priceDistrict < row.priceHQ ? "lower" : ""}
                  >
                    {formatPrice(row.priceDistrict)}
                  </span>
                </td>
                <td>{formatPercentage(row.priceDiff)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableD3Price;
