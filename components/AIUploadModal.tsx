
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { UserStory, MandaysByRole } from '../types';
import * as XLSX from 'xlsx';

interface AIUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSync: (stories: UserStory[]) => void;
  projectId: string;
}

export const AIUploadModal: React.FC<AIUploadModalProps> = ({ isOpen, onClose, onSync, projectId }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedStories, setExtractedStories] = useState<UserStory[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const parseSpreadsheet = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          // Convert first sheet to CSV text
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const csv = XLSX.utils.sheet_to_csv(worksheet);
          resolve(csv);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const processFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    const isTextBased = ['txt', 'md', 'markdown', 'csv'].includes(extension || '');
    const isImageOrPdf = ['pdf', 'png', 'jpg', 'jpeg', 'webp'].includes(extension || '');
    const isSpreadsheet = ['xlsx', 'xls', 'ods'].includes(extension || '');

    if (!isTextBased && !isImageOrPdf && !isSpreadsheet) {
      alert(`Format .${extension} not supported.`);
      return;
    }

    setIsProcessing(true);
    setUploadProgress(10);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let parts: any[] = [];

      const prompt = `Act as a Senior Business Analyst. Analyze the provided requirement data and extract User Stories.
      
      For each User Story, estimate Mandays for:
      - Backend
      - Android
      - iOS
      - QA Manual
      - QA Automation
      
      Requirements:
      - Return ONLY a JSON array.
      - Properties: id, title, epic, category, mandaysByRole.
      - Category: 'Existing', 'Future', 'New Feature', 'Foundation'.
      - If data is a CSV/Spreadsheet, map columns to these fields accurately.`;

      if (isSpreadsheet) {
        setUploadProgress(30);
        const csvContent = await parseSpreadsheet(file);
        parts = [
          { text: `Requirement Data (Spreadsheet as CSV):\n\n${csvContent}` },
          { text: prompt }
        ];
      } else if (isTextBased) {
        setUploadProgress(30);
        const textContent = await readFileAsText(file);
        parts = [
          { text: `Requirement Document Content:\n\n${textContent}` },
          { text: prompt }
        ];
      } else {
        setUploadProgress(30);
        const base64Data = await readFileAsBase64(file);
        parts = [
          { inlineData: { data: base64Data, mimeType: file.type } },
          { text: prompt }
        ];
      }
      
      setUploadProgress(60);

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: [{ parts }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                epic: { type: Type.STRING },
                category: { type: Type.STRING },
                mandaysByRole: {
                  type: Type.OBJECT,
                  properties: {
                    backend: { type: Type.NUMBER },
                    android: { type: Type.NUMBER },
                    ios: { type: Type.NUMBER },
                    qa: { type: Type.NUMBER },
                    qaAutomation: { type: Type.NUMBER }
                  }
                }
              },
              required: ["id", "title", "mandaysByRole"]
            }
          }
        }
      });

      setUploadProgress(90);
      const result = JSON.parse(response.text || "[]");
      
      const preparedStories = result.map((s: any) => ({
        ...s,
        projectId,
        dependencies: s.dependencies || []
      }));

      setExtractedStories(preparedStories);
    } catch (error: any) {
      console.error("AI Processing failed:", error);
      alert("Failed to analyze file. Please ensure it contains readable data.");
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSync = () => {
    onSync(extractedStories);
    setExtractedStories([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
        
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              </div>
              AI Smart Ingestor
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Upload Excel, PRD, or CSV to auto-generate backlog.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {extractedStories.length === 0 && !isProcessing ? (
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="group border-4 border-dashed border-slate-100 rounded-[32px] py-24 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-indigo-50/30 hover:border-indigo-200 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-scan"></div>
              </div>

              <div className="w-20 h-20 bg-white rounded-3xl shadow-lg border border-slate-100 flex items-center justify-center text-indigo-500 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <p className="text-lg font-black text-slate-700">Drop your requirement file</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">
                EXCEL, ODS, PDF, PNG, MD, or CSV
              </p>
              <input 
                ref={fileInputRef} 
                type="file" 
                className="hidden" 
                onChange={processFile} 
                accept=".pdf,.png,.jpg,.jpeg,.txt,.md,.markdown,.csv,.xlsx,.xls,.ods" 
              />
            </div>
          ) : isProcessing ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-8">
              <div className="relative w-32 h-32">
                 <div className="absolute inset-0 border-8 border-slate-100 rounded-full"></div>
                 <div className="absolute inset-0 border-8 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center font-black text-indigo-600 text-xl">
                    {uploadProgress}%
                 </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black text-slate-800">Reading Data...</h3>
                <p className="text-slate-500 font-medium">Parsing file and mapping stories via Gemini AI.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Extracted Suggestions ({extractedStories.length})</h3>
                <button 
                  onClick={() => setExtractedStories([])}
                  className="text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors"
                >Clear Draft</button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {extractedStories.map((story, idx) => (
                  <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <span className="text-[10px] font-black text-indigo-500 font-mono-custom mb-1 block">{story.id} • {story.epic}</span>
                        <h4 className="text-base font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{story.title}</h4>
                      </div>
                      <span className="text-[10px] font-black bg-white border border-slate-200 px-2 py-1 rounded-lg text-slate-500">{story.category}</span>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-3">
                      <MiniEstimate label="BE" val={story.mandaysByRole.backend} />
                      <MiniEstimate label="AND" val={story.mandaysByRole.android} />
                      <MiniEstimate label="IOS" val={story.mandaysByRole.ios} />
                      <MiniEstimate label="QA" val={story.mandaysByRole.qa} />
                      <MiniEstimate label="AUT" val={story.mandaysByRole.qaAutomation} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-500 hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>
          {extractedStories.length > 0 && (
            <button 
                onClick={handleSync}
                className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                Sync to Backlog
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          from { transform: translateY(0); }
          to { transform: translateY(240px); }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

const MiniEstimate = ({ label, val }: { label: string, val: number }) => (
  <div className="bg-white p-2 rounded-xl border border-slate-200 text-center">
    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">{label}</span>
    <span className="block text-xs font-black text-slate-700">{val}d</span>
  </div>
);
