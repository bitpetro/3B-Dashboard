import React from 'react';
import { Metric } from '../types';
import { StatusBadge } from './StatusBadge';

interface Props {
  metric: Metric;
}

export const MetricCard: React.FC<Props> = ({ metric }) => {
  return (
    <div className="bg-slate-800/40 p-3 rounded border border-slate-700 flex flex-col justify-between hover:border-slate-600 transition-colors relative overflow-hidden group">
      <div className="flex justify-between items-start mb-2 relative z-10">
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{metric.name}</span>
        {metric.trend === 'intensifying' && <span className="text-red-400 text-[10px] animate-pulse">▲ INTENSIFYING</span>}
        {metric.trend === 'dissipating' && <span className="text-emerald-400 text-[10px]">▼ DISSIPATING</span>}
        {metric.trend === 'stable' && <span className="text-slate-500 text-[10px]">= STABLE</span>}
      </div>
      
      <div className="flex items-baseline gap-1 relative z-10">
        <span className="text-lg font-mono font-bold text-slate-200">{metric.value}</span>
        {metric.unit && <span className="text-[10px] text-slate-500 font-mono">{metric.unit}</span>}
      </div>
      
      <div className="mt-2 flex justify-between items-end relative z-10">
        <p className="text-[10px] text-slate-500 leading-tight max-w-[65%]">{metric.description}</p>
        <StatusBadge level={metric.hazardLevel} />
      </div>
    </div>
  );
};