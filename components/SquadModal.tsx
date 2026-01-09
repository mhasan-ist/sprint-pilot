
import React, { useState, useEffect } from 'react';
import { SprintSquad, MandaysByRole } from '../types';
import { IconBackend, IconMobile, IconQA } from './Common';

interface SquadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, members: MandaysByRole) => void;
  sprintSquad: SprintSquad | null;
  squadName: string;
  sprintName: string;
}

export const SquadModal: React.FC<SquadModalProps> = ({ isOpen, onClose, onSave, sprintSquad, squadName, sprintName }) => {
  const [formData, setFormData] = useState<MandaysByRole>({ backend: 0, android: 0, ios: 0, qa: 0, qaAutomation: 0 });

  useEffect(() => {
    if (sprintSquad) {
      setFormData(sprintSquad.membersByRole);
    }
  }, [sprintSquad, isOpen]);

  if (!isOpen || !sprintSquad) return null;

  const handleMemberChange = (role: keyof MandaysByRole, value: string) => {
    const num = parseInt(value) || 0;
    setFormData(prev => ({ ...prev, [role]: num }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Squad Composition</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{squadName} • {sprintName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Team Members Count</label>
          <div className="space-y-3">
             <MemberInput icon={<IconBackend />} label="Backend Engineers" value={formData.backend} onChange={val => handleMemberChange('backend', val)} />
             <MemberInput icon={<IconMobile />} label="Android Engineers" value={formData.android} onChange={val => handleMemberChange('android', val)} />
             <MemberInput icon={<IconMobile />} label="iOS Engineers" value={formData.ios} onChange={val => handleMemberChange('ios', val)} />
             <MemberInput icon={<IconQA />} label="QA Engineers" value={formData.qa} onChange={val => handleMemberChange('qa', val)} />
             <MemberInput icon={<IconQA />} label="Automation QA" value={formData.qaAutomation} onChange={val => handleMemberChange('qaAutomation', val)} />
          </div>
          
          <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
            <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-[11px] text-amber-700 font-medium">Changing squad composition will immediately recalculate capacity and utilization for this specific sprint instance.</p>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex gap-3 bg-slate-50/50">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all">Cancel</button>
          <button onClick={() => onSave(sprintSquad.id, formData)} className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Update Capacity</button>
        </div>
      </div>
    </div>
  );
};

const MemberInput = ({ icon, label, value, onChange }: { icon: any, label: string, value: number, onChange: (val: string) => void }) => (
  <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
    <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-white shadow-sm text-slate-600 border border-slate-100">{icon}</div>
        <span className="text-xs font-bold text-slate-700">{label}</span>
    </div>
    <div className="flex items-center gap-2">
        <button 
            onClick={() => onChange((Math.max(0, value - 1)).toString())}
            className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100"
        >-</button>
        <input 
            type="number" 
            value={value} 
            onChange={e => onChange(e.target.value)}
            className="w-8 text-center bg-transparent text-sm font-mono-custom font-bold outline-none" 
        />
        <button 
            onClick={() => onChange((value + 1).toString())}
            className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100"
        >+</button>
    </div>
  </div>
);
