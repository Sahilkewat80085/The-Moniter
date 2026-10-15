"use client";

import React from "react";

/**
 * High-fidelity skeleton loader for The Monitor dashboard.
 * Mirrors the exact structural layout of page.js (including region pills and right panel tabs)
 * to completely eliminate layout shifts during initial load.
 */
export default function Loading() {
  return (
    <div className="flex h-full w-full bg-background overflow-hidden select-none font-sans">
      {/* Left Sidebar (Intel Feed & Region Filter Skeletons) */}
      <section className="w-72 border-r border-border flex flex-col bg-panel/80 flex-shrink-0 z-10">
        <div className="px-3 py-4 border-b border-border flex justify-between items-center bg-panel/50 backdrop-blur-sm">
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              Intel Feed
            </h2>
            <div className="mt-1 h-3 w-16 bg-slate-800/80 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold text-blue-500 tracking-widest animate-pulse">CONNECTING</span>
          </div>
        </div>

        {/* Region Filter Selector Skeleton matching page.js */}
        <div className="px-2 py-2 border-b border-border/60 bg-panel/20 flex gap-1 overflow-x-hidden">
          {["ALL", "ASIA", "N. AMER", "EUROPE", "MID EAST"].map((name, i) => (
            <div
              key={name}
              className={`px-2 py-0.5 text-[8px] font-mono rounded ${
                i === 0 ? "bg-info/30 text-white" : "bg-slate-800/40 text-slate-500"
              }`}
            >
              {name}
            </div>
          ))}
        </div>

        {/* List of Notification cards */}
        <div className="flex-1 overflow-hidden px-3 py-3 flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="p-3 border border-border/60 bg-panel/40 rounded-lg flex flex-col gap-2.5 animate-pulse"
            >
              <div className="flex justify-between items-center">
                <div className="h-2.5 w-16 bg-slate-700/60 rounded" />
                <div className="h-2.5 w-10 bg-slate-700/40 rounded" />
              </div>
              <div className="h-3.5 w-full bg-slate-700/80 rounded" />
              <div className="h-3 w-4/5 bg-slate-700/50 rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* Middle Section (3D Globe Area Skeleton) */}
      <section className="flex-1 flex flex-col relative overflow-hidden bg-background">
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
            {/* Pulsing Concentric Radar Rings */}
            <div className="absolute inset-0 border border-blue-500/10 rounded-full animate-ping [animation-duration:3s]" />
            <div className="absolute w-5/6 h-5/6 border border-blue-500/10 rounded-full animate-pulse" />
            <div className="absolute w-4/6 h-4/6 border border-blue-500/15 border-dashed rounded-full" />
            <div className="absolute w-3/6 h-3/6 border border-blue-500/20 rounded-full" />
            <div className="absolute w-2/6 h-2/6 border border-blue-500/25 border-dashed rounded-full animate-pulse" />
            
            {/* Sweeping Radar Arc */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-transparent to-blue-500/10 animate-spin [animation-duration:8s]" />

            {/* Center Node */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full border border-blue-500/40 flex items-center justify-center bg-background/80 backdrop-blur-sm shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping" />
              </div>
              <div className="mt-4 flex flex-col items-center">
                <span className="text-[10px] font-mono text-slate-400 tracking-[0.25em] uppercase font-bold animate-pulse">
                  ACQUIRING ORBITAL TELEMETRY...
                </span>
                <span className="text-[8px] font-mono text-slate-600 tracking-widest mt-1.5 uppercase font-medium">
                  NODE: MON-LOC-GLB · WGS84
                </span>
              </div>
            </div>

            {/* Matrix Crosshairs */}
            <div className="absolute w-full h-[1px] bg-border/20" />
            <div className="absolute h-full w-[1px] bg-border/20" />
          </div>
        </div>
      </section>

      {/* Right Sidebar (Source Intelligence & Financial News/Markets) */}
      <section className="w-[400px] border-l border-border flex flex-col bg-panel/40 backdrop-blur-xl flex-shrink-0 z-10">
        <div className="p-6 flex flex-col gap-8 overflow-hidden h-full">
          {/* Section 1: Source Intelligence */}
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Source Intelligence
              </h2>
              <div className="h-3 w-16 bg-slate-800 rounded animate-pulse" />
            </div>
            
            {/* Event Blog Card Skeleton */}
            <div className="flex-1 flex flex-col gap-4 p-5 border border-border/50 bg-panel/30 rounded-xl animate-pulse">
              <div className="w-full h-40 bg-slate-800/80 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="w-8 h-8 rounded-full border border-slate-700/50 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-600 animate-ping" />
                </div>
              </div>
              
              <div className="h-5 w-4/5 bg-slate-700/80 rounded" />
              
              <div className="flex flex-col gap-2">
                <div className="h-3 w-full bg-slate-800/60 rounded" />
                <div className="h-3 w-full bg-slate-800/60 rounded" />
                <div className="h-3 w-3/4 bg-slate-800/60 rounded" />
              </div>

              <div className="mt-auto pt-3 border-t border-border/40 flex justify-between items-center">
                <div className="h-3.5 w-20 bg-slate-800/70 rounded" />
                <div className="h-3.5 w-14 bg-slate-800/70 rounded" />
              </div>
            </div>
          </div>

          {/* Section 2: Financial News / Market Matrix Tabs Skeleton */}
          <div className="flex-shrink-0">
            <div className="flex justify-between items-center mb-3">
              <div className="flex gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-info border-b border-info pb-0.5">
                  Headlines
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">
                  Core Markets
                </span>
              </div>
              <span className="text-[9px] font-mono text-slate-600">SRC: LIVE OSINT</span>
            </div>
            
            {/* NewsFeed skeleton */}
            <div className="flex flex-col gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="p-3 border border-border/40 bg-panel/20 rounded-lg flex flex-col gap-2 animate-pulse"
                >
                  <div className="flex justify-between items-center">
                    <div className="h-2.5 w-16 bg-slate-700/60 rounded" />
                    <div className="h-2.5 w-10 bg-slate-700/40 rounded" />
                  </div>
                  <div className="h-3.5 w-full bg-slate-700/80 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
