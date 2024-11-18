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
  Legend,
} from "recharts";
import "../ComponentsStyles/BarGraphReH.css";

const numberFormatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  maximumFractionDigits: 3,
});

// Component to render a horizontal stacked bar chart
const BarGraphReH = ({
  data,
  yAxisKey,
  title,
  height = 900,
  hqColor = "#4a0072", // Default color for HQ stack
  districtColor = "#c69530", // Default color for District stack
  hqLabel = "ส่วนกลาง", // Customizable label for HQ stack
  districtLabel = "ส่วนภูมิภาค", // Customizable label for District stack
}) => {
  return (
    <div className="bar-chart-container">
      <h2 className="bar-chart-title">{title}</h2>
      {/* Legend positioned below the title */}
      <ResponsiveContainer width="100%" height={50}>
        <BarChart>
          <Legend
            verticalAlign="top"
            align="center"
            payload={[
              { value: hqLabel, type: "square", color: hqColor },
              { value: districtLabel, type: "square", color: districtColor },
            ]}
          />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 20, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            tickFormatter={numberFormatter.format}
            type="number"
            domain={[0, "dataMax"]}
          />
          <YAxis dataKey={yAxisKey} type="category" width={150} />
          <Tooltip
            formatter={(value, name) => {
              const label =
                name === "valueHQ"
                  ? hqLabel
                  : name === "valueDistrict"
                  ? districtLabel
                  : name;
              return [numberFormatter.format(value), label];
            }}
            labelFormatter={(label) => `Category: ${label}`}
          />
          <Bar dataKey="valueHQ" fill={hqColor} stackId="a" />
          <Bar dataKey="valueDistrict" fill={districtColor} stackId="a">
            {/* Display labels only for the sum of valueHQ + valueDistrict */}
            <LabelList
              dataKey={(entry) => entry.valueHQ + entry.valueDistrict}
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
