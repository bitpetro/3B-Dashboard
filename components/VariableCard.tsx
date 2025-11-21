import React, { useState } from 'react';
import { Variable, HazardLevel } from '../types';
import { MetricCard } from './MetricCard';
import { StatusBadge } from './StatusBadge';

interface Props {
  variable: Variable;
}

export const VariableCard: React.FC<Props> = ({ variable }) => {
  const [expanded, setExpanded] = useState(false);
  const [frameworkExpanded, setFrameworkExpanded] = useState(false);

  const primaryMetrics = variable.metrics.filter(m => !m.isSecondary);
  const secondaryMetrics = variable.metrics.filter(m => m.isSecondary);

  // Subtle border highlighting for Critical states
  const containerClasses = variable.hazardLevel === HazardLevel.Critical 
    ? "border-inst-danger/40 shadow-[0_0_15px_-5px_rgba(239,68,68,0.15)]" 
    : "border-inst-border";

  const polaritySymbol = 
    variable.polarity === 'positive' ? '(+)' :
    variable.polarity === 'negative' ? '(-)' :
    '(0)';

  // Trivium Colors mapped to Force badges
  const triviumColors: Record<string, string> = {
      Grammar: "text-blue-400 border-blue-800/30 bg-blue-900/10",
      Logic: "text-purple-400 border-purple-800/30 bg-purple-900/10",
      Rhetoric: "text-orange-400 border-orange-800/30 bg-orange-900/10"
  };

  return (
    <div className={`bg-inst-surface border ${containerClasses} rounded-md p-4 flex flex-col h-full transition-all duration-300`}>
      
      {/* Card Header */}
      <div className="flex justify-between items-start mb-3 pb-2 border-b border-inst-border">
        <div>
            <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-inst-text tracking-wide uppercase">{variable.name}</h3>
                <span className="text-xs font-mono text-inst-muted opacity-70" title={`Polarity: ${variable.polarity}`}>
                    {polaritySymbol}
                </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
                <p className="text-xs font-mono text-inst-muted">{variable.scientificName}</p>
                {/* Force Description Badge (What/How/Why) - Dominant Label */}
                <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-mono tracking-wider ${triviumColors[variable.conceptual.trivium] || 'text-gray-400'}`}>
                    {variable.conceptual.forceDescription}
                </span>
            </div>
        </div>
        <StatusBadge level={variable.hazardLevel} condition={variable.condition} />
      </div>
      
      {/* Summary Block - Academic Style */}
      <div className="mb-4 p-3 bg-inst-bg border-l-2 border-inst-muted rounded-r">
        <p className="text-sm text-inst-text font-serif leading-relaxed italic opacity-90">
          {variable.summary}
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 gap-3 mb-3 flex-grow">
        {primaryMetrics.map(m => (
          <MetricCard key={m.id} metric={m} />
        ))}
      </div>

      {/* Framework & Data Toggles */}
      <div className="mt-auto space-y-1">
          {/* 1. Framework Architecture Dropdown */}
          <div className="border border-inst-border rounded-sm overflow-hidden">
             <button 
                 onClick={() => setFrameworkExpanded(!frameworkExpanded)}
                 className="w-full bg-inst-bg/30 hover:bg-inst-bg text-[10px] font-mono uppercase tracking-wider text-inst-muted hover:text-inst-accent flex items-center justify-between px-3 py-2 transition-colors"
             >
                 <span className="flex items-center gap-2">
                     <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                     3B³ System Architecture
                 </span>
                 <span className={`transform transition-transform duration-300 ${frameworkExpanded ? 'rotate-180' : ''}`}>▼</span>
             </button>
             
             {frameworkExpanded && (
                 <div className="bg-inst-bg p-3 border-t border-inst-border animate-in slide-in-from-top-1">
                     <div className="mb-3">
                         <span className="block text-[9px] text-inst-muted uppercase tracking-widest mb-0.5">System Role</span>
                         <p className="text-xs font-medium text-inst-text font-sans">
                             <span className={triviumColors[variable.conceptual.trivium].split(' ')[0]}>{variable.conceptual.forceDescription}</span>
                             <span className="mx-1.5 text-inst-muted">/</span> 
                             {variable.conceptual.triviumRole}
                         </p>
                     </div>
                     <div>
                         <span className="block text-[9px] text-inst-muted uppercase tracking-widest mb-0.5">Earth System Analogy</span>
                         <p className="text-xs font-bold text-inst-text mb-1">{variable.conceptual.earthSystemAnalogy}</p>
                         <p className="text-[11px] leading-snug text-inst-muted font-serif italic">
                             "{variable.conceptual.analogyDescription}"
                         </p>
                     </div>
                 </div>
             )}
          </div>

          {/* 2. Data Expansion */}
          {secondaryMetrics.length > 0 && (
            <div className="border-t border-inst-border pt-1">
                <button 
                    onClick={() => setExpanded(!expanded)}
                    className="w-full text-[10px] font-mono uppercase tracking-widest text-inst-muted hover:text-inst-text flex items-center justify-center gap-2 py-2 transition-colors hover:bg-inst-bg/50 rounded-sm"
                >
                    <span>{expanded ? "Collapse Metrics" : "Expand Metrics"}</span>
                    <span className={`transform transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>▼</span>
                </button>
                
                {expanded && (
                    <div className="grid grid-cols-1 gap-3 pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        {secondaryMetrics.map(m => (
                            <MetricCard key={m.id} metric={m} />
                        ))}
                    </div>
                )}
            </div>
          )}
      </div>
    </div>
  );
};