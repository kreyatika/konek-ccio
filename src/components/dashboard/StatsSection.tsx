
import React from 'react';
import StatCard from '@/components/dashboard/StatCard';
import { ClipboardList, Calendar, CalendarDays, Users } from 'lucide-react';

interface StatsSectionProps {
  stats: {
    title: string;
    value: string | number;
    change: number;
    changeType: 'increase' | 'decrease' | 'neutral';
  }[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          changeType={stat.changeType}
          icon={
            index === 0 ? <ClipboardList /> : 
            index === 1 ? <Calendar /> : 
            index === 2 ? <CalendarDays /> : 
            <Users />
          }
        />
      ))}
    </div>
  );
};

export default StatsSection;
