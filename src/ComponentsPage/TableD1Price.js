import React from "react";
import "../ComponentsStyles/table.css";

const TableD1Price = ({ title, data }) => {
  const formatPrice = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <div className="table-container">
      <h2 className="table-title">{title}</h2>
      <div className="table-wrapper-NS">
        <table>
          <thead>
            <tr>
              <th>รหัสพัสดุ</th>
              <th>ชื่อพัสดุ</th>
              <th>% ราคาที่แตกต่าง</th>
              <th>ราคาเฉลี่ยที่กฟฟ. เขต</th>
              <th>ราคาที่ส่วนกลาง</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td data-label="รหัสพัสดุ">{row.matNR}</td>
                <td data-label="ชื่อพัสดุ">{row.matName}</td>
                <td data-label="ราคาที่แตกต่าง (เท่า)">{row.priceDiff}</td>
                <td data-label="ราคาเฉลี่ยที่กฟข. (บาท)">
                  <span
                    className={row.priceDistrict < row.priceHQ ? "lower" : ""}
                  >
                    {formatPrice(row.priceDistrict)}{" "}
                  </span>
                </td>
                <td data-label="ราคาที่ส่วนกลาง (บาท)">
                  <span
                    className={row.priceHQ < row.priceDistrict ? "lower" : ""}
                  >
                    {formatPrice(row.priceHQ)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableD1Price;
