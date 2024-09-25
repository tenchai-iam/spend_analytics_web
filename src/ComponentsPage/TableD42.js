// src/Table2Component.js
import React from 'react';
import '../ComponentsStyles/tableD42.css';

const TableD42 = ({ data }) => {
  return (
    <div className="table2-container">
      <table>
        <thead>
          <tr>
            <th>Item Code</th>
            <th>Description</th>
            <th>Usage</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.itemCode}</td>
              <td>{row.description}</td>
              <td>{row.usage}</td>
              <td>
                <span className={`priority ${row.priority.toLowerCase()}`}>
                  {row.priority}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableD42;