import React from 'react';
import { HazardLevel } from '../types';

interface Props {
  level: HazardLevel;
  condition?: string;
}

export const StatusBadge: React.FC<Props> = ({ level, condition }) => {
  const styles = {
    [HazardLevel.Nominal]: "text-emerald-400 border-emerald-800/50 bg-emerald-900/10",
    [HazardLevel.Elevated]: "text-amber-400 border-amber-800/50 bg-amber-900/10",
    [HazardLevel.Critical]: "text-red-400 border-red-800/50 bg-red-900/10",
    [HazardLevel.Cataclysmic]: "text-purple-400 border-purple-800/50 bg-purple-900/10",
  };

  return (
    <div className="flex flex-col items-end">
      <div className={`px-2 py-1 rounded-sm border ${styles[level]} flex items-center gap-2`}>
        <div className={`w-1.5 h-1.5 rounded-full ${level === HazardLevel.Nominal ? 'bg-emerald-500' : level === HazardLevel.Critical ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`}></div>
        <span className="text-[10px] font-mono font-medium uppercase tracking-widest">
          {level}
        </span>
      </div>
      {condition && (
        <span className="text-[10px] font-mono text-inst-muted uppercase tracking-tight mt-1">
          Condition: {condition}
        </span>
      )}
    </div>
  );
};