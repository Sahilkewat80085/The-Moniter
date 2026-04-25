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
  return (
    <div className="pointer-events-auto absolute left-4 right-4 bottom-4 z-20">
      <div className="rounded-2xl border border-border bg-panel/80 p-4 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
              Timeline Playback
            </div>
            <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-200 truncate">
              {activeEvent?.title || "Slide the timeline to reveal events progressively"}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onTogglePlaying}
              className="rounded-full border border-info/40 bg-info/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-info"
            >
              {playing ? "Pause" : "Play"}
            </button>
            <span className="text-[10px] font-mono tracking-[0.16em] text-slate-500">
              {current}/{total || 0}
            </span>
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={Math.max(total, 0)}
          value={current}
          onChange={(e) => onScrub(Number(e.target.value))}
          className="mt-3 h-2 w-full cursor-pointer accent-sky-400"
        />
      </div>
    </div>
  );
}
