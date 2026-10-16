"use client";

import React from "react";

const sentiments = [
  { id: "all", label: "All Sentiment" },
  { id: "bullish", label: "Bullish" },
  { id: "bearish", label: "Bearish" },
  { id: "neutral", label: "Neutral" },
];

const impactLevels = [
  { id: 0, label: "Any Impact" },
  { id: 70, label: "70+ Score" },
  { id: 85, label: "85+ High" },
];

export default function IntelligenceControls({
  query = "",
  onQueryChange,
  region = "all",
  onRegionChange,
  sentiment = "all",
  onSentimentChange,
  minImpact = 0,
  onMinImpactChange,
  regions = [],
}) {
  return (
    <div className="space-y-3 rounded-xl border border-border/70 bg-panel/75 p-4 backdrop-blur-xl shadow-lg select-none">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
          Signal Controls
        </div>
        {(query || region !== "all" || sentiment !== "all" || minImpact > 0) && (
          <button
            type="button"
            onClick={() => {
              onQueryChange?.("");
              onRegionChange?.("all");
              onSentimentChange?.("all");
              onMinImpactChange?.(0);
            }}
            className="text-[9px] font-mono text-info hover:underline uppercase tracking-wider"
          >
            Reset Filters
          </button>
        )}
      </div>

      <div className="relative">
        <input
          value={query}
          onChange={(e) => onQueryChange?.(e.target.value)}
          placeholder="Filter region, asset, headline..."
          aria-label="Filter intelligence signals"
          className="w-full rounded-lg border border-border/80 bg-background/70 px-3 py-1.5 text-xs text-foreground outline-none transition-colors placeholder:text-slate-500 focus:border-info focus:ring-1 focus:ring-info/40"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange?.("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-foreground text-xs"
            aria-label="Clear filter query"
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <select
          value={region}
          onChange={(e) => onRegionChange?.(e.target.value)}
          aria-label="Filter by region"
          className="rounded-lg border border-border/80 bg-background/70 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground outline-none focus:border-info transition-colors cursor-pointer"
        >
          <option value="all">All Regions</option>
          {regions.map((regionName) => (
            <option key={regionName} value={regionName}>
              {regionName}
            </option>
          ))}
        </select>

        <select
          value={sentiment}
          onChange={(e) => onSentimentChange?.(e.target.value)}
          aria-label="Filter by sentiment"
          className="rounded-lg border border-border/80 bg-background/70 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground outline-none focus:border-info transition-colors cursor-pointer"
        >
          {sentiments.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-1.5 pt-1">
        {impactLevels.map((option) => {
          const active = minImpact === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onMinImpactChange?.(option.id)}
              className={`rounded-full px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider transition-all outline-none focus-visible:ring-1 focus-visible:ring-info ${
                active
                  ? "bg-info text-white font-bold shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                  : "bg-background/60 text-slate-400 border border-border/70 hover:text-foreground hover:border-border"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
