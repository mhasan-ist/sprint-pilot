
import React, { useState, useMemo } from 'react';
import { useSprintStore } from './store';
import { Sidebar } from './components/Sidebar';
import { HelicopterView } from './components/HelicopterView';
import { GanttView } from './components/GanttView';
import { GlobalDashboard } from './components/GlobalDashboard';
import { ConflictPanel } from './components/ConflictPanel';
import { AIModal } from './components/AIModal';
import { ViewMode } from './types';
import { validateFullPlan } from './engine';

const App: React.FC = () => {
  const store = useSprintStore();
  const [isConflictPanelOpen, setConflictPanelOpen] = useState(false);
  const [isAIModalOpen, setAIModalOpen] = useState(false);
  const [isProjectDropdownOpen, setProjectDropdownOpen] = useState(false);

  const issues = useMemo(() => {
    return validateFullPlan(store.stories, store.sprints, store.sprintSquads, store.assignments);
  }, [store.stories, store.sprints, store.sprintSquads, store.assignments]);

  const criticalCount = issues.filter(i => i.severity === 'HIGH').length;

  return (
    <div className={`flex h-screen w-screen bg-slate-100 text-slate-900 overflow-hidden select-none transition-all duration-500 ${store.isSandboxMode ? 'border-[6px] border-purple-500/50' : ''}`}>
      
      {/* Sidebar - Hidden on Dashboard mode */}
      {store.viewMode !== ViewMode.DASHBOARD && <Sidebar store={store} />}

      {/* Main Area */}
      <main className="flex-1 flex flex-col h-full relative">
        
        {/* Sandbox Global Banner */}
        {store.isSandboxMode && (
            <div className="bg-purple-600 text-white px-8 py-2 flex items-center justify-between shrink-0 shadow-lg relative z-30 animate-in slide-in-from-top duration-300">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Simulation Mode Active — No changes are saved to main plan</span>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={store.discardSandbox}
                        className="px-4 py-1 bg-white/10 hover:bg-white/20 text-white text-[9px] font-black uppercase rounded-lg transition-all"
                    >
                        Discard Draft
                    </button>
                    <button 
                        onClick={store.commitSandbox}
                        className="px-4 py-1 bg-white text-purple-600 hover:bg-purple-50 text-[9px] font-black uppercase rounded-lg shadow-sm transition-all"
                    >
                        Commit to Main Plan
                    </button>
                </div>
            </div>
        )}

        {/* Top Navbar with Project Switcher */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-20 shadow-sm">
          <div className="flex items-center gap-6">
            
            {/* Portfolio Dashboard Toggle */}
            <button 
              onClick={() => store.setViewMode(ViewMode.DASHBOARD)}
              className={`p-2 rounded-xl transition-all ${store.viewMode === ViewMode.DASHBOARD ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
              title="Portfolio Dashboard"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>

            {/* Project Switcher */}
            <div className={`relative transition-all duration-300 ${store.viewMode === ViewMode.DASHBOARD ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
              <button 
                onClick={() => setProjectDropdownOpen(!isProjectDropdownOpen)}
                className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all group"
              >
                <div className={`w-3 h-3 rounded-full bg-${store.activeProject.color}-500 ring-4 ring-${store.activeProject.color}-50`}></div>
                <div className="text-left">
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active Project</span>
                  <span className="block text-xs font-black text-slate-800 leading-none">{store.activeProject.name}</span>
                </div>
                <svg className={`w-4 h-4 text-slate-400 transition-transform ${isProjectDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>

              {isProjectDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-2 animate-in fade-in zoom-in duration-200">
                  {store.projects.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        store.setActiveProjectId(p.id);
                        setProjectDropdownOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${store.activeProjectId === p.id ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50 border border-transparent'}`}
                    >
                      <div className={`w-2 h-2 rounded-full bg-${p.color}-500`}></div>
                      <div>
                        <span className="block text-[11px] font-black text-slate-800">{p.name}</span>
                        <span className="block text-[9px] text-slate-500 truncate max-w-[180px] font-medium">{p.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200"></div>

            <nav className={`flex bg-slate-100 p-1 rounded-xl transition-all ${store.viewMode === ViewMode.DASHBOARD ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                <button 
                    onClick={() => store.setViewMode(ViewMode.HELICOPTER)}
                    className={`px-5 py-1.5 rounded-lg text-xs font-black transition-all ${store.viewMode === ViewMode.HELICOPTER ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Helicopter
                </button>
                <button 
                    onClick={() => store.setViewMode(ViewMode.GANTT)}
                    className={`px-5 py-1.5 rounded-lg text-xs font-black transition-all ${store.viewMode === ViewMode.GANTT ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Gantt
                </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {!store.isSandboxMode && store.viewMode !== ViewMode.DASHBOARD && (
                <button 
                    onClick={store.enterSandbox}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200 border-dashed"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    Sandbox
                </button>
            )}
            <button 
              onClick={() => setAIModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:brightness-110 transition-all active:scale-95 animate-pulse-slow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              AI Hub
            </button>
          </div>
        </header>

        {/* Dynamic View Rendering */}
        <div className="flex-1 relative flex flex-col overflow-hidden bg-slate-50">
          {store.viewMode === ViewMode.DASHBOARD && <GlobalDashboard store={store} />}
          {store.viewMode === ViewMode.HELICOPTER && <HelicopterView store={store} />}
          {store.viewMode === ViewMode.GANTT && <GanttView store={store} />}
        </div>

        {/* Audit Overlay */}
        <ConflictPanel 
          isOpen={isConflictPanelOpen} 
          onClose={() => setConflictPanelOpen(false)} 
          issues={issues}
        />

        {/* AI Assistant Modal */}
        <AIModal 
          isOpen={isAIModalOpen}
          onClose={() => setAIModalOpen(false)}
          store={store}
        />
      </main>

      {/* Audit Toggle Button - Hidden on Dashboard */}
      {store.viewMode !== ViewMode.DASHBOARD && (
        <button 
          onClick={() => setConflictPanelOpen(true)}
          className={`fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all z-40 group ${criticalCount > 0 ? 'bg-red-500 text-white animate-bounce-slow' : 'bg-white text-slate-600 hover:text-indigo-600'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          {criticalCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded-full border border-red-100 shadow-sm">{criticalCount}</span>
          )}
        </button>
      )}

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.02); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
