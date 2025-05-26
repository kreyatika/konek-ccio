
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ProjectStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

// Define the form schema
export const projectSchema = z.object({
  title: z.string().min(3, { message: 'Project title must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  committee: z.string().min(1, { message: 'Please select a committee.' }),
  status: z.enum(['planned', 'in-progress', 'review', 'completed'], {
    message: 'Please select a valid status.',
  }),
  startDate: z.string().min(1, { message: 'Start date is required.' }),
  endDate: z.string().min(1, { message: 'End date is required.' }),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

interface UseProjectFormProps {
  onSuccess: () => void;
}

export const useProjectForm = ({ onSuccess }: UseProjectFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { userProfile } = useAuth();
  
  // Initialize form
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      committee: '',
      status: 'planned',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  });
  
  // Handle form submission
  const onSubmit = async (values: ProjectFormValues) => {
    if (!userProfile) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a project.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Insert into projects table
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          title: values.title,
          description: values.description,
          committee: values.committee,
          status: values.status,
          start_date: values.startDate,
          end_date: values.endDate,
        })
        .select('id')
        .single();
      
      if (projectError) throw projectError;
      
      // Add current user as a project member
      const { error: memberError } = await supabase
        .from('project_members')
        .insert({
          project_id: projectData.id,
          user_id: userProfile.id,
        });
      
      if (memberError) throw memberError;
      
      toast({
        title: "Success",
        description: "Project created successfully.",
      });
      
      // Reset form and refresh projects
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onSuccess();
      
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting
  };
};
