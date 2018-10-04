import React, { Component } from 'react';

import { Group } from '@vx/group';
import { LinePath, Bar, AreaClosed } from '@vx/shape';
import { AxisBottom } from '@vx/axis';
import { curveNatural } from '@vx/curve';
import { scaleTime, scaleLinear } from '@vx/scale';

import { LinearGradient } from '@vx/gradient';
import { PatternLines } from '@vx/pattern';
import { withTooltip } from '@vx/tooltip';
import { localPoint } from '@vx/event';
import { bisector } from 'd3-array';

import ChartCardBackground from '../ChartCardBackground/ChartCardBackground';
import TimeseriesChartTooltip from '../TimeseriesChartTooltip/TimeseriesChartTooltip';
import TimeseriesHoverline from '../TimeseriesHoverline/TimeseriesHoverline';

import MaxValue from './MaxValue';
import MinValue from './MinValue';

import formatDate from '../../utils/formatDate';
import { format } from 'd3-format';

class PreviewTimeseriesChart extends Component {
  render() {
    const {
      data,
      parentWidth,
      parentHeight,
      margin = {},
      showTooltip,
      hideTooltip,
      tooltipData,
      tooltipLeft,
      tooltipTop,
      symbol,
    } = this.props;

    const width = parentWidth - margin.left - margin.right;
    const height = parentHeight - margin.top - margin.bottom;

    // accessors
    const x = d => d.time * 1000;
    const y = d => d.index;
    const bisectDate = bisector(d => x(d)).left;

    const firstPoint = data[0];
    const currentPoint = data[data.length - 1];
    const minValue = Math.min(...data.map(y));
    const maxValue = Math.max(...data.map(y));

    const maxData = [
      { time: x(firstPoint), index: maxValue },
      { time: x(currentPoint), index: maxValue }
    ];

    const minData = [
      { time: x(firstPoint), index: minValue },
      { time: x(currentPoint), index: minValue }
    ];

    // scales
    const xScale = scaleTime({
      range: [0, width],
      domain: [x(firstPoint), x(currentPoint)],
    });
    const yScale = scaleLinear({
      range: [height, 0],
      domain: [minValue, maxValue + maxValue / 8],
    });

    const formatValue = v => format('.2f')(v) + symbol;
    return (
      <div>
        <svg ref={s => (this.svg = s)} width={parentWidth} height={parentHeight}>
          <ChartCardBackground
            width={parentWidth}
            height={parentHeight}
            colors={[
              { hex: '#FFE29F', offset: 0 },
              { hex: '#FFA99F', offset: 48 },
              { hex: '#FF719A', offset: 100 }
            ]}
          />
          <LinearGradient
            id="fill"
            from="#ed6ea0"
            to="#ec8c69"
            fromOpacity={0.2}
            toOpacity={0}
          />
          <PatternLines
            id="dLines"
            height={6}
            width={6}
            stroke="#fff"
            strokeWidth={1}
            orientation={['diagonal']}
            strokeOpacity={0}
          />
          <Group top={margin.top} left={margin.left}>
            <AxisBottom
              data={data}
              scale={xScale}
              x={x}
              top={height}
              left={margin.left + 18}
              hideTicks
              hideAxisLine
              tickLabelComponent={
                <text
                  fill="#ffffff"
                  dy=".33em"
                  fillOpacity={0.3}
                  fontSize={11}
                  textAnchor="middle"
                />
              }
            />
            <MaxValue
              data={maxData}
              yText={yScale(maxValue)}
              label={formatValue(maxValue)}
              yScale={yScale}
              xScale={xScale}
              x={x}
              y={y}
            />
            <AreaClosed
              stroke="transparent"
              data={data}
              yScale={yScale}
              xScale={xScale}
              x={x}
              y={y}
              fill="url(#fill)"
              curve={curveNatural}
            />
            <AreaClosed
              stroke="transparent"
              data={data}
              yScale={yScale}
              xScale={xScale}
              x={x}
              y={y}
              fill="url(#dLines)"
              curve={curveNatural}
            />
            <LinePath
              data={maxData}
              yScale={yScale}
              xScale={xScale}
              y={y}
              x={x}
              stroke="#000"
              strokeWidth={1}
              strokeDasharray="4,4"
              strokeOpacity=".3"
            />
            <LinePath
              data={data}
              xScale={xScale}
              yScale={yScale}
              x={x}
              y={y}
              stroke="#ffffff"
              strokeWidth={1}
              curve={curveNatural}
            />
            <MinValue
              data={minData}
              yScale={yScale}
              xScale={xScale}
              y={y}
              x={x}
              yText={yScale(minValue)}
              label={formatValue(minValue)}
            />
            <Bar
              data={data}
              width={width}
              height={height}
              fill="transparent"
              onMouseLeave={data => event => hideTooltip()}
              onMouseMove={data => event => {
                const { x: xPoint } = localPoint(this.svg, event);
                const x0 = xScale.invert(xPoint);
                const index = bisectDate(data, x0, 1);
                const d0 = data[index - 1];
                const d1 = data[index];
                const d = x0 - xScale(x(d0)) > xScale(x(d1)) - x0 ? d1 : d0;

                showTooltip({
                  tooltipData: d,
                  tooltipLeft: xScale(x(d)),
                  tooltipTop: yScale(y(d))
                });
              }}
            />
          </Group>
          {tooltipData &&
            <TimeseriesHoverline
              from={{
                x: tooltipLeft,
                y: yScale(y(maxData[0]))
              }}
              to={{
                x: tooltipLeft,
                y: yScale(y(minData[0]))
              }}
              tooltipLeft={tooltipLeft}
              tooltipTop={tooltipTop}
            />}
        </svg>
        {tooltipData &&
          <TimeseriesChartTooltip
            yTop={tooltipTop - 12}
            yLeft={tooltipLeft + 12}
            yLabel={formatValue(y(tooltipData))}
            xTop={yScale(y(minData[0])) + 4}
            xLeft={tooltipLeft}
            xLabel={formatDate(x(tooltipData))}
          />}
      </div>
    );
  }
}

export default withTooltip(PreviewTimeseriesChart);
