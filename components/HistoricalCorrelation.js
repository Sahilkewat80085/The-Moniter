import React from "react";

export default function HistoricalCorrelation({ correlation }) {
  if (!correlation) return null;

  return (
    <div className="mt-10 border-t border-border pt-8 pb-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Historical Correlation Analysis</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground italic uppercase tracking-tight">
              {correlation.pastEvent}
            </span>
            <span className="px-1.5 py-0.5 bg-info/10 border border-info/30 rounded text-[9px] font-mono text-info">
              {correlation.similarity}% MATCH
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-mono text-slate-600 block uppercase">Intelligence Core</span>
          <span className="text-[10px] font-bold text-positive tracking-widest block uppercase whitespace-nowrap">● ALGORITHMIC MATCH</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {correlation.impacts.map((stock, idx) => (
          <div key={idx} className="bg-panel/50 border border-border p-4 rounded-lg flex flex-col gap-2 group hover:border-info/40 transition-all">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-info font-black text-xs tracking-widest">{stock.symbol}</span>
                <span className="text-[9px] text-slate-500 uppercase font-medium">{stock.name}</span>
              </div>
              <span className={`text-sm font-black ${stock.change.startsWith('+') ? 'text-positive' : 'text-negative'}`}>
                {stock.change}
              </span>
            </div>
            
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">{stock.period}</span>
              <div className="w-8 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${stock.change.startsWith('+') ? 'bg-positive' : 'bg-negative'}`} 
                  style={{ width: `${Math.min(Math.abs(parseFloat(stock.change)) * 3, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-info/5 border border-info/10 rounded-lg">
        <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
          <span className="text-info font-bold uppercase mr-2 tracking-wider">[ Analysts Note ]</span>
          Past performance exhibits an {correlation.similarity}% structural similarity to the current macroeconomic climate. 
          Historical data suggests a strong probability of directional convergence in the highlighted equities listed above over the next 30-180 days.
        </p>
      </div>
    </div>
  );
}
