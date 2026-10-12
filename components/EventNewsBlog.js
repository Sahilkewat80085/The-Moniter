"use client";

import React, { useState, useEffect } from "react";

export default function EventNewsBlog({ event }) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [event?.id]);

  if (!event) {
    return (
      <div className="p-6 rounded-xl border border-dashed border-border/50 flex flex-col items-center justify-center text-center h-full min-h-[300px] bg-panel/20">
        <div className="w-10 h-10 rounded-full bg-slate-800/40 border border-slate-700/60 flex items-center justify-center mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <p className="text-[11px] text-slate-300 font-bold uppercase tracking-[0.15em] mb-2">Awaiting Event Selection</p>
        <p className="text-[10px] text-slate-500 font-mono leading-relaxed max-w-[220px]">
          Select an event node from the globe or notification stream to view primary verification intel.
        </p>
      </div>
    );
  }

  const sentimentColors = {
    bullish: "text-positive border-positive/30 bg-positive/10",
    bearish: "text-negative border-negative/30 bg-negative/10",
    neutral: "text-warning border-warning/30 bg-warning/10"
  };

  const hasValidImage = event.image && !imageFailed;

  return (
    <div className="flex flex-col border border-border/70 rounded-xl bg-panel/30 overflow-hidden group hover:border-info/40 transition-all duration-300 h-full min-h-[350px]">
      {/* Blog Image/Banner */}
      <div className="w-full h-40 bg-slate-950 border-b border-border/50 relative overflow-hidden flex items-center justify-center">
        {hasValidImage ? (
          <img 
            src={event.image} 
            alt={event.title} 
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover grayscale-[0.15] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-500/20 z-0">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </>
        )}
        
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/95 to-transparent z-10" />

        {/* Tags */}
        <div className="absolute bottom-3 left-4 z-20 flex flex-wrap gap-1.5 max-w-[90%]">
          {event.tags?.map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-black/70 backdrop-blur-md rounded text-[9px] font-bold text-slate-300 border border-white/10 uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Article Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-info animate-pulse" />
            <span className="text-[10px] font-bold text-info uppercase tracking-[0.15em]">{event.source}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">{event.timestamp}</span>
        </div>
        
        <h3 className="text-sm font-extrabold text-slate-100 leading-tight">
          {event.title}
        </h3>
        
        <div className="text-xs text-slate-400 leading-relaxed line-clamp-3 font-medium">
          {event.description}
        </div>
        
        <div className="mt-auto pt-2">
          {event.url ? (
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-info/90 hover:text-info font-bold tracking-wider uppercase inline-flex items-center gap-1.5 transition-colors"
            >
              Read full report 
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          ) : (
            <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
              Internal OSINT Dispatch
            </span>
          )}
        </div>
      </div>
      
      {/* Article Footer */}
      <div className="px-5 py-3 border-t border-border/50 bg-slate-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 text-[8px] font-bold rounded uppercase tracking-widest border ${sentimentColors[event.sentiment] || sentimentColors.neutral}`}>
            SIGNAL: {event.sentiment}
          </span>
          {event.impactScore && (
            <span className="px-1.5 py-0.5 text-[8px] font-mono rounded bg-slate-800 text-slate-400 border border-border">
              SCORE: {event.impactScore}
            </span>
          )}
        </div>
        <span className="text-[9px] font-mono text-positive tracking-widest flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-positive inline-block" />
          VERIFIED
        </span>
      </div>
    </div>
  );
}
