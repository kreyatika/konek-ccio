
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COMMITTEES } from '@/lib/data/committees';
import { UseFormReturn } from "react-hook-form";

interface CommitteeSelectProps {
  form: UseFormReturn<any>;
}

const CommitteeSelect: React.FC<CommitteeSelectProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="committee"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Committee</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select committee" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {COMMITTEES.map(committee => (
                <SelectItem key={committee} value={committee}>
                  {committee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CommitteeSelect;
