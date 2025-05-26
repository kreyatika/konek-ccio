
import React from 'react';
import { Task, User } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatMeetingDate } from '@/utils/dateFormatters';
import { useAuth } from '@/contexts/auth';
import DeleteTaskButton from './DeleteTaskButton';

interface TaskListProps {
  tasks: Task[];
  projectId: string;
  allMembers?: User[]; // Added allMembers as an optional prop
}

const TaskList: React.FC<TaskListProps> = ({ tasks, projectId, allMembers }) => {
  const { userProfile } = useAuth();
  const isSuperAdmin = userProfile?.role === 'superadmin';
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-slate-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'review':
        return 'bg-amber-500';
      case 'done':
        return 'bg-green-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-amber-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Due Date</TableHead>
            {isSuperAdmin && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isSuperAdmin ? 6 : 5} className="text-center text-muted-foreground">
                No tasks found
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`${getStatusColor(task.status)} text-white`}>
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getPriorityColor(task.priority)} text-white`}>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  {task.assignee ? task.assignee.name : 'Unassigned'}
                </TableCell>
                <TableCell>
                  {task.dueDate ? formatMeetingDate(task.dueDate) : 'No deadline'}
                </TableCell>
                {isSuperAdmin && (
                  <TableCell className="text-right">
                    <DeleteTaskButton 
                      taskId={task.id}
                      taskTitle={task.title}
                      projectId={projectId}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskList;
