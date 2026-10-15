import React from "react";
import ProbabilityBar from "./ProbabilityBar";

export default function ImpactCard({ impact }) {
  if (!impact) return null;

  const reasoning = Array.isArray(impact.reasoning) ? impact.reasoning : [];
  
  // Dynamic confidence estimation from sentiment spread
  const maxPolarity = Math.max(impact.bullish || 0, impact.bearish || 0);
  const confidenceLevel = maxPolarity >= 70 ? "HIGH" : maxPolarity >= 50 ? "MEDIUM" : "BALANCED";

  return (
    <div className="intelligence-card p-5 rounded-xl flex flex-col gap-5 relative overflow-hidden border border-border/70 bg-panel/40 backdrop-blur-sm">
      <div className="flex justify-between items-center border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-info shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          <h3 className="text-lg font-black text-foreground tracking-wider uppercase italic">
            {impact.asset || "Global Asset Node"}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-mono text-slate-500 uppercase">Impact Assessment</span>
            <span className={`text-[10px] font-black font-mono tracking-widest ${
              confidenceLevel === "HIGH" ? "text-positive" : "text-info"
            }`}>
              {confidenceLevel}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 flex flex-col justify-center gap-3 bg-panel/30 p-3.5 rounded-lg border border-border/40">
          <ProbabilityBar title="Bullish" value={impact.bullish} colorClass="bg-positive" />
          <ProbabilityBar title="Bearish" value={impact.bearish} colorClass="bg-negative" />
          <ProbabilityBar title="Neutral" value={impact.neutral} colorClass="bg-warning" />
        </div>
        
        <div className="col-span-2 bg-background/50 p-4 rounded-lg border border-border/50 flex flex-col justify-center">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-info" />
            Intelligence Rationale
          </h4>
          {reasoning.length > 0 ? (
            <ul className="space-y-1.5">
              {reasoning.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-info/70 mt-1.5 flex-shrink-0" />
                  <p className="text-xs text-slate-300 dark:text-slate-400 leading-relaxed font-normal">
                    {reason}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">No automated rationale recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
}
