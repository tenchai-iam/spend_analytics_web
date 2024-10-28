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
const formatCurrency = (value) => `${value.toLocaleString()}`;

const LineGraphRe = ({ data, xAxisKey, lineKey, title }) => {
  // Get screen width to dynamically adjust chart height for responsiveness
  const screenWidth = window.innerWidth;

  // Set dynamic height for the chart based on screen width
  const chartHeight = screenWidth < 600 ? 250 : screenWidth < 768 ? 300 : 400;

  // Set dynamic label font size based on screen width
  const labelFontSize =
    screenWidth < 600 ? "10px" : screenWidth < 768 ? "12px" : "14px";

  return (
    <div className="line-chart-container">
      <h2 className="line-chart-title">{title}</h2>
      <ResponsiveContainer width="100%" height={chartHeight}>
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
          <Tooltip formatter={(value) => `${value.toLocaleString("th-TH")}`} />
          <Line
            type="monotone"
            dataKey={lineKey}
            stroke="#4a0072"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          >
            {/* Adjust the label font size based on screen size */}
            <LabelList
              dataKey={lineKey}
              offset={10}
              position="top"
              formatter={formatCurrency}
              style={{ fontSize: labelFontSize }}
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineGraphRe;
