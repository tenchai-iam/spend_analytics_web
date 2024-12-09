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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const formatQuantity = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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

    const specialMatNRs = [
    "1020010002",
    "1020010007",
    "1020010009",
    "1020020002",
    "1020020007",
    "1020050000",
    "1020050004",
    "1020050100",
    "1020050104",
    "1020070000",
    "1020070002",
    "1020070004",
  ];

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
                ราคาที่ส่วนกลาง {renderSortArrow("priceHQ")}
              </th>
              <th onClick={() => handleSort("priceDistrict")}>
                ราคาเฉลี่ยที่ กฟข. {renderSortArrow("priceDistrict")}
              </th>
              <th onClick={() => handleSort("priceDiff")}>
                % ราคาที่แตกต่าง {renderSortArrow("priceDiff")}
              </th>
              <th onClick={() => handleSort("quantityHQ")}>
                จำนวนพัสดุเฉลี่ยต่อ PO ที่ส่วนกลาง{" "}
                {renderSortArrow("quantityHQ")}
              </th>
              <th onClick={() => handleSort("quantityRegion")}>
                จำนวนพัสดุเฉลี่ยต่อ PO ที่ กฟข.{" "}
                {renderSortArrow("quantityRegion")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr key={index}>
                <td>{specialMatNRs.includes(row.matNR) ? `${row.matNR}*` : row.matNR}</td>
                <td>
                    {row.matName}
                </td>
                <td>
                  <span
                    className={row.priceHQ < row.priceDistrict && row.priceHQ > 0 ? "lower" : ""}
                  >
                    {row.priceHQ === 0 ? "-" : formatPrice(row.priceHQ)}{" "}
                  </span>
                </td>
                <td>
                  <span
                    className={row.priceDistrict < row.priceHQ && row.priceDistrict > 0 ? "lower" : ""}
                  >
                    {row.priceDistrict === 0 ? "-" : formatPrice(row.priceDistrict)}{" "}
                  </span>
                </td>
                <td>
                  {row.priceDiff < 0 ? "-" : formatPercentage(row.priceDiff)}
                </td>
                <td>{formatQuantity(row.quantityHQ)}</td>
                <td>{formatQuantity(row.quantityRegion)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableD3Price;

