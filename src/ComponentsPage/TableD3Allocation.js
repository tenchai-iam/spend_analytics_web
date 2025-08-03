import React, { useState } from "react";
import "../ComponentsStyles/table.css";
import "../ComponentsStyles/TablePrice.css";

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

  const formatValue = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
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
              <th onClick={() => handleSort("quantityHQ")}>
                จำนวนจัดซื้อโดยส่วนกลาง{" "}
                {renderSortArrow("quantityHQ")}
              </th>
              <th onClick={() => handleSort("quantityRegion")}>
                จำนวนจัดซื้อโดย กฟข.{" "}
                {renderSortArrow("quantityRegion")}
              </th>
                            <th onClick={() => handleSort("quantityTotal")}>
                จำนวนจัดซื้อรวม{" "}
                {renderSortArrow("quantityTotal")}
              </th>
                <th onClick={() => handleSort("budgetHQ")}>
                งบประมาณส่วนกลาง{" "}
                {renderSortArrow("budgetHQ")}
              </th>
                              <th onClick={() => handleSort("budgetRegion")}>
                งบประมาณ กฟข.{" "}
                {renderSortArrow("budgetRegion")}
              </th>
                              <th onClick={() => handleSort("budgetTotal")}>
                งบประมาณรวม{" "}
                {renderSortArrow("budgetTotal")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr key={index}>
                <td>
                  {specialMatNRs.includes(row.matNR)
                    ? `${row.matNR}*`
                    : row.matNR}
                </td>
                <td className="matnr">{row.matName}</td>
                <td className="number">
                  <span
                    className={
                      row.priceHQ < row.priceDistrict && row.priceHQ > 0
                        ? "lower"
                        : ""
                    }
                  >
                    {row.priceHQ === 0 ? "-" : formatPrice(row.priceHQ)}{" "}
                  </span>
                </td>
                <td className="number">
                  <span
                    className={
                      row.priceDistrict < row.priceHQ && row.priceDistrict > 0
                        ? "lower"
                        : ""
                    }
                  >
                    {row.priceDistrict === 0
                      ? "-"
                      : formatPrice(row.priceDistrict)}{" "}
                  </span>
                </td>
                <td className="number">{formatQuantity(row.quantityHQ)}</td>
                <td className="number">{formatQuantity(row.quantityRegion)}</td>
                <td className="number">{formatQuantity(row.quantityTotal)}</td>
                <td className="number">{formatValue(row.budgetHQ)}</td>
                <td className="number">{formatValue(row.budgetRegion)}</td>
                <td className="number">{formatValue(row.budgetTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableD3Price;