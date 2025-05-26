
import React, { useState } from 'react';
import { KanbanColumn as KanbanColumnType, Task, TaskStatus } from '@/types';
import { KanbanCard } from './card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KanbanColumnProps {
  column: KanbanColumnType;
  onAddTask: () => void;
  onUpdateTaskStatus: (taskId: string, newStatus: string) => void;
  onEditTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  column, 
  onAddTask,
  onUpdateTaskStatus,
  onEditTask,
  onDeleteTask
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      console.log(`Dropping task ${taskId} into column ${column.id}`);
      onUpdateTaskStatus(taskId, column.id);
    }
  };

  return (
    <div className="kanban-column bg-muted/40 p-2 rounded-lg shadow-sm flex flex-col h-[calc(100vh-18rem)]">
      <div className="mb-2 flex items-center justify-between px-1.5">
        <h3 className="text-xs font-medium">{column.title}</h3>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
          {column.tasks.length}
        </span>
      </div>
      
      <ScrollArea 
        className="flex-grow pr-2"
        data-column-id={column.id}
      >
        <div 
          className={`flex flex-col gap-1.5 pb-2 min-h-[200px] transition-all duration-300 ease-in-out 
            ${isDragOver ? 'bg-muted/70 border-2 border-dashed border-primary/40 rounded-md p-1 scale-[1.01]' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          data-droppable="true"
        >
          {column.tasks.map((task) => (
            <KanbanCard 
              key={task.id} 
              task={task} 
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
          {column.tasks.length === 0 && isDragOver && (
            <div className="text-xs text-muted-foreground text-center py-4 animate-pulse">
              Drop task here
            </div>
          )}
        </div>
      </ScrollArea>
      
      <Button 
        variant="ghost" 
        size="sm"
        className="mt-2 w-full justify-start text-muted-foreground text-xs transition-colors hover:text-primary"
        onClick={onAddTask}
      >
        <PlusCircle className="mr-1 h-3.5 w-3.5" />
        Add Task
      </Button>
    </div>
  );
};

export default KanbanColumn;
