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
      className="w-full bg-panel/30 border-b border-border py-1.5 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        className={`flex items-center whitespace-nowrap will-change-transform ${isPaused ? "paused" : ""}`}
        style={{
          animation: "tickerScroll 60s linear infinite",
          display: "flex",
          width: "max-content",
        }}
      >
        {items.map((event, index) => (
          <div 
            key={`${event.id}-${index}`}
            className="flex items-center px-6"
          >
            <span 
              className="w-1.5 h-1.5 rounded-full mr-3 shadow-[0_0_8px_rgba(0,0,0,0.5)]"
              style={{ backgroundColor: sentimentToColor(event.sentiment) }}
            />
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-2">
              [{event.region}]
            </span>
            <span className="text-[11px] font-semibold text-foreground tracking-tight uppercase italic">
              {event.title}
            </span>
            <span className="mx-6 text-slate-800 dark:text-slate-700 font-black tracking-[0.3em]">///</span>
          </div>
        ))}
      </div>
    </div>
  );
}
