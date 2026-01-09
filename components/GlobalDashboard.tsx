
import React, { useMemo } from 'react';
import { SprintStore } from '../store';
import { calculateSprintSquadMetrics, validateFullPlan } from '../engine';
import { ViewMode } from '../types';

export const GlobalDashboard: React.FC<{ store: SprintStore }> = ({ store }) => {
  const { projects, storeStories, sprints, sprintSquads, storeAssignments, setActiveProjectId, setViewMode } = store;

  const globalMetrics = useMemo(() => {
    let totalStories = storeStories.length;
    let totalAssignments = storeAssignments.length;
    let totalLoad = 0;
    const roleLoads = { backend: 0, android: 0, ios: 0, qa: 0, qaAutomation: 0 };

    storeStories.forEach(s => {
      totalLoad += (Object.values(s.mandaysByRole) as number[]).reduce((a, b) => a + b, 0);
      roleLoads.backend += s.mandaysByRole.backend;
      roleLoads.android += s.mandaysByRole.android;
      roleLoads.ios += s.mandaysByRole.ios;
      roleLoads.qa += s.mandaysByRole.qa;
      roleLoads.qaAutomation += s.mandaysByRole.qaAutomation;
    });

    return { totalStories, totalAssignments, totalLoad, roleLoads };
  }, [storeStories, storeAssignments]);

  const forecastData = useMemo(() => {
    // Unique Sprints and Squads across all projects
    const allSprintNames = Array.from(new Set(sprints.map(s => s.name))).sort();
    const allSquadNames = Array.from(new Set(store.squads.map(sq => sq.id))).sort();

    return { allSprintNames, allSquadNames };
  }, [sprints, store.squads]);

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
                  {forecastData.allSprintNames.map(name => (
                    <th key={name} className="p-3 text-center text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 min-w-[100px]">{name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {forecastData.allSquadNames.map(squadId => (
                  <tr key={squadId} className="group">
                    <td className="p-3 text-xs font-black text-slate-700 border-b border-slate-50 sticky left-0 bg-white z-10 group-hover:text-indigo-600 transition-colors">{squadId}</td>
                    {forecastData.allSprintNames.map(sprintName => {
                      // Find any project's sprint-squad with this name
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
                
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-${project.color}-100 flex items-center justify-center text-${project.color}-600`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                  </div>
                  {project.criticalCount > 0 && (
                    <span className="bg-red-100 text-red-600 text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest animate-pulse">
                      {project.criticalCount} Critical Issues
                    </span>
                  )}
                </div>

                <h4 className="text-lg font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">{project.name}</h4>
                <p className="text-xs text-slate-500 font-medium mb-6 line-clamp-2 h-8">{project.description}</p>

                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Average Utilization</span>
                    <span className={project.avgUtil > 100 ? 'text-red-500' : 'text-slate-700'}>{project.avgUtil.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 bg-${project.color}-500`} 
                      style={{ width: `${Math.min(project.avgUtil, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-400">S{i}</div>)}
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {project.assignedCount} / {project.storyCount} Stories Assigned
                  </span>
                </div>
              </div>
            ))}
            
            {/* Create New Project Call to Action */}
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center p-8 hover:bg-white hover:border-indigo-400 transition-all group cursor-pointer min-h-[250px]">
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:scale-110 transition-all mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              </div>
              <span className="text-sm font-black text-slate-400 group-hover:text-indigo-600 uppercase tracking-widest">Initialize New Stream</span>
            </div>
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

const RoleMeter = ({ label, val, color }: { label: string, val: number, color: string }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-end">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-xs font-black text-slate-700">{val.toFixed(0)}d</span>
    </div>
    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
      <div 
        className={`h-full bg-${color}-500 transition-all duration-1000`} 
        style={{ width: `${Math.min((val/100) * 100, 100)}%` }} 
      />
    </div>
  </div>
);

const ForecastLegend = ({ label, color }: { label: string, color: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-md ${color.includes('slate') ? color : color}`}></div>
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
  </div>
);
