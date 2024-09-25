import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import "../ComponentsStyles/LineGraph.css"; // Import the CSS file
import Axes from "./LineGraphAxes.js";
import Grid from "./LineGraphGrid.js";

const LineGraph = ({ data }) => {
  const ref = useRef();
  const width = 700;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };

  useEffect(() => {
    const svg = d3.select(ref.current);

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line()
      .defined((d) => !isNaN(d.value))
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX); // Adding smoothness to the line

    // Clear previous content before appending new elements
    svg.selectAll("*").remove();

    svg
      .append("path")
      .datum(data)
      .attr("class", "line") // Apply the 'line' class from the CSS
      .attr("d", line);

    // X Axis Label
    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("transform", `translate(${width / 2},${height - 5})`)
      .attr("text-anchor", "middle")
      .text("Date");

    // Y Axis Label
    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .text("Value");
  }, [data]);

  return (
    <svg ref={ref} width={width} height={height}>
      <Grid
        xScale={d3
          .scaleTime()
          .domain(d3.extent(data, (d) => d.date))
          .range([margin.left, width - margin.right])}
        yScale={d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d.value)])
          .nice()
          .range([height - margin.bottom, margin.top])}
        width={width}
        height={height}
        margin={margin}
      />
      <Axes
        xScale={d3
          .scaleTime()
          .domain(d3.extent(data, (d) => d.date))
          .range([margin.left, width - margin.right])}
        yScale={d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d.value)])
          .nice()
          .range([height - margin.bottom, margin.top])}
        height={height}
        margin={margin}
      />
    </svg>
  );
};

export default LineGraph;
