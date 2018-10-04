import React from 'react';

import { LinePath } from '@vx/shape';

export default ({ data, yScale, xScale, yText, label, x, y }) => {
  return (
    <g>
      <LinePath
        data={data}
        yScale={yScale}
        xScale={xScale}
        y={y}
        x={x}
        stroke="#fff"
        strokeWidth={1}
        strokeDasharray="4,4"
        strokeOpacity="1"
      />
      <text fill="#fff" y={yText} dy="-.5em" dx="10px" fontSize="12">
        {label}
      </text>
    </g>
  );
};
