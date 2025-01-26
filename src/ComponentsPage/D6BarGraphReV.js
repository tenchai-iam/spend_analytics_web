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
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const D6BarGraphReV = ({ data, xAxisKey, title, height = 400 }) => {
  return (
    <div className="bar-chart-container">
      <h2 className="bar-chart-title">{title}</h2>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{
            top: 30,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxisKey}
            label={{
              position: "insideBottom", // Position it at the bottom
              offset: -5, // Adjust offset
            }}
          />
          <YAxis tickFormatter={(value) => numberFormatter.format(value)} />
          <Tooltip formatter={(value) => numberFormatter.format(value)} />
          <Bar dataKey="amtused_MT" fill="#932BDE"></Bar>
          <Bar dataKey="amtused_MA" fill="#12B76A"></Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default D6BarGraphReV;
