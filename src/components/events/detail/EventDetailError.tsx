
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface EventDetailErrorProps {
  handleBack: () => void;
}

const EventDetailError: React.FC<EventDetailErrorProps> = ({ handleBack }) => {
  return (
    <div className="container px-4 py-6 mx-auto">
      <Button variant="ghost" onClick={handleBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>
      
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load event details. Please try again later.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default EventDetailError;
