
import React from 'react';
import { Rectangle } from 'recharts';
import { formatMeetingDate } from '@/utils/dateFormatters';
import { ChartData } from './ganttUtils';

interface CustomBarProps {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  payload: ChartData;
  onClick: (data: ChartData) => void;
}

const CustomBar: React.FC<CustomBarProps> = ({ x, y, width, height, fill, payload, onClick }) => {
  const data = payload as ChartData;
  
  // Only proceed if we have valid dates
  const startDateStr = data.startDate ? formatMeetingDate(data.startDate) : '';
  const endDateStr = data.endDate ? formatMeetingDate(data.endDate) : '';
  const dateLabel = startDateStr && endDateStr ? `${startDateStr} - ${endDateStr}` : '';
  
  // Only show label if width is sufficient and label exists
  const showLabel = width > 100 && dateLabel;
  
  return (
    <g onClick={() => onClick(data)} style={{ cursor: 'pointer' }}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        radius={4}
      />
      {showLabel && (
        <text
          x={x + 5}
          y={y + height / 2 + 4}
          textAnchor="start"
          fill="#ffffff"
          fontSize={10}
          fontWeight={500}
        >
          {dateLabel}
        </text>
      )}
    </g>
  );
};

export default CustomBar;
