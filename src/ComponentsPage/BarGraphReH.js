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
import "../ComponentsStyles/BarGraphReH.css";

const numberFormatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  maximumFractionDigits: 3,
});

// Component to render a horizontal bar chart
const BarGraphReH = ({ data, yAxisKey, barKey, title, height = 900 }) => {
  return (
    <div className="bar-chart-container">
      <h2 className="bar-chart-title">{title}</h2>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 20, left: 30, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {/* X-Axis now represents the numeric values */}
          <XAxis
            tickFormatter={numberFormatter.format}
            type="number"
            domain={[0, "dataMax"]}
          />
          {/* Y-Axis represents the category names */}
          <YAxis dataKey={yAxisKey} type="category" width={130} />
          <Tooltip />
          <Bar dataKey={barKey} fill="#4a0072">
            {/* Display labels inside the horizontal bars */}
            <LabelList
              dataKey={barKey}
              position="top"
              formatter={numberFormatter.format}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarGraphReH;
