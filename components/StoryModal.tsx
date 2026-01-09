
import React, { useState, useEffect } from 'react';
import { UserStory, Role, MandaysByRole } from '../types';
import { IconBackend, IconMobile, IconQA } from './Common';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (story: UserStory) => void;
  story?: UserStory | null;
  existingStories: UserStory[];
  // Fix: Added projectId to props to satisfy the required UserStory property
  projectId: string;
}

export const StoryModal: React.FC<StoryModalProps> = ({ isOpen, onClose, onSave, story, existingStories, projectId }) => {
  // Fix: Initialize formData with projectId to match UserStory interface (Error fixed for line 15)
  const [formData, setFormData] = useState<UserStory>({
    id: '',
    projectId: projectId,
    title: '',
    epic: '',
    category: 'New Feature',
    mandaysByRole: { backend: 0, android: 0, ios: 0, qa: 0, qaAutomation: 0 },
    dependencies: []
  });

  useEffect(() => {
    if (story) {
      setFormData({
          ...story,
          epic: story.epic || '',
          category: story.category || 'New Feature'
      });
    } else {
      // Fix: Added required projectId to the reset state for new stories (Error fixed for line 32)
      setFormData({
        id: `US-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        projectId: projectId,
        title: '',
        epic: '',
        category: 'New Feature',
        mandaysByRole: { backend: 0, android: 0, ios: 0, qa: 0, qaAutomation: 0 },
        dependencies: []
      });
    }
  }, [story, isOpen, projectId]);

  if (!isOpen) return null;

  const handleMandayChange = (role: keyof MandaysByRole, value: string) => {
    const num = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      mandaysByRole: { ...prev.mandaysByRole, [role]: num }
    }));
  };

  const toggleDependency = (id: string) => {
    setFormData(prev => ({
      ...prev,
      dependencies: prev.dependencies.includes(id) 
        ? prev.dependencies.filter(d => d !== id)
        : [...prev.dependencies, id]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">{story ? 'Edit User Story' : 'New User Story'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto no-scrollbar flex-1">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">ID</label>
              <input 
                value={formData.id}
                onChange={e => setFormData(prev => ({ ...prev, id: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono-custom text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>
            <div className="col-span-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Title</label>
              <input 
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Story description..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Epic</label>
              <input 
                value={formData.epic}
                onChange={e => setFormData(prev => ({ ...prev, epic: e.target.value }))}
                placeholder="e.g. Onboarding"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Existing">Existing</option>
                <option value="Future">Future</option>
                <option value="New Feature">New Feature</option>
                <option value="Foundation">Foundation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Role-Based Estimation (Mandays)</label>
            <div className="grid grid-cols-2 gap-4">
              <EstimationInput icon={<IconBackend />} label="Backend" value={formData.mandaysByRole.backend} onChange={val => handleMandayChange('backend', val)} color="indigo" />
              <EstimationInput icon={<IconMobile />} label="Android" value={formData.mandaysByRole.android} onChange={val => handleMandayChange('android', val)} color="sky" />
              <EstimationInput icon={<IconMobile />} label="iOS" value={formData.mandaysByRole.ios} onChange={val => handleMandayChange('ios', val)} color="blue" />
              <EstimationInput icon={<IconQA />} label="QA Manual" value={formData.mandaysByRole.qa} onChange={val => handleMandayChange('qa', val)} color="emerald" />
              <EstimationInput icon={<IconQA />} label="QA Auto" value={formData.mandaysByRole.qaAutomation} onChange={val => handleMandayChange('qaAutomation', val)} color="emerald" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Dependencies</label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-slate-100 rounded-lg bg-slate-50/50">
                {existingStories.filter(s => s.id !== formData.id).map(s => (
                    <button
                        key={s.id}
                        onClick={() => toggleDependency(s.id)}
                        className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${formData.dependencies.includes(s.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'}`}
                    >
                        {s.id}
                    </button>
                ))}
                {existingStories.length <= 1 && <span className="text-[10px] text-slate-400 italic">No other stories available.</span>}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex gap-3 bg-slate-50/50 shrink-0">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all border border-slate-200">Cancel</button>
          <button onClick={() => onSave(formData)} className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Save Story</button>
        </div>
      </div>
    </div>
  );
};

const EstimationInput = ({ icon, label, value, onChange, color }: { icon: any, label: string, value: number, onChange: (val: string) => void, color: string }) => (
  <div className="flex items-center gap-3 p-2 bg-white border border-slate-100 rounded-xl shadow-sm">
    <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600`}>{icon}</div>
    <div className="flex-1">
      <span className="block text-[9px] font-black text-slate-400 uppercase leading-none mb-1 tracking-tight">{label}</span>
      <input 
        type="number" 
        value={value} 
        onChange={e => onChange(e.target.value)}
        className="w-full text-sm font-mono-custom font-bold outline-none text-slate-700" 
      />
    </div>
  </div>
);
