
import React from 'react';
import DashboardCard from './DashboardCard';
import GanttChart from '@/components/charts/GanttChart';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';
import { Loader2 } from 'lucide-react';

const GanttChartSection: React.FC = () => {
  const navigate = useNavigate();
  const { projects, isLoading, error } = useProjects();
  
  return (
    <DashboardCard 
      title="Project Timeline"
      className="col-span-full"
      titleAction={
        <Button variant="outline" size="sm" onClick={() => navigate('/projects')}>
          View All
        </Button>
      }
    >
      <div className="h-[300px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading projects...</span>
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Error loading project data</p>
          </div>
        ) : (
          <GanttChart projects={projects} />
        )}
      </div>
    </DashboardCard>
  );
};

export default GanttChartSection;
