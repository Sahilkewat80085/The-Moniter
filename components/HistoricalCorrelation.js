import React from "react";

export default function HistoricalCorrelation({ correlation }) {
  if (!correlation) return null;

  const impacts = Array.isArray(correlation.impacts) ? correlation.impacts : [];

  return (
    <div className="mt-10 border-t border-border pt-8 pb-4 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
            Historical Correlation Analysis
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground italic uppercase tracking-tight">
              {correlation.pastEvent || "Macro Parallels Cycle"}
            </span>
            <span className="px-1.5 py-0.5 bg-info/10 border border-info/30 rounded text-[9px] font-mono text-info font-bold">
              {correlation.similarity ?? 80}% MATCH
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-wider">Intelligence Core</span>
          <span className="text-[10px] font-bold text-positive tracking-widest block uppercase whitespace-nowrap">
            ● ALGORITHMIC MATCH
          </span>
        </div>
      </div>

      {impacts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {impacts.map((stock, idx) => {
            const rawChange = String(stock.change || "0");
            const isPositive = rawChange.startsWith("+") || (!rawChange.startsWith("-") && parseFloat(rawChange) > 0);
            const numVal = Math.abs(parseFloat(rawChange.replace(/[^\d.-]/g, "")) || 0);
            const barWidth = Math.min(Math.max(numVal * 4, 10), 100);

            return (
              <div
                key={`${stock.symbol || idx}-${idx}`}
                className="bg-panel/50 border border-border p-4 rounded-lg flex flex-col gap-2 group hover:border-info/40 transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-info font-black text-xs tracking-widest">{stock.symbol}</span>
                    <span className="text-[9px] text-slate-400 uppercase font-medium">{stock.name}</span>
                  </div>
                  <span className={`text-sm font-black font-mono ${isPositive ? "text-positive" : "text-negative"}`}>
                    {rawChange}
                  </span>
                </div>
                
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                    {stock.period || "Historical Window"}
                  </span>
                  <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${isPositive ? "bg-positive" : "bg-negative"}`} 
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 p-4 bg-info/5 border border-info/10 rounded-lg">
        <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
          <span className="text-info font-bold uppercase mr-2 tracking-wider">[ Analysts Note ]</span>
          Past performance exhibits an {correlation.similarity ?? 80}% structural similarity to current macroeconomic signals.
          Algorithmic backtesting highlights potential directional convergence across corresponding equities over the next 30-180 days.
        </p>
      </div>
    </div>
  );
}
