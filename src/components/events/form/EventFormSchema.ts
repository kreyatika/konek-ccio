
import * as z from "zod";

// Schema for form validation
export const eventFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  committee: z.string().optional(),
  startDate: z.date({
    required_error: "Please select a start date.",
  }),
  startTime: z.string({
    required_error: "Please select a start time.",
  }),
  endDate: z.date().optional(),
  endTime: z.string().optional(),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  rsvpDeadline: z.date().optional(),
}).refine(data => {
  // Only check if both endDate and endTime are provided
  if (data.endDate && data.endTime) {
    // Create full date objects to compare
    const startDateTime = new Date(data.startDate);
    const [startHours, startMinutes] = data.startTime.split(':').map(Number);
    startDateTime.setHours(startHours, startMinutes);
    
    const endDateTime = new Date(data.endDate);
    const [endHours, endMinutes] = data.endTime.split(':').map(Number);
    endDateTime.setHours(endHours, endMinutes);
    
    return endDateTime > startDateTime;
  }
  
  // If no end date/time provided, validation passes
  return true;
}, {
  message: "End date/time must be after start date/time",
  path: ["endDate"],
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
