
// Add more utility functions as needed
// This file is for any additional utilities that don't fit in the other files

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Function to create a notification for a user
export const createUserNotification = async ({
  userId,
  title,
  message,
  type,
  link,
}: {
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  link?: string;
}) => {
  try {
    const { error } = await supabase.from('notifications').insert([
      {
        user_id: userId,
        title,
        message,
        type,
        link,
        read: false,
      },
    ]);

    if (error) {
      console.error('Error creating notification:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error creating notification:', error);
    return false;
  }
};

// Function to create a notification for multiple users
export const createBulkNotifications = async ({
  userIds,
  title,
  message,
  type,
  link,
}: {
  userIds: string[];
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  link?: string;
}) => {
  try {
    const notifications = userIds.map((userId) => ({
      user_id: userId,
      title,
      message,
      type,
      link,
      read: false,
    }));

    const { error } = await supabase.from('notifications').insert(notifications);

    if (error) {
      console.error('Error creating bulk notifications:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    return false;
  }
};
