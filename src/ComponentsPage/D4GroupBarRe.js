import React, { useEffect, useState } from "react";
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
import "../ComponentsStyles/BarGraphReV.css";

const formatValue = (value) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(value);

const D4GroupBarRe = ({
  data, // data is dataTableSimMaterialPlan
  title,
  height = 400,
  hqColor = "#4a0072",
  districtColor = "#3e3e3e",
}) => {
  const [aggregatedData, setAggregatedData] = useState([]);
  const [regionDifferences, setRegionDifferences] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const totalUnitTargetCost = data.reduce(
        (sum, item) =>
          sum +
          (item.unitHQ * item.priceHQ +
            item.unitDistrict * item.priceDistrict) /
            1000000,
        0
      );
      const totalUnitBaseCost = data.reduce(
        (sum, item) => sum + (item.newQuantity * item.priceDistrict) / 1000000,
        0
      );
      const difference = totalUnitBaseCost - totalUnitTargetCost;

      // Pre-calculate differences for each region for tooltip display
      const differences = data.map((item) => ({
        region: item.region,
        difference:
          (item.unitHQ * item.priceDistrict - item.unitHQ * item.priceHQ) /
          1000000,
      }));

      setAggregatedData([
        {
          baseCost: totalUnitBaseCost,
          targetCost: totalUnitTargetCost,
          Placeholder: totalUnitTargetCost, // Placeholder for offsetting Difference
          Difference: difference,
        },
      ]);
      setRegionDifferences(differences);
    }
  }, [data, hqColor, districtColor]);

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
            bottom: 40,
          }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <Tooltip
            content={() => (
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                }}
              >
                <h5>Savings ตามเขต</h5>
                <ul>
                  {regionDifferences.map((item, index) => (
                    <li key={index}>
                      {item.region}: {formatValue(item.difference)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          />
          <Legend />

          {/* Render bars for HQ Cost and District Cost */}
          <Bar dataKey="baseCost" fill={hqColor} name="Base Case">
            <LabelList
              dataKey="baseCost"
              position="top"
              formatter={formatValue}
            />
          </Bar>
          <Bar dataKey="targetCost" fill={districtColor} name="Target Case">
            <LabelList
              dataKey="targetCost"
              position="top"
              formatter={formatValue}
            />
          </Bar>

          {/* Render Placeholder and Difference bars for offset effect */}
          <Bar dataKey="Placeholder" fill="transparent" stackId="offset" />
          <Bar
            dataKey="Difference"
            fill={aggregatedData[0]?.Difference >= 0 ? "#FD8A8A" : "#ACE1AF"}
            stackId="offset"
            name="Savings"
          >
            <LabelList
              dataKey="Difference"
              position="top"
              formatter={formatValue}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default D4GroupBarRe;
