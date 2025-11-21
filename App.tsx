
import React, { useState } from 'react';
import { BodyType, StakeholderView } from './types';
import { getInitialData } from './services/mockData';
import { VariableCard } from './components/VariableCard';
import { GeospatialMap } from './components/GeospatialMap';
import { MonteCarloChart } from './components/MonteCarloChart';
import { GeminiAnalysis } from './components/GeminiAnalysis';
import { generateStrategicDispatch, GeminiResponse } from './services/geminiService';

const App: React.FC = () => {
  const [data] = useState(getInitialData());
  const [view, setView] = useState<'dashboard' | 'map'>('dashboard');
  
  // Lifted State for Report Persistence
  const [analysis, setAnalysis] = useState<GeminiResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (stakeholderView: StakeholderView) => {
    setIsAnalyzing(true);
    // Clear previous analysis to show loading state clearly if needed, or keep it for smooth transition
    // setAnalysis(null); 
    const result = await generateStrategicDispatch(data, stakeholderView);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-inst-bg text-inst-text font-sans pb-20 selection:bg-inst-accent/30">
      {/* Institutional Header */}
      <header className="border-b border-inst-border bg-inst-surface sticky top-0 z-30 shadow-lg shadow-black/50">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tighter text-inst-text leading-none flex items-center gap-2">
                3B³ FRAMEWORK
                <span className="text-[9px] px-1.5 py-0.5 bg-inst-danger/10 text-inst-danger border border-inst-danger/30 rounded font-mono tracking-wider">COUNCIL-LOCKED</span>
              </h1>
              <span className="text-[10px] font-mono text-inst-muted tracking-[0.25em] uppercase mt-1.5">System v1.0 // Nov 20 2025</span>
            </div>
            <div className="h-8 w-px bg-inst-border mx-2 hidden md:block"></div>
            <div className="text-[10px] font-mono text-inst-accent px-2 py-1 border border-inst-accent/20 rounded bg-inst-accent/5 hidden md:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-inst-accent animate-pulse"></span>
              SCENARIO: LIVE
            </div>
          </div>
          
          <nav className="flex gap-1 bg-inst-bg p-1 rounded border border-inst-border">
            <button 
              onClick={() => setView('dashboard')}
              className={`px-4 py-1.5 rounded-sm text-[11px] font-mono uppercase tracking-wide transition-all ${view === 'dashboard' ? 'bg-inst-surface text-inst-text border border-inst-border shadow-sm font-bold' : 'text-inst-muted hover:text-inst-text opacity-70 hover:opacity-100'}`}
            >
              Matrix
            </button>
            <button 
              onClick={() => setView('map')}
              className={`px-4 py-1.5 rounded-sm text-[11px] font-mono uppercase tracking-wide transition-all ${view === 'map' ? 'bg-inst-surface text-inst-text border border-inst-border shadow-sm font-bold' : 'text-inst-muted hover:text-inst-text opacity-70 hover:opacity-100'}`}
            >
              GIS (Map)
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-4 lg:px-6 mt-6 pb-12">
        
        {/* Data Ticker / Status */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-inst-border pb-4">
          <div className="flex items-center gap-6 text-[11px] font-mono">
             <div className="bg-inst-surface px-3 py-1 rounded border border-inst-border flex items-center gap-2">
               <span className="text-inst-muted">TIMESTAMP:</span>
               <span className="text-inst-cyan font-bold">{data.timestamp.replace('T', ' ')}</span>
             </div>
             <div className="hidden sm:block opacity-60">
               <span className="text-inst-muted mr-2">EPOCH:</span>
               <span className="text-inst-text">Post-Tariff / Cycle 5</span>
             </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-inst-muted uppercase tracking-widest">Exploitation Level:</span>
            <span className="text-[10px] font-bold bg-inst-accent/10 text-inst-accent px-3 py-1 rounded border border-inst-accent/30 uppercase tracking-widest shadow-[0_0_10px_-3px_rgba(245,158,11,0.3)] flex items-center gap-2">
               <span className="w-2 h-2 bg-inst-accent rounded-full animate-pulse"></span>
               HIGH
            </span>
          </div>
        </div>

        {view === 'dashboard' ? (
          <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
            
            {/* THE 3x3 GRID MATRIX */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* COLUMN 1: PROTOCOL BODY */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-inst-border pb-2">
                        <h2 className="text-sm font-bold text-inst-text uppercase tracking-[0.2em]">Protocol Body</h2>
                        <span className="text-[10px] font-mono text-inst-muted">GEOSPHERE</span>
                    </div>
                    <div className="flex flex-col gap-4 h-full">
                        {data.bodies[BodyType.Protocol].map(v => <VariableCard key={v.id} variable={v} />)}
                    </div>
                </div>

                {/* COLUMN 2: PRICE BODY */}
                 <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-inst-border pb-2">
                        <h2 className="text-sm font-bold text-inst-text uppercase tracking-[0.2em]">Price Body</h2>
                        <span className="text-[10px] font-mono text-inst-muted">ATMOSPHERE</span>
                    </div>
                    <div className="flex flex-col gap-4 h-full">
                        {data.bodies[BodyType.Price].map(v => <VariableCard key={v.id} variable={v} />)}
                    </div>
                </div>

                {/* COLUMN 3: ENVIRONMENT BODY */}
                 <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-inst-border pb-2">
                        <h2 className="text-sm font-bold text-inst-text uppercase tracking-[0.2em]">Environment Body</h2>
                        <span className="text-[10px] font-mono text-inst-muted">BIOSPHERE</span>
                    </div>
                    <div className="flex flex-col gap-4 h-full">
                        {data.bodies[BodyType.Environment].map(v => <VariableCard key={v.id} variable={v} />)}
                    </div>
                </div>
            </div>
            
            <GeminiAnalysis 
              data={data} 
              analysis={analysis}
              loading={isAnalyzing}
              onAnalyze={handleAnalyze}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-in fade-in duration-300">
             {/* Left: Map and Report */}
             <div className="xl:col-span-7 flex flex-col gap-6">
                <GeospatialMap data={data} />
                
                {/* Report persistent here */}
                <div className="w-full">
                    <GeminiAnalysis 
                       data={data} 
                       analysis={analysis}
                       loading={isAnalyzing}
                       onAnalyze={handleAnalyze}
                    />
                </div>
             </div>

             {/* Right: Simulation */}
             <div className="xl:col-span-5 flex flex-col gap-6">
                <div className="h-[400px]">
                  <MonteCarloChart data={data.simulation} />
                </div>
                
                <div className="p-5 bg-inst-surface border border-inst-border rounded-md">
                    <h4 className="text-xs font-bold text-inst-text uppercase tracking-widest border-b border-inst-border pb-2 mb-3">Simulation Parameters</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="block text-[10px] text-inst-muted uppercase">Drift (μ)</span>
                            <span className="font-mono text-sm text-inst-cyan">0.26 (Adoption)</span>
                        </div>
                        <div>
                            <span className="block text-[10px] text-inst-muted uppercase">Volatility (σ)</span>
                            <span className="font-mono text-sm text-inst-cyan">0.65 (Regime)</span>
                        </div>
                        <div>
                            <span className="block text-[10px] text-inst-muted uppercase">Scenario Date</span>
                            <span className="font-mono text-sm text-inst-text">Nov 2025</span>
                        </div>
                        <div>
                            <span className="block text-[10px] text-inst-muted uppercase">Model</span>
                            <span className="font-mono text-sm text-inst-text">Stochastic GBM</span>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
