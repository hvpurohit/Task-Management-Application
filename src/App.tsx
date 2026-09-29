import React, { useState, useMemo } from 'react';
import { useStore } from './store/useStore';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardCounts } from './components/dashboard/DashboardCounts';
import { TaskList } from './components/tasks/TaskList';
import { TaskDetailModal } from './components/tasks/TaskDetailModal';
import { ProjectModal } from './components/projects/ProjectModal';
import type { Task, Project } from './types';
import { Search, Plus, Settings, Menu } from 'lucide-react';

function App() {
  const { tasks, theme } = useStore();
  const [currentView, setCurrentView] = useState('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  type SortOption = 'created_desc' | 'due_asc' | 'priority_desc' | 'title_asc';
  const [sortBy, setSortBy] = useState<SortOption>('created_desc');

  // Apply theme to document root
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleOpenTaskModal = (task?: Task) => {
    setEditingTask(task || null);
    setIsTaskModalOpen(true);
  };

  const handleOpenProjectModal = (project?: Project) => {
    setEditingProject(project || null);
    setIsProjectModalOpen(true);
  };

  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) || 
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // View/Project filter
    if (selectedProjectId) {
      result = result.filter(t => t.projectId === selectedProjectId);
    } else {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const todayEnd = todayStart + 86400000;

      switch (currentView) {
        case 'today':
          result = result.filter(t => t.dueDate && new Date(t.dueDate).getTime() >= todayStart && new Date(t.dueDate).getTime() < todayEnd && t.status !== 'completed');
          break;
        case 'upcoming':
          result = result.filter(t => t.dueDate && new Date(t.dueDate).getTime() >= todayEnd && t.status !== 'completed');
          break;
        case 'completed':
          result = result.filter(t => t.status === 'completed');
          break;
        case 'overdue':
          result = result.filter(t => t.dueDate && new Date(t.dueDate).getTime() < todayStart && t.status !== 'completed');
          break;
        case 'all':
        default:
          break;
      }
    }

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'title_asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'due_asc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'priority_desc') {
        const pOrder = { high: 3, medium: 2, low: 1 };
        return pOrder[b.priority] - pOrder[a.priority];
      }
      // default created_desc
      return b.createdAt - a.createdAt;
    });
  }, [tasks, currentView, selectedProjectId, searchQuery, sortBy]);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar 
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          setIsMobileMenuOpen(false);
        }}
        selectedProjectId={selectedProjectId}
        onProjectSelect={(id) => {
          setSelectedProjectId(id);
          setIsMobileMenuOpen(false);
        }}
        onNewProject={() => {
          handleOpenProjectModal();
          setIsMobileMenuOpen(false);
        }}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 md:p-8 pb-4 border-b border-transparent">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-1.5 -ml-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold tracking-tight">
              {selectedProjectId 
                ? useStore.getState().projects.find(p => p.id === selectedProjectId)?.name 
                : currentView.charAt(0).toUpperCase() + currentView.slice(1)}
            </h1>
            {selectedProjectId && (
              <button 
                onClick={() => handleOpenProjectModal(useStore.getState().projects.find(p => p.id === selectedProjectId))}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                title="Project Settings"
              >
                <Settings size={18} />
              </button>
            )}
          </div>
          
          <button 
            onClick={() => handleOpenTaskModal()}
            className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-4 space-y-8">
          <DashboardCounts />

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input 
                  type="text" 
                  placeholder="Search tasks..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground hidden sm:inline">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as SortOption)}
                  className="bg-card border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="created_desc">Created Date</option>
                  <option value="due_asc">Due Date</option>
                  <option value="priority_desc">Priority</option>
                  <option value="title_asc">A to Z</option>
                </select>
              </div>
            </div>

            <TaskList 
              tasks={filteredTasks}
              onTaskClick={handleOpenTaskModal}
              emptyMessage={searchQuery ? "No tasks match your search." : "No tasks found in this view."}
            />
          </div>
        </div>
      </main>

      <TaskDetailModal 
        task={editingTask} 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
      />

      <ProjectModal 
        project={editingProject} 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)}
        onProjectDeleted={() => {
          setSelectedProjectId(null);
          setCurrentView('all');
        }}
      />
    </div>
  );
}

export default App;
