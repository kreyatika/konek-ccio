
import { useState } from 'react';

/**
 * Custom hook for handling Kanban card drag operations
 */
export const useKanbanCardDrag = (taskId: string, isSubmitting: boolean) => {
  const [isDragging, setIsDragging] = useState(false);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent) => {
    if (isSubmitting) {
      e.preventDefault();
      return;
    }
    
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
    
    // Add a delay to set isDragging for visual feedback
    setTimeout(() => setIsDragging(true), 0);
    
    // Create a drag image (optional)
    const dragImage = document.createElement('div');
    dragImage.textContent = 'Moving task...';
    dragImage.className = 'bg-primary text-primary-foreground p-2 rounded text-sm opacity-70';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Clean up the drag image element after a short delay
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return {
    isDragging,
    handleDragStart,
    handleDragEnd
  };
};
