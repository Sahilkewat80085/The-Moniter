"use client";

import React, { useMemo } from "react";

const sentimentDotColors = {
  bullish: "bg-positive shadow-[0_0_10px_rgba(34,197,94,0.7)] border-emerald-400",
  bearish: "bg-negative shadow-[0_0_10px_rgba(239,68,68,0.7)] border-rose-400",
  neutral: "bg-warning shadow-[0_0_10px_rgba(217,119,6,0.7)] border-amber-400",
};

export default function MapView({ events = [], selectedEventId = null, onSelectEvent }) {
  const safeEvents = useMemo(() => {
    return Array.isArray(events) ? events : [];
  }, [events]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-background flex items-center justify-center select-none">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>
      
      {/* Simplified Vector Equirectangular Projection */}
      <svg 
        viewBox="0 0 1000 500" 
        className="w-[92%] h-auto opacity-30 grayscale contrast-125 pointer-events-none"
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.2"
      >
        {/* Lat/Lon Grid lines */}
        <line x1="0" y1="250" x2="1000" y2="250" strokeDasharray="4 4" className="text-slate-600" />
        <line x1="500" y1="0" x2="500" y2="500" strokeDasharray="4 4" className="text-slate-600" />
        
        {/* Simplified Global Landmass Contours */}
        {/* North America */}
        <path d="M120,80 Q200,60 260,110 T300,190 T220,250 T160,200 Z" className="text-info/40" />
        {/* South America */}
        <path d="M260,260 Q340,280 320,380 T260,460 T230,360 Z" className="text-info/40" />
        {/* Europe & Africa */}
        <path d="M460,90 Q540,80 560,140 T480,180 Z" className="text-info/40" />
        <path d="M460,190 Q560,180 560,320 T480,420 T440,280 Z" className="text-info/40" />
        {/* Asia */}
        <path d="M570,80 Q780,60 840,160 T760,280 T600,220 Z" className="text-info/40" />
        {/* Australia */}
        <path d="M760,340 Q860,330 840,420 T750,410 Z" className="text-info/40" />
      </svg>

      {/* Plotting events as interactive glowing markers */}
      {safeEvents.map((ev) => {
        const coords = ev.coordinates || [0, 0];
        const lat = coords[0] || 0;
        const lon = coords[1] || 0;

        // Spherical/Mercator projection mapping to percentage space
        const x = ((lon + 180) / 360) * 100;
        const y = ((90 - lat) / 180) * 100;
        const isActive = ev.id === selectedEventId;

        const colorClass = sentimentDotColors[ev.sentiment] || "bg-info shadow-[0_0_10px_rgba(59,130,246,0.8)] border-sky-400";

        return (
          <button
            key={ev.id}
            type="button"
            onClick={() => onSelectEvent?.(ev)}
            title={`${ev.title} (${ev.region || "Global"})`}
            aria-label={`Select event: ${ev.title}`}
            className={`absolute w-3 h-3 rounded-full border transition-all duration-300 outline-none -translate-x-1/2 -translate-y-1/2 cursor-pointer ${colorClass} ${
              isActive ? "scale-150 ring-2 ring-white z-20 animate-pulse" : "hover:scale-125 z-10 opacity-80 hover:opacity-100"
            }`}
            style={{ 
              left: `${Math.min(Math.max(x, 2), 98)}%`, 
              top: `${Math.min(Math.max(y, 4), 96)}%` 
            }}
          />
        );
      })}

      <div className="absolute bottom-4 right-4 bg-panel/85 border border-border px-3 py-1.5 rounded-lg text-[9px] font-mono text-slate-400 uppercase tracking-widest backdrop-blur-md">
        CRS: EPSG:4326 · WGS84
      </div>
    </div>
  );
}
