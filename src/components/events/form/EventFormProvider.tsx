
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Event } from '@/types';
import { useAuth } from '@/contexts/auth';
import { eventFormSchema, EventFormValues } from './EventFormSchema';

interface EventFormContextProps {
  form: ReturnType<typeof useForm<EventFormValues>>;
  isSubmitting: boolean;
  eventImage: File | null;
  imagePreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  submitForm: (values: EventFormValues) => void;
}

const EventFormContext = React.createContext<EventFormContextProps | undefined>(undefined);

interface EventFormProviderProps {
  children: React.ReactNode;
  onSubmit: (data: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'>, eventImage?: File) => void;
}

export const EventFormProvider: React.FC<EventFormProviderProps> = ({ 
  children, 
  onSubmit 
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      committee: "",
      location: "",
      startTime: "09:00",
      endTime: "10:00",
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEventImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setEventImage(null);
    setImagePreview(null);
  };

  const submitForm = (values: EventFormValues) => {
    setIsSubmitting(true);
    
    // Create a event start date object with the selected date and time
    const startDateTime = new Date(values.startDate);
    const [startHours, startMinutes] = values.startTime.split(':').map(Number);
    startDateTime.setHours(startHours, startMinutes);
    
    // Calculate end date - handle the case where endDate or endTime is undefined
    let endDateTime: Date;
    
    if (!values.endDate || !values.endTime) {
      // If no end date/time, set end date to start date plus 1 hour
      endDateTime = new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + 1);
    } else {
      endDateTime = new Date(values.endDate);
      const [endHours, endMinutes] = values.endTime.split(':').map(Number);
      endDateTime.setHours(endHours, endMinutes);
    }
    
    // Create a complete event object with all required fields
    const newEvent: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'> = {
      title: values.title,
      description: values.description,
      committee: values.committee,
      startDate: startDateTime,
      endDate: endDateTime,
      location: values.location,
      attendees: user ? [user] : [],
      rsvpDeadline: values.rsvpDeadline,
      imageUrl: null, // This will be set by the server after image upload
    };
    
    onSubmit(newEvent, eventImage || undefined);
    setIsSubmitting(false);
  };

  return (
    <EventFormContext.Provider 
      value={{ 
        form, 
        isSubmitting, 
        eventImage, 
        imagePreview, 
        handleImageChange, 
        handleRemoveImage, 
        submitForm 
      }}
    >
      {children}
    </EventFormContext.Provider>
  );
};

export const useEventForm = () => {
  const context = React.useContext(EventFormContext);
  if (context === undefined) {
    throw new Error('useEventForm must be used within an EventFormProvider');
  }
  return context;
};
