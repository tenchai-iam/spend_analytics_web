import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import "../ComponentsStyles/BarGraphReV.css";

// Safe formatter function with fallback
const formatCurrency = (value) => {
  if (value === null || value === undefined) return "-";
  return value.toLocaleString();
};

// Custom Tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { maxPrice, minPrice } = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p>{`ราคาสูงสุด (บาท): ${formatCurrency(maxPrice)}`}</p>
        <p>{`ราคาต่ำสุด (บาท): ${formatCurrency(minPrice)}`}</p>
      </div>
    );
  }
  return null;
};

const D3BarGraphReV = ({ data, xAxisKey, barKey, title, height = 400 }) => {
  return (
    <div className="bar-chart-container">
      <h2 className="bar-chart-title">{title}</h2>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
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
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey={barKey} fill="#4a0072">
            <LabelList
              dataKey={barKey}
              position="top"
              formatter={formatCurrency}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default D3BarGraphReV;
