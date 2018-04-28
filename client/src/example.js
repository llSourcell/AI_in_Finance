import React from 'react';
import ReactDOM from 'react-dom';
import dailyProductPerceivedQualityData from '../../constants/dailyProductPerceivedQuality.json';
import './index.css';
import { extent as d3ArrayExtent } from 'd3-array';
import {
  axisBottom as d3AxisBottom,
  axisLeft as d3AxisLeft,
} from 'd3-axis';
import {
  scaleLinear as d3ScaleLinear,
  scaleTime as d3ScaleTime,
} from 'd3-scale';
import { select as d3Select } from 'd3-selection';
import { line as d3Line } from 'd3-shape';
import './index.css'
import getContentContainerStyle from './getContentContainerStyle';
import getSVGDimensions from './getSVGDimensions';

var data = dailyProductPerceivedQualityData;
var height = 40;
var margin = 20;
var selectX = {datum => new Date(datum.day)
    .setHours(0,0,0,0)
  }
var selectY={datum => datum.productPerceivedQuality}
var width = 200;

const xScale = d3ScaleTime()
    .domain(d3ArrayExtent(data, selectX))
    .range([0, width]);
const yScale = d3ScaleLinear()
    .domain(d3ArrayExtent(data, selectY))
    .range([height, 0]);

const xAxis = d3AxisBottom()
    .scale(xScale)
    .ticks(data.length / 2);
const yAxis = d3AxisLeft()
    .scale(yScale)
    .ticks(3);

const selectScaledX = datum => xScale(selectX(datum));
const selectScaledY = datum => yScale(selectY(datum));

const sparkLine = d3Line()
    .x(selectScaledX)
    .y(selectScaledY);

const linePath = sparkLine(data);
const circlePoints = data.map(datum => ({
    x: selectScaledX(datum),
    y: selectScaledY(datum),
  }));

  return (
    <svg
    {...getSVGDimensions({
      height,
      margin,
      width,
    })}
  >
    <g
      className="contentContainer"
      style={getContentContainerStyle({ margin })}
    >
      {!!"contentContainerBackgroundRect" && (
        <rect
          className="contentContainerBackgroundRect"
          height={height}
          width={width}
          x={0}
          y={0}
        />
      )}
      {children}
    </g>
    <g
      className="xAxis"
      ref={node => d3Select(node).call(xAxis)}
      style={{
        transform: `translateY(${height}px)`,
      }}
    />
    <g className="yAxis" ref={node => d3Select(node).call(yAxis)} />
    <g className="line">
      <path d={linePath} />
    </g>
    <g className="scatter">
      {circlePoints.map(circlePoint => (
        <circle
          cx={circlePoint.x}
          cy={circlePoint.y}
          key={`${circlePoint.x},${circlePoint.y}`}
          r={4}
        />
      ))}
    </g>
  </svg>
  );
};
