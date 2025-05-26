
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Meeting } from '@/types';
import { useAuth } from '@/contexts/auth';

// Schema for form validation
const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  committee: z.string({
    required_error: "Please select a committee.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  startTime: z.string({
    required_error: "Please select a start time.",
  }),
  endTime: z.string({
    required_error: "Please select an end time.",
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  agenda: z.string().optional(),
}).refine(data => {
  // Validate that end time is after start time
  return data.startTime < data.endTime;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

export type MeetingFormValues = z.infer<typeof formSchema>;

interface MeetingFormContextProps {
  form: ReturnType<typeof useForm<MeetingFormValues>>;
  isSubmitting: boolean;
  submitForm: (values: MeetingFormValues) => void;
}

const MeetingFormContext = React.createContext<MeetingFormContextProps | undefined>(undefined);

export interface MeetingFormDefaults {
  title?: string;
  description?: string;
  committee?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  agenda?: string;
}

interface MeetingFormProviderProps {
  children: React.ReactNode;
  onSubmit: (data: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => void;
  defaultValues?: MeetingFormDefaults;
}

export const MeetingFormProvider: React.FC<MeetingFormProviderProps> = ({ 
  children, 
  onSubmit,
  defaultValues = {}
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues.title || "",
      description: defaultValues.description || "",
      committee: defaultValues.committee || "",
      location: defaultValues.location || "",
      startTime: defaultValues.startTime || "09:00",
      endTime: defaultValues.endTime || "10:00",
      agenda: defaultValues.agenda || "",
    },
  });

  const submitForm = (values: MeetingFormValues) => {
    setIsSubmitting(true);
    
    // Create a meeting date object with the selected date and time
    const meetingDate = new Date(values.date);
    const [startHours, startMinutes] = values.startTime.split(':').map(Number);
    meetingDate.setHours(startHours, startMinutes);
    
    // Calculate end date (for duration)
    const endDate = new Date(values.date);
    const [endHours, endMinutes] = values.endTime.split(':').map(Number);
    endDate.setHours(endHours, endMinutes);
    
    // Create a complete meeting object with all required fields
    const newMeeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'> = {
      title: values.title,
      description: values.description,
      committee: values.committee,
      date: meetingDate,
      endDate: endDate, // Add the end date
      location: values.location,
      attendees: user ? [user] : [],
      agenda: values.agenda || '',
      minutes: '',
    };
    
    onSubmit(newMeeting);
    setIsSubmitting(false);
  };

  return (
    <MeetingFormContext.Provider value={{ form, isSubmitting, submitForm }}>
      {children}
    </MeetingFormContext.Provider>
  );
};

export const useMeetingForm = () => {
  const context = React.useContext(MeetingFormContext);
  if (context === undefined) {
    throw new Error('useMeetingForm must be used within a MeetingFormProvider');
  }
  return context;
};
