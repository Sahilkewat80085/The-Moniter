"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

/**
 * NotificationMarquee.js
 * 
 * High-performance vertical intelligence feed with buttery smooth autoscroll,
 * hover-to-pause, and keyboard accessibility.
 */
export default function NotificationMarquee({ events = [], onSelect, selectedEventId }) {
  const containerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef(null);

  // Memoize duplicated event list to avoid re-allocating on every render
  const items = useMemo(() => {
    if (!events || events.length === 0) return [];
    return [...events, ...events];
  }, [events]);

  const sentimentToColor = (sentiment) => {
    switch (sentiment) {
      case "bullish": return "var(--positive-color)";
      case "bearish": return "var(--negative-color)";
      case "neutral": return "var(--warning-color)";
      default: return "var(--info-color)";
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || items.length === 0) return;

    let lastTime = performance.now();

    const scroll = (now) => {
      const delta = now - lastTime;
      lastTime = now;

      if (!isPaused && delta > 0) {
        // Frame-rate independent speed: approx 30 pixels per second
        const step = (30 * delta) / 1000;
        container.scrollTop += step;

        // Loop seamlessly halfway down the duplicated list
        if (container.scrollTop >= container.scrollHeight / 2) {
          container.scrollTop = 0;
        }
      }
      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, items.length]);

  if (items.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-500 font-mono text-[10px]">
        No notifications active
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-full overflow-y-auto custom-scrollbar relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      tabIndex={0}
      aria-label="Real-time event notification stream"
    >
      <div className="flex flex-col w-full py-2">
        {items.map((event, index) => {
          const isActive = event.id === selectedEventId;
          return (
            <div 
              key={`${event.id}-${index}`}
              role="button"
              tabIndex={0}
              onClick={() => onSelect && onSelect(event)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect && onSelect(event);
                }
              }}
              className={`p-3 mb-3 intelligence-card rounded-lg border transition-all duration-200 flex flex-col gap-1.5 mx-0.5 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-info ${
                isActive 
                  ? "border-info bg-panel/80 shadow-[0_0_15px_rgba(59,130,246,0.25)] translate-x-0.5" 
                  : "border-border/60 bg-panel/30 hover:border-info/40 hover:bg-panel/50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.4)]"
                    style={{ backgroundColor: sentimentToColor(event.sentiment) }}
                  />
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-tight">
                    {event.timestamp || "RECENT"} | {event.source || event.region}
                  </span>
                </div>
                <span className="text-[8px] font-mono text-slate-500">ID:{event.id?.slice(0, 8)}</span>
              </div>
              
              <h4 className="text-[11px] font-bold text-slate-200 leading-snug uppercase tracking-tight line-clamp-2 italic">
                {event.title}
              </h4>
            </div>
          );
        })}
      </div>
    </div>
  );
}
