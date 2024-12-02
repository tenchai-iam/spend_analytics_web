import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "../ComponentsStyles/DonutChartRe.css";

const COLORS = ["#ff0000", "#c69530", "#00674f"]; // Example colors

const D4DonutChartRe = ({ data, title, height = 400, onPrioritySelect }) => {
  const numberFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      return (
        <div
          className="custom-tooltip donut-text"
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <p className="label donut-text" style={{ margin: 0 }}>
            <strong>{name}:</strong> {numberFormatter.format(value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const handleClick = (data, index) => {
    const priority = data.priority; // Get the clicked section’s name (priority)
    onPrioritySelect(priority); // Call the callback function with the priority
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
            innerRadius="60%"
            outerRadius="80%"
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label={({ value, percent }) => {
              const formattedValue = numberFormatter.format(value);
              return `${formattedValue} (${(percent * 100).toFixed(2)}%)`;
            }}
            labelLine={false}
            onClick={handleClick} // Add click handler
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default D4DonutChartRe;
