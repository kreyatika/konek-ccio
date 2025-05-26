
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartContainer } from '@/components/ui/chart';
import {
  Bar,
  XAxis,
  YAxis,
  BarChart,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { 
  prepareGanttData, 
  createProjectConfig, 
  ChartData 
} from './gantt/ganttUtils';
import CustomBar from './gantt/CustomBar';
import CustomTooltip from './gantt/CustomTooltip';
import CustomXAxisTick from './gantt/CustomXAxisTick';

interface GanttChartProps {
  projects: Array<{
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    status: string;
  }>;
}

const GanttChart: React.FC<GanttChartProps> = ({ projects }) => {
  const navigate = useNavigate();

  const { chartData, monthTicks } = useMemo(() => {
    return prepareGanttData(projects);
  }, [projects]);

  // Color config with project IDs as keys
  const config = useMemo(() => {
    return createProjectConfig(chartData);
  }, [chartData]);

  const handleBarClick = (data: ChartData) => {
    if (data && data.id) {
      navigate(`/projects/${data.id}`);
    }
  };

  if (!chartData.length) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No projects to display</p>
      </div>
    );
  }

  // We need to create a proper tick renderer function that passes all required props
  const renderCustomAxisTick = (props: any) => {
    return <CustomXAxisTick {...props} monthTicks={monthTicks} />;
  };

  return (
    <ChartContainer config={config} className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          barCategoryGap={10}
          margin={{ top: 30, right: 30, left: 100, bottom: 30 }}
        >
          <XAxis 
            type="number" 
            domain={[0, 'dataMax']} 
            tick={renderCustomAxisTick}
            tickLine={false}
            axisLine={true}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            tickLine={false}
            axisLine={false}
            width={100}
          />
          <Tooltip content={<CustomTooltip onProjectClick={handleBarClick} />} />
          <Bar 
            dataKey="duration" 
            minPointSize={2}
            stackId="a" 
            barSize={20}
            shape={(props) => <CustomBar {...props} onClick={handleBarClick} />}
            background={{ fill: "#f3f4f6" }}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default GanttChart;
