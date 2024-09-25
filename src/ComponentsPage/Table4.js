// src/TableComponent.js
import React from "react";
import "../ComponentsStyles/table.css";

const Table4 = ({ data }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>กฟฟ</th>
            <th>อัตราใช้งานต่อเดือน (unit / เดือน)</th>
            <th>ยอดคงคลัง (unit)</th>
            <th>สัญญาค้างรับ (PR without PO) (unit)</th>
            <th>ยอดรวมคงคลังใช้งานได้ (unit)</th>
            <th>อยู่ระหว่างการจัดหาเพิ่ม (unit)</th>
            <th>จัดหาเพิ่ม (เดือน)</th>
            <th>จัดหาเพิ่ม (unit)</th>
            <th>ฝัง (unit)</th>
            <th>กฟฟเขต (unit)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.region}</td>
              <td>{row.usage}</td>
              <td>{row.stock}</td>
              <td>{row.contract}</td>
              <td>{row.awaiting}</td>
              <td>{row.totalStock}</td>
              <td>{row.monthsLeft}</td>
              <td>{row.ordered}</td>
              <td>{row.delivered}</td>
              <td>{row.totalRegion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table4;
