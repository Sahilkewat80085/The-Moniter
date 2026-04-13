"use client";

import React, { useState, useEffect } from "react";

/**
 * PerformanceToggle.js
 * 
 * Manages "Cinematic" (Quality) vs "Speed" (Performance) modes.
 * Persists user preference via cookies as requested.
 */
export default function PerformanceToggle() {
  const [isHighPerf, setIsHighPerf] = useState(false);

  // Sync with cookie on mount
  useEffect(() => {
    const savedMode = document.cookie
      .split("; ")
      .find((row) => row.startsWith("perf_mode="))
      ?.split("=")[1];
    
    if (savedMode === "high") {
      setIsHighPerf(true);
      document.documentElement.classList.add("perf-mode-high");
    }
  }, []);

  const toggleMode = () => {
    const nextMode = !isHighPerf;
    setIsHighPerf(nextMode);
    
    // Set cookie (valid for 30 days)
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    document.cookie = `perf_mode=${nextMode ? "high" : "quality"}; expires=${expiry.toUTCString()}; path=/`;
    
    if (nextMode) {
      document.documentElement.classList.add("perf-mode-high");
    } else {
      document.documentElement.classList.remove("perf-mode-high");
    }

    // Force a reload or notify system (in this app, components will listen to the class or window event)
    window.dispatchEvent(new Event("performance-mode-change"));
  };

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-border bg-panel/50 backdrop-blur-sm">
      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
        {isHighPerf ? "Perf Mode: ON" : "Quality Mode"}
      </span>
      <button
        onClick={toggleMode}
        className={`w-8 h-4 rounded-full relative transition-all duration-300 ${
          isHighPerf ? "bg-positive" : "bg-slate-700"
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
            isHighPerf ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
      {isHighPerf && (
        <span className="text-[9px] font-mono text-positive animate-pulse">GPU OPTIMIZED</span>
      )}
    </div>
  );
}
