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
          {/* Format the Y-axis values */}
          <YAxis tickFormatter={formatCurrency} />
          {/* Tooltip with custom formatter */}
          <Tooltip formatter={(value) => formatCurrency(value)} />
          {/* Render horizontal bars */}
          <Bar dataKey={barKey} fill="#4a0072">
            {/* Display labels inside the horizontal bars */}
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

export default BarGraphReV;
