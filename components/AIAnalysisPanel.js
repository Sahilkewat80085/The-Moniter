import React, { useState, useEffect } from 'react';

/**
 * AI Analysis Panel
 * Shows deep historical intelligence and market trends.
 */
export default function AIAnalysisPanel({ event }) {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!event) return;

    async function fetchAnalysis() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
        });
        
        if (!response.ok) throw new Error('Analysis failed');
        const data = await response.json();
        setAnalysis(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [event?.id]);

  if (!event) return null;

  if (loading) {
    return (
      <div className="bg-slate-900/40 border border-blue-500/20 rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px] backdrop-blur-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none" />
        
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
          <div className="absolute inset-2 bg-blue-500/30 rounded-full animate-pulse" />
          <div className="absolute inset-4 border-t-2 border-r-2 border-blue-400 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h3 className="text-blue-400 font-mono text-[10px] uppercase tracking-[0.3em] font-black">Neural Reasoning Active</h3>
          <div className="flex gap-1 h-3 items-end">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-1 bg-blue-500/40 rounded-full animate-neural-bar" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
          <p className="text-slate-500 text-[10px] font-mono mt-4 text-center">SCANNING HISTORICAL DATABASES FOR PARALLELS...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="p-8 border border-red-500/20 bg-red-500/5 rounded-xl text-center">
        <p className="text-red-400 font-mono text-xs uppercase italic">Analysis Link Error: Connection Failed</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Header with Confidence */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-foreground">AI Intelligence Analysis</h2>
        </div>
        <div className="flex items-center gap-3">
           <span className="text-[9px] font-mono text-slate-500 uppercase">Confidence</span>
           <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 rounded text-blue-400 font-mono text-[10px]">
              {analysis.confidence}%
           </div>
        </div>
      </div>

      {/* 2. Reasoning Text */}
      <div className="relative lg:col-span-2">
        <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/40 to-transparent" />
        <p className="text-slate-200 text-sm leading-relaxed font-normal italic pl-2">
          "{analysis.ai_reasoning}"
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-widest">Projection:</span>
          <span className="text-[10px] font-black text-slate-100 uppercase tracking-tight bg-slate-800 px-2 py-0.5 rounded border border-white/5">
            {analysis.market_projection}
          </span>
        </div>
      </div>

      {/* 3. Neural History Match (NEW SECTION) */}
      {analysis.deep_historical_match && (
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] scale-[4] rotate-12 pointer-events-none text-white font-black">
            HISTORY
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em]">Neural History Match</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7">
              <h4 className="text-sm font-extrabold text-white uppercase italic leading-tight mb-2">
                [{analysis.deep_historical_match.year}] {analysis.deep_historical_match.event_name}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-lg">
                {analysis.deep_historical_match.context}
              </p>
            </div>
            
            <div className="md:col-span-5 bg-black/40 rounded-lg p-4 border border-white/5">
              <div className="text-[9px] font-mono text-slate-500 uppercase mb-3 text-center">{analysis.deep_historical_match.then_vs_now.label} Comparison</div>
              <div className="flex justify-between items-center gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-[8px] text-slate-600 font-bold uppercase">Then</span>
                  <span className="text-xs font-black text-blue-400">{analysis.deep_historical_match.then_vs_now.then_metric}</span>
                </div>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500/20 via-blue-500 to-blue-500/20" />
                <div className="flex flex-col items-center">
                  <span className="text-[8px] text-slate-600 font-bold uppercase">Now</span>
                  <span className="text-xs font-black text-indigo-400">{analysis.deep_historical_match.then_vs_now.now_metric}</span>
                </div>
              </div>
              <div className="mt-3 text-[9px] text-center text-slate-500 font-medium italic">
                "{analysis.deep_historical_match.then_vs_now.narrative}"
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Other Historical Parallels */}
      <div>
        <div className="flex items-center gap-3 mb-4 opacity-60">
          <div className="h-[1px] flex-1 bg-border/50" />
          <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-2">Ancillary Correlations</h3>
          <div className="h-[1px] flex-1 bg-border/50" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.historical_parallels.map((parallel, i) => (
            <div 
              key={i} 
              className="group relative bg-panel/30 border border-border/60 rounded-xl p-5 hover:border-blue-500/40 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-blue-400/80 font-bold">HISTORICAL NODE</span>
                <span className="text-[9px] font-mono text-slate-600 uppercase">Year: {parallel.year}</span>
              </div>
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-tight mb-2">
                 {parallel.event}
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                {parallel.outcome}
              </p>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                 <span className="text-[8px] font-mono text-slate-600 uppercase">Performance</span>
                 <span className="text-[10px] font-black text-positive uppercase"> {parallel.market_trend} </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes neural-bar {
          0%, 100% { height: 4px; opacity: 0.3; }
          50% { height: 12px; opacity: 1; }
        }
        .animate-neural-bar {
          animation: neural-bar 1s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
