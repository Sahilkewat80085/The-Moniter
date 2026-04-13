"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { INITIAL_EVENTS } from "../lib/mockData";
import EventCard from "../components/EventCard";
import ImpactCard from "../components/ImpactCard";
import EventNewsBlog from "../components/EventNewsBlog";
import NewsFeed from "../components/NewsFeed";
import NotificationMarquee from "../components/NotificationMarquee";
import PerformanceToggle from "../components/PerformanceToggle";
import AIAnalysisPanel from "../components/AIAnalysisPanel";
import { useIntelligenceFeed } from "../hooks/useIntelligenceFeed";

// Dynamic import prevents Three.js from running during SSR
const GlobeView = dynamic(() => import("../components/GlobeView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
        <span className="text-[10px] font-mono text-slate-600 tracking-widest uppercase">Initializing Globe</span>
      </div>
    </div>
  ),
});

function getIndiaTime() {
  const now = new Date();
  const indiaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const hours = indiaTime.getHours().toString().padStart(2, "0");
  const minutes = indiaTime.getMinutes().toString().padStart(2, "0");
  const seconds = indiaTime.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export default function Dashboard() {
  const events = useIntelligenceFeed();
  // null = no event selected → full-globe default view
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [syncTime, setSyncTime] = useState("");

  useEffect(() => {
    setSyncTime(getIndiaTime());
    const interval = setInterval(() => {
      setSyncTime(getIndiaTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const selectedEvent = events.find(e => e.id === selectedEventId) || null;

  // Clicking a card selects it; clicking the active card dismisses it
  const handleCardClick = (ev) => {
    setSelectedEventId(prev => prev === ev.id ? null : ev.id);
  };

  const handleClose = () => setSelectedEventId(null);

  return (
    <div className="flex h-full w-full bg-background overflow-hidden">
      {/* ── Left Panel: Event Feed ─────────────────────────────────────── */}
      <section className="w-80 border-r border-border flex flex-col bg-panel/80 flex-shrink-0">
        <div className="p-4 border-b border-border flex justify-between items-center bg-panel/50 backdrop-blur-sm">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Notifications</h2>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-positive pulse-green"></span>
            <span className="text-[10px] font-bold text-positive tracking-widest">LIVE</span>
          </div>
        </div>
        
        {/* Animated Headline Marquee */}


        {/* Vertical Animated Headline Marquee */}
        <div className="flex-1 overflow-hidden px-4 py-4 flex flex-col">
          <NotificationMarquee 
            events={events} 
            onSelect={handleCardClick}
            selectedEventId={selectedEventId}
          />
        </div>

      </section>

      {/* ── Center Panel: Full Globe + optional event drawer ──────────── */}
      <section className="flex-1 flex flex-col relative overflow-hidden">

        {/* Globe fills 100% of this panel always */}
        <div className="absolute inset-0 z-0">
          <GlobeView
            events={events}
            selectedEventId={selectedEventId}
            onSelectEvent={(ev) => setSelectedEventId(ev.id)}
            height="100%"
          />
        </div>

        {/* ── Event Detail Drawer ────────────────────────────────────── */}
        {/* Slides up from bottom when an event is selected             */}
        <div
          className="absolute inset-x-0 bottom-0 z-20 transition-transform duration-500 ease-in-out"
          style={{
            transform: selectedEvent ? "translateY(0)" : "translateY(100%)",
          }}
        >
          {/* Fade gradient bridge so the panel blends into globe */}
          <div className="h-20 bg-gradient-to-b from-transparent to-background pointer-events-none" />

          <div
            className="bg-background/95 backdrop-blur-xl border-t border-border overflow-y-auto custom-scrollbar"
            style={{ maxHeight: "55vh" }}
          >
            {selectedEvent && (
              <div className="p-8">
                {/* Header row with event meta + close button */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-info/20 text-info text-[9px] font-bold rounded uppercase tracking-widest border border-info/30">
                        Event ID: {selectedEvent.id}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-500 text-[9px] font-bold rounded uppercase tracking-widest">
                        Region: {selectedEvent.region}
                      </span>
                      <span
                        className="px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-widest border"
                        style={{
                          color: selectedEvent.sentiment === "bullish" ? "var(--positive-color)" : selectedEvent.sentiment === "bearish" ? "var(--negative-color)" : "var(--warning-color)",
                          borderColor: selectedEvent.sentiment === "bullish" ? "color-mix(in srgb, var(--positive-color) 30%, transparent)" : selectedEvent.sentiment === "bearish" ? "color-mix(in srgb, var(--negative-color) 30%, transparent)" : "color-mix(in srgb, var(--warning-color) 30%, transparent)",
                          background: selectedEvent.sentiment === "bullish" ? "color-mix(in srgb, var(--positive-color) 10%, transparent)" : selectedEvent.sentiment === "bearish" ? "color-mix(in srgb, var(--negative-color) 10%, transparent)" : "color-mix(in srgb, var(--warning-color) 10%, transparent)",
                        }}
                      >
                        {selectedEvent.sentiment?.toUpperCase()}
                      </span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-foreground tracking-tight leading-tight uppercase italic max-w-3xl">
                      {selectedEvent.title}
                    </h1>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={handleClose}
                    className="flex-shrink-0 ml-4 mt-1 w-8 h-8 rounded-full border border-border bg-panel hover:border-slate-500 transition-all flex items-center justify-center text-slate-500 hover:text-foreground"
                    aria-label="Close event panel"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>

                {/* Description */}
                <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-4xl font-medium border-l-2 border-border pl-4">
                  {selectedEvent.description}
                </p>

                {/* Impact cards grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-6">
                  {selectedEvent.impacts.map((impact, idx) => (
                    <ImpactCard key={idx} impact={impact} />
                  ))}
                </div>

                {/* AI PRO ANALYSIS SECTION */}
                <div className="mt-8 pt-8 border-t border-white/5">
                  <AIAnalysisPanel event={selectedEvent} />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Right Panel: Markets + Filters + News ─────────────────────── */}
      <section className="w-[400px] border-l border-border flex flex-col bg-panel/40 backdrop-blur-xl flex-shrink-0">
        <div className="p-8 flex flex-col gap-10 overflow-y-auto custom-scrollbar h-full">
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Source Intelligence</h2>
              <span className="text-[9px] font-mono text-positive tracking-widest">● VERIFIED</span>
            </div>
            <div className="flex-1 min-h-0">
              <EventNewsBlog event={selectedEvent} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Financial News</h2>
              <span className="text-[9px] font-mono text-slate-600">SRC: GNEWS</span>
            </div>
            <NewsFeed />
          </div>
        </div>
      </section>
    </div>
  );
}
