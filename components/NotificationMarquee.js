"use client";

import React, { useState, useEffect, useRef } from "react";

/**
 * NotificationMarquee.js
 * 
 * A specialized marquee component for the Notifications panel.
 * It automatically crawls vertically but allows for manual mouse scrolling.
 */
export default function NotificationMarquee({ events, onSelect, selectedEventId }) {
  const containerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef(null);

  // Duplicate events to create a seamless loop
  const items = events && events.length > 0 ? [...events, ...events] : [];

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

    const scroll = () => {
      // Only auto-scroll if not hovered
      if (!isPaused) {
        container.scrollTop += 0.5; // Smooth slow crawl
        
        // Loop back to top once we pass the first set of items
        // We use scrollHeight / 2 because we duplicated the items
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

  if (items.length === 0) return null;

  return (
    <div 
      ref={containerRef}
      className="w-full h-full overflow-y-auto custom-scrollbar relative group scroll-smooth"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex flex-col w-full py-2">
        {items.map((event, index) => {
          const isActive = event.id === selectedEventId;
          return (
            <div 
              key={`${event.id}-${index}`}
              onClick={() => onSelect && onSelect(event)}
              className={`p-3 mb-4 intelligence-card rounded-lg border transition-all flex flex-col gap-1.5 mx-0.5 cursor-pointer hover:border-info/50 ${
                isActive 
                  ? "border-info bg-panel/60 shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                  : "border-border/60 bg-panel/30"
              }`}
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
          );
        })}
      </div>
    </div>
  );
}
