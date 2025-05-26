
import React, { useState } from 'react';
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import TextField from '@/components/meetings/form/TextField';
import { Checkbox } from '@/components/ui/checkbox';
import { EventFormValues } from './EventFormSchema';

interface EventDateTimeFieldsProps {
  form: UseFormReturn<EventFormValues>;
}

const EventDateTimeFields: React.FC<EventDateTimeFieldsProps> = ({ form }) => {
  const [isSingleDay, setIsSingleDay] = useState(false);
  
  React.useEffect(() => {
    if (isSingleDay) {
      form.setValue('endDate', undefined);
      form.setValue('endTime', undefined);
    }
  }, [isSingleDay, form]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <TextField 
                form={form} 
                name="startTime" 
                label="Start Time" 
                placeholder="Start time (HH:MM)" 
              />
            )}
          />
        </div>
        
        {!isSingleDay && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <TextField 
                  form={form} 
                  name="endTime" 
                  label="End Time" 
                  placeholder="End time (HH:MM)" 
                />
              )}
            />
          </div>
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
          This is a single-day event (no end date/time required)
        </label>
      </div>
    </div>
  );
};

export default EventDateTimeFields;
