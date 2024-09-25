import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const Grid = ({ xScale, yScale, width, height, margin }) => {
  const refGrid = useRef();

  useEffect(() => {
    const gridX = d3
      .axisBottom(xScale)
      .tickSize(-height + margin.top + margin.bottom)
      .tickFormat("");

    const gridY = d3
      .axisLeft(yScale)
      .tickSize(-width + margin.left + margin.right)
      .tickFormat("");

    d3.select(refGrid.current).call(gridY);
    d3.select(refGrid.current).call(gridX);
  }, [xScale, yScale, width, height, margin]);

  return <g ref={refGrid} className="grid" />;
};

export default Grid;
