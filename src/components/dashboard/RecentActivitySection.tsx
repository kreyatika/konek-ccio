
import React from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '@/components/dashboard/DashboardCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Activity } from '@/types';

interface RecentActivitySectionProps {
  activities: Activity[];
}

const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({ activities }) => {
  return (
    <DashboardCard
      title="Recent Activity"
      className="md:col-span-4"
      titleAction={
        <Button variant="ghost" size="sm" className="gap-1" asChild>
          <Link to="/notifications">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      }
    >
      <RecentActivity activities={activities.slice(0, 5)} />
    </DashboardCard>
  );
};

export default RecentActivitySection;
