import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const TreeMap = () => {
  const chartRef = useRef(null); // Reference for the chart container

  useEffect(() => {
    const data = [
      { name: "Transitioner", value: 19975 },
      { name: "Easing", value: 17010 },
      { name: "Transition", value: 9201 },
      { name: "Tween", value: 6006 },
      { name: "Function Sequence", value: 5842 },
      { name: "Scheduler", value: 5593 },
      { name: "Sequence", value: 5534 },
      { name: "Parallel", value: 5176 },
      { name: "Interpolator", value: 8746 },
      { name: "Matrix Interpolator", value: 2202 },
    ];

    // Set dimensions and margins
    const width = 360;
    const height = 360;

    // Create the SVG container
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    // Create a hierarchy from the data
    const root = d3
      .hierarchy({ children: data })
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);

    // Create a treemap layout
    d3.treemap().size([width, height]).padding(1)(root);

    // Draw rectangles for each data point
    svg
      .selectAll("rect")
      .data(root.leaves())
      .join("rect")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("fill", "#fc8d62")
      .attr("stroke", "#fff");

    // Add text labels inside the rectangles
    svg
      .selectAll("text")
      .data(root.leaves())
      .join("text")
      .attr("x", (d) => (d.x0 + d.x1) / 2)
      .attr("y", (d) => (d.y0 + d.y1) / 2)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "10px")
      .style("fill", "#000")
      .text((d) => `${d.data.name}\n${d.data.value}`);

    // Cleanup function to remove SVG on component unmount
    return () => {
      d3.select(chartRef.current).select("svg").remove();
    };
  }, []);

  return <div ref={chartRef} style={{ width: "100%" }}></div>;
};

export default TreeMap;
