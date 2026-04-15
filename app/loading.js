"use client";

import React, { useState, useEffect } from "react";

/**
 * Loading screen for The Monitor dashboard.
 * Includes a terminal-style boot sequence with easter eggs.
 */
export default function Loading() {
  const [messages, setMessages] = useState([
    "INITIALIZING MONITOR KERNEL...",
    "ESTABLISHING SECURE PROTOCOLS...",
  ]);
  const [progress, setProgress] = useState(0);

  const easternEggs = [
    "BYPASSING GLOBAL FIREWALLS...",
    "FETCHING TOP SECRET MARKET SIGNALS...",
    "DECRYPTING SATELLITE LINKS...",
    "CALCULATING GEOPOLITICAL BLUFFS...",
    "LOCATING ILLUMINATI... (FAILED, RETRYING)",
    "DEBUNKING CONSPIRACY THEORIES...",
    "OPTIMIZING FEAR & GREED INDEX...",
    "BRACING FOR IMPACT...",
    "SYNCHRONIZING ATOMIC CLOCKS...",
    "SCANNING FOR BLACK SWANS...",
  ];

  useEffect(() => {
    // Message sequence
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      if (msgIndex < easternEggs.length) {
        setMessages((prev) => [...prev, easternEggs[msgIndex]]);
        msgIndex++;
      } else {
        clearInterval(msgInterval);
      }
    }, 450);

    // Progress bar
    const progInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progInterval);
          return 100;
        }
        return prev + Math.random() * 5;
      });
    }, 200);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#05080a] flex flex-col items-center justify-center font-mono overflow-hidden">
      {/* Scanning Bar Overlay */}
      <div className="scanning-bar" />

      {/* Background Noise/Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <div className="w-full max-w-2xl px-6 flex flex-col gap-8 z-10 relative">
        {/* Central Logo/UI Element */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
            <div className="absolute inset-0 rounded-full border border-blue-500/50 flex items-center justify-center">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-500 rounded-sm animate-pulse" />
              </div>
            </div>
            {/* Compass-style marks */}
            {[0, 90, 180, 270].map((deg) => (
              <div
                key={deg}
                className="absolute w-1 h-3 bg-blue-500/50"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-40px)`,
                }}
              />
            ))}
          </div>
          
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-black tracking-[0.3em] text-white terminal-flicker">
              THE MONITOR
            </h1>
            <span className="text-[10px] text-blue-500/60 font-bold tracking-[0.5em] uppercase mt-1">
              Global Intelligence Node
            </span>
          </div>
        </div>

        {/* Terminal Boot Log */}
        <div className="bg-black/40 border border-white/5 rounded-lg p-5 h-48 overflow-y-auto custom-scrollbar flex flex-col gap-1 shadow-inner">
          {messages.map((msg, i) => (
            <div key={i} className="flex gap-3 text-[10px] items-center">
              <span className="text-blue-500/40">[{new Date().toLocaleTimeString()}]</span>
              <span className={i === messages.length - 1 ? "text-blue-400 animate-pulse" : "text-slate-500"}>
                {msg}
              </span>
            </div>
          ))}
          <div className="h-1 w-1 bg-blue-500 animate-pulse mt-1" />
        </div>

        {/* Tech Progress Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[9px] font-bold text-blue-500/50 tracking-widest uppercase">
            <span>System Initialization</span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
            <div 
              className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Bottom Footer Info */}
        <div className="flex justify-between items-center text-[8px] text-slate-700 tracking-widest uppercase font-bold">
          <div className="flex gap-4">
            <span>SECURE LINK: ESTABLISHED</span>
            <span>LATENCY: 12ms</span>
          </div>
          <span>v1.0.4-BETA</span>
        </div>
      </div>
    </div>
  );
}
