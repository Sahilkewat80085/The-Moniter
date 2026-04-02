import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function EventCard({ event, isActive, onClick }) {
  const sentimentColors = {
    bullish: "bg-positive",
    bearish: "bg-negative",
    neutral: "bg-warning"
  };

  return (
    <div 
      onClick={() => onClick(event)}
      className={cn(
        "p-4 intelligence-card rounded-lg cursor-pointer flex flex-col gap-2 relative overflow-hidden",
        isActive ? "border-info bg-panel" : "border-border"
      )}
    >
      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-info" />}
      
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-1.5">
          <div className={cn("w-2 h-2 rounded-full", sentimentColors[event.sentiment])} />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
            {event.timestamp} | {event.source}
          </span>
        </div>
      </div>

      <h3 className="text-sm font-semibold leading-snug text-slate-200 line-clamp-2 uppercase">
        {event.title}
      </h3>

    </div>
  );
}
