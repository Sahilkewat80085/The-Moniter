"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import EventNewsBlog from "../components/EventNewsBlog";
import NewsFeed from "../components/NewsFeed";
import NotificationMarquee from "../components/NotificationMarquee";
import AIAnalysisPanel from "../components/AIAnalysisPanel";
import HistoricalCorrelation from "../components/HistoricalCorrelation";
import PerformanceToggle from "../components/PerformanceToggle";
import DashboardBriefingBar from "../components/DashboardBriefingBar";
import IntelligenceControls from "../components/IntelligenceControls";
import TimelineControls from "../components/TimelineControls";
import { useIntelligenceFeed } from "../hooks/useIntelligenceFeed";

const GlobeView = dynamic(() => import("../components/GlobeView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
        <span className="text-[10px] font-mono text-slate-600 tracking-widest uppercase">
          Initializing Globe
        </span>
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

function parseEventTime(event, fallbackIndex) {
  const parsed = Date.parse(event?.publishedAt || "");
  if (!Number.isNaN(parsed)) return parsed;
  return Date.now() - fallbackIndex * 60000;
}

export default function Dashboard() {
  const { events, articles, articlesLoading } = useIntelligenceFeed();
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [syncTime, setSyncTime] = useState("");
  const [showGlobe, setShowGlobe] = useState(false);
  const [query, setQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [minImpact, setMinImpact] = useState(0);
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState(false);

  useEffect(() => {
    setSyncTime(getIndiaTime());
    const interval = setInterval(() => {
      setSyncTime(getIndiaTime());
    }, 1000);
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

  const regions = useMemo(() => {
    return Array.from(new Set(sortedEvents.map((event) => event.region).filter(Boolean))).sort();
  }, [sortedEvents]);

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sortedEvents.filter((event) => {
      const searchableText = [
        event.title,
        event.region,
        event.source,
        event.description,
        ...(event.tags || []),
        ...(event.impacts || []).map((impact) => impact.asset),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
      const matchesRegion = regionFilter === "all" || event.region === regionFilter;
      const matchesSentiment = sentimentFilter === "all" || event.sentiment === sentimentFilter;
      const matchesImpact = (event.impactScore || 0) >= minImpact;

      return matchesQuery && matchesRegion && matchesSentiment && matchesImpact;
    });
  }, [sortedEvents, query, regionFilter, sentimentFilter, minImpact]);

  useEffect(() => {
    setTimelineIndex((current) => {
      if (filteredEvents.length === 0) return 0;
      if (current === 0) return filteredEvents.length;
      return Math.min(current, filteredEvents.length);
    });
  }, [filteredEvents.length]);

  useEffect(() => {
    if (!isTimelinePlaying || filteredEvents.length <= 1) return;

    const interval = window.setInterval(() => {
      setTimelineIndex((current) => {
        if (current >= filteredEvents.length) return 1;
        return current + 1;
      });
    }, 1800);

    return () => window.clearInterval(interval);
  }, [isTimelinePlaying, filteredEvents.length]);

  const visibleEvents = useMemo(() => {
    if (filteredEvents.length === 0 || timelineIndex <= 0) return [];
    return filteredEvents.slice(0, Math.min(timelineIndex, filteredEvents.length));
  }, [filteredEvents, timelineIndex]);

  useEffect(() => {
    if (visibleEvents.length === 0) {
      setSelectedEventId(null);
      return;
    }

    const selectedStillVisible = visibleEvents.some((event) => event.id === selectedEventId);
    if (!selectedStillVisible) {
      setSelectedEventId(visibleEvents[0].id);
    }
  }, [visibleEvents, selectedEventId]);

  const selectedEvent = visibleEvents.find((event) => event.id === selectedEventId) || null;

  const briefing = useMemo(() => {
    const pool = visibleEvents.length > 0 ? visibleEvents : filteredEvents;
    if (pool.length === 0) {
      return {
        dominantSentiment: "neutral",
        topRegion: "Global",
        topTheme: "Macro",
        highestImpactEvent: null,
      };
    }

    const countTopValue = (items, fallback) => {
      const counts = items.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || fallback;
    };

    return {
      dominantSentiment: countTopValue(pool.map((event) => event.sentiment || "neutral"), "neutral"),
      topRegion: countTopValue(pool.map((event) => event.region || "Global"), "Global"),
      topTheme: countTopValue(
        pool.map((event) => event.tags?.[0] || event.impacts?.[0]?.asset || "Macro"),
        "Macro"
      ),
      highestImpactEvent: [...pool].sort((a, b) => (b.impactScore || 0) - (a.impactScore || 0))[0] || null,
    };
  }, [filteredEvents, visibleEvents]);

  const handleCardClick = (event) => {
    setSelectedEventId((prev) => (prev === event.id ? null : event.id));
  };

  const handleClose = () => setSelectedEventId(null);

  return (
    <div className="flex h-full w-full bg-background overflow-hidden">
      <section className="w-80 border-r border-border flex flex-col bg-panel/80 flex-shrink-0">
        <div className="p-4 border-b border-border flex justify-between items-center bg-panel/50 backdrop-blur-sm">
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
              Notifications
            </h2>
            <p className="mt-1 text-[10px] font-mono tracking-[0.16em] text-slate-600">
              IST {syncTime}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-positive pulse-green" />
            <span className="text-[10px] font-bold text-positive tracking-widest">LIVE</span>
          </div>
        </div>

        <div className="px-4 py-4 border-b border-border/70">
          <IntelligenceControls
            query={query}
            onQueryChange={setQuery}
            region={regionFilter}
            onRegionChange={setRegionFilter}
            sentiment={sentimentFilter}
            onSentimentChange={setSentimentFilter}
            minImpact={minImpact}
            onMinImpactChange={setMinImpact}
            regions={regions}
          />
        </div>

        <div className="flex-1 overflow-hidden px-4 py-4 flex flex-col">
          <NotificationMarquee
            events={visibleEvents}
            onSelect={handleCardClick}
            selectedEventId={selectedEventId}
          />
        </div>
      </section>

      <section className="flex-1 flex flex-col relative overflow-hidden">
        <DashboardBriefingBar
          totalEvents={filteredEvents.length}
          visibleEvents={visibleEvents.length}
          dominantSentiment={briefing.dominantSentiment}
          topRegion={briefing.topRegion}
          topTheme={briefing.topTheme}
          highestImpactEvent={briefing.highestImpactEvent}
        />

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
                <span className="text-[10px] font-mono text-slate-600 tracking-widest uppercase">
                  Preparing Globe
                </span>
              </div>
            </div>
          )}
        </div>

        <TimelineControls
          total={filteredEvents.length}
          current={Math.min(timelineIndex, filteredEvents.length)}
          playing={isTimelinePlaying}
          onTogglePlaying={() => setIsTimelinePlaying((prev) => !prev)}
          onScrub={(value) => {
            setIsTimelinePlaying(false);
            setTimelineIndex(value);
          }}
          activeEvent={selectedEvent || briefing.highestImpactEvent}
        />

        <div
          className="absolute inset-x-0 bottom-0 z-20 transition-transform duration-500 ease-in-out"
          style={{
            transform: selectedEvent ? "translateY(0)" : "translateY(100%)",
          }}
        >
          <div className="h-20 bg-gradient-to-b from-transparent to-background pointer-events-none" />

          <div
            className="bg-background/95 backdrop-blur-xl border-t border-border overflow-y-auto custom-scrollbar"
            style={{ maxHeight: "55vh" }}
          >
            {selectedEvent && (
              <div className="p-8">
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
                    className="flex-shrink-0 ml-4 mt-1 w-8 h-8 rounded-full border border-border bg-panel hover:border-slate-500 transition-all flex items-center justify-center text-slate-500 hover:text-foreground"
                    aria-label="Close event panel"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-4xl font-medium border-l-2 border-border pl-4">
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

      <section className="w-[400px] border-l border-border flex flex-col bg-panel/40 backdrop-blur-xl flex-shrink-0">
        <div className="p-8 flex flex-col gap-10 overflow-y-auto custom-scrollbar h-full">
          <div className="flex justify-end">
            <PerformanceToggle />
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                Source Intelligence
              </h2>
              <span className="text-[9px] font-mono text-positive tracking-widest">● VERIFIED</span>
            </div>
            <div className="flex-1 min-h-0">
              <EventNewsBlog event={selectedEvent} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                Financial News
              </h2>
              <span className="text-[9px] font-mono text-slate-600">SRC: GNEWS</span>
            </div>
            <NewsFeed articles={articles} loading={articlesLoading} />
          </div>
        </div>
      </section>
    </div>
  );
}
