import React, { useState, useEffect } from 'react';
import type { Task } from '../../types';
import { useStore } from '../../store/useStore';
import { format } from 'date-fns';
import { X, Trash2 } from 'lucide-react';

interface TaskDetailModalProps {
  task?: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
  const { addTask, updateTask, deleteTask, projects } = useStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [status, setStatus] = useState<Task['status']>('todo');
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setStatus(task.status);
      setDueDate(task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '');
      setProjectId(task.projectId || '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('todo');
      setDueDate('');
      setProjectId('');
    }
    setIsConfirmingDelete(false);
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      title,
      description: description || undefined,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      projectId: projectId || undefined
    };

    if (task) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (task) {
      deleteTask(task.id);
      onClose();
    }
  };

  // ── Confirmation screen ──────────────────────────────────────
  if (isConfirmingDelete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <div className="bg-card w-full max-w-sm rounded-xl border border-border shadow-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-danger">Delete Task?</h2>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <span className="font-medium text-foreground">"{task?.title}"</span>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsConfirmingDelete(false)}
              className="px-4 py-2 rounded-md font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-danger text-white rounded-md font-medium hover:bg-danger/80 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main modal ───────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card w-full max-w-lg rounded-xl border border-border shadow-lg flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">
          <div className="space-y-1">
            <label className="text-sm font-medium">Title <span className="text-danger">*</span></label>
            <input 
              autoFocus
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="What needs to be done?"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="Add details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Project</label>
              <select 
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">No Project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Due Date</label>
              <input 
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Priority</label>
              <select 
                value={priority}
                onChange={e => setPriority(e.target.value as Task['priority'])}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Status</label>
              <select 
                value={status}
                onChange={e => setStatus(e.target.value as Task['status'])}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="todo">To Do</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </form>

        <div className="p-4 border-t border-border flex justify-between items-center bg-muted/30">
          {/* Delete button — only shown when editing an existing task */}
          {task ? (
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(true)}
              className="p-2 text-danger hover:bg-danger/10 rounded-md transition-colors"
              title="Delete Task"
            >
              <Trash2 size={18} />
            </button>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-md font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
