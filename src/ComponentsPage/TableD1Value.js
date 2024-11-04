import React from "react";
import "../ComponentsStyles/table.css";

const TableD1Value = ({ title, data }) => {
  const formatQuantity = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="table-container">
      <h2 className="table-title">{title}</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>พื้นที่การจัดซื้อ</th>
              <th>เปอร์เซ็นต์ PO มูลค่าไม่เกิน 500,000 บาท</th>
              <th>จำนวน PO มูลค่าไม่เกิน 500,000 บาท</th>
              <th>จำนวน PO ทั้งหมด</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.district}</td>
                <td>{row.percentQuantity}</td>
                <td>{formatQuantity(row.lessThanQuantity)}</td>
                <td>{formatQuantity(row.totalQuantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableD1Value;
