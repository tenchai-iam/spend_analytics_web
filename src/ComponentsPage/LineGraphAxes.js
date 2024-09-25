import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const Axes = ({ xScale, yScale, height, margin }) => {
  const refX = useRef();
  const refY = useRef();

  useEffect(() => {
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    d3.select(refX.current)
      .call(xAxis)
      .attr('transform', `translate(0,${height - margin.bottom})`);
      
    d3.select(refY.current)
      .call(yAxis)
      .attr('transform', `translate(${margin.left},0)`);

  }, [xScale, yScale, height, margin]);

  return (
    <>
      <g ref={refX} />
      <g ref={refY} />
    </>
  );
};

export default Axes;