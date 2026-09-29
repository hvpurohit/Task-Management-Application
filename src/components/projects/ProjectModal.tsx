import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { useStore } from '../../store/useStore';
import { X, Trash2 } from 'lucide-react';

interface ProjectModalProps {
  project?: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onProjectDeleted?: () => void;
}

export function ProjectModal({ project, isOpen, onClose, onProjectDeleted }: ProjectModalProps) {
  const { addProject, renameProject, deleteProject } = useStore();
  const [name, setName] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name);
    } else {
      setName('');
    }
    setIsConfirmingDelete(false);
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (project) {
      renameProject(project.id, name);
    } else {
      addProject(name);
    }
    onClose();
  };

  const handleDelete = () => {
    if (project) {
      deleteProject(project.id);
      if (onProjectDeleted) onProjectDeleted();
      onClose();
    }
  };

  if (isConfirmingDelete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <div className="bg-card w-full max-w-sm rounded-xl border border-border shadow-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-danger">Delete Project?</h2>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete "{project?.name}"? All associated tasks will lose their project assignment. This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <button 
              onClick={() => setIsConfirmingDelete(false)}
              className="px-4 py-2 rounded-md font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              className="px-4 py-2 bg-danger text-danger-foreground rounded-md font-medium hover:bg-danger/90 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card w-full max-w-md rounded-xl border border-border shadow-lg flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">{project ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Project Name <span className="text-danger">*</span></label>
            <input 
              autoFocus
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. Work, Personal, Groceries"
            />
          </div>
        </form>

        <div className="p-4 border-t border-border flex justify-between items-center bg-muted/30">
          {project ? (
            <button 
              type="button"
              onClick={() => setIsConfirmingDelete(true)}
              className="p-2 text-danger hover:bg-danger/10 rounded-md transition-colors"
              title="Delete Project"
            >
              <Trash2 size={18} />
            </button>
          ) : (
            <div></div> // empty div for spacing
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
              {project ? 'Save' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
