export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in progress' | 'completed';

export interface Project {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO date string
  priority: Priority;
  status: Status;
  projectId?: string; // Links to Project.id
  createdAt: number; // Timestamp
}
