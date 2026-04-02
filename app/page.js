"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { INITIAL_EVENTS } from "../lib/mockData";
import EventCard from "../components/EventCard";
import ImpactCard from "../components/ImpactCard";
import EventNewsBlog from "../components/EventNewsBlog";
import NewsFeed from "../components/NewsFeed";
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
  const [activeTab, setActiveTab] = useState("ALL");
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
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Live Intel Feed</h2>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-positive pulse-green"></span>
            <span className="text-[10px] font-bold text-positive tracking-widest">LIVE</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4 scrollbar-hide">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isActive={event.id === selectedEventId}
              onClick={handleCardClick}
            />
          ))}
        </div>

        <div className="p-4 border-t border-border bg-panel/50 text-[10px] text-slate-600 font-mono">
          Last synchronization: {syncTime} IND
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
          <div className="h-20 bg-gradient-to-b from-transparent to-[#0b0f14] pointer-events-none" />

          <div
            className="bg-[#0b0f14]/95 backdrop-blur-xl border-t border-border overflow-y-auto custom-scrollbar"
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
                          color: selectedEvent.sentiment === "bullish" ? "#00e676" : selectedEvent.sentiment === "bearish" ? "#ff1744" : "#ffc400",
                          borderColor: selectedEvent.sentiment === "bullish" ? "#00e67630" : selectedEvent.sentiment === "bearish" ? "#ff174430" : "#ffc40030",
                          background: selectedEvent.sentiment === "bullish" ? "#00e67610" : selectedEvent.sentiment === "bearish" ? "#ff174410" : "#ffc40010",
                        }}
                      >
                        {selectedEvent.sentiment?.toUpperCase()}
                      </span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-white tracking-tight leading-tight uppercase italic max-w-3xl">
                      {selectedEvent.title}
                    </h1>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={handleClose}
                    className="flex-shrink-0 ml-4 mt-1 w-8 h-8 rounded-full border border-border bg-panel/50 hover:border-slate-500 hover:bg-slate-800 transition-all flex items-center justify-center text-slate-500 hover:text-white"
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
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-4">
                  {selectedEvent.impacts.map((impact, idx) => (
                    <ImpactCard key={idx} impact={impact} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Right Panel: Markets + Filters + News ─────────────────────── */}
      <section className="w-[400px] border-l border-border flex flex-col bg-panel/40 backdrop-blur-xl flex-shrink-0">
        <div className="p-8 flex flex-col gap-10 overflow-y-auto custom-scrollbar h-full">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Source Intelligence</h2>
              <span className="text-[9px] font-mono text-positive tracking-widest">● VERIFIED</span>
            </div>
            <EventNewsBlog event={selectedEvent} />
          </div>

          <div className="intelligence-panel p-6 rounded-xl border border-border/50 bg-background/30">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 underline decoration-info/30 underline-offset-8">Scenario Filters</h2>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asset Class</label>
                <div className="flex flex-wrap gap-2">
                  {["ALL", "MACRO", "CRYPTO", "STOCKS", "FX"].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setActiveTab(tag)}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded transition-all border ${
                        activeTab === tag ? "bg-info text-white border-info" : "bg-slate-800/50 text-slate-500 border-border hover:border-slate-600"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security Level</label>
                <div className="h-1.5 w-full bg-slate-900 rounded-full border border-border">
                  <div className="h-full w-2/3 bg-warning rounded-full glow-warning shadow-[0_0_10px_rgba(245,197,66,0.3)]"></div>
                </div>
                <div className="flex justify-between text-[9px] font-mono text-slate-600">
                  <span>UNCLASSIFIED</span>
                  <span className="text-warning">LEVEL 3 - MODERATE</span>
                </div>
              </div>
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
