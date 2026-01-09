
import React, { useState, useMemo } from 'react';
import { SprintStore } from '../store';
import { IconBackend, IconMobile, IconQA } from './Common';
import { StoryModal } from './StoryModal';
import { AIUploadModal } from './AIUploadModal';
import { UserStory } from '../types';

export const Sidebar: React.FC<{ store: SprintStore }> = ({ store }) => {
  const [isStoryModalOpen, setStoryModalOpen] = useState(false);
  const [isAIUploadOpen, setAIUploadOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<UserStory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEpic, setSelectedEpic] = useState<string>('All Epics');
  
  const unassigned = store.getUnassignedStories;

  const epics = useMemo(() => {
    const uniqueEpics = new Set(unassigned.map(s => s.epic || 'Uncategorized'));
    return ['All Epics', ...Array.from(uniqueEpics).sort()];
  }, [unassigned]);

  const filteredStories = useMemo(() => {
    return unassigned.filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesEpic = selectedEpic === 'All Epics' || (s.epic || 'Uncategorized') === selectedEpic;
      return matchesSearch && matchesEpic;
    });
  }, [unassigned, searchQuery, selectedEpic]);

  const onDragStart = (e: React.DragEvent, storyId: string) => {
    e.dataTransfer.setData('storyId', storyId);
  };

  const handleSaveStory = (story: UserStory) => {
    if (editingStory) {
        store.updateStory(story);
    } else {
        store.addStory(story);
    }
    setStoryModalOpen(false);
    setEditingStory(null);
  };

  const handleEditClick = (story: UserStory) => {
    setEditingStory(story);
    setStoryModalOpen(true);
  };

  return (
    <div className="w-80 h-full border-r border-slate-200 bg-white flex flex-col shrink-0 relative shadow-xl z-30">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-xl font-black text-indigo-600 tracking-tight flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            SPRINTPILOT
        </h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Capacity Planning System</p>
      </div>

      <div className="p-4 space-y-3 bg-slate-50/50 border-b border-slate-200">
          <div className="relative">
              <svg className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                placeholder="Search stories..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
          </div>
          <div className="flex gap-2">
              <select 
                value={selectedEpic}
                onChange={e => setSelectedEpic(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
              >
                  {epics.map(epic => <option key={epic} value={epic}>{epic}</option>)}
              </select>
              <button 
                onClick={() => setAIUploadOpen(true)}
                className="p-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                title="AI Requirements Ingest"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              </button>
          </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-black text-slate-800 text-[10px] uppercase tracking-widest">Unassigned ({filteredStories.length})</h2>
          <button 
            onClick={() => { setEditingStory(null); setStoryModalOpen(true); }}
            className="p-1 text-indigo-600 hover:bg-indigo-50 rounded transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>

        <div className="space-y-3">
          {filteredStories.map(story => (
            <div
              key={story.id}
              draggable
              onDragStart={(e) => onDragStart(e, story.id)}
              onClick={() => handleEditClick(story)}
              className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group relative"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-black text-indigo-500 font-mono-custom tracking-tighter">{story.id}</span>
                <span className="text-[9px] font-black text-slate-400 uppercase truncate max-w-[100px]">{story.epic}</span>
              </div>
              <h3 className="text-xs font-bold text-slate-800 leading-snug mb-3 group-hover:text-indigo-600 transition-colors">
                {story.title}
              </h3>
              
              <div className="grid grid-cols-2 gap-1.5">
                <RoleBadge icon={<IconBackend />} value={story.mandaysByRole.backend} label="BE" />
                <RoleBadge icon={<IconMobile />} value={story.mandaysByRole.android + story.mandaysByRole.ios} label="MOB" />
                <RoleBadge icon={<IconQA />} value={story.mandaysByRole.qa} label="QA" />
                <RoleBadge icon={<IconQA />} value={story.mandaysByRole.qaAutomation} label="QA-A" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Backlog Weight</h4>
            <div className="flex justify-between items-end">
                {/* Fixed type error by explicitly casting Object.values to number array in reduce operation. */}
                <span className="text-xl font-black">{unassigned.reduce((acc, s) => acc + (Object.values(s.mandaysByRole) as number[]).reduce((a, b) => a + b, 0), 0).toFixed(0)}d</span>
                <span className="text-[9px] font-black bg-white/20 px-1.5 py-0.5 rounded">TOTAL LOAD</span>
            </div>
        </div>
      </div>

      <StoryModal 
        isOpen={isStoryModalOpen}
        onClose={() => { setStoryModalOpen(false); setEditingStory(null); }}
        onSave={handleSaveStory}
        story={editingStory}
        existingStories={store.stories}
        projectId={store.activeProjectId}
      />

      <AIUploadModal 
        isOpen={isAIUploadOpen}
        onClose={() => setAIUploadOpen(false)}
        onSync={store.addStories}
        projectId={store.activeProjectId}
      />
    </div>
  );
};

const RoleBadge = ({ icon, value, label }: { icon: React.ReactNode, value: number, label: string }) => {
    if (value === 0) return null;
    return (
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded text-[9px] font-bold text-slate-600">
            <span className="opacity-50">{icon}</span>
            <span>{value}d</span>
        </div>
    );
};
