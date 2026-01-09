
import React, { useState } from 'react';
import { SprintStore } from '../store';
import { calculateSprintSquadMetrics, getStatusColor, checkDependencyViolations } from '../engine';
import { IconBackend, IconMobile, IconQA, Badge } from './Common';
import { UserStory, Role, SprintSquad, MandaysByRole, ViewMode } from '../types';
import { SquadModal } from './SquadModal';
import { StoryModal } from './StoryModal';

export const HelicopterView: React.FC<{ store: SprintStore }> = ({ store }) => {
  const { sprints, squads, sprintSquads, assignments, setSelectedSprintSquadId, setViewMode, assignStory, updateSprintSquadMembers } = store;

  const [squadToEdit, setSquadToEdit] = useState<{ ss: SprintSquad, squadName: string, sprintName: string } | null>(null);
  const [editingStory, setEditingStory] = useState<UserStory | null>(null);
  const [selectedTraceStoryId, setSelectedTraceStoryId] = useState<string | null>(null);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, sprintSquadId: string) => {
    const storyId = e.dataTransfer.getData('storyId');
    if (storyId) {
      assignStory(storyId, sprintSquadId);
    }
  };

  const handleSquadUpdate = (id: string, members: MandaysByRole) => {
    updateSprintSquadMembers(id, members);
    setSquadToEdit(null);
  };

  const handleStorySave = (story: UserStory) => {
    store.updateStory(story);
    setEditingStory(null);
  };

  const isRelatedToSelected = (storyId: string) => {
      if (!selectedTraceStoryId) return false;
      if (storyId === selectedTraceStoryId) return true;
      const story = store.stories.find(s => s.id === selectedTraceStoryId);
      return story?.dependencies.includes(storyId) || false;
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full bg-slate-50" onClick={() => setSelectedTraceStoryId(null)}>
      {/* Header Section */}
      <div className="p-6 shrink-0 flex items-center justify-between bg-white border-b border-slate-200 z-30 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Helicopter Overview</h2>
          <p className="text-slate-500 text-sm font-medium">Strategic planning and capacity realism at a glance.</p>
        </div>
        <div className="flex gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-[9px] font-black text-indigo-600 uppercase tracking-widest animate-pulse">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Dependency Tracer Active
            </div>
            <div className="flex gap-2">
                <Legend color="emerald" label="Healthy" />
                <Legend color="amber" label="Warning" />
                <Legend color="red" label="Overload" />
            </div>
        </div>
      </div>

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-auto custom-scrollbar relative p-6">
        {/* We use width: max-content to ensure the grid defines the scrollable range */}
        <div 
          className="grid gap-4" 
          style={{ 
            gridTemplateColumns: `200px repeat(${sprints.length}, 320px)`,
            width: 'max-content',
            minWidth: '100%'
          }}
        >
            {/* Top Left Empty Cell (Sticky Both Ways) */}
            <div className="sticky top-0 left-0 z-40 bg-slate-50/95 backdrop-blur-sm py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest flex items-end">
               Squads / Timeline
            </div>

            {/* Sprint Headers (Sticky Top) */}
            {sprints.map(sprint => (
              <div key={sprint.id} className="sticky top-0 z-30 bg-white border-b-4 border-slate-200 p-4 rounded-t-xl shadow-sm">
                  <h3 className="font-black text-slate-800 tracking-tight">{sprint.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">
                  {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                  </p>
              </div>
            ))}

            {/* Squad Rows */}
            {squads.map(squad => (
              <React.Fragment key={squad.id}>
                  {/* Squad Name (Sticky Left) */}
                  <div className="sticky left-0 z-20 flex flex-col justify-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 group">
                      <span className="text-[10px] font-black text-indigo-500 uppercase mb-1 tracking-widest leading-none">Squad</span>
                      <span className="text-sm font-black text-slate-800 tracking-tight leading-tight">{squad.name}</span>
                      <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-r from-transparent to-slate-50/50 pointer-events-none"></div>
                  </div>

                  {/* Sprint Cells */}
                  {sprints.map(sprint => {
                    const sprintSquad = sprintSquads.find(ss => ss.sprintId === sprint.id && ss.squadId === squad.id);
                    
                    if (!sprintSquad) {
                        return (
                        <div 
                            key={sprint.id} 
                            className="group border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center bg-slate-100/30 hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer transition-all h-48"
                            onClick={() => store.addSprintSquad(sprint.id, squad.id)}
                        >
                            <span className="text-slate-400 group-hover:text-indigo-400 text-[10px] font-black uppercase tracking-widest">+ Assign Squad</span>
                        </div>
                        );
                    }

                    const assignedStories = store.getStoriesForSprintSquad(sprintSquad.id);
                    const metrics = calculateSprintSquadMetrics(sprint, sprintSquad, assignedStories);
                    const status = getStatusColor(metrics.totalUtilization);
                    const isOverloaded = metrics.totalUtilization > 110;

                    return (
                        <div
                        key={sprint.id}
                        onDragOver={onDragOver}
                        onDrop={(e) => onDrop(e, sprintSquad.id)}
                        className={`relative p-4 rounded-xl border-2 transition-all group min-h-[192px] shadow-sm hover:shadow-md ${status.bg} ${status.border} ${isOverloaded ? 'animate-pulse-subtle' : ''}`}
                        >
                        <div className="flex justify-between items-start mb-3">
                            <div 
                                className="cursor-pointer"
                                onClick={() => {
                                    setSelectedSprintSquadId(sprintSquad.id);
                                    setViewMode(ViewMode.GANTT);
                                }}
                            >
                                <span className={`text-2xl font-black font-mono-custom ${status.text}`}>
                                {metrics.totalUtilization.toFixed(0)}%
                                </span>
                            </div>
                            <div className="flex gap-1">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setSquadToEdit({ ss: sprintSquad, squadName: squad.name, sprintName: sprint.name }) }}
                                    className="p-1 hover:bg-black/5 rounded text-slate-500 transition-colors"
                                    title="Configure Squad Capacity"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar pb-2">
                            {assignedStories.map(story => {
                            const violations = checkDependencyViolations(story, assignments, sprintSquads, sprints);
                            const hasViolation = violations.length > 0;
                            const isTraceRelated = isRelatedToSelected(story.id);
                            
                            return (
                                <div 
                                key={story.id} 
                                className={`text-[11px] font-bold py-1.5 px-2 bg-white rounded-lg shadow-sm flex items-center justify-between border-2 transition-all cursor-pointer active:cursor-grabbing ${isTraceRelated ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200' : hasViolation ? 'border-red-400 bg-red-50' : 'border-slate-100 group-hover:border-slate-200'}`}
                                draggable
                                onDragStart={(e) => e.dataTransfer.setData('storyId', story.id)}
                                onClick={(e) => { e.stopPropagation(); setSelectedTraceStoryId(story.id === selectedTraceStoryId ? null : story.id); }}
                                onDoubleClick={() => setEditingStory(story)}
                                title={hasViolation ? `Blocking dependencies: ${violations.join(', ')}` : 'Click to trace dependencies'}
                                >
                                <div className="flex items-center gap-2 truncate">
                                    <span className={`font-black shrink-0 ${hasViolation ? 'text-red-600' : 'text-indigo-600'}`}>{story.id}</span>
                                    <span className="text-slate-700 truncate">{story.title}</span>
                                </div>
                                {isTraceRelated && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping"></div>
                                )}
                                </div>
                            );
                            })}
                        </div>

                        {/* Role Micro-Bars */}
                        <div className="mt-auto pt-3 border-t border-black/5 flex gap-2">
                            <RoleMiniMeter label="BE" val={metrics.utilization.backend} />
                            <RoleMiniMeter label="MOB" val={(metrics.utilization.android + metrics.utilization.ios) / 2} />
                            <RoleMiniMeter label="QA" val={metrics.utilization.qa} />
                        </div>
                        </div>
                    );
                  })}
              </React.Fragment>
            ))}
        </div>
      </div>

      <SquadModal 
        isOpen={!!squadToEdit} 
        onClose={() => setSquadToEdit(null)}
        onSave={handleSquadUpdate}
        sprintSquad={squadToEdit?.ss || null}
        squadName={squadToEdit?.squadName || ''}
        sprintName={squadToEdit?.sprintName || ''}
      />

      <StoryModal 
        isOpen={!!editingStory}
        onClose={() => setEditingStory(null)}
        onSave={handleStorySave}
        story={editingStory}
        existingStories={store.stories}
        projectId={store.activeProjectId}
      />

      <style>{`
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(1.005); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

const Legend = ({ color, label }: { color: string, label: string }) => (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-500">
        <div className={`w-2 h-2 rounded-full bg-${color}-500`}></div> <span>{label}</span>
    </div>
);

const RoleMiniMeter = ({ label, val }: { label: string, val: number }) => {
    const isOver = val > 100;
    return (
        <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between text-[7px] font-black text-slate-400 uppercase tracking-tighter">
                <span>{label}</span>
                <span className={isOver ? 'text-red-500' : 'text-slate-500'}>{val.toFixed(0)}%</span>
            </div>
            <div className="h-1 w-full bg-slate-200/50 rounded-full overflow-hidden border border-black/5">
                <div 
                    className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : val > 90 ? 'bg-amber-400' : 'bg-indigo-500'}`} 
                    style={{ width: `${Math.min(val, 100)}%` }}
                />
            </div>
        </div>
    );
};
