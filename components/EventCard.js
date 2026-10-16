import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const sentimentGlow = {
  bullish: "bg-positive shadow-[0_0_8px_rgba(34,197,94,0.5)]",
  bearish: "bg-negative shadow-[0_0_8px_rgba(239,68,68,0.5)]",
  neutral: "bg-warning shadow-[0_0_8px_rgba(217,119,6,0.5)]",
};

export default function EventCard({ event, isActive, onClick }) {
  if (!event) return null;

  return (
    <div 
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(event)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(event);
        }
      }}
      className={cn(
        "p-4 intelligence-card rounded-lg cursor-pointer flex flex-col gap-2 relative overflow-hidden transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-info",
        isActive 
          ? "border-info bg-panel/90 shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
          : "border-border/70 hover:border-info/40 bg-panel/30"
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-info shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
      )}
      
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", sentimentGlow[event.sentiment] || "bg-info")} />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tight">
            {event.timestamp || "RECENT"} | {event.source || "OSINT"}
          </span>
        </div>
        {event.region && (
          <span className="text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-white/5">
            {event.region}
          </span>
        )}
      </div>

      <h3 className="text-xs font-bold leading-snug text-foreground line-clamp-2 uppercase italic tracking-tight">
        {event.title}
      </h3>

      {event.impactScore && (
        <div className="mt-1 flex items-center justify-between text-[8px] font-mono text-slate-500">
          <span>IMPACT INDEX</span>
          <span className="font-bold text-info tabular-nums">{event.impactScore}/100</span>
        </div>
      )}
    </div>
  );
}
