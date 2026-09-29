import type { Task } from '../../types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  emptyMessage?: string;
}

export function TaskList({ tasks, onTaskClick, emptyMessage = "No tasks found" }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="py-12 text-center border-2 border-dashed border-border rounded-xl">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} onClick={onTaskClick} />
      ))}
    </div>
  );
}
