import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "../ComponentsStyles/BubbleChart.css"; // Import the CSS

const BubbleChart = ({ data }) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });

  // Resize chart based on container size
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

    // Remove old chart elements before drawing new ones
    svg.selectAll("*").remove();

    // Create a scale for bubble size
    const sizeScale = d3
      .scaleSqrt()
      .domain([0, d3.max(data, (d) => d.value)]) // adjust domain based on data range
      .range([10, 50]); // Bubble size range (min, max)

    // Create a force simulation to position the bubbles
    const simulation = d3
      .forceSimulation(data)
      .force("x", d3.forceX(dimensions.width / 2).strength(0.05)) // Center based on width
      .force("y", d3.forceY(dimensions.height / 2).strength(0.05)) // Center based on height
      .force(
        "collision",
        d3.forceCollide((d) => sizeScale(d.value) + 5)
      ) // Prevent bubbles from overlapping
      .on("tick", ticked);

    // Draw bubbles
    const bubble = svg
      .selectAll(".bubble")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "bubble")
      .attr("r", (d) => sizeScale(d.value))
      .attr("fill", "#69b3a2")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .style("cursor", "pointer")
      .on("mouseover", function () {
        d3.select(this)
          .attr("fill", "#ff5722") // Change color on hover
          .attr("r", (d) => sizeScale(d.value) + 10); // Enlarge bubble on hover
      })
      .on("mouseout", function () {
        d3.select(this)
          .attr("fill", "#69b3a2") // Return to original color
          .attr("r", (d) => sizeScale(d.value)); // Return to original size
      });

    // Add text labels inside bubbles
    const text = svg
      .selectAll(".text")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bubble-text")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .attr("dy", ".35em")
      .text((d) => d.name);

    // Update positions on each tick
    function ticked() {
      bubble.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      text.attr("x", (d) => d.x).attr("y", (d) => d.y);
    }
  }, [data, dimensions]);

  return (
    <div ref={containerRef} className="bubble-chart-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BubbleChart;
