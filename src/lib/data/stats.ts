
import { projects } from './projects';
import { events } from './events';
import { tasks } from './tasks';
import { users } from './users';

// Stats for dashboard
export const stats = [
  {
    title: 'Active Projects',
    value: projects.filter(p => p.status === 'in-progress').length,
    change: 2,
    changeType: 'increase' as const,
  },
  {
    title: 'Upcoming Events',
    value: events.length,
    change: 1,
    changeType: 'increase' as const,
  },
  {
    title: 'Tasks Due This Week',
    value: tasks.filter(t => 
      t.dueDate && 
      t.dueDate > new Date() && 
      t.dueDate < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    ).length,
    change: 3,
    changeType: 'increase' as const,
  },
  {
    title: 'Board Members',
    value: users.filter(u => u.role === 'board' || u.role === 'superadmin').length,
    change: 0,
    changeType: 'neutral' as const,
  },
];
