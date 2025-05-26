
import React from 'react';
import { Form } from "@/components/ui/form";
import { Event } from '@/types';
import { EventFormProvider, useEventForm } from './form/EventFormProvider';
import { EventFormValues } from './form/EventFormSchema';
import EventBasicInfo from './form/EventBasicInfo';
import EventDateTimeFields from './form/EventDateTimeFields';
import EventRsvpDeadline from './form/EventRsvpDeadline';
import EventImageUpload from './form/EventImageUpload';
import EventFormActions from './form/EventFormActions';

interface CreateEventFormProps {
  onSubmit: (data: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'>, eventImage?: File) => void;
  onCancel: () => void;
}

// Main form component that uses the form context
const EventFormFields = ({ onCancel }: { onCancel: () => void }) => {
  const { 
    form, 
    isSubmitting, 
    imagePreview, 
    handleImageChange, 
    handleRemoveImage, 
    submitForm 
  } = useEventForm();
  
  const handleSubmit = (values: EventFormValues) => {
    submitForm(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <EventBasicInfo form={form} />
        
        <EventDateTimeFields form={form} />
        
        <EventRsvpDeadline form={form} />
        
        <EventImageUpload 
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          onImageRemove={handleRemoveImage}
        />
        
        <EventFormActions 
          isSubmitting={isSubmitting}
          onCancel={onCancel}
        />
      </form>
    </Form>
  );
};

// Wrapper component that provides the form context
const CreateEventForm: React.FC<CreateEventFormProps> = ({ onSubmit, onCancel }) => {
  return (
    <EventFormProvider onSubmit={onSubmit}>
      <EventFormFields onCancel={onCancel} />
    </EventFormProvider>
  );
};

export default CreateEventForm;
