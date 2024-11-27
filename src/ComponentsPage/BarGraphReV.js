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

// Custom formatter function to add commas and currency symbol
const formatCurrency = (value) => `${value.toLocaleString()}`;

const BarGraphReV = ({ data, xAxisKey, barKey, title, height = 400 }) => {
  // Ensure data contains a `fill` property for coloring bars
  const formattedData = data.map((item, index) => ({
    ...item,
    fill: index === 1 ? "#00724a" : "#4a0072", // Different color for the second bar
  }));

  return (
    <div className="bar-chart-container">
      <h2 className="bar-chart-title">{title}</h2>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={formattedData}
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
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Bar dataKey={barKey}>
            {formattedData.map((entry, index) => (
              <Bar key={index} fill={entry.fill}>
                <LabelList dataKey={barKey} position="top" formatter={formatCurrency} />
              </Bar>
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarGraphReV;
