
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { SprintStore } from '../store';
import { getWorkingDays, calculateSprintSquadMetrics } from '../engine';
import { UserStory, Role, TaskSchedule } from '../types';
import { IconBackend, IconMobile, IconQA, Card, Badge } from './Common';

export const GanttView: React.FC<{ store: SprintStore }> = ({ store }) => {
  const { sprintSquads, sprints, assignments, selectedSprintSquadId, getStoriesForSprintSquad, setViewMode, updateTaskSchedule, optimizeSchedulesForSprintSquad } = store;

  const context = useMemo(() => {
    const ss = sprintSquads.find(s => s.id === selectedSprintSquadId);
    if (!ss) return null;
    const sprint = sprints.find(s => s.id === ss.sprintId);
    if (!sprint) return null;
    const stories = getStoriesForSprintSquad(ss.id);
    return { sprintSquad: ss, sprint, stories };
  }, [selectedSprintSquadId, sprintSquads, sprints, getStoriesForSprintSquad]);

  if (!context) return (
    <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center p-10 bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Sprint Selected</h3>
            <p className="text-sm text-slate-500 mt-2">Go back to Helicopter View and click on a squad's utilization percentage to deep-dive into its schedule.</p>
            <button 
                onClick={() => setViewMode('HELICOPTER' as any)}
                className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold"
            >Back to Helicopter View</button>
        </div>
    </div>
  );

  const { sprint, stories, sprintSquad } = context;
  const workingDays = getWorkingDays(sprint.startDate, sprint.endDate);
  const metrics = calculateSprintSquadMetrics(sprint, sprintSquad, stories);

  const daysArray = Array.from({ length: workingDays }, (_, i) => i + 1);

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/50">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setViewMode('HELICOPTER' as any)}
                className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors bg-white border border-slate-200 shadow-sm"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Gantt: {sprint.name} {sprintSquad.squadId}</h2>
                <div className="flex gap-4 mt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Utilization: <strong className="text-slate-700">{metrics.totalUtilization.toFixed(1)}%</strong>
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-300"></span> Working Days: <strong className="text-slate-700">{workingDays}</strong>
                    </span>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-3">
            <button 
                onClick={() => optimizeSchedulesForSprintSquad(sprintSquad.id)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-95"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Smart Auto-Sequence
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex gap-2">
                <RoleCapacityPill label="Backend" members={sprintSquad.membersByRole.backend} util={metrics.utilization.backend} />
                <RoleCapacityPill label="Mobile" members={sprintSquad.membersByRole.android + sprintSquad.membersByRole.ios} util={(metrics.utilization.android + metrics.utilization.ios) / 2} />
                <RoleCapacityPill label="QA" members={sprintSquad.membersByRole.qa} util={metrics.utilization.qa} />
            </div>
        </div>
      </div>

      {/* Main Gantt Grid */}
      <div className="flex-1 overflow-auto relative p-6 bg-white custom-scrollbar">
        <div className="min-w-[1000px]">
            {/* Days Header */}
            <div className="flex sticky top-0 bg-white z-20 border-b-2 border-slate-100 pb-3 mb-4">
                <div className="w-80 shrink-0 font-black text-slate-400 text-[10px] uppercase tracking-widest">User Story / Tasks</div>
                <div className="flex-1 flex">
                    {daysArray.map(d => (
                        <div key={d} className="flex-1 text-center font-mono-custom text-[11px] text-slate-400 font-black border-l border-slate-50">D{d}</div>
                    ))}
                </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-100">
                {stories.map(story => {
                    const assignment = assignments.find(a => a.userStoryId === story.id && a.sprintSquadId === sprintSquad.id);
                    return (
                        <GanttStoryRow 
                            key={story.id} 
                            story={story} 
                            workingDays={workingDays} 
                            schedule={assignment?.schedule || { beOffset: 0, mobOffset: 0, qaOffset: 0 }}
                            onUpdateSchedule={(newSchedule) => updateTaskSchedule(story.id, sprintSquad.id, newSchedule)}
                        />
                    );
                })}
            </div>

            {stories.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 text-slate-400 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                    <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    <p className="font-bold text-xs uppercase tracking-widest">No stories assigned.</p>
                </div>
            )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-[10px] font-bold text-slate-400 flex justify-between">
          <div className="flex gap-4">
              <span>TIP: Use "Smart Auto-Sequence" to optimize role handovers based on mandays.</span>
          </div>
          <div className="flex gap-4">
              <span className="text-indigo-600">Legend: BE (Indigo), MOB (Sky), QA (Emerald)</span>
          </div>
      </div>
    </div>
  );
};

const RoleCapacityPill: React.FC<{ label: string, members: number, util: number }> = ({ label, members, util }) => (
    <div className={`px-4 py-2 border-2 rounded-xl flex flex-col min-w-[100px] transition-all ${util > 100 ? 'bg-red-50 border-red-100 shadow-sm' : 'bg-white border-slate-100'}`}>
        <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1.5 tracking-tighter">{label} ({members})</span>
        <span className={`text-base font-black leading-none ${util > 100 ? 'text-red-600' : 'text-slate-800'}`}>{util.toFixed(0)}%</span>
    </div>
);

const GanttStoryRow: React.FC<{ story: UserStory, workingDays: number, schedule: TaskSchedule, onUpdateSchedule: (s: TaskSchedule) => void }> = ({ story, workingDays, schedule, onUpdateSchedule }) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState<{ role: 'be' | 'mob' | 'qa', startX: number, startOffset: number } | null>(null);

    const beWidth = Math.min(story.mandaysByRole.backend, workingDays);
    const mobileWidth = Math.min(Math.max(story.mandaysByRole.android, story.mandaysByRole.ios), workingDays);
    const qaWidth = Math.min(story.mandaysByRole.qa, workingDays);

    const handleMouseDown = (e: React.MouseEvent, role: 'be' | 'mob' | 'qa') => {
        setDragging({
            role,
            startX: e.clientX,
            startOffset: role === 'be' ? schedule.beOffset : role === 'mob' ? schedule.mobOffset : schedule.qaOffset
        });
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dragging || !rowRef.current) return;

            const gridWidth = rowRef.current.querySelector('.grid-container')?.clientWidth || 0;
            const pxPerDay = gridWidth / workingDays;
            const deltaPx = e.clientX - dragging.startX;
            const deltaDays = Math.round(deltaPx / pxPerDay);
            
            let newOffset = Math.max(0, Math.min(workingDays - 1, dragging.startOffset + deltaDays));
            
            // Limit based on task width
            const width = dragging.role === 'be' ? beWidth : dragging.role === 'mob' ? mobileWidth : qaWidth;
            newOffset = Math.min(newOffset, workingDays - width);

            const newSchedule = { ...schedule };
            if (dragging.role === 'be') newSchedule.beOffset = newOffset;
            else if (dragging.role === 'mob') newSchedule.mobOffset = newOffset;
            else if (dragging.role === 'qa') newSchedule.qaOffset = newOffset;

            onUpdateSchedule(newSchedule);
        };

        const handleMouseUp = () => {
            setDragging(null);
        };

        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, workingDays, beWidth, mobileWidth, qaWidth, schedule, onUpdateSchedule]);

    return (
        <div ref={rowRef} className="py-6 flex hover:bg-slate-50/50 group transition-colors">
            <div className="w-80 shrink-0 flex flex-col pr-6">
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter mb-1">{story.id}</span>
                <span className="text-sm font-bold text-slate-800 leading-tight mb-2">{story.title}</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                    {story.mandaysByRole.backend > 0 && <Badge color="blue">BE: {story.mandaysByRole.backend}d</Badge>}
                    {mobileWidth > 0 && <Badge color="slate">MOB: {mobileWidth}d</Badge>}
                    {story.mandaysByRole.qa > 0 && <Badge color="emerald">QA: {story.mandaysByRole.qa}d</Badge>}
                </div>
            </div>
            
            <div className="flex-1 flex flex-col gap-2 relative py-1 grid-container">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 flex pointer-events-none">
                    {Array.from({ length: workingDays }).map((_, i) => (
                        <div key={i} className="flex-1 border-r border-slate-100 last:border-0" />
                    ))}
                </div>

                {/* BE Track */}
                <div className="h-4 relative">
                    {story.mandaysByRole.backend > 0 && (
                        <div 
                            onMouseDown={(e) => handleMouseDown(e, 'be')}
                            className={`h-full bg-indigo-500 rounded-md shadow-sm flex items-center px-2 cursor-grab active:cursor-grabbing border border-indigo-600 hover:brightness-110 transition-all z-10 absolute ${dragging?.role === 'be' ? 'ring-2 ring-indigo-300 ring-offset-1' : ''}`}
                            style={{ 
                                left: `${(schedule.beOffset / workingDays) * 100}%`,
                                width: `${(beWidth / workingDays) * 100}%` 
                            }}
                        >
                            <span className="text-[9px] text-white font-black uppercase tracking-widest whitespace-nowrap">Backend</span>
                        </div>
                    )}
                </div>

                {/* Mobile Track */}
                <div className="h-4 relative">
                    {mobileWidth > 0 && (
                        <div 
                            onMouseDown={(e) => handleMouseDown(e, 'mob')}
                            className={`h-full bg-sky-500 rounded-md shadow-sm flex items-center px-2 cursor-grab active:cursor-grabbing border border-sky-600 hover:brightness-110 transition-all z-10 absolute ${dragging?.role === 'mob' ? 'ring-2 ring-sky-300 ring-offset-1' : ''}`}
                            style={{ 
                                left: `${(schedule.mobOffset / workingDays) * 100}%`,
                                width: `${(mobileWidth / workingDays) * 100}%` 
                            }}
                        >
                             <span className="text-[9px] text-white font-black uppercase tracking-widest whitespace-nowrap">Mobile</span>
                        </div>
                    )}
                </div>

                {/* QA Track */}
                <div className="h-4 relative">
                    {story.mandaysByRole.qa > 0 && (
                        <div 
                            onMouseDown={(e) => handleMouseDown(e, 'qa')}
                            className={`h-full bg-emerald-500 rounded-md shadow-sm flex items-center px-2 cursor-grab active:cursor-grabbing border border-emerald-600 hover:brightness-110 transition-all z-10 absolute ${dragging?.role === 'qa' ? 'ring-2 ring-emerald-300 ring-offset-1' : ''}`}
                            style={{ 
                                left: `${(schedule.qaOffset / workingDays) * 100}%`,
                                width: `${(qaWidth / workingDays) * 100}%` 
                            }}
                        >
                             <span className="text-[9px] text-white font-black uppercase tracking-widest whitespace-nowrap">QA</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
