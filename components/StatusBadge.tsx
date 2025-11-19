import React from 'react';
import { HazardLevel } from '../types';

interface Props {
  level: HazardLevel;
  condition?: string;
}

export const StatusBadge: React.FC<Props> = ({ level, condition }) => {
  const styles = {
    [HazardLevel.Nominal]: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    [HazardLevel.Elevated]: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    [HazardLevel.Critical]: "bg-red-500/10 text-red-400 border-red-500/30",
    [HazardLevel.Cataclysmic]: "bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)] animate-pulse",
  };

  return (
    <div className="flex flex-col items-end">
      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${styles[level]} uppercase tracking-wider mb-1`}>
        {level}
      </span>
      {condition && (
        <span className="text-[10px] font-bold font-mono text-slate-300 uppercase tracking-tight">
          [{condition}]
        </span>
      )}
    </div>
  );
};