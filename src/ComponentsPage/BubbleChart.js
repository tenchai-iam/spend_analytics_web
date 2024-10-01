import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "../ComponentsStyles/BubbleChart.css"; // Import the CSS file

const BubbleChart = ({ data }) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });

  // Update chart dimensions based on container size
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
    if (!data || data.length === 0) return;

    const svg = d3
      .select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

    // Remove old chart elements before drawing new ones
    svg.selectAll("*").remove();

    // Calculate the maximum radius based on container dimensions
    const maxRadius = Math.min(dimensions.width, dimensions.height) / 10;

    // Create a size scale for bubble radius
    const sizeScale = d3
      .scaleSqrt()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([maxRadius / 4, maxRadius]); // Bubble size range relative to container

    // Create a color scale for the bubbles
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    // Force Simulation Setup
    const simulation = d3
      .forceSimulation(data)
      .force("x", d3.forceX(dimensions.width / 2).strength(0.05))
      .force("y", d3.forceY(dimensions.height / 2).strength(0.05))
      .force(
        "collision",
        d3.forceCollide((d) => sizeScale(d.value) + 5)
      )
      .on("tick", ticked);

    // Draw groups for each bubble
    const bubbleGroup = svg
      .selectAll(".bubble-group")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "bubble-group")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    // Draw the bubbles
    bubbleGroup
      .append("circle")
      .attr("class", "bubble")
      .attr("r", (d) => sizeScale(d.value))
      .attr("fill", (d) => colorScale(d.group))
      .attr("stroke", "black");

    // Add a tooltip title for hover
    bubbleGroup.append("title").text((d) => `${d.name}: ${d.value}`);

    // Add labels inside each bubble
    const labels = bubbleGroup
      .append("text")
      .attr("class", "bubble-label") // Use CSS class for styling
      .style("pointer-events", "none")
      .attr("text-anchor", "middle") // Center align text
      .attr("dy", "-0.5em") // Position label text slightly above center
      .style("font-size", (d) => calculateFontSize(d, sizeScale(d.value))) // Dynamic font size
      .text((d) => d.name);

    // Add the value as a separate tspan element below the text
    labels
      .append("tspan")
      .attr("class", "bubble-value") // Use CSS class for value styling
      .attr("x", 0)
      .attr("dy", "1.2em") // Position value text below the label
      .text((d) => d.value);

    // Update positions on each tick of the simulation
    function ticked() {
      bubbleGroup.attr("transform", (d) => `translate(${d.x},${d.y})`);
    }

    // Calculate the font size to fit within the bubble radius
    function calculateFontSize(d, radius) {
      const defaultFontSize = 12;
      const maxFontSize = Math.min(defaultFontSize, radius / 3); // Calculate max font size based on bubble size
      let fontSize = maxFontSize;

      // Create a temporary SVG text element to measure text width
      const tempText = svg
        .append("text")
        .attr("class", "bubble-label-temp")
        .style("font-size", `${fontSize}px`)
        .style("visibility", "hidden")
        .text(d.name);

      let textWidth = tempText.node().getBBox().width;

      // Decrease the font size if text width is larger than the bubble diameter
      while (textWidth > radius * 1.8 && fontSize > 6) {
        // Keep reducing font size until it fits or reaches a minimum
        fontSize -= 1;
        tempText.style("font-size", `${fontSize}px`);
        textWidth = tempText.node().getBBox().width;
      }

      tempText.remove(); // Remove the temporary text element
      return `${fontSize}px`;
    }
  }, [data, dimensions]);

  return (
    <div ref={containerRef} className="bubble-chart-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BubbleChart;
