import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "../ComponentsStyles/BubbleChart.css"; // Import CSS

const BubbleChart = ({ data }) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });

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

  const numberFormatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 3,
  });

  const colorPalette = [
    "#BC6FF1",
    "#7A1CAC",
    "#AD49E1",
    "#8d98a1",
    "#c69530",
    "#7f3f98",
    "#7a0f5a",
    "#81377e",
    "#5B4B8A",
    "#EE4266",
  ];

  const generateGradient = (defs, color, index) => {
    const gradient = defs
      .append("linearGradient")
      .attr("id", `gradient-${index}`)
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", d3.color(color).brighter(0.8));

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", d3.color(color).darker(1.2));
  };

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3
      .select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

    svg.selectAll("*").remove();

    const defs = svg.append("defs");

    data.forEach((_, i) => {
      const color = colorPalette[i % colorPalette.length];
      generateGradient(defs, color, i);
    });

    const maxRadius = Math.min(dimensions.width, dimensions.height) / 10;

    const sizeScale = d3
      .scaleSqrt()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([maxRadius / 2, maxRadius * 1.5]);

    const simulation = d3
      .forceSimulation(data)
      .force("x", d3.forceX(dimensions.width / 2).strength(0.05))
      .force("y", d3.forceY(dimensions.height / 2).strength(0.05))
      .force(
        "collision",
        d3.forceCollide((d) => sizeScale(d.value) + 30)
      )
      .force("manyBody", d3.forceManyBody().strength(10))
      .alphaDecay(0.005) // Keep the simulation running
      .on("tick", ticked);

    const bubbleGroup = svg
      .selectAll(".bubble-group")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "bubble-group");

    const circles = bubbleGroup
      .append("circle")
      .attr("class", "bubble")
      .attr("r", (d) => sizeScale(d.value))
      .attr("fill", (d, i) => `url(#gradient-${i})`)
      .attr("stroke", "#d3cce3")
      .on("mouseenter", (event, d) => applyInteractionForce(d))
      .on("mouseleave", resetInteractionForce)
      .on("touchstart", (event, d) => {
        event.preventDefault(); // Prevent default scrolling
        applyInteractionForce(d);
      })
      .on("touchend", resetInteractionForce);

    bubbleGroup
      .append("text")
      .attr("class", "bubble-label")
      .attr("text-anchor", "middle")
      .attr("dy", "-1.5em") // Move the name upwards
      .selectAll("tspan")
      .data((d) => wrapText(d.name, sizeScale(d.value)))
      .join("tspan")
      .attr("x", 0)
      .attr("dy", (d, i) => `${i}em`) // Align multiple lines properly
      .text((d) => d);

    bubbleGroup
      .append("text")
      .attr("class", "bubble-value")
      .attr("text-anchor", "middle")
      .attr("dy", "2.0em") // Move the value below the name
      .text((d) => numberFormatter.format(d.value));

    function ticked() {
      bubbleGroup.attr("transform", (d) => {
        d.x = Math.max(
          sizeScale(d.value),
          Math.min(dimensions.width - sizeScale(d.value), d.x)
        );
        d.y = Math.max(
          sizeScale(d.value),
          Math.min(dimensions.height - sizeScale(d.value), d.y)
        );
        return `translate(${d.x},${d.y})`;
      });
    }

    function applyInteractionForce(d) {
      const strength = 0.3;
      simulation
        .alpha(0.3) // Add energy to the simulation
        .force(
          "x",
          d3
            .forceX()
            .strength(strength)
            .x((node) =>
              node === d ? Math.random() * dimensions.width : node.x
            )
        )
        .force(
          "y",
          d3
            .forceY()
            .strength(strength)
            .y((node) =>
              node === d ? Math.random() * dimensions.height : node.y
            )
        )
        .restart();
    }

    function resetInteractionForce() {
      simulation.alpha(0.1).restart();
    }

    function wrapText(text, radius) {
      const words = text.split(/\s+/);
      const lines = [];
      let currentLine = [];

      words.forEach((word) => {
        currentLine.push(word);
        const lineWidth = currentLine.join(" ").length * 6;
        if (lineWidth > radius * 2) {
          lines.push(currentLine.join(" "));
          currentLine = [];
        }
      });

      if (currentLine.length) lines.push(currentLine.join(" "));
      return lines;
    }

    return () => simulation.stop(); // Clean up on unmount
  }, [data, dimensions]);

  return (
    <div ref={containerRef} className="bubble-chart-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BubbleChart;
