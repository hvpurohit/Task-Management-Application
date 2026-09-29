import React from 'react';
import type { Task } from '../../types';
import { useStore } from '../../store/useStore';
import { format } from 'date-fns';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TaskItemProps {
  task: Task;
  onClick: (task: Task) => void;
}

export function TaskItem({ task, onClick }: TaskItemProps) {
  const { updateTask, projects } = useStore();
  
  const isCompleted = task.status === 'completed';
  const project = projects.find(p => p.id === task.projectId);
  
  const toggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateTask(task.id, { 
      status: isCompleted ? 'todo' : 'completed' 
    });
  };

  const isOverdue = task.dueDate && !isCompleted && new Date(task.dueDate).getTime() < new Date().setHours(0,0,0,0);

  return (
    <div 
      onClick={() => onClick(task)}
      className={cn(
        "group flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all",
        "hover:border-foreground/20 hover:shadow-sm",
        isCompleted ? "bg-muted/30 border-transparent opacity-60" : "bg-card border-border",
        isOverdue && !isCompleted ? "border-danger/30 bg-danger/5" : ""
      )}
    >
      <button 
        onClick={toggleComplete}
        className={cn(
          "mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20",
          isCompleted ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40 hover:border-primary"
        )}
      >
        {isCompleted && <Check size={12} strokeWidth={3} />}
      </button>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={cn(
            "text-base font-medium truncate",
            isCompleted && "line-through"
          )}>
            {task.title}
          </h3>
          {task.priority === 'high' && !isCompleted && (
            <span className="shrink-0 w-2 h-2 rounded-full bg-orange-500" title="High Priority" />
          )}
        </div>
        
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {project && (
            <span className="px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground font-medium">
              {project.name}
            </span>
          )}
          
          {task.dueDate && (
            <div className={cn(
              "flex items-center gap-1",
              isOverdue && !isCompleted ? "text-danger font-medium" : ""
            )}>
              {isOverdue && !isCompleted ? <AlertCircle size={12} /> : <Clock size={12} />}
              <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
