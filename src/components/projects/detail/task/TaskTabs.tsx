
import React from 'react';
import { Project, User } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskList from './TaskList';

interface TaskTabsProps {
  tasks: Project['tasks'];
  allMembers: User[];
  projectId: string;
}

const TaskTabs: React.FC<TaskTabsProps> = ({ tasks, allMembers, projectId }) => {
  return (
    <Tabs defaultValue="all">
      <TabsList className="grid grid-cols-5 mb-4">
        <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
        <TabsTrigger value="todo">
          Todo ({tasks.filter(t => t.status === 'todo').length})
        </TabsTrigger>
        <TabsTrigger value="in-progress">
          In Progress ({tasks.filter(t => t.status === 'in-progress').length})
        </TabsTrigger>
        <TabsTrigger value="review">
          Review ({tasks.filter(t => t.status === 'review').length})
        </TabsTrigger>
        <TabsTrigger value="done">
          Done ({tasks.filter(t => t.status === 'done').length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <TaskList tasks={tasks} allMembers={allMembers} projectId={projectId} />
      </TabsContent>
      <TabsContent value="todo">
        <TaskList tasks={tasks.filter(t => t.status === 'todo')} allMembers={allMembers} projectId={projectId} />
      </TabsContent>
      <TabsContent value="in-progress">
        <TaskList tasks={tasks.filter(t => t.status === 'in-progress')} allMembers={allMembers} projectId={projectId} />
      </TabsContent>
      <TabsContent value="review">
        <TaskList tasks={tasks.filter(t => t.status === 'review')} allMembers={allMembers} projectId={projectId} />
      </TabsContent>
      <TabsContent value="done">
        <TaskList tasks={tasks.filter(t => t.status === 'done')} allMembers={allMembers} projectId={projectId} />
      </TabsContent>
    </Tabs>
  );
};

export default TaskTabs;
