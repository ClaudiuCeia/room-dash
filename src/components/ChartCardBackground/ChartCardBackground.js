import React from 'react';
import { LinearGradient } from '@vx/gradient';

export default function ChartCardBackground({ width, height, colors }) {
  return (
    <svg width={width} height={height}>
      <LinearGradient id="bg" orientation={['diagonal']}>
        {colors.map(c => {
          return <stop stopColor={c['hex']} offset={c['offset']} key={c['offset']}/>
        })}
      </LinearGradient>
      <rect width={width} height={height} fill="url(#bg)" />
    </svg>
  );
}
