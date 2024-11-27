import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import "../ComponentsStyles/LineGraphRe.css";

// Custom formatter function for Y-axis values
const formatCurrency = (value) => `${value.toLocaleString("th-TH")}`;

// Generalized Tooltip Component
const CustomTooltip = ({ active, payload, label, dataKey, title }) => {
  if (active && payload && payload.length) {
    // Extract the active line's data
    const item = payload[0]?.payload?.[dataKey] || 0;

    // Extract district breakdown
    const districts = payload[0]?.payload?.[`${dataKey}Districts`] || {};

    // Construct district breakdown list
    const breakdown = Object.entries(districts).map(([key, value]) => (
      <li key={key} style={{ fontSize: "12px" }}>
        {key}: {formatCurrency(value)}
      </li>
    ));

    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          fontSize: "14px",
          maxWidth: "300px",
        }}
      >
        <p style={{ marginBottom: "5px" }}>
          <strong>{label}</strong>
        </p>
        <p style={{ color: "#4a0072", margin: 0 }}>{formatCurrency(item)}</p>
        <div style={{ marginTop: "10px" }}>
          <strong>{title}</strong>
          <ul style={{ paddingLeft: "15px", margin: "5px 0" }}>{breakdown}</ul>
        </div>
      </div>
    );
  }

  return null;
};

const LineGraphReNumPO = ({ data, xAxisKey, title, height }) => {
  // Get screen width to dynamically adjust chart styling
  const screenWidth = window.innerWidth;

  // Set dynamic label font size based on screen width
  const labelFontSize =
    screenWidth < 600 ? "10px" : screenWidth < 768 ? "12px" : "14px";

  return (
    <div className="line-chart-container">
      <h2 className="line-chart-title">{title}</h2>
      <ResponsiveContainer width="100%" height={height || 400}>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip
            content={<CustomTooltip dataKey="mat" title="สัดส่วนตาม กฟข." />}
          />
          {/* Material PO Num Line */}
          <Line
            type="monotone"
            dataKey="mat"
            stroke="#4a0072"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          >
            <LabelList
              dataKey="mat"
              offset={10}
              position="top"
              formatter={(value) => formatCurrency(value)}
              style={{ fontSize: labelFontSize, fill: "#4a0072" }}
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={height || 400}>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip
            content={<CustomTooltip dataKey="nonMat" title="สัดส่วนตาม กฟข." />}
          />
          {/* Non-Material Spend Line */}
          <Line
            type="monotone"
            dataKey="nonMat"
            stroke="#00724a"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          >
            <LabelList
              dataKey="nonMat"
              offset={10}
              position="top"
              formatter={(value) => formatCurrency(value)}
              style={{ fontSize: labelFontSize, fill: "#00724a" }}
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineGraphReNumPO;