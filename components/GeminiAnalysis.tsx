import React from 'react';
import { FrameworkData } from '../types';
import { GeminiResponse } from '../services/geminiService';
import { marked } from 'marked';

interface Props {
  data: FrameworkData;
  analysis: GeminiResponse | null;
  loading: boolean;
  onAnalyze: () => void;
}

export const GeminiAnalysis: React.FC<Props> = ({ data, analysis, loading, onAnalyze }) => {
  // Convert markdown to HTML securely
  const getMarkdownHtml = (markdown: string) => {
    try {
      return marked.parse(markdown);
    } catch (e) {
      return markdown;
    }
  };

  return (
    <div className="bg-inst-surface border border-inst-border rounded-md overflow-hidden flex flex-col w-full transition-all duration-300 shadow-lg">
      {/* Header */}
      <div className="bg-inst-bg px-6 py-4 border-b border-inst-border flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-inst-accent rounded-full"></div>
          <h2 className="text-sm font-bold text-inst-text tracking-widest uppercase font-mono">
            Strategic Intelligence Briefing (Live Grounding)
          </h2>
        </div>
        <button 
          onClick={onAnalyze}
          disabled={loading}
          className="bg-inst-surface hover:bg-inst-border text-inst-text border border-inst-border font-mono text-xs px-4 py-2 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider flex items-center gap-2"
        >
          {loading ? (
             <>
               <span className="w-2 h-2 rounded-full bg-inst-accent animate-ping"></span>
               Vetting Data...
             </>
          ) : (
             <>
               <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
               Validate & Generate
             </>
          )}
        </button>
      </div>

      {/* Report Content */}
      <div className="p-8 min-h-[300px] bg-[#0c0c0e] flex-grow overflow-y-auto">
        {analysis ? (
          <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="flex justify-between items-end mb-8 border-b border-inst-border pb-4">
              <div>
                <h3 className="text-lg font-bold text-inst-text mb-1 tracking-tight">SITREP: 3B³ SYSTEM STATE</h3>
                <span className="text-xs font-mono text-inst-muted">CLASSIFICATION: STRATEGIC / NOFORN</span>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-inst-muted">AUTH: AI STRATEGY UNIT</div>
                <div className="text-xs font-mono text-inst-muted">VALIDATION: GOOGLE SEARCH GROUNDING</div>
              </div>
            </div>
            
            {/* Main Text - Rendered Markdown */}
            <div className="prose prose-invert prose-sm max-w-none font-sans leading-relaxed text-inst-text opacity-90 mb-8">
               <div dangerouslySetInnerHTML={{ __html: getMarkdownHtml(analysis.markdown) as string }} />
            </div>
            
            {/* Verified Sources Section */}
            {analysis.sources && analysis.sources.length > 0 && (
                <div className="bg-inst-bg border border-inst-border rounded p-4 mb-4">
                    <h4 className="text-[10px] font-bold text-inst-accent uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-inst-accent"></span>
                        Validated Intelligence Sources
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
                                <span className="text-[10px] font-mono text-inst-muted group-hover:text-inst-text truncate flex-grow">
                                    {source.title}
                                </span>
                                <svg className="w-3 h-3 text-inst-muted opacity-0 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-inst-border flex justify-between items-center">
               <span className="text-[10px] font-mono text-inst-muted uppercase">/End Transmission</span>
               <div className="flex gap-2">
                  <span className="w-16 h-1 bg-inst-border"></span>
                  <span className="w-4 h-1 bg-inst-accent"></span>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-inst-muted gap-4">
            <div className="w-16 h-16 border border-inst-border rounded-full flex items-center justify-center bg-inst-bg relative">
                <div className="absolute inset-0 border border-inst-accent/20 rounded-full animate-ping"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <div className="text-center max-w-md">
                <p className="text-sm font-medium text-inst-text mb-1">Awaiting Verification</p>
                <p className="text-xs font-mono opacity-70">Execute grounding protocol to validate matrix values against live web data. Generated reports will persist here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};