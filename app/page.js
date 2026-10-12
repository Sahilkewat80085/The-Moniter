"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import EventNewsBlog from "../components/EventNewsBlog";
import NewsFeed from "../components/NewsFeed";
import NotificationMarquee from "../components/NotificationMarquee";
import AIAnalysisPanel from "../components/AIAnalysisPanel";
import HistoricalCorrelation from "../components/HistoricalCorrelation";
import MarketTicker from "../components/MarketTicker";
import { useIntelligenceFeed } from "../hooks/useIntelligenceFeed";

const GlobeView = dynamic(() => import("../components/GlobeView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
        <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">
          Initializing 3D Matrix
        </span>
      </div>
    </div>
  ),
});

const istTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function parseEventTime(event, fallbackIndex = 0) {
  const parsed = Date.parse(event?.publishedAt || "");
  if (!Number.isNaN(parsed)) return parsed;
  return Date.now() - fallbackIndex * 60000;
}

const REGION_FILTERS = ["ALL", "ASIA", "NORTH AMERICA", "EUROPE", "MIDDLE EAST"];

export default function Dashboard() {
  const { events, articles, articlesLoading } = useIntelligenceFeed();
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState("ALL");
  const [rightPanelTab, setRightPanelTab] = useState("news"); // 'news' | 'markets'
  const [syncTime, setSyncTime] = useState("--:--:--");
  const [showGlobe, setShowGlobe] = useState(false);

  useEffect(() => {
    const updateClock = () => setSyncTime(istTimeFormatter.format(new Date()));
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const revealGlobe = () => {
      if (!cancelled) {
        setShowGlobe(true);
      }
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(revealGlobe, { timeout: 1200 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    const timeoutId = window.setTimeout(revealGlobe, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => parseEventTime(b, 0) - parseEventTime(a, 0));
  }, [events]);

  const visibleEvents = useMemo(() => {
    if (selectedRegion === "ALL") return sortedEvents;
    return sortedEvents.filter(
      (ev) => ev.region?.toUpperCase() === selectedRegion || ev.tags?.some((t) => t.toUpperCase() === selectedRegion)
    );
  }, [sortedEvents, selectedRegion]);

  useEffect(() => {
    if (visibleEvents.length === 0) {
      setSelectedEventId(null);
      return;
    }

    const selectedStillVisible = visibleEvents.some((event) => event.id === selectedEventId);
    if (!selectedStillVisible && selectedEventId) {
      setSelectedEventId(null);
    }
  }, [visibleEvents, selectedEventId]);

  const selectedEvent = visibleEvents.find((event) => event.id === selectedEventId) || null;

  const handleCardClick = useCallback((event) => {
    setSelectedEventId((prev) => (prev === event.id ? null : event.id));
  }, []);

  const handleClose = useCallback(() => setSelectedEventId(null), []);

  return (
    <div className="flex h-full w-full bg-background overflow-hidden select-none">
      {/* Left Column: Notification Stream */}
      <section className="w-72 border-r border-border flex flex-col bg-panel/80 flex-shrink-0 z-10">
        <div className="px-3 py-4 border-b border-border flex justify-between items-center bg-panel/50 backdrop-blur-sm">
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              Intel Feed
            </h2>
            <p className="mt-1 text-[10px] font-mono tracking-[0.16em] text-slate-500">
              IST {syncTime}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-positive pulse-green" />
            <span className="text-[10px] font-bold text-positive tracking-widest">LIVE</span>
          </div>
        </div>

        {/* Region Filter Selector */}
        <div className="px-2 py-2 border-b border-border/60 bg-panel/20 flex gap-1 overflow-x-auto custom-scrollbar">
          {REGION_FILTERS.map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => setSelectedRegion(region)}
              className={`px-2 py-0.5 text-[8px] font-mono uppercase rounded transition-colors whitespace-nowrap ${
                selectedRegion === region
                  ? "bg-info text-white font-bold"
                  : "bg-slate-800/40 text-slate-400 hover:text-white"
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-hidden px-3 py-3 flex flex-col">
          <NotificationMarquee
            events={visibleEvents}
            onSelect={handleCardClick}
            selectedEventId={selectedEventId}
          />
        </div>
      </section>

      {/* Center Column: Interactive Globe & Selected Event Details */}
      <section className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          {showGlobe ? (
            <GlobeView
              events={visibleEvents}
              selectedEventId={selectedEventId}
              onSelectEvent={(event) => setSelectedEventId(event.id)}
              height="100%"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-background">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
                <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">
                  Preparing Globe Coordinates
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Slide-up Event Detail Drawer */}
        <div
          className="absolute inset-x-0 bottom-0 z-20 transition-transform duration-500 ease-in-out"
          style={{
            transform: selectedEvent ? "translateY(0)" : "translateY(100%)",
          }}
        >
          <div className="h-16 bg-gradient-to-b from-transparent to-background pointer-events-none" />

          <div
            className="bg-background/95 backdrop-blur-xl border-t border-border overflow-y-auto custom-scrollbar"
            style={{ maxHeight: "55vh" }}
          >
            {selectedEvent && (
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 bg-info/20 text-info text-[9px] font-bold rounded uppercase tracking-widest border border-info/30">
                        Event ID: {selectedEvent.id}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[9px] font-bold rounded uppercase tracking-widest border border-white/5">
                        Region: {selectedEvent.region}
                      </span>
                      <span
                        className="px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-widest border"
                        style={{
                          color:
                            selectedEvent.sentiment === "bullish"
                              ? "var(--positive-color)"
                              : selectedEvent.sentiment === "bearish"
                                ? "var(--negative-color)"
                                : "var(--warning-color)",
                          borderColor:
                            selectedEvent.sentiment === "bullish"
                              ? "color-mix(in srgb, var(--positive-color) 30%, transparent)"
                              : selectedEvent.sentiment === "bearish"
                                ? "color-mix(in srgb, var(--negative-color) 30%, transparent)"
                                : "color-mix(in srgb, var(--warning-color) 30%, transparent)",
                          background:
                            selectedEvent.sentiment === "bullish"
                              ? "color-mix(in srgb, var(--positive-color) 10%, transparent)"
                              : selectedEvent.sentiment === "bearish"
                                ? "color-mix(in srgb, var(--negative-color) 10%, transparent)"
                                : "color-mix(in srgb, var(--warning-color) 10%, transparent)",
                        }}
                      >
                        {selectedEvent.sentiment?.toUpperCase()}
                      </span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-foreground tracking-tight leading-tight uppercase italic max-w-3xl">
                      {selectedEvent.title}
                    </h1>
                  </div>

                  <button
                    onClick={handleClose}
                    className="flex-shrink-0 ml-4 mt-1 w-8 h-8 rounded-full border border-border bg-panel hover:border-slate-400 transition-all flex items-center justify-center text-slate-400 hover:text-foreground"
                    aria-label="Close event panel"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-4xl font-medium border-l-2 border-info/50 pl-4">
                  {selectedEvent.description}
                </p>

                <div className="mt-8 pt-8 border-t border-white/5">
                  <AIAnalysisPanel event={selectedEvent} />
                </div>

                <HistoricalCorrelation correlation={selectedEvent.historicalCorrelations} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Right Column: Source Intel & News / Market Matrix */}
      <section className="w-[400px] border-l border-border flex flex-col bg-panel/40 backdrop-blur-xl flex-shrink-0 z-10">
        <div className="p-6 flex flex-col gap-8 overflow-y-auto custom-scrollbar h-full">
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Source Intelligence
              </h2>
              <span className="text-[9px] font-mono text-positive tracking-widest flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-positive inline-block" />
                VERIFIED
              </span>
            </div>
            <div className="flex-1 min-h-0">
              <EventNewsBlog event={selectedEvent} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRightPanelTab("news")}
                  className={`text-[10px] font-black uppercase tracking-[0.18em] transition-colors ${
                    rightPanelTab === "news" ? "text-info border-b border-info pb-0.5" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Headlines
                </button>
                <button
                  type="button"
                  onClick={() => setRightPanelTab("markets")}
                  className={`text-[10px] font-black uppercase tracking-[0.18em] transition-colors ${
                    rightPanelTab === "markets" ? "text-info border-b border-info pb-0.5" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Core Markets
                </button>
              </div>
              <span className="text-[9px] font-mono text-slate-500">
                {rightPanelTab === "news" ? "SRC: LIVE OSINT" : "SRC: YAHOO"}
              </span>
            </div>

            {rightPanelTab === "news" ? (
              <NewsFeed articles={articles} loading={articlesLoading} />
            ) : (
              <div className="pt-1">
                <MarketTicker />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
