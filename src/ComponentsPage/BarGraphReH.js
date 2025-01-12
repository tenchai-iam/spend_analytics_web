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
      {/* Title and Legend Row */}
      <div className="title-legend-container">
        <h2 className="bar-chart-title">{title}</h2>
        <ResponsiveContainer width="50%" height={50}>
          <BarChart>
            <Legend
              verticalAlign="middle"
              className="bar-chart-title"
              align="right"
              payload={[
                { value: hqLabel, type: "square", color: hqColor },
                { value: districtLabel, type: "square", color: districtColor },
              ]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 75, left: 50, bottom: 5 }}
          className="data-size"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            tickFormatter={numberFormatter.format}
            type="number"
            domain={[0, "dataMax"]}
            className="data-size"
          />
          <YAxis
            dataKey={yAxisKey}
            type="category"
            width={350}
            className="data-size"
            tick={{
              dx: -25, // Add spacing between the axis and the text
            }}
          />
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
            className="data-size"
          />
          <Bar dataKey="valueHQ" fill={hqColor} stackId="a" barSize={25} />
          <Bar
            dataKey="valueDistrict"
            fill={districtColor}
            stackId="a"
            barSize={25}
          >
            {/* Display labels only for the sum of valueHQ + valueDistrict */}
            <LabelList
              dataKey={(entry) => entry.valueHQ + entry.valueDistrict}
              position="right"
              formatter={numberFormatter.format}
              className="data-size"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarGraphReH;
