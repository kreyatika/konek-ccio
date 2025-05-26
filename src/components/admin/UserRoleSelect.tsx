
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/types';

interface UserRoleSelectProps {
  value: UserRole;
  onValueChange: (value: UserRole) => void;
  disabled?: boolean;
  showDisabledNote?: boolean;
}

const UserRoleSelect: React.FC<UserRoleSelectProps> = ({
  value,
  onValueChange,
  disabled,
  showDisabledNote,
}) => {
  return (
    <div className="w-full sm:w-40">
      <label className="text-xs text-muted-foreground mb-1 block">Role</label>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="superadmin">Super Admin</SelectItem>
          <SelectItem value="board">Board</SelectItem>
          <SelectItem value="staff">Staff</SelectItem>
          <SelectItem value="member">Member</SelectItem>
        </SelectContent>
      </Select>
      {showDisabledNote && (
        <p className="text-xs text-muted-foreground mt-1">
          Cannot change your own role
        </p>
      )}
    </div>
  );
};

export default UserRoleSelect;
