import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const BarChart = ({ data }) => {
  const chartRef = useRef();

  // Define a color scale
  const colorScale = d3
    .scaleSequential()
    .domain([0, d3.max(data, (d) => d.value)]) // Map values to a color range
    .interpolator(d3.interpolatePurples); // Use a purple color scale

  useEffect(() => {
    // Set up the SVG element
    const containerWidth = chartRef.current?.clientWidth || 800; // Dynamic width based on container
    const containerHeight = 600; // Fixed height to accommodate more space
    const margin = { top: 20, right: 30, bottom: 50, left: 50 }; // Adjusted margins for better space

    // Set the dimensions and margins of the graph
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    // Select and clear previous content from SVG
    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    // Append the SVG object to the chartRef element
    const chart = svg
      .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`) // Make SVG responsive
      .attr("preserveAspectRatio", "xMidYMid meet") // Preserve aspect ratio for responsiveness
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis scale (categorical)
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.name))
      .padding(0.2); // Increased padding between bars

    // Y axis scale (linear)
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice() // Makes the axis end on a nice round number
      .range([height, 0]);

    // Add the X axis with custom styles
    chart
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "middle")
      .style("font-family", "Arial, sans-serif") // Custom font family
      .style("font-size", "14px") // Custom font size
      .style("fill", "#333"); // Custom font color

    // Add the Y axis with custom styles
    chart
      .append("g")
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .style("font-family", "Arial, sans-serif") // Custom font family
      .style("font-size", "14px") // Custom font size
      .style("fill", "#333"); // Custom font color

    // Tooltip setup
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #d3d3d3")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("box-shadow", "0 0 10px rgba(0, 0, 0, 0.1)")
      .style("visibility", "hidden") // Initially hidden
      .style("font-size", "12px");

    // Add the bars with animations
    chart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.name))
      .attr("width", x.bandwidth())
      .attr("y", height) // Start bars from the bottom for animation
      .attr("height", 0) // Start with height 0 for animation
      .attr("fill", (d) => colorScale(d.value)) // Use color scale for dynamic coloring
      .attr(
        "aria-label",
        (d) => `Bar representing ${d.name} with value ${d.value}`
      ) // Accessibility
      .on("mouseover", (event, d) => {
        tooltip
          .style("visibility", "visible")
          .html(`Category: ${d.name}<br>Value: ${d.value}`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("top", `${event.pageY - 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      })
      .transition() // Add animation transition
      .duration(800) // Duration of the animation
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => height - y(d.value));

    // Cleanup function to remove tooltip when component unmounts
    return () => {
      tooltip.remove();
    };
  }, [data]);

  return <svg ref={chartRef} style={{ width: "100%", height: "100%" }}></svg>; // Responsive SVG
};

export default BarChart;
