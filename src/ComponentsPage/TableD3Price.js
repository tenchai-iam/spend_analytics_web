import React from "react";
import "../ComponentsStyles/table.css";

const TableD3Price = ({ title, data }) => {
  const formatPrice = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value);

  return (
    <div className="table-container">
      <h2 className="table-title">{title}</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>รหัสพัสดุ</th>
              <th>ชื่อพัสดุ</th>
              <th>เปอร์เซ็นต์ราคาที่แตกต่างกัน</th>
              <th>ราคาที่กฟข. (บาท)</th>
              <th>ราคาที่ส่วนกลาง (บาท)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.matNR}</td>
                <td>{row.matName}</td>
                <td>{row.priceDiff}</td>
                <td>{formatPrice(row.priceDistrict)}</td>
                <td>{formatPrice(row.priceHQ)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableD3Price;
