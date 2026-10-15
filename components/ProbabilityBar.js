import React from "react";

export default function ProbabilityBar({ title, value = 0, colorClass = "bg-info" }) {
  const numericValue = Math.min(Math.max(Number(value) || 0, 0), 100);

  return (
    <div 
      className="flex flex-col gap-1 w-full"
      role="progressbar"
      aria-label={`${title} probability`}
      aria-valuenow={numericValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="flex justify-between text-[10px] font-mono font-bold">
        <span className="text-slate-500 uppercase tracking-wider">{title}</span>
        <span className="text-slate-300 tabular-nums">{numericValue}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden border border-white/5">
        <div 
          className={`h-full ${colorClass} transition-all duration-500 rounded-full`} 
          style={{ width: `${numericValue}%` }}
        />
      </div>
    </div>
  );
}
