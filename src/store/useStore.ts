import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Task, Project, Priority, Status } from '../types';

interface State {
  tasks: Task[];
  projects: Project[];
  theme: 'light' | 'dark';
  
  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  addProject: (name: string) => void;
  renameProject: (id: string, newName: string) => void;
  deleteProject: (id: string) => void;
}

const seedProjects: Project[] = [
  { id: 'p1', name: 'Personal' },
  { id: 'p2', name: 'Work' },
  { id: 'p3', name: 'Home' },
];

const seedTasks: Task[] = [
  {
    id: uuidv4(),
    title: 'Buy groceries',
    description: 'Milk, bread, eggs, and fruit',
    priority: 'medium',
    status: 'todo',
    projectId: 'p3',
    createdAt: Date.now(),
  },
  {
    id: uuidv4(),
    title: 'Finish quarterly report',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    priority: 'high',
    status: 'in progress',
    projectId: 'p2',
    createdAt: Date.now() - 10000,
  },
  {
    id: uuidv4(),
    title: 'Book dentist appointment',
    priority: 'low',
    status: 'completed',
    projectId: 'p1',
    createdAt: Date.now() - 86400000,
  },
  {
    id: uuidv4(),
    title: 'Review team performance',
    priority: 'high',
    status: 'todo',
    projectId: 'p2',
    createdAt: Date.now() - 5000,
  },
  {
    id: uuidv4(),
    title: 'Plan vacation',
    description: 'Look at flights to Japan',
    priority: 'medium',
    status: 'todo',
    projectId: 'p1',
    createdAt: Date.now() - 2000,
  },
  {
    id: uuidv4(),
    title: 'Fix leaky faucet',
    priority: 'medium',
    status: 'todo',
    projectId: 'p3',
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString(), // Overdue
    createdAt: Date.now() - 3000,
  }
];

export const useStore = create<State>()(
  persist(
    (set) => ({
      tasks: seedTasks,
      projects: seedProjects,
      theme: 'light',
      
      setTheme: (theme) => set({ theme }),
      
      addTask: (taskData) => set((state) => ({
        tasks: [
          ...state.tasks, 
          { 
            ...taskData, 
            id: uuidv4(), 
            createdAt: Date.now() 
          }
        ]
      })),
      
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),
      
      addProject: (name) => set((state) => ({
        projects: [...state.projects, { id: uuidv4(), name }]
      })),
      
      renameProject: (id, name) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, name } : p)
      })),
      
      deleteProject: (id) => set((state) => {
        // Also remove this project from all tasks that use it
        const newTasks = state.tasks.map(t => 
          t.projectId === id ? { ...t, projectId: undefined } : t
        );
        return {
          projects: state.projects.filter(p => p.id !== id),
          tasks: newTasks
        };
      }),
    }),
    {
      name: 'task-manager-storage',
    }
  )
);
