import React from "react";
import ProbabilityBar from "./ProbabilityBar";

export default function ImpactCard({ impact }) {
  return (
    <div className="intelligence-card p-6 rounded-xl flex flex-col gap-6 scanline relative overflow-hidden">
      <div className="flex justify-between items-center border-b border-border pb-3">
        <h3 className="text-xl font-bold text-white tracking-widest uppercase">{impact.asset}</h3>
        <div className="flex gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[8px] text-slate-500 uppercase">Confidence</span>
            <span className="text-xs font-bold text-info">MEDIUM</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 flex flex-col gap-4">
          <ProbabilityBar title="Bullish" value={impact.bullish} colorClass="bg-positive" />
          <ProbabilityBar title="Bearish" value={impact.bearish} colorClass="bg-negative" />
          <ProbabilityBar title="Neutral" value={impact.neutral} colorClass="bg-warning" />
        </div>
        
        <div className="col-span-2 bg-background/50 p-4 rounded-lg border border-border/50">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-3">Intelligence Rationale</h4>
          <ul className="space-y-2">
            {impact.reasoning.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-info mt-1.5" />
                <p className="text-xs text-slate-400 leading-normal">{reason}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
