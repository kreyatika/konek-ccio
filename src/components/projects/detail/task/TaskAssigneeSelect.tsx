
import React from 'react';
import { User } from '@/types';
import { ControllerRenderProps } from 'react-hook-form';
import { TaskFormValues } from './TaskFormSchema';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TaskAssigneeSelectProps {
  field: ControllerRenderProps<TaskFormValues, "assignee">;
  committeeMembers: User[];
}

export const TaskAssigneeSelect: React.FC<TaskAssigneeSelectProps> = ({ 
  field, 
  committeeMembers 
}) => {
  return (
    <FormItem>
      <FormLabel>Assignee</FormLabel>
      <Select
        onValueChange={field.onChange}
        value={field.value || "unassigned"}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Unassigned" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="unassigned">Unassigned</SelectItem>
          {committeeMembers.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="text-xs">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span>{member.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};
