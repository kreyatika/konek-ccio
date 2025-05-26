
import React from 'react';
import { Loader2 } from 'lucide-react';
import PageTransition from '@/components/ui/page-transition';
import StatsSection from '@/components/dashboard/StatsSection';
import RecentActivitySection from '@/components/dashboard/RecentActivitySection';
import UpcomingItemsSection from '@/components/dashboard/UpcomingItemsSection';
import ActiveProjectsSection from '@/components/dashboard/ActiveProjectsSection';
import UpcomingMeetingsSection from '@/components/dashboard/UpcomingMeetingsSection';
import GanttChartSection from '@/components/dashboard/GanttChartSection';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useUpcomingItems } from '@/hooks/useUpcomingItems';
import { useDashboardData } from '@/hooks/useDashboardData';
import { toast } from 'sonner';

const Dashboard = () => {
  const {
    stats,
    activities,
    projects,
    meetings,
    isLoading,
    error
  } = useDashboardData();
  
  const upcomingItems = useUpcomingItems();

  // Show error notification
  React.useEffect(() => {
    if (error) {
      toast.error('Failed to load dashboard data');
    }
  }, [error]);
  
  if (isLoading) {
    return (
      <PageTransition>
        <div className="container mx-auto py-6">
          <DashboardHeader />
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading dashboard data...</span>
          </div>
        </div>
      </PageTransition>
    );
  }
  
  return (
    <PageTransition>
      <div className="container mx-auto py-6">
        <DashboardHeader />

        {/* Stats */}
        <StatsSection stats={stats || []} />
        
        {/* Gantt Chart */}
        <div className="mt-6">
          <GanttChartSection />
        </div>

        {/* Main content */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-6">
          {/* Recent activity */}
          <RecentActivitySection activities={activities || []} />

          {/* Upcoming */}
          <UpcomingItemsSection upcomingItems={upcomingItems || []} />

          {/* Active Projects */}
          <ActiveProjectsSection projects={projects || []} />

          {/* Upcoming Meetings */}
          <UpcomingMeetingsSection meetings={meetings || []} />
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
