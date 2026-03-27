import React from "react";

export default function ProbabilityBar({ title, value, colorClass }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between text-[10px] font-mono font-bold">
        <span className="text-slate-500 uppercase">{title}</span>
        <span className="text-slate-300">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClass} transition-all duration-500`} 
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
