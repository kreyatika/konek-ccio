
import React from 'react';
import { Button } from '@/components/ui/button';

interface EventFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

const EventFormActions: React.FC<EventFormActionsProps> = ({ 
  isSubmitting, 
  onCancel 
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button variant="outline" type="button" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Event'}
      </Button>
    </div>
  );
};

export default EventFormActions;
