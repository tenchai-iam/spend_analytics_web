import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const CostSavingsChart = ({ data, savings }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(chartRef.current);
    const container = svg.node().parentNode;

    // Use the width and height of the parent container
    const width = container.clientWidth;
    const height = container.clientHeight || 400; // Set a default height

    // Clear any previous content before rendering new chart
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 20, bottom: 50, left: 100 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const chart = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, chartWidth])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([chartHeight, 0]);

    // X Axis
    chart
      .append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-15)")
      .style("text-anchor", "end");

    // Y Axis
    chart.append("g").call(d3.axisLeft(y).tickFormat(d3.format(",")).ticks(5));

    // Bars
    chart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.name))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => chartHeight - y(d.value))
      .attr("fill", "#1f77b4");

    // Add text labels on top of bars
    chart
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.name) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 5)
      .attr("text-anchor", "middle")
      .text((d) => d3.format(",")(d.value));
  }, [data]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <svg ref={chartRef}></svg>
      <h3>
        ค่าใช้จ่ายที่ลดได้:{" "}
        <span style={{ color: savings > 0 ? "green" : "red" }}>
          {d3.format(",")(savings)}
        </span>
      </h3>
    </div>
  );
};

export default CostSavingsChart;
