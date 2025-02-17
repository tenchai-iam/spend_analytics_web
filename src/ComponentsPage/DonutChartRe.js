import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "../ComponentsStyles/DonutChartRe.css";

const COLORS = ["#BC6FF1", "#B03052", "#C69530"]; // Example colors

const DonutChartRe = ({ data, title, height = 300 }) => {
  const numberFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <p className="label" style={{ margin: 0 }}>
            <strong>{name}:</strong> {numberFormatter.format(value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    name,
    value,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 70; // Increase label radius to move labels away from the chart
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const formattedValue = numberFormatter.format(value);

    return (
      <text x={x} y={y} textAnchor="middle" dominantBaseline="central">
        <tspan x={x} dy="-0.5em">
          {name}
        </tspan>
        <tspan x={x} dy="1.2em">
          {formattedValue} ({(percent * 100).toFixed(2)}%)
        </tspan>
      </text>
    );
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <h2 className="donut-title">{title}</h2>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="35%"
            outerRadius="55%"
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label={renderCustomLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonutChartRe;
