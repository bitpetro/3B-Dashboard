import React, { useState } from 'react';
import { BodyType } from './types';
import { getInitialData } from './services/mockData';
import { VariableCard } from './components/VariableCard';
import { GeospatialMap } from './components/GeospatialMap';
import { MonteCarloChart } from './components/MonteCarloChart';
import { GeminiAnalysis } from './components/GeminiAnalysis';

const App: React.FC = () => {
  const [data] = useState(getInitialData());
  const [view, setView] = useState<'dashboard' | 'map'>('dashboard');

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-orange-500 selection:text-white pb-12">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-700 rounded transform rotate-45 shadow-lg shadow-orange-900/20"></div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-100">THE REBELLION'S LEDGER</h1>
              <p className="text-[10px] font-mono text-orange-500 tracking-widest uppercase">3B³ Operational Dashboard</p>
            </div>
          </div>
          
          <nav className="flex gap-4">
            <button 
              onClick={() => setView('dashboard')}
              className={`px-3 py-1 rounded text-sm font-mono transition-colors ${view === 'dashboard' ? 'bg-gray-800 text-orange-400 border border-orange-500/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              [ DASHBOARD ]
            </button>
            <button 
              onClick={() => setView('map')}
              className={`px-3 py-1 rounded text-sm font-mono transition-colors ${view === 'map' ? 'bg-gray-800 text-orange-400 border border-orange-500/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              [ GLOBAL WEATHER ]
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Status Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 bg-gray-900 p-4 rounded border border-gray-800">
          <div className="flex items-center gap-4">
             <span className="text-xs font-mono text-gray-500">SNAPSHOT:</span>
             <span className="text-sm font-mono font-bold text-gray-200">{data.timestamp}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-gray-500">GLOBAL STATUS:</span>
            <span className="text-xs font-bold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">COEXISTENCE BY CONSTRAINT</span>
          </div>
        </div>

        {view === 'dashboard' ? (
          <div className="space-y-8">
            {/* Protocol Body */}
            <section>
              <h2 className="text-sm font-mono text-gray-500 mb-4 border-b border-gray-800 pb-2 uppercase tracking-wider">01 // Protocol Body</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.bodies[BodyType.Protocol].map(v => <VariableCard key={v.id} variable={v} />)}
              </div>
            </section>

            {/* Price Body */}
            <section>
              <h2 className="text-sm font-mono text-gray-500 mb-4 border-b border-gray-800 pb-2 uppercase tracking-wider">02 // Price Body</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.bodies[BodyType.Price].map(v => <VariableCard key={v.id} variable={v} />)}
              </div>
            </section>

            {/* Environment Body */}
            <section>
              <h2 className="text-sm font-mono text-gray-500 mb-4 border-b border-gray-800 pb-2 uppercase tracking-wider">03 // Environment Body</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.bodies[BodyType.Environment].map(v => <VariableCard key={v.id} variable={v} />)}
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Unified Geospatial Weather Map */}
            <GeospatialMap data={data} />

            {/* Probabilistic Models */}
            <MonteCarloChart data={data.simulation} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-gray-500">
              <div className="p-4 bg-gray-900 rounded border border-gray-800">
                <strong className="text-orange-500 block mb-1">PROTOCOL FORTRESS</strong>
                Deep foundation. Immutable. Resilient to external shocks but slow to adapt.
              </div>
              <div className="p-4 bg-gray-900 rounded border border-gray-800">
                <strong className="text-amber-500 block mb-1">PRICE ATMOSPHERE</strong>
                Volatile. Driven by Macro Jet Streams (Liquidity) and Derivative Storms.
              </div>
              <div className="p-4 bg-gray-900 rounded border border-gray-800">
                <strong className="text-emerald-500 block mb-1">ENVIRONMENT</strong>
                Physical ground. Energy arbitrage acting as a Load Dam for the grid.
              </div>
            </div>
          </div>
        )}

        {/* AI Analysis Section */}
        <GeminiAnalysis data={data} />

      </main>
    </div>
  );
};

export default App;