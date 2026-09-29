import { useStore } from '../../store/useStore';

export function DashboardCounts() {
  const tasks = useStore(state => state.tasks);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const todayEnd = todayStart + 86400000;

  const allCount = tasks.length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const inProgressCount = tasks.filter(t => t.status === 'in progress').length;
  
  const dueTodayCount = tasks.filter(t => 
    t.dueDate && 
    t.status !== 'completed' && 
    new Date(t.dueDate).getTime() >= todayStart && 
    new Date(t.dueDate).getTime() < todayEnd
  ).length;

  const overdueCount = tasks.filter(t => 
    t.dueDate && 
    t.status !== 'completed' && 
    new Date(t.dueDate).getTime() < todayStart
  ).length;

  const counts = [
    { label: 'All tasks', value: allCount, color: 'text-foreground' },
    { label: 'Due today', value: dueTodayCount, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'In progress', value: inProgressCount, color: 'text-zinc-700 dark:text-zinc-300' },
    { label: 'Completed', value: completedCount, color: 'text-muted-foreground' },
    { label: 'Overdue', value: overdueCount, color: 'text-danger' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {counts.map((item, idx) => (
        <div key={idx} className="bg-card border border-border rounded-lg p-4 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-2">{item.label}</p>
          <p className={`text-5xl font-bold ${item.color}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}
