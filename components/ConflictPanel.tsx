
import React from 'react';
import { PlanningIssue } from '../types';

interface ConflictPanelProps {
  isOpen: boolean;
  onClose: () => void;
  issues: PlanningIssue[];
}

export const ConflictPanel: React.FC<ConflictPanelProps> = ({ isOpen, onClose, issues }) => {
  if (!isOpen) return null;

  const highPriority = issues.filter(i => i.severity === 'HIGH');
  const mediumPriority = issues.filter(i => i.severity === 'MEDIUM');

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 border-l border-slate-200 flex flex-col transform transition-transform animate-slide-in">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Planning Audit</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{issues.length} Issues Detected</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="font-bold text-slate-800">Plan is Healthy!</h3>
            <p className="text-xs text-slate-500 mt-1">No dependency violations or overloads detected in the current configuration.</p>
          </div>
        ) : (
          <>
            {highPriority.length > 0 && (
              <div>
                <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Critical Errors ({highPriority.length})
                </h3>
                <div className="space-y-3">
                  {highPriority.map((issue, idx) => (
                    <IssueCard key={idx} issue={issue} />
                  ))}
                </div>
              </div>
            )}

            {mediumPriority.length > 0 && (
              <div>
                <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Warnings ({mediumPriority.length})
                </h3>
                <div className="space-y-3">
                  {mediumPriority.map((issue, idx) => (
                    <IssueCard key={idx} issue={issue} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
            Resolving critical errors ensures your squad execution timeline is realistic and logically sound.
          </p>
      </div>

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

// Properly type IssueCard component as React.FC to handle React-specific props like key.
const IssueCard: React.FC<{ issue: PlanningIssue }> = ({ issue }) => {
  const isHigh = issue.severity === 'HIGH';
  return (
    <div className={`p-3 rounded-xl border-2 transition-all hover:scale-[1.02] ${isHigh ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
      <div className="flex gap-3">
        <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${isHigh ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'}`}>
           {issue.type === 'OVERLOAD' ? (
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
           ) : (
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
           )}
        </div>
        <div>
          <h4 className={`text-xs font-black ${isHigh ? 'text-red-700' : 'text-amber-700'}`}>{issue.type.replace('_', ' ')}</h4>
          <p className="text-[11px] font-medium text-slate-700 mt-0.5 leading-snug">{issue.message}</p>
          {issue.storyId && (
            <div className="mt-2 inline-block px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-black text-indigo-600 font-mono-custom">
              {issue.storyId}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
