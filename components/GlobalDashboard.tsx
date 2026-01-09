
import React, { useMemo, useState } from 'react';
import { SprintStore } from '../store';
import { calculateSprintSquadMetrics, validateFullPlan, getWorkingDays } from '../engine';
import { ViewMode } from '../types';

export const GlobalDashboard: React.FC<{ store: SprintStore }> = ({ store }) => {
  const { projects, storeStories, sprints, sprintSquads, storeAssignments, setActiveProjectId, setViewMode } = store;
  const [simSquadCount, setSimSquadCount] = useState(4);
  const [simBuffer, setSimBuffer] = useState(0.8);

  const globalMetrics = useMemo(() => {
    let totalStories = storeStories.length;
    let totalAssignments = storeAssignments.length;
    let totalLoad = 0;
    const roleLoads = { backend: 0, android: 0, ios: 0, qa: 0, qaAutomation: 0 };

    storeStories.forEach(s => {
      const storyTotal = (Object.values(s.mandaysByRole) as number[]).reduce((a, b) => a + b, 0);
      totalLoad += storyTotal;
      roleLoads.backend += s.mandaysByRole.backend;
      roleLoads.android += s.mandaysByRole.android;
      roleLoads.ios += s.mandaysByRole.ios;
      roleLoads.qa += s.mandaysByRole.qa;
      roleLoads.qaAutomation += s.mandaysByRole.qaAutomation;
    });

    return { totalStories, totalAssignments, totalLoad, roleLoads };
  }, [storeStories, storeAssignments]);

  const projection = useMemo(() => {
    // Basic Simulation: Total Mandays / (Squads * DaysPerSprint * Buffer * RolesPerSquad)
    // Assuming standard squad: 2 BE, 2 AND, 2 IOS, 2 QA (8 people)
    const avgSquadCapacityPerSprint = 10 * simSquadCount * simBuffer * 8; 
    const sprintsNeeded = Math.ceil(globalMetrics.totalLoad / avgSquadCapacityPerSprint);
    return { sprintsNeeded, capacityPerSprint: avgSquadCapacityPerSprint };
  }, [globalMetrics.totalLoad, simSquadCount, simBuffer]);

  const projectDetails = useMemo(() => {
    return projects.map(p => {
      const projectStories = storeStories.filter(s => s.projectId === p.id);
      const projectSprints = sprints.filter(s => s.projectId === p.id);
      const projectAssignments = storeAssignments.filter(a => projectStories.some(ps => ps.id === a.userStoryId));
      
      const issues = validateFullPlan(projectStories, projectSprints, sprintSquads, projectAssignments);
      const criticalCount = issues.filter(i => i.severity === 'HIGH').length;
      
      let totalProjectUtilization = 0;
      let squadCount = 0;

      sprintSquads.forEach(ss => {
        const sprint = projectSprints.find(s => s.id === ss.sprintId);
        if (sprint) {
          const ssStories = projectStories.filter(ps => 
            projectAssignments.some(pa => pa.userStoryId === ps.id && pa.sprintSquadId === ss.id)
          );
          const metrics = calculateSprintSquadMetrics(sprint, ss, ssStories);
          totalProjectUtilization += metrics.totalUtilization;
          squadCount++;
        }
      });

      const avgUtil = squadCount > 0 ? totalProjectUtilization / squadCount : 0;

      return {
        ...p,
        storyCount: projectStories.length,
        assignedCount: projectAssignments.length,
        avgUtil,
        criticalCount
      };
    });
  }, [projects, storeStories, sprints, sprintSquads, storeAssignments]);

  const allSprintNames = useMemo(() => Array.from(new Set(sprints.map(s => s.name))).sort(), [sprints]);
  const allSquadNames = useMemo(() => Array.from(new Set(store.squads.map(sq => sq.id))).sort(), [store.squads]);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Portfolio Executive Dashboard</h2>
            <p className="text-slate-500 font-medium">Cross-project resource allocation and organizational health.</p>
          </div>
          <div className="bg-indigo-600 px-4 py-2 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
            Real-time Forecasting Active
          </div>
        </div>

        {/* Simulation Projector */}
        <div className="bg-white p-8 rounded-[40px] border border-indigo-100 shadow-xl shadow-indigo-50/50 flex flex-col md:flex-row gap-8 items-center border-t-4 border-t-indigo-500">
           <div className="flex-1 space-y-6 w-full">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-2">
                 <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 Sprint Requirement Projector
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                       Target Squads <span>{simSquadCount}</span>
                    </label>
                    <input type="range" min="1" max="10" value={simSquadCount} onChange={e => setSimSquadCount(parseInt(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                       Capacity Factor (Buffer) <span>{(simBuffer * 100).toFixed(0)}%</span>
                    </label>
                    <input type="range" min="0.1" max="1" step="0.05" value={simBuffer} onChange={e => setSimBuffer(parseFloat(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                 </div>
              </div>
           </div>
           
           <div className="w-full md:w-px h-px md:h-24 bg-slate-100"></div>

           <div className="shrink-0 text-center md:text-left px-8">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Projected Sprints Needed</span>
              <div className="text-6xl font-black text-indigo-600 tracking-tighter mt-1">{projection.sprintsNeeded}</div>
              <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase">At ~{projection.capacityPerSprint.toFixed(0)} mandays/sprint</p>
           </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard title="Total Projects" value={projects.length} subtitle="Active delivery streams" color="indigo" />
          <KPICard title="Portfolio Load" value={`${globalMetrics.totalLoad.toFixed(0)}d`} subtitle="Cumulative mandays" color="purple" />
          <KPICard title="Backlog Progress" value={`${((globalMetrics.totalAssignments / globalMetrics.totalStories) * 100 || 0).toFixed(0)}%`} subtitle="Total stories assigned" color="emerald" />
          <KPICard title="Health Index" value={projectDetails.every(p => p.criticalCount === 0) ? 'EXCELLENT' : 'STRESSED'} subtitle="Organizational risk level" color={projectDetails.every(p => p.criticalCount === 0) ? 'emerald' : 'amber'} />
        </div>

        {/* Capacity Forecast Heatmap */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Global Capacity Forecast</h3>
               <p className="text-xs text-slate-400 font-medium">Squad utilization across the portfolio timeline.</p>
            </div>
            <div className="flex gap-4">
               <ForecastLegend label="Free" color="slate-100" />
               <ForecastLegend label="Optimal" color="emerald-500" />
               <ForecastLegend label="Warning" color="amber-500" />
               <ForecastLegend label="Critical" color="red-500" />
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 sticky left-0 bg-white z-10">Squad</th>
                  {allSprintNames.map(name => (
                    <th key={name} className="p-3 text-center text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 min-w-[100px]">{name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allSquadNames.map(squadId => (
                  <tr key={squadId} className="group">
                    <td className="p-3 text-xs font-black text-slate-700 border-b border-slate-50 sticky left-0 bg-white z-10 group-hover:text-indigo-600 transition-colors">{squadId}</td>
                    {allSprintNames.map(sprintName => {
                      const ss = sprintSquads.find(ss => {
                         const s = sprints.find(sp => sp.id === ss.sprintId);
                         return s?.name === sprintName && ss.squadId === squadId;
                      });

                      if (!ss) return <td key={sprintName} className="p-3 border-b border-slate-50"><div className="w-full h-8 bg-slate-50 rounded-lg"></div></td>;
                      
                      const sprint = sprints.find(s => s.id === ss.sprintId)!;
                      const stories = storeStories.filter(s => storeAssignments.some(a => a.userStoryId === s.id && a.sprintSquadId === ss.id));
                      const metrics = calculateSprintSquadMetrics(sprint, ss, stories);
                      const util = metrics.totalUtilization;

                      const colorClass = util > 110 ? 'bg-red-500' : util > 90 ? 'bg-amber-500' : util > 10 ? 'bg-emerald-500' : 'bg-slate-100';
                      const textClass = (util > 10 && util <= 110) ? 'text-white' : 'text-slate-400';

                      return (
                        <td key={sprintName} className="p-2 border-b border-slate-50">
                           <div className={`w-full h-10 rounded-xl flex items-center justify-center text-[11px] font-black shadow-sm transition-all hover:scale-105 cursor-help ${colorClass} ${textClass}`} title={`${util.toFixed(1)}% Utilization`}>
                              {util > 0 ? `${util.toFixed(0)}%` : '-'}
                           </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Project Grid */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Active Project Portfolio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectDetails.map(project => (
              <div 
                key={project.id}
                onClick={() => {
                  setActiveProjectId(project.id);
                  setViewMode(ViewMode.HELICOPTER);
                }}
                className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:border-indigo-500 hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-${project.color}-500/5 rounded-full -mr-8 -mt-8`}></div>
                <h4 className="text-lg font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">{project.name}</h4>
                <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2 h-8">{project.description}</p>
                <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {project.assignedCount} / {project.storyCount} Stories Assigned
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, subtitle, color }: { title: string, value: any, subtitle: string, color: string }) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</span>
    <span className={`block text-3xl font-black text-${color}-600 tracking-tight leading-none mb-2`}>{value}</span>
    <span className="block text-[11px] text-slate-500 font-medium">{subtitle}</span>
  </div>
);

const ForecastLegend = ({ label, color }: { label: string, color: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-md bg-${color}`}></div>
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
  </div>
);
