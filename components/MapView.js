import React from "react";

export default function MapView({ events, selectedEventId }) {
  // A simple stylized SVG map for the "Intelligence" look
  // In a real app, use Leaflet or Mapbox
  return (
    <div className="w-full h-full relative overflow-hidden bg-background flex items-center justify-center">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(#1f2a36_1px,transparent_1px)] [background-size:30px_30px]"></div>
      </div>
      
      <svg 
        viewBox="0 0 1000 500" 
        className="w-[90%] h-auto opacity-40 grayscale contrast-150"
        fill="none" 
        stroke="#1f2a36" 
        strokeWidth="1"
      >
        {/* Very simplified world outline */}
        <path d="M150,150 Q200,100 300,150 T450,200 T600,150 T800,200 T900,250 L900,450 Q700,400 500,450 T200,400 Z" />
        <path d="M400,300 Q450,250 550,300 T700,350 T850,300" />
      </svg>

      {/* Plotting events as glowing dots */}
      {events.map((ev) => {
        // Mock mapping of coordinates to SVG space
        const x = ((ev.coordinates[1] + 180) / 360) * 1000;
        const y = ((90 - ev.coordinates[0]) / 180) * 500;
        const isActive = ev.id === selectedEventId;

        return (
          <div 
            key={ev.id}
            className={`absolute w-3 h-3 rounded-full border border-white/20 transition-all duration-500 cursor-pointer
              ${isActive ? "scale-150 bg-info pulse-blue shadow-[0_0_15px_#3b82f6]" : "bg-white/40 hover:bg-white/60"}
            `}
            style={{ 
              left: `${(x/1000)*100}%`, 
              top: `${(y/500)*100}%` 
            }}
          />
        );
      })}

      <div className="absolute bottom-4 right-4 bg-panel/80 border border-border p-2 rounded text-[8px] font-mono text-slate-500 uppercase">
        Coordinate System: WGS84
      </div>
    </div>
  );
}
