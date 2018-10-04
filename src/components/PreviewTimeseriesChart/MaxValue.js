
import React from 'react';

import { LinePath } from '@vx/shape';

export default ({ data, label, yText, yScale, xScale, x, y }) => {
  return (
    <g>
      <LinePath
        data={data}
        yScale={yScale}
        xScale={xScale}
        y={y}
        x={x}
        stroke="#fff"
        strokeWidth={5}
        // strokeDasharray="4,4"
        // strokeOpacity=".3"
      />
      <text fill="#fff" y={yText} dy="1.3em" dx="10px" fontSize="12">
        {label}
      </text>
    </g>
  );
};
