"use client";

import React, { useState } from "react";

/**
 * NotificationMarquee.js
 * 
 * A specialized marquee component for the Notifications panel header.
 * Scrolling through headlines with a professional intelligence aesthetic.
 */
export default function NotificationMarquee({ events }) {
  const [isPaused, setIsPaused] = useState(false);

  if (!events || events.length === 0) return null;

  // Duplicate events to create a seamless loop
  const items = [...events, ...events];

  const sentimentToColor = (sentiment) => {
    switch (sentiment) {
      case "bullish": return "var(--positive-color)";
      case "bearish": return "var(--negative-color)";
      case "neutral": return "var(--warning-color)";
      default: return "var(--info-color)";
    }
  };

  return (
    <div 
      className="w-full flex-1 overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        className={`flex flex-col w-full will-change-transform ${isPaused ? "paused" : ""}`}
        style={{
          animation: "tickerScrollVertical 120s linear infinite",
          display: "flex",
          height: "max-content",
        }}
      >
        {items.map((event, index) => (
          <div 
            key={`${event.id}-${index}`}
            className="p-3 mb-4 intelligence-card rounded-lg border border-border/60 bg-panel/30 transition-all flex flex-col gap-1.5 mx-0.5"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.3)]"
                  style={{ backgroundColor: sentimentToColor(event.sentiment) }}
                />
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tight">
                  {event.timestamp || "RECENT"} | {event.source || event.region}
                </span>
              </div>
              <span className="text-[8px] font-mono text-slate-600">ID:{event.id}</span>
            </div>
            
            <h4 className="text-[11px] font-bold text-slate-200 leading-snug uppercase tracking-tight line-clamp-2 italic">
              {event.title}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
}
