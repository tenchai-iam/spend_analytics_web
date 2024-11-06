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
  Cell,
} from "recharts";
import "../ComponentsStyles/BarGraphReV.css";

// Safe formatter function with fallback
const formatCurrency = (value) => {
  if (value === null || value === undefined) return "-";
  return value.toLocaleString();
};

// Custom Tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { maxPrice, minPrice } = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p>{`ราคาสูงสุด (บาท): ${formatCurrency(maxPrice)}`}</p>
        <p>{`ราคาต่ำสุด (บาท): ${formatCurrency(minPrice)}`}</p>
      </div>
    );
  }
  return null;
};

// Find the highest maxPrice and lowest minPrice in the data
const findPriceExtremes = (data) => {
  let highestMaxPrice = -Infinity;
  let lowestMinPrice = Infinity;

  data.forEach((item) => {
    if (item.maxPrice > highestMaxPrice) highestMaxPrice = item.maxPrice;
    if (item.minPrice < lowestMinPrice) lowestMinPrice = item.minPrice;
  });

  return { highestMaxPrice, lowestMinPrice };
};

const D3BarGraphReV = ({ data, xAxisKey, barKey, title, height = 400 }) => {
  const { highestMaxPrice, lowestMinPrice } = findPriceExtremes(data);

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
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey={barKey} fill="#4a0072">
            {data.map((entry, index) => {
              let color = "#4a0072"; // Default color
              if (entry.maxPrice === highestMaxPrice) color = "red";
              if (entry.minPrice === lowestMinPrice) color = "green";
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
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

export default D3BarGraphReV;
