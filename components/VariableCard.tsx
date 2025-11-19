import React, { useState } from 'react';
import { Variable, HazardLevel } from '../types';
import { MetricCard } from './MetricCard';
import { StatusBadge } from './StatusBadge';

interface Props {
  variable: Variable;
}

export const VariableCard: React.FC<Props> = ({ variable }) => {
  const [expanded, setExpanded] = useState(false);

  const primaryMetrics = variable.metrics.filter(m => !m.isSecondary);
  const secondaryMetrics = variable.metrics.filter(m => m.isSecondary);

  // Dynamic border color based on hazard
  const borderColor = 
    variable.hazardLevel === HazardLevel.Critical ? 'border-red-900/50 shadow-red-900/10' :
    variable.hazardLevel === HazardLevel.Elevated ? 'border-amber-900/50 shadow-amber-900/10' :
    variable.hazardLevel === HazardLevel.Cataclysmic ? 'border-purple-900/80 shadow-purple-900/20' :
    'border-slate-800';

  // Polarity colors
  const polarityColor = 
    variable.polarity === 'positive' ? 'text-emerald-500' :
    variable.polarity === 'negative' ? 'text-red-500' :
    'text-slate-500';
  
  const polaritySymbol = 
    variable.polarity === 'positive' ? '(+)' :
    variable.polarity === 'negative' ? '(-)' :
    '(Ø)';

  return (
    <div className={`bg-slate-900/80 border ${borderColor} rounded-lg p-4 shadow-xl flex flex-col h-full backdrop-blur-sm transition-all duration-300`}>
      <div className="flex justify-between items-start mb-4 border-b border-slate-800/50 pb-3">
        <div>
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100 tracking-wide uppercase">{variable.name}</h3>
                <span className={`text-xs font-mono font-bold ${polarityColor} opacity-80`} title={`Polarity: ${variable.polarity}`}>
                    {polaritySymbol}
                </span>
            </div>
            <p className="text-[10px] font-mono text-orange-500/80 tracking-widest mt-1">{variable.scientificName}</p>
        </div>
        <StatusBadge level={variable.hazardLevel} condition={variable.condition} />
      </div>
      
      <div className="mb-4 bg-black/20 p-2 rounded border-l-2 border-slate-700">
        <p className="text-xs text-slate-400 italic font-mono leading-relaxed">
          "{variable.summary}"
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {primaryMetrics.map(m => (
          <MetricCard key={m.id} metric={m} />
        ))}
      </div>

      {secondaryMetrics.length > 0 && (
        <div className="mt-auto pt-3">
            <button 
                onClick={() => setExpanded(!expanded)}
                className="w-full group text-[9px] font-mono uppercase tracking-widest text-slate-600 hover:text-orange-400 flex items-center justify-center gap-2 py-2 border-t border-slate-800/50 transition-colors"
            >
                <span>{expanded ? "Close Sensor Array" : "Access Deep Sensors"}</span>
                <span className={`transform transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
                  ▼
                </span>
            </button>
            
            {expanded && (
                <div className="grid grid-cols-1 gap-2 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    {secondaryMetrics.map(m => (
                        <MetricCard key={m.id} metric={m} />
                    ))}
                </div>
            )}
        </div>
      )}
    </div>
  );
};