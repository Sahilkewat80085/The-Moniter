"use client";

import React from "react";

function toneCopy(sentiment) {
  if (sentiment === "bullish") return "Risk appetite is strengthening across active global nodes.";
  if (sentiment === "bearish") return "Defensive positioning is dominating active capital allocations.";
  return "Cross-currents remain balanced with selective sector momentum.";
}

export default function DashboardBriefingBar({
  dominantSentiment = "neutral",
  topRegion = "Global",
  topTheme = "Macro",
  highestImpactEvent = null,
  onOpenEvent,
}) {
  const focusHeadline = highestImpactEvent?.title || "Monitoring incoming market intelligence nodes...";
  const isClickable = Boolean(highestImpactEvent && onOpenEvent);

  const sentimentColors = {
    bullish: "text-positive border-positive/30 bg-positive/10",
    bearish: "text-negative border-negative/30 bg-negative/10",
    neutral: "text-warning border-warning/30 bg-warning/10",
  };

  return (
    <div className="pointer-events-auto absolute top-4 left-4 right-4 z-20 select-none">
      <button
        type="button"
        disabled={!isClickable}
        onClick={() => {
          if (isClickable) onOpenEvent(highestImpactEvent);
        }}
        className={`w-full rounded-xl border border-border/80 bg-panel/85 p-4 text-left backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.3)] transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-info ${
          isClickable ? "hover:border-info/50 hover:bg-panel cursor-pointer" : "cursor-default"
        }`}
      >
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-info animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                Strategic Briefing
              </span>
              <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${sentimentColors[dominantSentiment] || sentimentColors.neutral}`}>
                {dominantSentiment}
              </span>
            </div>
            {isClickable && (
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-info flex items-center gap-1">
                Open Brief
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            )}
          </div>
          <h2 className="text-sm font-black uppercase italic tracking-tight text-foreground leading-snug line-clamp-2">
            {focusHeadline}
          </h2>
          <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400 max-w-3xl font-medium">
            {toneCopy(dominantSentiment)} Current concentration is strongest in{" "}
            <span className="text-slate-200 font-bold">{topRegion}</span>, with{" "}
            <span className="text-info font-bold">{topTheme}</span> driving primary impact flows.
          </p>
        </div>
      </button>
    </div>
  );
}
