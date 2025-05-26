
import { KanbanColumn } from '@/types';
import { tasks } from './tasks';

// Kanban columns with tasks
export const kanbanColumns: KanbanColumn[] = [
  {
    id: 'todo',
    title: 'To Do',
    tasks: tasks.filter(task => task.status === 'todo'),
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: tasks.filter(task => task.status === 'in-progress'),
  },
  {
    id: 'review',
    title: 'Review',
    tasks: tasks.filter(task => task.status === 'review'),
  },
  {
    id: 'done',
    title: 'Done',
    tasks: tasks.filter(task => task.status === 'done'),
  },
];
