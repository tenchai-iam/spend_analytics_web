// src/TableComponent.js
import React from "react";
import "../ComponentsStyles/table.css";

const Table4 = ({ title, data }) => {
  const formatQuantity = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <div className="table-container">
      <h2 className="table-title">{title}</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>กฟฟ.</th>
              <th>อัตราใช้งานต่อเดือน (unit / เดือน)</th>
              <th>ยอดคงคลัง (unit)</th>
              <th>อยู่ระหว่างการดำเนินการจัดหา (PR ที่ยังไม่เป็น PO) (unit)</th>
              <th>สัญญาค้างรับ (unit)</th>
              <th>ยอดคงเหลือ (unit)</th>
              <th>จำนวนเดือนที่ใช้ได้ (unit)</th>
              <th>จัดหาเพิ่ม (เดือน)</th>
              <th>จัดหาเพิ่ม (unit)</th>
              <th>โดย ฝวห. (unit)</th>
              <th>โดย กฟข. (unit)</th>
              <th>ราคาจัดซื้อที่ ฝวห. (บาท)</th>
              <th>ราคาจัดซื้อที่ กฟข. (บาท)</th>
              <th>ราคากลาง (บาท)</th>
              <th>งบประมาณที่ต้องใช้ (บาท)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.region}</td>
                <td>{formatQuantity(row.usage)}</td>
                <td>{formatQuantity(row.stock)}</td>
                <td>{formatQuantity(row.quantityPR)}</td>
                <td>{formatQuantity(row.contract)}</td>
                <td>{formatQuantity(row.availStock)}</td>
                <td>{formatQuantity(row.availMonth)}</td>
                <td>{formatQuantity(row.newMonth)}</td>
                <td>{formatQuantity(row.newQuantity)}</td>
                <td>{formatQuantity(row.unitHQ)}</td>
                <td>{formatQuantity(row.unitDistrict)}</td>
                <td>{formatPrice(row.priceHQ)}</td>
                <td>{formatPrice(row.priceDistrict)}</td>
                <td>{formatPrice(row.mediumPrice)}</td>
                <td>{formatPrice(row.budget)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table4;
