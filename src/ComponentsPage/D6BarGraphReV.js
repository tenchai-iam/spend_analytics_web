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

const numberFormatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  maximumFractionDigits: 3,
});

const D6BarGraphReV = ({ data, xAxisKey, barKey, title, height = 400 }) => {
  // Ensure data contains a fill property for coloring bars
  const formattedData = data.map((item, index) => ({
    ...item,
    fill: index === 1 ? "#12B76A" : "#932BDE", // Different color for the second bar
  }));

  return (
    <div className="bar-chart-container">
      <h2 className="bar-chart-title">{title}</h2>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={formattedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} tick={false} />
          <YAxis tickFormatter={(value) => numberFormatter.format(value)} />
          <Tooltip formatter={(value) => numberFormatter.format(value)} />
          <Bar dataKey={barKey} barSize={50}>
            {formattedData.map((entry, index) => (
              <Bar key={index} fill={entry.fill}></Bar>
            ))}
            <LabelList
              dataKey={barKey}
              position="top"
              formatter={(value) => numberFormatter.format(value)}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default D6BarGraphReV;
