
import React, { useState } from 'react';
import { FrameworkData, StakeholderView } from '../types';
import { GeminiResponse } from '../services/geminiService';
import { marked } from 'marked';

interface Props {
  data: FrameworkData;
  analysis: GeminiResponse | null;
  loading: boolean;
  onAnalyze: (view: StakeholderView) => void;
}

export const GeminiAnalysis: React.FC<Props> = ({ data, analysis, loading, onAnalyze }) => {
  const [selectedView, setSelectedView] = useState<StakeholderView>('investor');

  // Convert markdown to HTML securely
  const getMarkdownHtml = (markdown: string) => {
    try {
      return marked.parse(markdown);
    } catch (e) {
      console.error("Markdown rendering error:", e);
      return markdown;
    }
  };

  const stakeholders: {id: StakeholderView, label: string, desc: string}[] = [
      { id: 'sovereign', label: 'Sovereign', desc: 'National Advantage' },
      { id: 'regulator', label: 'Regulator', desc: 'Grid Resilience' },
      { id: 'investor', label: 'Investor', desc: 'Asymmetric Trade' },
      { id: 'developer', label: 'Developer', desc: 'Protocol Health' },
      { id: 'academic', label: 'Academic', desc: 'Raw Data' },
      { id: 'retail', label: 'Retail', desc: 'Legacy' },
  ];

  return (
    <div className="bg-inst-surface border border-inst-border rounded-md overflow-hidden flex flex-col w-full transition-all duration-300 shadow-lg">
      {/* Header */}
      <div className="bg-inst-bg px-4 py-4 border-b border-inst-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        
        <div className="flex flex-col">
            <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-inst-cyan rounded-full shadow-[0_0_10px_#06b6d4]"></div>
            <h2 className="text-sm font-bold text-inst-text tracking-widest uppercase font-mono">
                Strategic Intelligence
            </h2>
            </div>
            <span className="text-[10px] font-mono text-inst-muted ml-5 mt-1">3B³ SEGMENTED REPORTING ENGINE</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
            <select 
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value as StakeholderView)}
                className="bg-inst-surface text-inst-text text-xs font-mono border border-inst-border rounded px-2 py-2 outline-none focus:border-inst-accent uppercase tracking-wide flex-grow sm:flex-grow-0"
            >
                {stakeholders.map(s => (
                    <option key={s.id} value={s.id}>{s.label.toUpperCase()} // {s.desc.toUpperCase()}</option>
                ))}
            </select>

            <button 
            onClick={() => onAnalyze(selectedView)}
            disabled={loading}
            className="bg-inst-accent/10 hover:bg-inst-accent/20 text-inst-accent border border-inst-accent/50 font-mono text-xs px-4 py-2 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider flex items-center gap-2 whitespace-nowrap"
            >
            {loading ? (
                <>
                <span className="w-2 h-2 rounded-full bg-inst-accent animate-ping"></span>
                VETTING...
                </>
            ) : (
                <>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                GENERATE
                </>
            )}
            </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="p-6 sm:p-8 min-h-[400px] bg-[#000000] flex-grow overflow-y-auto relative">
        {/* Background grid effect */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        {analysis ? (
          <div className="animate-in fade-in duration-500 max-w-4xl mx-auto relative z-10">
            <div className="flex justify-between items-end mb-6 border-b border-inst-border pb-4">
              <div>
                <h3 className="text-lg font-bold text-inst-cyan mb-1 tracking-tight font-mono">SITREP // {selectedView.toUpperCase()}</h3>
                <span className="text-xs font-mono text-inst-muted">CLASSIFICATION: COUNCIL EYES ONLY</span>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-inst-accent">BITPETRO PROTOCOL ACTIVE</div>
                <div className="text-[10px] font-mono text-inst-muted">LIVE GROUNDING: ENABLED</div>
              </div>
            </div>
            
            {/* Main Text - Rendered Markdown */}
            <div className="prose prose-invert prose-sm max-w-none font-mono leading-relaxed text-inst-text opacity-90 mb-8">
                {/* Custom styling for the BITPETRO ORDER usually at top */}
               <div className="[&>h1]:text-inst-accent [&>h1]:border-b-0 [&>h1]:text-xl [&>h1]:tracking-tighter
                               [&>strong]:text-inst-cyan
                               [&>ul>li]:marker:text-inst-border" 
                    dangerouslySetInnerHTML={{ __html: getMarkdownHtml(analysis.markdown) as string }} />
            </div>
            
            {/* Verified Sources Section */}
            {analysis.sources && analysis.sources.length > 0 && (
                <div className="bg-[#0a0a0a] border border-inst-border rounded p-4 mb-4">
                    <h4 className="text-[10px] font-bold text-inst-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        Intel Chain of Custody
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {analysis.sources.map((source, idx) => (
                            <a 
                                key={idx} 
                                href={source.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 rounded hover:bg-inst-surface border border-transparent hover:border-inst-border transition-all group"
                            >
                                <span className="text-[10px] font-mono text-inst-cyan group-hover:text-inst-accent truncate flex-grow">
                                    {source.title}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-inst-border flex justify-between items-center">
               <span className="text-[10px] font-mono text-inst-muted uppercase">/3B3_SYSTEM_END</span>
               <div className="flex gap-1">
                  <span className="w-2 h-2 bg-inst-border"></span>
                  <span className="w-2 h-2 bg-inst-cyan"></span>
                  <span className="w-2 h-2 bg-inst-accent"></span>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-inst-muted gap-4 relative z-10">
            <div className="w-20 h-20 border border-inst-border rounded-full flex items-center justify-center bg-[#050505] relative">
                <div className="absolute inset-0 border border-inst-cyan/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute inset-2 border border-inst-accent/10 rounded-full animate-[pulse_3s_ease-in-out_infinite]"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-inst-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
            </div>
            <div className="text-center max-w-md px-4">
                <p className="text-sm font-bold text-inst-text mb-2 uppercase tracking-widest">Awaiting Target Selection</p>
                <p className="text-xs font-mono opacity-60 leading-relaxed">
                    Select a stakeholder profile to initiate the 3B³ extraction engine.
                    <br/>
                    System will perform live web grounding and apply mandatory BitPetro overrides.
                </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
