import React from "react";

export default function EventNewsBlog({ event }) {
  if (!event) {
    return (
      <div className="p-6 rounded-xl border border-dashed border-border/50 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
        <div className="w-10 h-10 rounded-full bg-slate-800/30 border border-slate-700/50 flex items-center justify-center mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.15em] mb-2">Awaiting Event Selection</p>
        <p className="text-[10px] text-slate-600 font-mono leading-relaxed max-w-[200px]">
          Select an event from the live feed to view the primary intelligence source and verification report.
        </p>
      </div>
    );
  }

  // Map sentiment to colored badge for the article header
  const sentimentColors = {
    bullish: "text-positive border-positive/30 bg-positive/10",
    bearish: "text-negative border-negative/30 bg-negative/10",
    neutral: "text-warning border-warning/30 bg-warning/10"
  };

  return (
    <div className="flex flex-col border border-border/70 rounded-xl bg-background/40 overflow-hidden group hover:border-info/30 transition-colors h-full min-h-[350px]">
      {/* Blog Image/Banner Placeholder */}
      <div className="w-full h-36 bg-slate-900 border-b border-border/50 relative overflow-hidden flex items-center justify-center">
        {/* Abstract pattern */}
        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/90 to-transparent z-10" />
        
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-500/10 z-0">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>

        {/* Tags */}
        <div className="absolute bottom-3 left-4 z-20 flex gap-2">
          {event.tags?.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-sm text-[9px] font-bold text-slate-300 border border-white/10 uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Article Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-info/80 animate-pulse" />
            <span className="text-[10px] font-bold text-info uppercase tracking-[0.15em]">{event.source}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">{event.timestamp}</span>
        </div>
        
        <h3 className="text-sm font-extrabold text-slate-200 leading-tight">
          {event.title}
        </h3>
        
        <div className="text-xs text-slate-400 leading-relaxed line-clamp-3 font-medium">
          {event.description}
        </div>
        
        <div className="mt-2 text-[10px] text-info/80 hover:text-info cursor-pointer font-bold tracking-wider uppercase inline-flex items-center gap-1 w-max">
          Read full report 
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
      
      {/* Article Footer */}
      <div className="px-5 py-3 border-t border-border/50 bg-slate-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 text-[8px] font-bold rounded uppercase tracking-widest border ${sentimentColors[event.sentiment] || sentimentColors.neutral}`}>
            SIGNAL: {event.sentiment}
          </span>
        </div>
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
          Auth Verified
        </span>
      </div>
    </div>
  );
}
