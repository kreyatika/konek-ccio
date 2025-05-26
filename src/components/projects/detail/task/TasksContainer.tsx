
import React from 'react';
import { Task, User } from '@/types';
import TaskTabs from '@/components/projects/detail/task/TaskTabs';
import CreateTaskDialog from '@/components/projects/detail/CreateTaskDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface TasksContainerProps {
  tasks: Task[];
  projectId: string;
  isCommitteeMember: boolean;
  committeeMembers: User[];
  allMembers: User[]; // Add allMembers prop
}

const TasksContainer: React.FC<TasksContainerProps> = ({
  tasks,
  projectId,
  isCommitteeMember,
  committeeMembers,
  allMembers
}) => {
  const [showTaskDialog, setShowTaskDialog] = useState(false);

  const handleAddTask = () => {
    setShowTaskDialog(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tasks</h3>
        {isCommitteeMember && (
          <Button size="sm" onClick={handleAddTask}>
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        )}
      </div>
      
      <TaskTabs tasks={tasks} projectId={projectId} allMembers={allMembers} />
      
      <CreateTaskDialog
        projectId={projectId}
        committeeMembers={committeeMembers}
        onSuccess={() => setShowTaskDialog(false)}
        isCommitteeMember={isCommitteeMember}
      />
    </div>
  );
};

export default TasksContainer;
