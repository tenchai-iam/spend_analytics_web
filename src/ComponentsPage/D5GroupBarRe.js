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

  // Define custom labels for each bar
  const barLabels = {
    baseValue: "Baseline",
    normalizedDifference: "Normalization",
    normalizedValue: "Normalized Baseline",
    actualDifferenceP: "Value Gain",
    actualDifferenceN: "Value Loss",
    actualValue: "Actual",
  };

  useEffect(() => {
    if (data) {
      const { base, normalized, actual } = data;

      // Calculate differences
      const differenceN = normalized - base;
      const differenceA = actual - normalized;

      // Set aggregated data with valid placeholder values
      setAggregatedData([
        {
          baseValue: base,
          normalizedPlaceholder: base, // Assign base value for placeholder
          normalizedDifference: differenceN,
          normalizedValue: normalized,
          actualPlaceholder: normalized, // Assign normalized value for placeholder
          actualDifference: differenceA,
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
          {/* Normalized Placeholder and Difference */}
          <Bar
            dataKey="normalizedPlaceholder"
            fill="transparent"
            stackId="offsetNormalized"
          />
          <Bar
            dataKey="normalizedDifference"
            fill={
              (aggregatedData[0]?.normalizedDifference || 0) >= 0
                ? "#FD8A8A"
                : "#ACE1AF"
            }
            stackId="offsetNormalized"
            name="Normalized Difference"
          >
            <LabelList
              dataKey="normalizedDifference"
              position="top"
              formatter={formatValue}
            />
            <LabelList
              valueAccessor={() => barLabels["normalizedDifference"]}
              position="center"
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
          {/* Actual Placeholder and Difference */}
          <Bar
            dataKey="actualPlaceholder"
            fill="transparent"
            stackId="offsetActual"
            name="Actual Placeholder"
          />
          <Bar
            dataKey="actualDifference"
            fill={
              (aggregatedData[0]?.actualDifference || 0) >= 0
                ? "#FD8A8A"
                : "#ACE1AF"
            }
            stackId="offsetActual"
            name="Actual Difference"
          >
            <LabelList
              dataKey="actualDifference"
              position="top"
              formatter={formatValue}
            />
            <LabelList
              valueAccessor={(entry) =>
                entry.actualDifference >= 0
                  ? barLabels["actualDifferenceN"]
                  : barLabels["actualDifferenceP"]
              }
              position="center"
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
