
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useProjectForm } from '@/hooks/useProjectForm';
import ProjectBasicInfo from './form/ProjectBasicInfo';
import ProjectMetadata from './form/ProjectMetadata';
import ProjectDates from './form/ProjectDates';
import SubmitButton from './form/SubmitButton';

interface CreateProjectFormProps {
  onSuccess: () => void;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ onSuccess }) => {
  const { form, onSubmit, isSubmitting } = useProjectForm({ onSuccess });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <ProjectBasicInfo form={form} />
        <ProjectMetadata form={form} />
        <ProjectDates form={form} />
        
        <DialogFooter>
          <SubmitButton isSubmitting={isSubmitting} />
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CreateProjectForm;
