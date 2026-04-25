"use client";

import React from "react";

function toneCopy(sentiment) {
  if (sentiment === "bullish") return "Risk appetite is strengthening across the active feed.";
  if (sentiment === "bearish") return "Defensive positioning is dominating the active feed.";
  return "Cross-currents remain mixed with no clear dominant risk direction.";
}

export default function DashboardBriefingBar({
  totalEvents = 0,
  visibleEvents = 0,
  dominantSentiment = "neutral",
  topRegion = "Global",
  topTheme = "Macro",
  highestImpactEvent = null,
}) {
  const sentimentTone = dominantSentiment.toUpperCase();
  const focusHeadline = highestImpactEvent?.title || "Monitoring incoming market intelligence.";

  return (
    <div className="pointer-events-auto absolute top-4 left-4 right-4 z-20">
      <div className="rounded-2xl border border-border bg-panel/80 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
        <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[1.8fr_1fr]">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-info animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
                Strategic Briefing
              </span>
            </div>
            <h2 className="text-sm font-black uppercase tracking-[0.08em] text-foreground leading-tight">
              {focusHeadline}
            </h2>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-400 max-w-3xl">
              {toneCopy(dominantSentiment)} Current concentration is strongest in {topRegion}, with {topTheme}
              {" "}driving the heaviest attention.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Active Feed", value: `${visibleEvents}/${totalEvents}` },
              { label: "Bias", value: sentimentTone },
              { label: "Hot Region", value: topRegion },
              { label: "Lead Theme", value: topTheme },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/5 bg-background/40 px-3 py-2">
                <div className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-600">
                  {item.label}
                </div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.06em] text-slate-200">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
