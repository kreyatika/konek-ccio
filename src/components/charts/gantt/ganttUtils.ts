
import { addDays, format, isAfter, isBefore, differenceInDays, startOfMonth, addMonths, endOfMonth } from 'date-fns';

export interface Project {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

export interface ChartData {
  name: string;
  id: string;
  start: number;
  duration: number;
  status: string;
  startDate: Date;
  endDate: Date;
  color: string;
}

export interface MonthTick {
  month: string;
  position: number;
}

export const PROJECT_COLORS = [
  "#3B82F6", // blue-500
  "#EF4444", // red-500
  "#22C55E", // green-500
  "#F59E0B", // amber-500
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#06B6D4", // cyan-500
  "#F97316", // orange-500
  "#10B981", // emerald-500
  "#6366F1", // indigo-500
  "#D946EF", // fuchsia-500
  "#14B8A6", // teal-500
];

export const prepareGanttData = (projects: Project[]) => {
  if (!projects?.length) return { chartData: [], monthTicks: [], earliestDate: new Date() };

  // Find earliest and latest dates
  let earliestDate = new Date();
  let latestDate = new Date();
  
  projects.forEach(project => {
    if (isBefore(project.startDate, earliestDate)) {
      earliestDate = project.startDate;
    }
    if (isAfter(project.endDate, latestDate)) {
      latestDate = project.endDate;
    }
  });

  // Create month ticks for the x-axis
  const startMonth = startOfMonth(earliestDate);
  const endMonth = endOfMonth(latestDate);
  
  const numberOfMonths = differenceInDays(endMonth, startMonth) / 30 + 1;
  const monthTicks: MonthTick[] = [];
  
  for (let i = 0; i < numberOfMonths; i++) {
    const currentMonth = addMonths(startMonth, i);
    monthTicks.push({
      month: format(currentMonth, 'MMM'),
      position: differenceInDays(currentMonth, earliestDate)
    });
  }

  // Add buffer days to the start
  const adjustedEarliestDate = addDays(earliestDate, -10);

  const data = projects.map((project, index) => ({
    name: project.title,
    id: project.id,
    start: differenceInDays(project.startDate, adjustedEarliestDate),
    duration: differenceInDays(project.endDate, project.startDate),
    status: project.status,
    startDate: project.startDate,
    endDate: project.endDate,
    color: PROJECT_COLORS[index % PROJECT_COLORS.length] // Assign a color from the palette
  }));

  return { 
    chartData: data, 
    monthTicks, 
    earliestDate: adjustedEarliestDate 
  };
};

export const createProjectConfig = (chartData: ChartData[]) => {
  const projectConfig: Record<string, { color: string }> = {};
  
  chartData.forEach((project) => {
    projectConfig[project.id] = { color: project.color };
  });
  
  return projectConfig;
};
