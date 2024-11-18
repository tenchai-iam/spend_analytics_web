import React, { useState } from "react";
import "../ComponentsStyles/table.css";

const Table4 = ({ title, data }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const formatQuantity = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatMonth = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const formatTotal = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "string") {
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
      <div className="table-wrapper-NS">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("region")}>
                กฟฟ. {renderSortArrow("region")}
              </th>
              <th onClick={() => handleSort("usage")}>
                อัตราการใช้งานต่อเดือน (R/M) {renderSortArrow("usage")}
              </th>
              <th onClick={() => handleSort("stock")}>
                ยอดคงคลัง {renderSortArrow("stock")}
              </th>
              <th onClick={() => handleSort("quantityPR")}>
                PR ที่ยังไม่เป็น PO {renderSortArrow("quantityPR")}
              </th>
              <th onClick={() => handleSort("contract")}>
                สัญญาค้างรับ {renderSortArrow("contract")}
              </th>
              <th onClick={() => handleSort("availStock")}>
                ยอดคงเหลือ {renderSortArrow("availStock")}
              </th>
              <th onClick={() => handleSort("availMonth")}>
                ใช้งานได้ (เดือน) {renderSortArrow("availMonth")}
              </th>
              <th onClick={() => handleSort("quantityAllocate")}>
                คาดการณ์จัดสรรจากส่วนกลาง {renderSortArrow("quantityAllocate")}
              </th>
              <th onClick={() => handleSort("availMonthAfter")}>
                ใช้งานได้ (เดือน) {renderSortArrow("availMonthAfter")}
              </th>
              <th onClick={() => handleSort("newMonth")}>
                จัดหาเพิ่ม (เดือน) {renderSortArrow("newMonth")}
              </th>
              <th onClick={() => handleSort("newQuantity")}>
                จัดหาเพิ่ม (หน่วย) {renderSortArrow("newQuantity")}
              </th>
              <th onClick={() => handleSort("unitHQ")}>
                จัดหาเพิ่มโดย ฝวห. (หน่วย) {renderSortArrow("unitHQ")}
              </th>
              <th onClick={() => handleSort("priceHQ")}>
                ราคาที่ ฝวห. {renderSortArrow("priceHQ")}
              </th>
              <th onClick={() => handleSort("unitDistrict")}>
                จัดหาเพิ่มโดย กฟข. (หน่วย) {renderSortArrow("unitDistrict")}
              </th>
              <th onClick={() => handleSort("priceDistrict")}>
                ราคาเฉลี่ยที่ กฟข. {renderSortArrow("priceDistrict")}
              </th>
              <th onClick={() => handleSort("mediumPrice")}>
                ราคาอ้างอิง {renderSortArrow("mediumPrice")}
              </th>
              <th onClick={() => handleSort("budget")}>
                งบประมาณที่ต้องใช้ {renderSortArrow("budget")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr key={index}>
                <td>{row.region}</td>
                <td>{formatQuantity(row.usage)}</td>
                <td>{formatQuantity(row.stock)}</td>
                <td>{formatQuantity(row.quantityPR)}</td>
                <td>{formatQuantity(row.contract)}</td>
                <td>{formatQuantity(row.availStock)}</td>
                <td>{formatMonth(row.availMonth)}</td>
                <td>{formatQuantity(row.quantityAllocate)}</td>
                <td>{formatMonth(row.availMonthAfter)}</td>
                <td>{formatQuantity(row.newMonth)}</td>
                <td>{formatQuantity(row.newQuantity)}</td>
                <td>{formatQuantity(row.unitHQ)}</td>
                <td>{formatPrice(row.priceHQ)}</td>
                <td>{formatQuantity(row.unitDistrict)}</td>
                <td>{formatPrice(row.priceDistrict)}</td>
                <td>{formatPrice(row.mediumPrice)}</td>
                <td>{formatTotal(row.budget)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table4;
