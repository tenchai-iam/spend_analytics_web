import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const D2Chart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    // Clear the chart if it already exists
    d3.select(chartRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 90 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create the x scale
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([0, width]);

    // Create the y scale
    const y = d3
      .scaleBand()
      .range([0, height])
      .domain(data.map((d, i) => `Value ${i + 1}`))
      .padding(0.1);

    // Add the bars
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", x(0))
      .attr("y", (d, i) => y(`Value ${i + 1}`))
      .attr("width", (d) => x(d))
      .attr("height", y.bandwidth())
      .attr("fill", "#6a1b9a");

    // Add the x Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add the y Axis
    svg.append("g").call(d3.axisLeft(y));
  }, [data]); // Re-render on data change

  return <div ref={chartRef} className="chart-container"></div>;
};

export default D2Chart;
