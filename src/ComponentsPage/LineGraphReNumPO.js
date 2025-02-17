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

const numberFormatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  maximumFractionDigits: 0,
});

// Mapping abbreviations to full Thai location names
const LOCATION_NAMES = {
  A: "กฟน.1",
  B: "กฟน.2",
  C: "กฟน.3",
  D: "กฟฉ.1",
  E: "กฟฉ.2",
  F: "กฟฉ.3",
  G: "กฟก.1",
  H: "กฟก.2",
  I: "กฟก.3",
  J: "กฟต.1",
  K: "กฟต.2",
  L: "กฟต.3",
  U: "ตัวอย่าง", // Example text in Thai
  Z: "ส่วนกลาง",
};

// Generalized Tooltip Component
const CustomTooltip = ({ active, payload, label, dataKey, title }) => {
  if (active && payload && payload.length) {
    const item = payload.find((entry) => entry.dataKey === dataKey)?.value || 0;
    const districts =
      payload.find((entry) => entry.payload[`${dataKey}Districts`])?.payload[
        `${dataKey}Districts`
      ] || {};

    // Construct list items dynamically, mapping district codes to full names
    const breakdown = [];
    for (const key in districts) {
      if (Object.hasOwnProperty.call(districts, key)) {
        const locationName = LOCATION_NAMES[key] || key; // Map key to full name
        breakdown.push(
          <li key={key} style={{ fontSize: "0.8rem" }}>
            {locationName}:{" "}
            {numberFormatter.format(districts[key])}
          </li>
        );
      }
    }

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
        <p style={{ color: "#4a0072", margin: 0 }}>
          {numberFormatter.format(item)}
        </p>
        <div style={{ marginTop: "10px" }}>
          <strong>{title}</strong>
          <ul style={{ paddingLeft: "20px", margin: "5px 0" }}>{breakdown}</ul>
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
      <div style={{ position: "relative", zIndex: 2 }}>
        <ResponsiveContainer width="100%" height={height || 400}>
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={xAxisKey}
              tick={{ fontSize: "0.8rem", fill: "#3e3e3e" }}
            />
            <YAxis
              tickFormatter={(value) => numberFormatter.format(value)}
              tick={{ fontSize: "0.8rem", fill: "#3e3e3e" }}
            />
            <Tooltip
              content={<CustomTooltip dataKey="mat" title="สัดส่วนตาม กฟข." />}
            />
            {/* Material Spend Line */}
            <Line
              type="monotone"
              dataKey="mat"
              stroke="#932BDE"
              strokeWidth={2}
              activeDot={{ r: 8 }}
            >
              <LabelList
                dataKey="mat"
                offset={10}
                position="top"
                formatter={(value) => numberFormatter.format(value)}
                style={{ fontSize: "0.8rem", fill: "#932BDE" }}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <ResponsiveContainer width="100%" height={height || 400}>
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={xAxisKey}
              tick={{ fontSize: "0.8rem", fill: "#3e3e3e" }}
            />
            <YAxis
              tickFormatter={(value) => numberFormatter.format(value)}
              tick={{ fontSize: "0.8rem", fill: "#3e3e3e" }}
            />
            <Tooltip
              content={
                <CustomTooltip dataKey="nonMat" title="สัดส่วนตาม กฟข." />
              }
            />
            {/* Non-Material Spend Line */}
            <Line
              type="monotone"
              dataKey="nonMat"
              stroke="#12B76A"
              strokeWidth={2}
              activeDot={{ r: 8 }}
            >
              <LabelList
                dataKey="nonMat"
                offset={10}
                position="top"
                formatter={(value) => numberFormatter.format(value)}
                style={{ fontSize: "0.8rem", fill: "#12B76A" }}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineGraphReNumPO;
