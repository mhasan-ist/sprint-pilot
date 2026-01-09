
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { SprintStore } from '../store';
import { calculateSprintSquadMetrics } from '../engine';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: SprintStore;
}

export const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, store }) => {
  const [isThinking, setIsThinking] = useState(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<any[] | null>(null);
  const [forecastResult, setForecastResult] = useState<string | null>(null);
  const [newProjectLoad, setNewProjectLoad] = useState<number>(30);

  if (!isOpen) return null;

  const runAudit = async () => {
    setIsThinking(true);
    setSuggestion(null);
    setForecastResult(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const squadMetrics = store.sprintSquads.map(ss => {
        const sprint = store.sprints.find(s => s.id === ss.sprintId);
        const stories = store.getStoriesForSprintSquad(ss.id);
        const metrics = sprint ? calculateSprintSquadMetrics(sprint, ss, stories) : null;
        return {
            squadId: ss.squadId,
            sprint: sprint?.name,
            utilization: metrics?.totalUtilization.toFixed(1) + '%',
            stories: stories.map(s => s.title)
        };
      });

      const prompt = `You are a Senior Release Manager. Audit this sprint plan:
      Context: ${JSON.stringify(squadMetrics)}
      
      Provide a concise summary of:
      1. Top 3 risks.
      2. Bottleneck roles.
      3. One actionable advice.
      
      Keep it professional and technical.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAuditResult(response.text);
    } catch (error) {
      console.error(error);
      setAuditResult("Error: AI could not process the plan at this time.");
    } finally {
      setIsThinking(false);
    }
  };

  const runForecast = async () => {
    setIsThinking(true);
    setAuditResult(null);
    setSuggestion(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Global snapshot of capacity
      const capacityMap = store.sprintSquads.map(ss => {
        const sprint = store.sprints.find(s => s.id === ss.sprintId);
        const stories = store.getStoriesForSprintSquad(ss.id);
        const metrics = sprint ? calculateSprintSquadMetrics(sprint, ss, stories) : null;
        return {
           squad: ss.squadId,
           sprint: sprint?.name,
           available: metrics?.availableMandays,
           used: metrics?.assignedMandays,
           utilization: metrics?.totalUtilization.toFixed(1) + '%'
        };
      });

      const prompt = `Act as a Capacity Planning Predictor. 
      Current Global Load Snapshot: ${JSON.stringify(capacityMap)}
      Requirement: We have a new project coming with a total load of ${newProjectLoad} mandays.
      
      Task:
      1. Analyze the "white space" (low utilization sprints/squads) across the portfolio.
      2. Predict the earliest optimal Start Sprint.
      3. Recommend which squads should take it.
      
      Output: A concise, bulleted forecast analysis.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      setForecastResult(response.text);
    } catch (error) {
      console.error(error);
      setForecastResult("Forecast failed. Check logs.");
    } finally {
      setIsThinking(false);
    }
  };

  const runSmartSuggest = async () => {
    setIsThinking(true);
    setAuditResult(null);
    setForecastResult(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const unassigned = store.getUnassignedStories.map(s => ({ id: s.id, title: s.title, load: s.mandaysByRole }));
      const capacities = store.sprintSquads.map(ss => ({ id: ss.id, squad: ss.squadId, sprint: ss.sprintId }));

      const prompt = `Act as an Optimization Engine. Suggest where to assign these unassigned stories:
      Stories: ${JSON.stringify(unassigned)}
      Available Slots (Sprint-Squads): ${JSON.stringify(capacities)}
      
      Return ONLY a JSON array of objects: { storyId: string, sprintSquadId: string, reason: string }. 
      Priority: Fill earlier sprints first without exceeding 90% utilization.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text);
      setSuggestion(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsThinking(false);
    }
  };

  const applySuggestion = (s: any) => {
    store.assignStory(s.storyId, s.sprintSquadId);
    setSuggestion(prev => prev ? prev.filter(item => item.storyId !== s.storyId) : null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/40 backdrop-blur-md p-4">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20 flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white shrink-0 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              AI Planning Assistant
            </h2>
            <p className="text-indigo-100 text-sm mt-1 font-medium">Enterprise Intelligence Hub • Gemini 3.0</p>
          </div>
          <button onClick={onClose} className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {/* Action Cards */}
          {!auditResult && !suggestion && !forecastResult && !isThinking && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ActionCard 
                onClick={runAudit}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                title="Health Audit"
                desc="Bottleneck detection and risk summary."
                color="indigo"
              />
              
              <ActionCard 
                onClick={runSmartSuggest}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
                title="Smart Distribute"
                desc="Auto-assign unassigned backlog stories."
                color="purple"
              />

              <div className="col-span-full mt-4 p-6 rounded-[32px] bg-slate-50 border-2 border-slate-100">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Capacity Forecasting</h4>
                 <div className="flex items-center gap-6">
                    <div className="flex-1">
                       <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">Upcoming Project Load (Mandays)</label>
                       <div className="flex items-center gap-3">
                          <input 
                            type="range" min="10" max="200" step="10" 
                            value={newProjectLoad} 
                            onChange={(e) => setNewProjectLoad(parseInt(e.target.value))}
                            className="flex-1 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
                          />
                          <span className="text-sm font-black text-indigo-600 w-10">{newProjectLoad}d</span>
                       </div>
                    </div>
                    <button 
                      onClick={runForecast}
                      className="px-6 py-3 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95"
                    >
                      Run Forecast
                    </button>
                 </div>
              </div>
            </div>
          )}

          {/* Thinking State */}
          {isThinking && (
            <div className="py-20 flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
               <div className="relative">
                  <div className="w-20 h-20 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full animate-pulse"></div>
                  </div>
               </div>
               <div className="text-center">
                 <h3 className="font-black text-slate-800 text-lg">Analyzing Data...</h3>
                 <p className="text-sm text-slate-400 font-medium">Gemini is simulating resource scenarios across all project streams.</p>
               </div>
            </div>
          )}

          {/* Audit Result Display */}
          {auditResult && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <ResultHeader title="Audit Report" onReset={() => setAuditResult(null)} color="indigo" />
              <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 whitespace-pre-wrap text-sm font-medium text-slate-700 leading-relaxed shadow-inner">
                {auditResult}
              </div>
            </div>
          )}

          {/* Forecast Result Display */}
          {forecastResult && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <ResultHeader title="Project Readiness Forecast" onReset={() => setForecastResult(null)} color="slate" />
              <div className="p-8 bg-slate-900 rounded-[32px] text-indigo-50 border border-slate-800 whitespace-pre-wrap text-sm font-medium leading-relaxed shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Predictive Analysis Complete</span>
                </div>
                {forecastResult}
              </div>
            </div>
          )}

          {/* Suggestion List Display */}
          {suggestion && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <ResultHeader title="Smart Recommendations" onReset={() => setSuggestion(null)} color="purple" />
              <div className="space-y-3">
                {suggestion.map((s, idx) => {
                  const squad = store.sprintSquads.find(ss => ss.id === s.sprintSquadId);
                  const sprint = store.sprints.find(sp => sp.id === squad?.sprintId);
                  return (
                    <div key={idx} className="p-5 bg-white border border-slate-200 rounded-[28px] flex items-center justify-between group hover:border-purple-500 transition-all shadow-sm">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-800">{s.storyId}</span>
                          <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-lg uppercase tracking-tight">{sprint?.name} • {squad?.squadId}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium italic">"{s.reason}"</p>
                      </div>
                      <button 
                        onClick={() => applySuggestion(s)}
                        className="px-4 py-2 bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-purple-700 transition-all active:scale-95 shadow-lg shadow-purple-100"
                      >
                        Apply
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Logic Ready</span>
           </div>
           <button onClick={onClose} className="px-8 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-100 transition-all shadow-sm active:scale-95">
             Dismiss
           </button>
        </div>

      </div>
    </div>
  );
};

const ActionCard = ({ onClick, icon, title, desc, color }: { onClick: () => void, icon: any, title: string, desc: string, color: string }) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-[32px] border-2 border-slate-100 hover:border-${color}-500 hover:bg-${color}-50/30 transition-all text-left group`}
  >
    <div className={`w-12 h-12 bg-${color}-100 rounded-2xl flex items-center justify-center text-${color}-600 mb-4 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="font-black text-slate-800 tracking-tight">{title}</h3>
    <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{desc}</p>
  </button>
);

const ResultHeader = ({ title, onReset, color }: { title: string, onReset: () => void, color: string }) => (
  <div className="flex justify-between items-center mb-4">
    <h3 className={`text-[10px] font-black uppercase tracking-widest text-${color}-600`}>{title}</h3>
    <button onClick={onReset} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors">Clear</button>
  </div>
);
