"use client";

import React from "react";

export default function TimelineControls({
  total = 0,
  current = 0,
  playing = false,
  onTogglePlaying,
  onScrub,
  activeEvent = null,
}) {
  const safeTotal = Math.max(total, 1);
  const safeCurrent = Math.min(Math.max(current, 0), safeTotal);

  return (
    <div className="pointer-events-auto absolute left-4 right-4 bottom-4 z-20 select-none">
      <div className="rounded-xl border border-border/70 bg-panel/85 p-4 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-info animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                Temporal Chronology
              </span>
              {activeEvent?.timestamp && (
                <span className="text-[9px] font-mono text-slate-500">
                  [{activeEvent.timestamp}]
                </span>
              )}
            </div>
            <div className="mt-1 text-xs font-bold uppercase italic tracking-tight text-foreground truncate">
              {activeEvent?.title || "Slide timeline to scrub chronological event sequence"}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Step backward */}
            <button
              type="button"
              disabled={safeCurrent <= 1}
              onClick={() => onScrub?.(Math.max(safeCurrent - 1, 1))}
              className="p-1.5 rounded-lg border border-border bg-panel hover:bg-panel/80 disabled:opacity-30 disabled:cursor-not-allowed text-slate-400 hover:text-foreground transition-all"
              aria-label="Previous event"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="19 20 9 12 19 4 19 20" />
                <line x1="5" y1="19" x2="5" y2="5" />
              </svg>
            </button>

            {/* Play/Pause toggle */}
            <button
              type="button"
              onClick={onTogglePlaying}
              className="rounded-full border border-info/40 bg-info/15 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-info hover:bg-info/25 active:scale-95 transition-all flex items-center gap-1.5"
              aria-label={playing ? "Pause timeline playback" : "Start timeline playback"}
            >
              {playing ? (
                <>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>Play</span>
                </>
              )}
            </button>

            {/* Step forward */}
            <button
              type="button"
              disabled={safeCurrent >= safeTotal}
              onClick={() => onScrub?.(Math.min(safeCurrent + 1, safeTotal))}
              className="p-1.5 rounded-lg border border-border bg-panel hover:bg-panel/80 disabled:opacity-30 disabled:cursor-not-allowed text-slate-400 hover:text-foreground transition-all"
              aria-label="Next event"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="5 4 15 12 5 20 5 4" />
                <line x1="19" y1="5" x2="19" y2="19" />
              </svg>
            </button>

            <span className="text-[10px] font-mono tracking-wider text-slate-400 tabular-nums">
              {safeCurrent}/{safeTotal}
            </span>
          </div>
        </div>

        <input
          type="range"
          min={1}
          max={safeTotal}
          value={safeCurrent}
          aria-label="Timeline scrubber"
          aria-valuenow={safeCurrent}
          aria-valuemin={1}
          aria-valuemax={safeTotal}
          onChange={(e) => onScrub?.(Number(e.target.value))}
          className="mt-3 h-1.5 w-full cursor-pointer accent-sky-400 bg-slate-800 rounded-lg outline-none focus-visible:ring-1 focus-visible:ring-info"
        />
      </div>
    </div>
  );
}
