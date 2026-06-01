import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import "../ComponentsStyles/BarGraphReV.css";

const formatValue = (value) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const D5GroupBarRe = ({
  data,
  title,
  height = 400,
  baseColor = "#3e3e3e",
  normalizedColor = "#3e3e3e",
  actualColor = "#4a0072",
}) => {
  const [aggregatedData, setAggregatedData] = useState([]);

  const barLabels = {
    baseValue: "Baseline",
    normalizedValue: "Normalized Baseline",
    actualValue: "Actual",
  };

  useEffect(() => {
    if (data) {
      const { base, normalized, actual } = data;

      setAggregatedData([
        {
          baseValue: base,
          normalizedValue: normalized,
          actualValue: actual,
        },
      ]);
    }
  }, [data]);

  return (
    <div className="bar-chart-container">
      <h2 className="bar-chart-title">{title}</h2>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={aggregatedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          {/* Base Value Bar */}
          <Bar dataKey="baseValue" fill={baseColor} name="Base Value">
            <LabelList
              dataKey="baseValue"
              position="top"
              formatter={formatValue}
            />
            {/* Add custom label below the bar */}
            <LabelList
              valueAccessor={() => barLabels["baseValue"]}
              position="bottom"
              offset={10}
            />
          </Bar>
          {/* Normalized Value Bar */}
          <Bar
            dataKey="normalizedValue"
            fill={normalizedColor}
            name="Normalized Value"
          >
            <LabelList
              dataKey="normalizedValue"
              position="top"
              formatter={formatValue}
            />
            <LabelList
              valueAccessor={() => barLabels["normalizedValue"]}
              position="bottom"
              offset={10}
            />
          </Bar>
          {/* Actual Value Bar */}
          <Bar dataKey="actualValue" fill={actualColor} name="Actual Value">
            <LabelList
              dataKey="actualValue"
              position="top"
              formatter={formatValue}
            />
            <LabelList
              valueAccessor={() => barLabels["actualValue"]}
              position="bottom"
              offset={10}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default D5GroupBarRe;
