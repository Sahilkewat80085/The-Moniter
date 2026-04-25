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
  { id: 70, label: "70+" },
  { id: 85, label: "85+" },
];

export default function IntelligenceControls({
  query,
  onQueryChange,
  region,
  onRegionChange,
  sentiment,
  onSentimentChange,
  minImpact,
  onMinImpactChange,
  regions = [],
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-border bg-panel/60 p-4 backdrop-blur-xl">
      <div className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
        Signal Filters
      </div>

      <input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search region, asset, topic..."
        className="w-full rounded-xl border border-border bg-background/60 px-3 py-2 text-[12px] text-slate-200 outline-none transition-colors placeholder:text-slate-600 focus:border-info/50"
      />

      <div className="grid grid-cols-2 gap-2">
        <select
          value={region}
          onChange={(e) => onRegionChange(e.target.value)}
          className="rounded-xl border border-border bg-background/60 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-200 outline-none"
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
          onChange={(e) => onSentimentChange(e.target.value)}
          className="rounded-xl border border-border bg-background/60 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-200 outline-none"
        >
          {sentiments.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        {impactLevels.map((option) => {
          const active = minImpact === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onMinImpactChange(option.id)}
              className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] transition-colors ${
                active
                  ? "bg-info/20 text-info border border-info/40"
                  : "bg-background/50 text-slate-500 border border-border"
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
