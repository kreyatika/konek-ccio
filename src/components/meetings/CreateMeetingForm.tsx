
import React from 'react';
import { Form } from "@/components/ui/form";
import { MeetingFormProvider, useMeetingForm, MeetingFormValues, MeetingFormDefaults } from './MeetingFormProvider';
import { Meeting } from '@/types';
import TextField from './form/TextField';
import TextareaField from './form/TextareaField';
import CommitteeSelect from './form/CommitteeSelect';
import DatePickerField from './form/DatePickerField';
import TimeRangeField from './form/TimeRangeField';
import FormActions from './form/FormActions';

interface CreateMeetingFormProps {
  onSubmit: (data: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => void;
  defaultValues?: MeetingFormDefaults;
}

// Main form component that uses the form context
const MeetingFormFields = () => {
  const { form, isSubmitting, submitForm } = useMeetingForm();
  
  const handleSubmit = (values: MeetingFormValues) => {
    submitForm(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <TextField 
          form={form} 
          name="title" 
          label="Title" 
          placeholder="Meeting title" 
        />
        
        <TextareaField 
          form={form} 
          name="description" 
          label="Description" 
          placeholder="Brief description of the meeting" 
        />
        
        <CommitteeSelect form={form} />
        
        <DatePickerField form={form} />
        
        <TimeRangeField form={form} />
        
        <TextField 
          form={form} 
          name="location" 
          label="Location" 
          placeholder="Meeting location" 
        />
        
        <TextareaField 
          form={form} 
          name="agenda" 
          label="Agenda" 
          placeholder="Meeting agenda items" 
          optional={true}
        />
        
        <FormActions isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
};

// Wrapper component that provides the form context
const CreateMeetingForm: React.FC<CreateMeetingFormProps> = ({ onSubmit, defaultValues }) => {
  return (
    <MeetingFormProvider onSubmit={onSubmit} defaultValues={defaultValues}>
      <MeetingFormFields />
    </MeetingFormProvider>
  );
};

export default CreateMeetingForm;
