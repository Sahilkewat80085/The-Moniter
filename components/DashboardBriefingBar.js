"use client";

import React from "react";

function toneCopy(sentiment) {
  if (sentiment === "bullish") return "Risk appetite is strengthening across the active feed.";
  if (sentiment === "bearish") return "Defensive positioning is dominating the active feed.";
  return "Cross-currents remain mixed with no clear dominant risk direction.";
}

export default function DashboardBriefingBar({
  dominantSentiment = "neutral",
  topRegion = "Global",
  topTheme = "Macro",
  highestImpactEvent = null,
  onOpenEvent,
}) {
  const focusHeadline = highestImpactEvent?.title || "Monitoring incoming market intelligence.";
  const isClickable = Boolean(highestImpactEvent && onOpenEvent);

  return (
    <div className="pointer-events-auto absolute top-4 left-4 right-4 z-20">
      <button
        type="button"
        onClick={() => {
          if (isClickable) onOpenEvent(highestImpactEvent);
        }}
        className={`w-full rounded-2xl border border-border bg-panel/80 p-4 text-left backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition-all ${
          isClickable ? "hover:border-info/45 hover:bg-panel/90" : ""
        }`}
      >
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-info animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
                Strategic Briefing
              </span>
            </div>
            {isClickable && (
              <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-info">
                Open Brief
              </span>
            )}
          </div>
          <h2 className="text-sm font-black uppercase tracking-[0.08em] text-foreground leading-tight">
            {focusHeadline}
          </h2>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-400 max-w-3xl">
            {toneCopy(dominantSentiment)} Current concentration is strongest in {topRegion}, with {topTheme}
            {" "}driving the heaviest attention.
          </p>
        </div>
      </button>
    </div>
  );
}
