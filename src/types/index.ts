
// User roles
export type UserRole = 'superadmin' | 'board' | 'staff' | 'member';

// User profile
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Project status
export type ProjectStatus = 'planned' | 'in-progress' | 'review' | 'completed';

// Task status
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

// Task model
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: Date;
  assignee?: User;
  assigneeId?: string | null;
  committee?: string;
  priority: 'low' | 'medium' | 'high';
  projectId?: string; // Add projectId field to link to source project
  attachments?: { name: string; url: string }[];
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

// Comment model
export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
}

// Project model
export interface Project {
  id: string;
  title: string;
  description: string;
  committee: string;
  status: ProjectStatus;
  startDate: Date;
  endDate: Date;
  tasks: Task[];
  members: User[];
  attachments?: { name: string; url: string }[];
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

// Meeting model
export interface Meeting {
  id: string;
  title: string;
  description: string;
  committee: string;
  date: Date;
  endDate: Date;
  location: string;
  attendees: User[];
  agenda?: string;
  minutes?: string;
  attachments?: { name: string; url: string }[];
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

// Event model
export interface Event {
  id: string;
  title: string;
  description: string;
  committee?: string;
  startDate: Date;
  endDate: Date;
  location: string;
  attendees: User[];
  rsvpDeadline?: Date;
  imageUrl?: string | null;
  attachments?: { name: string; url: string }[];
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

// Notification model
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  link?: string;
  createdAt: Date;
}

// Activity model for dashboard
export interface Activity {
  id: string;
  type: 'task' | 'project' | 'meeting' | 'event' | 'comment';
  title: string;
  description: string;
  user: User;
  entityId: string; // ID of the related entity (task, project, etc.)
  entityType: string; // Type of the related entity
  createdAt: Date;
}

// Calendar item (can be task, meeting, event or project)
export interface CalendarItem {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  type: 'task' | 'meeting' | 'event' | 'project';
  committee?: string;
  location?: string;
  color?: string;
  entityId: string; // ID of the original entity
}

// Kanban column
export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
