import React, { useState } from 'react';
import { FrameworkData } from '../types';
import { generateStrategicDispatch } from '../services/geminiService';

interface Props {
  data: FrameworkData;
}

export const GeminiAnalysis: React.FC<Props> = ({ data }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await generateStrategicDispatch(data);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="bg-slate-900 border border-orange-500/30 rounded-lg p-6 mt-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-900 via-orange-500 to-orange-900 opacity-50"></div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-mono font-bold text-orange-400 flex items-center gap-2">
          <span className="text-2xl">⌬</span> STRATEGIC DISPATCH
        </h2>
        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white font-mono text-sm px-4 py-2 rounded transition-colors disabled:opacity-50"
        >
          {loading ? "DECRYPTING SIGNAL..." : "GENERATE DISPATCH"}
        </button>
      </div>

      {analysis ? (
        <div className="prose prose-invert max-w-none font-mono text-sm leading-relaxed bg-black/30 p-4 rounded border border-orange-500/10 shadow-inner">
          <pre className="whitespace-pre-wrap font-sans text-slate-300">{analysis}</pre>
        </div>
      ) : (
        <div className="text-center py-8 text-slate-600 font-mono text-xs">
          AWAITING INPUT FROM 3B³ ORACLE...
        </div>
      )}
    </div>
  );
};
