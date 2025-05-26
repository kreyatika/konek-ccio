
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProfileEditFormProps {
  userId: string;
  initialName: string;
  onCancel: () => void;
}

const ProfileEditForm = ({ userId, initialName, onCancel }: ProfileEditFormProps) => {
  const [name, setName] = useState(initialName);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('Profile updated successfully');
      onCancel(); // This will set isEditing to false in the parent component
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Your name"
        />
      </div>
      <div className="flex space-x-2">
        <Button 
          onClick={handleUpdateProfile} 
          disabled={isLoading}
          variant="blue"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ProfileEditForm;
