import React, { useState } from "react";
import "../ComponentsStyles/table.css";
import "../ComponentsStyles/TablePrice.css";

const TableD3LastPrice = ({ title, data }) => {
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
              <th onClick={() => handleSort("date")}>
                วันที่จัดซื้อ {renderSortArrow("date")}
              </th>
              <th onClick={() => handleSort("werks")}>
                คลังพัสดุ {renderSortArrow("werks")}
              </th>
              <th onClick={() => handleSort("ekgrp")}>
                หน่วยงานจัดซื้อ {renderSortArrow("ekgrp")}
              </th>
              <th onClick={() => handleSort("matNR")}>
                รหัสพัสดุ {renderSortArrow("matNR")}
              </th>
              <th onClick={() => handleSort("matName")}>
                ชื่อพัสดุ {renderSortArrow("matName")}
              </th>
              <th onClick={() => handleSort("lastPrice")}>
                ราคาล่าสุด {renderSortArrow("lastPrice")}
              </th>
              <th onClick={() => handleSort("lastQty")}>
                จำนวนล่าสุด {renderSortArrow("lastQty")}
              </th>
              <th onClick={() => handleSort("netwr")}>
                มูลค่า {renderSortArrow("netwr")}
              </th>             
              <th onClick={() => handleSort("poNum")}>
                เลขที่ PO {renderSortArrow("poNum")}
              </th>
              <th onClick={() => handleSort("vName")}>
                คู่ค้า {renderSortArrow("vName")}
              </th>

            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr key={index}>
                <td>{row.date}</td>
                <td>{row.werks}</td>
                <td>{row.ekgrp}</td>
                <td>
                  {specialMatNRs.includes(row.matNR)
                    ? `${row.matNR}*`
                    : row.matNR}
                </td>
                <td className="matnr">{row.matName}</td>
                <td className="number">
                    {formatPrice(row.lastPrice)}
                </td>
                <td className="number">
                    {formatQuantity(row.lastQty)}
                </td>
                <td className="number">
                    {formatQuantity(row.netwr)}
                </td>               
                <td>
                    {row.poNum}
                </td>
                <td>
                    {row.vName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableD3LastPrice;