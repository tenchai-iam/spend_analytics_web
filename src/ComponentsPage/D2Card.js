import React from "react";
import "../ComponentsStyles/D2Card.css"; // Import CSS for Card styling

const Card = ({ company, purchaseValue, poCount, avgPoValue }) => {
  return (
    <div className="card">
      <h3 className="card-title">{company}</h3>
      <div className="card-grid">
        <div className="card-item card-purchase-value">
          <p className="card-label">มูลค่าการจัดซื้อ:</p>
          <p className="card-data">{purchaseValue}</p>
        </div>
        <div className="card-item card-po-count">
          <p className="card-label">จำนวน PO:</p>
          <p className="card-data">{poCount}</p>
        </div>
        <div className="card-item card-avg-po-value">
          <p className="card-label">มูลค่าการจัดซื้อต่อ PO:</p>
          <p className="card-data">{avgPoValue}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
