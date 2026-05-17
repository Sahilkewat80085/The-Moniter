"use client";

import React from "react";

/**
 * A professional, high-fidelity skeleton loader for The Monitor dashboard.
 * Mirrors the exact layout structure of page.js to eliminate layout shift,
 * and includes standard breathing animation combined with premium shimmer overlays.
 */
export default function Loading() {
  return (
    <div className="flex h-full w-full bg-background overflow-hidden select-none font-sans">
      {/* Inject custom high-end shimmer effect and scanning line */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes custom-shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .shimmer-bg {
          position: relative;
          overflow: hidden;
        }
        .shimmer-bg::after {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          transform: translateX(-100%);
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.05) 20%,
            rgba(255, 255, 255, 0.1) 60%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: custom-shimmer 2.5s infinite;
          content: '';
        }
        .dark .shimmer-bg::after {
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.03) 20%,
            rgba(255, 255, 255, 0.06) 60%,
            rgba(255, 255, 255, 0) 100%
          );
        }
      `}} />

      {/* Left Sidebar (Notifications) */}
      <section className="w-72 border-r border-border flex flex-col bg-panel/80 flex-shrink-0">
        {/* Header section matching page.js exactly */}
        <div className="px-3 py-4 border-b border-border flex justify-between items-center bg-panel/50 backdrop-blur-sm">
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
              Notifications
            </h2>
            <div className="mt-1 h-3 w-16 bg-slate-200 dark:bg-slate-800/80 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold text-blue-500 tracking-widest animate-pulse">SECURE</span>
          </div>
        </div>

        {/* List of Notification cards */}
        <div className="flex-1 overflow-hidden px-3 py-3 flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-3 border border-border/60 bg-panel/40 rounded-lg flex flex-col gap-2.5 animate-pulse shimmer-bg">
              <div className="flex justify-between items-center">
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800/80 rounded" />
                <div className="h-3 w-12 bg-slate-200 dark:bg-slate-800/60 rounded" />
              </div>
              <div className="h-4 w-full bg-slate-300/80 dark:bg-slate-800/90 rounded" />
              <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-800/60 rounded" />
              <div className="flex gap-2 mt-1">
                <div className="h-3.5 w-10 bg-slate-200/80 dark:bg-slate-800/70 rounded-sm" />
                <div className="h-3.5 w-14 bg-slate-200/80 dark:bg-slate-800/70 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Middle Section (Globe Area) */}
      <section className="flex-1 flex flex-col relative overflow-hidden bg-background">
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          {/* High-tech Radar Grid mapping style placeholder */}
          <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
            {/* Pulsing Outer Rings */}
            <div className="absolute inset-0 border border-blue-500/5 rounded-full animate-ping [animation-duration:3s]" />
            <div className="absolute w-5/6 h-5/6 border border-blue-500/10 rounded-full animate-pulse" />
            <div className="absolute w-4/6 h-4/6 border border-blue-500/15 border-dashed rounded-full" />
            <div className="absolute w-3/6 h-3/6 border border-blue-500/20 rounded-full" />
            <div className="absolute w-2/6 h-2/6 border border-blue-500/25 border-dashed rounded-full animate-pulse" />
            
            {/* Sweeping Radar Line */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-transparent to-blue-500/5 animate-spin [animation-duration:8s]" />

            {/* Center glowing node */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="w-9 h-9 rounded-full border border-blue-500/40 flex items-center justify-center bg-background/80 backdrop-blur-sm shadow-[0_0_20px_rgba(59,130,246,0.25)] animate-pulse">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping" />
              </div>
              <div className="mt-4 flex flex-col items-center">
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 tracking-[0.25em] uppercase font-bold animate-pulse">
                  ESTABLISHING SIGNAL...
                </span>
                <span className="text-[8px] font-mono text-slate-400 dark:text-slate-600 tracking-widest mt-1.5 uppercase font-medium">
                  NODE: MON-LOC-GLB
                </span>
              </div>
            </div>

            {/* Cyberpunk grid overlay lines */}
            <div className="absolute w-full h-[1px] bg-border/20 dark:bg-border/10" />
            <div className="absolute h-full w-[1px] bg-border/20 dark:bg-border/10" />
            
            {/* Diagonal lines */}
            <div className="absolute w-full h-[1px] bg-border/10 dark:bg-border/5 rotate-45" />
            <div className="absolute w-full h-[1px] bg-border/10 dark:bg-border/5 -rotate-45" />
          </div>
        </div>
      </section>

      {/* Right Sidebar (Source Intelligence and Financial News) */}
      <section className="w-[400px] border-l border-border flex flex-col bg-panel/40 backdrop-blur-xl flex-shrink-0">
        <div className="p-8 flex flex-col gap-10 overflow-hidden h-full">
          
          {/* Section 1: Source Intelligence */}
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                Source Intelligence
              </h2>
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            </div>
            
            {/* High-fidelity event/article blog skeleton */}
            <div className="flex-1 flex flex-col gap-5 p-5 border border-border/50 bg-panel/30 rounded-xl animate-pulse shimmer-bg">
              {/* Skeleton Image Panel */}
              <div className="w-full h-48 bg-slate-200 dark:bg-slate-800/80 rounded-lg flex items-center justify-center relative overflow-hidden">
                <svg className="w-12 h-12 text-slate-400/80 dark:text-slate-700/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              <div className="h-6 w-5/6 bg-slate-300 dark:bg-slate-800 rounded" />
              
              <div className="flex flex-col gap-2.5">
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-800/60 rounded" />
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-800/60 rounded" />
                <div className="h-3 w-4/5 bg-slate-200 dark:bg-slate-800/60 rounded" />
              </div>

              <div className="mt-auto pt-4 border-t border-border/40 flex justify-between items-center">
                <div className="h-4.5 w-24 bg-slate-200/80 dark:bg-slate-800/70 rounded" />
                <div className="h-4.5 w-16 bg-slate-200/80 dark:bg-slate-800/70 rounded" />
              </div>
            </div>
          </div>

          {/* Section 2: Financial News */}
          <div className="flex-shrink-0">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                Financial News
              </h2>
              <span className="text-[9px] font-mono text-slate-600 dark:text-slate-500">SRC: GNEWS</span>
            </div>
            
            {/* NewsFeed skeleton */}
            <div className="flex flex-col gap-3.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-3 border border-border/40 bg-panel/20 rounded-lg flex gap-3.5 items-center animate-pulse shimmer-bg">
                  {/* Small thumbnail skeleton */}
                  <div className="w-12 h-12 bg-slate-200/80 dark:bg-slate-800/80 rounded flex-shrink-0" />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="h-3.5 w-full bg-slate-300 dark:bg-slate-800 rounded" />
                    <div className="flex justify-between items-center">
                      <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800/60 rounded" />
                      <div className="h-3 w-12 bg-slate-200 dark:bg-slate-800/60 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}
