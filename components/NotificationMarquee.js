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
      className="w-full bg-panel/80 backdrop-blur-md border-b border-border py-2.5 overflow-hidden shadow-sm"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        className={`flex items-center whitespace-nowrap will-change-transform ${isPaused ? "paused" : ""}`}
        style={{
          animation: "tickerScroll 180s linear infinite",
          display: "flex",
          width: "max-content",
        }}
      >
        {items.map((event, index) => (
          <div 
            key={`${event.id}-${index}`}
            className="flex flex-col justify-center px-10 border-r border-border/30 last:border-r-0"
          >
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                style={{ backgroundColor: sentimentToColor(event.sentiment) }}
              />
              <span className="text-[9px] font-black text-info uppercase tracking-[0.2em]">
                {event.region}
              </span>
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                ID: {event.id}
              </span>
            </div>
            
            <div className="text-[12px] font-bold text-foreground tracking-tight uppercase italic flex items-center gap-3">
              <span>{event.title}</span>
              <span className="text-slate-800 dark:text-slate-700 font-black tracking-[0.3em] opacity-30">///</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
