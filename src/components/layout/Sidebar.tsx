import { 
  CheckCircle2, CalendarDays, Inbox, Clock, CalendarClock, 
  Folder, Plus, Sun, Moon
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  selectedProjectId: string | null;
  onProjectSelect: (id: string | null) => void;
  onNewProject: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ currentView, onViewChange, selectedProjectId, onProjectSelect, onNewProject, isOpenMobile, onCloseMobile }: SidebarProps) {
  const { projects, tasks, theme, setTheme } = useStore();

  const navItems = [
    { id: 'all', label: 'All tasks', icon: Inbox },
    { id: 'today', label: 'Today', icon: CalendarDays },
    { id: 'upcoming', label: 'Upcoming', icon: CalendarClock },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
    { id: 'overdue', label: 'Overdue', icon: Clock },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" 
          onClick={onCloseMobile}
        />
      )}
      
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-muted/30 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 bg-background md:bg-transparent",
        isOpenMobile ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Task Manager</h2>
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        <div className="space-y-1">
          <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Views</p>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.id);
                onProjectSelect(null);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-2 py-2 text-base rounded-md transition-colors",
                currentView === item.id && !selectedProjectId
                  ? "bg-primary text-primary-foreground font-medium" 
                  : "hover:bg-muted text-foreground/80"
              )}
            >
              <item.icon size={17} className={currentView === item.id && !selectedProjectId ? "text-primary-foreground" : "text-muted-foreground"} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 mb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Projects</p>
            <button 
              onClick={onNewProject}
              className="text-muted-foreground hover:text-foreground"
            >
              <Plus size={14} />
            </button>
          </div>
          
          {projects.map(project => {
            const taskCount = tasks.filter(t => t.projectId === project.id && t.status !== 'completed').length;
            
            return (
              <button
                key={project.id}
                onClick={() => {
                  onProjectSelect(project.id);
                  onViewChange('project');
                }}
                className={cn(
                  "w-full flex items-center justify-between px-2 py-2 text-base rounded-md transition-colors",
                  selectedProjectId === project.id
                    ? "bg-primary text-primary-foreground font-medium" 
                    : "hover:bg-muted text-foreground/80"
                )}
              >
                <div className="flex items-center gap-3">
                  <Folder size={16} className={selectedProjectId === project.id ? "text-primary-foreground" : "text-muted-foreground"} />
                  <span className="truncate max-w-[120px] text-left">{project.name}</span>
                </div>
                {taskCount > 0 && (
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full",
                    selectedProjectId === project.id ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground"
                  )}>
                    {taskCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
    </>
  );
}
