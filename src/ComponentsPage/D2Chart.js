import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const BarGraphH = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    // Clear the chart if it already exists
    d3.select(chartRef.current).selectAll("*").remove();

    // Define fixed dimensions for the chart
    const margin = { top: 20, right: 30, bottom: 40, left: 90 };
    const width = 550 - margin.left - margin.right; // Fixed width
    const height = 350 - margin.top - margin.bottom; // Fixed height

    // Create the SVG container
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("background", "none") // Set the SVG background to none
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create the x scale
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data)]) // Input domain based on data
      .range([0, width]); // Output range fixed to the chart width

    // Create the y scale
    const y = d3
      .scaleBand()
      .range([0, height]) // Output range fixed to the chart height
      .domain(data.map((d, i) => `Value ${i + 1}`)) // Map each value to its own label
      .padding(0.1); // Spacing between bars

    // Draw the bars
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
  }, [data]);

  return (
    <div
      ref={chartRef}
      style={{ width: "550px", height: "350px", background: "none" }} // Set the div background to none
    ></div>
  );
};

export default BarGraphH;
