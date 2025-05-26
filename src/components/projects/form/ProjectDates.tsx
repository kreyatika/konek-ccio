
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProjectFormValues } from '@/hooks/useProjectForm';
import { Checkbox } from '@/components/ui/checkbox';

interface ProjectDatesProps {
  form: UseFormReturn<ProjectFormValues>;
}

const ProjectDates: React.FC<ProjectDatesProps> = ({ form }) => {
  const endDateValue = form.watch('endDate');
  const [isSingleDay, setIsSingleDay] = React.useState<boolean>(!endDateValue);

  React.useEffect(() => {
    if (isSingleDay && endDateValue) {
      form.setValue('endDate', undefined);
    }
  }, [isSingleDay, form, endDateValue]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {!isSingleDay && (
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value ? field.value : ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="single-day" 
          checked={isSingleDay}
          onCheckedChange={(checked) => {
            setIsSingleDay(checked as boolean);
          }}
        />
        <label
          htmlFor="single-day"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          This is a single-day event
        </label>
      </div>
    </div>
  );
};

export default ProjectDates;
