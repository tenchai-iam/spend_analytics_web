import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const DonutChart = () => {
  const ref = useRef();

  useEffect(() => {
    const data = [
      { label: "<= 6 months", value: 98, percentage: 82, color: "#6A0DAD" },
      { label: "6-9 months", value: 10, percentage: 8, color: "#FFD700" },
      { label: ">= 9 months", value: 12, percentage: 10, color: "#4B0082" },
    ];

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const arc = d3
      .arc()
      .innerRadius(radius - 80)
      .outerRadius(radius);

    const pie = d3
      .pie()
      .value((d) => d.value)
      .sort(null);

    const arcs = svg
      .selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => d.data.color)
      .transition()
      .duration(1000) // Animation duration
      .attrTween("d", function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(i(t));
        };
      });

    // Add text labels
    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("fill", "#fff")
      .transition()
      .delay(1000) // Start after the arc animation
      .text((d) => `${d.data.value} (${d.data.percentage}%)`);

    // Add legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(-${width / 2}, -${height / 2})`);

    legend
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", 10)
      .attr("y", (d, i) => 10 + i * 25)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", (d) => d.color);

    legend
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", 40)
      .attr("y", (d, i) => 25 + i * 25)
      .text((d) => d.label)
      .attr("font-size", "14px")
      .attr("fill", "#000");
  }, []);

  return <svg ref={ref}></svg>;
};

export default DonutChart;
