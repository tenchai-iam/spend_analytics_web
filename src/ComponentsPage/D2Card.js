import React from "react";
import "../ComponentsStyles/D2Card.css"; // Import CSS for Card styling

const Card = ({ SUPPLIER_NAME, TOTAL_SPEND, TOTAL_PO, SPEND_PER_PO }) => {
  // Thai Baht currency formatter for proper formatting
  const thbFormatter = new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  });

  return (
    <div className="card">
      <h3 className="card-title">{SUPPLIER_NAME}</h3>
      <div className="card-grid">
        <div className="card-item card-purchase-value">
          <p className="card-label">มูลค่าการจัดซื้อ (บาn)</p>
          <p className="card-data">{thbFormatter.format(TOTAL_SPEND)}</p>
        </div>
        <div className="card-item card-po-count">
          <p className="card-label">จำนวน PO (รายการ)</p>
          <p className="card-data">{TOTAL_PO.toLocaleString()}</p>
        </div>
        <div className="card-item card-avg-po-value">
          <p className="card-label">มูลค่าการจัดซื้อต่อ PO (บาทต่อรายการ)</p>
          <p className="card-data">{thbFormatter.format(SPEND_PER_PO)}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
