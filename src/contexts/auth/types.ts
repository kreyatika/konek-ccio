
import { User, UserRole } from '@/types';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  avatar?: string;
  committee?: string;
}

export interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loading: boolean;
  userProfile: UserProfile | null;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
  hasPermission: (action: 'create' | 'read' | 'update' | 'delete' | 'comment') => boolean;
}
