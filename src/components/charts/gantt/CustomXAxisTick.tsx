
import React from 'react';
import { MonthTick } from './ganttUtils';

interface CustomXAxisTickProps {
  x: number;
  y: number;
  payload: {
    value: number;
  };
  monthTicks: MonthTick[];
}

const CustomXAxisTick: React.FC<CustomXAxisTickProps> = ({ x, y, payload, monthTicks }) => {
  const monthIndex = payload.value;
  const monthTick = monthTicks.find(m => Math.abs(m.position - monthIndex) < 5);
  
  if (!monthTick) return null;
  
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="#666"
        fontSize={12}
      >
        {monthTick.month}
      </text>
    </g>
  );
};

export default CustomXAxisTick;
