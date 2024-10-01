import React, { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import useResizeObserver from "use-resize-observer";
import "../ComponentsStyles/LineChart.css"; // Import the CSS file

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

const LineChart = ({ data, fontColor = "#2E073F" }) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [hoverLocation, setHoverLocation] = useState(null);
  const { ref: wrapperRef, width = 600, height = 400 } = useResizeObserver();

  const boundsWidth = width - MARGIN.left - MARGIN.right;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // X and Y scales
  const xScale = useMemo(() => {
    const [xMin, xMax] = d3.extent(data, (d) => d.x);
    return d3
      .scaleLinear()
      .domain([0, xMax || 0])
      .range([0, boundsWidth]);
  }, [data, boundsWidth]);

  const yScale = useMemo(() => {
    const [min, max] = d3.extent(data, (d) => d.y);
    return d3
      .scaleLinear()
      .domain([0, max || 0])
      .range([boundsHeight, 0]);
  }, [data, boundsHeight]);

  // Line generator function
  const lineBuilder = d3
    .line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))
    .curve(d3.curveMonotoneX);

  const linePath = lineBuilder(data);

  // Render the X and Y axis using D3.js
  useEffect(() => {
    if (!svgRef.current) return;

    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll(".x-axis, .y-axis").remove();

    // Create the X axis
    const xAxisGenerator = d3.axisBottom(xScale);
    const xAxis = svgElement
      .append("g")
      .attr("class", "x-axis")
      .attr(
        "transform",
        `translate(${MARGIN.left}, ${boundsHeight + MARGIN.top})`
      )
      .call(xAxisGenerator);

    // Create the Y axis
    const yAxisGenerator = d3.axisLeft(yScale);
    const yAxis = svgElement
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)
      .call(yAxisGenerator);

    // Apply styles using the prop `fontColor`
    xAxis
      .selectAll("text")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", fontColor); // Set font color

    yAxis
      .selectAll("text")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", fontColor); // Set font color

    // Optional: increase the axis line thickness
    xAxis.selectAll("path, line").style("stroke-width", "2px");
    yAxis.selectAll("path, line").style("stroke-width", "2px");
  }, [data, xScale, yScale, boundsHeight, fontColor]);

  const handleMouseMove = (event, d) => {
    if (!tooltipRef.current) return;

    setTooltipContent(`x: ${d.x}, y: ${d.y}`);
    setHoverLocation({
      x: xScale(d.x) + MARGIN.left,
      y: yScale(d.y) + MARGIN.top,
    });
  };

  const handleMouseLeave = () => {
    setTooltipContent(null);
    setHoverLocation(null);
  };

  return (
    <div
      ref={wrapperRef}
      className="chart-wrapper" // Use class from CSS file
    >
      {/* Tooltip */}
      {tooltipContent && (
        <div ref={tooltipRef} className="tooltip">
          {tooltipContent}
        </div>
      )}
      {/* Main SVG */}
      <svg ref={svgRef} width={width} height={height} className="main-svg">
        {/* Line Path */}
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
          <path d={linePath || ""} className="line-path" />
          {/* Render Points on the Line */}
          {data.map((point, index) => (
            <circle
              key={index}
              cx={xScale(point.x)}
              cy={yScale(point.y)}
              className="data-point"
              onMouseEnter={(event) => handleMouseMove(event, point)}
              onMouseLeave={handleMouseLeave}
            />
          ))}
        </g>
        {/* Axes Group */}
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`} />
      </svg>
    </div>
  );
};

export default LineChart;
