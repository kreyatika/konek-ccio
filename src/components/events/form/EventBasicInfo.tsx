
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import TextField from '@/components/meetings/form/TextField';
import TextareaField from '@/components/meetings/form/TextareaField';
import CommitteeSelect from '@/components/meetings/form/CommitteeSelect';
import { EventFormValues } from './EventFormSchema';

interface EventBasicInfoProps {
  form: UseFormReturn<EventFormValues>;
}

const EventBasicInfo: React.FC<EventBasicInfoProps> = ({ form }) => {
  return (
    <>
      <TextField 
        form={form} 
        name="title" 
        label="Title" 
        placeholder="Event title" 
      />
      
      <TextareaField 
        form={form} 
        name="description" 
        label="Description" 
        placeholder="Description of the event" 
      />
      
      <CommitteeSelect form={form} />
      
      <TextField 
        form={form} 
        name="location" 
        label="Location" 
        placeholder="Event location" 
      />
    </>
  );
};

export default EventBasicInfo;
