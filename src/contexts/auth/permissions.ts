
import { UserProfile } from './types';
import { rolePermissions } from '@/lib/data/permissions';

/**
 * Check if a user has permission for a specific action
 */
export const checkPermission = (
  userProfile: UserProfile | null,
  action: 'create' | 'read' | 'update' | 'delete' | 'comment'
): boolean => {
  if (!userProfile) return false;
  
  // Superadmin has all permissions
  if (userProfile.role === 'superadmin') return true;
  
  return rolePermissions[userProfile.role]?.[action] || false;
};
