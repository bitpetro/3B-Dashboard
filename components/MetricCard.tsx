import React from 'react';
import { Metric } from '../types';
import { StatusBadge } from './StatusBadge';

interface Props {
  metric: Metric;
}

export const MetricCard: React.FC<Props> = ({ metric }) => {
  // Color logic for values
  const valueColor = metric.hazardLevel === 'Critical' ? 'text-inst-danger' : 'text-inst-text';
  
  return (
    <div className="bg-inst-surface border border-inst-border p-3 rounded-sm flex flex-col justify-between hover:border-inst-accent/50 transition-colors group">
      
      {/* Header: Name and Trend */}
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-inst-muted uppercase tracking-wide">{metric.name}</span>
        {metric.trend === 'intensifying' && <span className="text-inst-accent text-xs font-mono">↑ RISING</span>}
        {metric.trend === 'dissipating' && <span className="text-inst-success text-xs font-mono">↓ EASING</span>}
        {metric.trend === 'stable' && <span className="text-inst-muted text-xs font-mono">= STEADY</span>}
      </div>
      
      {/* Main Value */}
      <div className="flex items-baseline gap-2 mb-1">
        <span className={`text-2xl font-mono font-bold ${valueColor} tracking-tight`}>{metric.value}</span>
        {metric.unit && <span className="text-sm text-inst-muted font-mono">{metric.unit}</span>}
      </div>
      
      {/* Description */}
      <div className="mb-2 min-h-[2.5em]">
        <p className="text-xs text-inst-muted leading-normal">{metric.description}</p>
      </div>

      {/* Footer: Verification */}
      <div className="border-t border-inst-border pt-2 mt-auto">
        {metric.sources && metric.sources.length > 0 ? (
           <div className="flex flex-wrap gap-1 items-center">
              <span className="text-[10px] text-inst-muted uppercase font-mono mr-1">Src:</span>
              {metric.sources.map((source, idx) => (
                <span key={idx} className="text-[10px] font-mono text-inst-text bg-inst-bg px-1.5 py-0.5 rounded border border-inst-border whitespace-nowrap">
                  {source}
                </span>
              ))}
           </div>
        ) : (
          <span className="text-[10px] text-inst-border font-mono uppercase">Unverified</span>
        )}
      </div>
    </div>
  );
};