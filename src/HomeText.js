import React from "react";
import "./ComponentsStyles/HomeText.css"; // Separate CSS file for styling

const HomeText = () => {
  return (
    <div className="text-container">
      <p>ยอดจัดซื้อทั้งหมด</p>
      <p>จำนวนใบสั่งซื้อ (PO) ทั้งหมด</p>
    </div>
  );
};

export default HomeText;
