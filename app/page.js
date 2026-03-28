"use client";

import React, { useState, useEffect } from "react";
import { INITIAL_EVENTS, MARKET_TICKERS } from "../lib/mockData";
import EventCard from "../components/EventCard";
import ImpactCard from "../components/ImpactCard";
import MarketTicker from "../components/MarketTicker";
import MapView from "../components/MapView";
import { useIntelligenceFeed } from "../hooks/useIntelligenceFeed";

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
  const [selectedEventId, setSelectedEventId] = useState(INITIAL_EVENTS[0].id);
  const [activeTab, setActiveTab] = useState("ALL");
  const [syncTime, setSyncTime] = useState("");

  useEffect(() => {
    setSyncTime(getIndiaTime());
    const interval = setInterval(() => {
      setSyncTime(getIndiaTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const selectedEvent = events.find(e => e.id === selectedEventId) || events[0];

  return (
    <div className="flex h-full w-full bg-background overflow-hidden">
      {/* Left Panel: Event Feed */}
      <section className="w-80 border-r border-border flex flex-col bg-panel/80">
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
              onClick={(ev) => setSelectedEventId(ev.id)}
            />
          ))}
        </div>

        <div className="p-4 border-t border-border bg-panel/50 text-[10px] text-slate-600 font-mono">
          Last synchronization: {syncTime} IND
        </div>
      </section>

      {/* Center Panel: Intelligence Analysis */}
      <section className="flex-1 flex flex-col relative overflow-hidden">
        {/* Map Header */}
        <div className="absolute top-0 inset-x-0 h-48 pointer-events-none z-0">
          <MapView events={events} selectedEventId={selectedEventId} />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="flex-1 flex flex-col z-10 p-8 pt-44 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col gap-1 mb-8">
            <div className="flex items-center gap-2 mb-2">
               <span className="px-2 py-0.5 bg-info/20 text-info text-[9px] font-bold rounded uppercase tracking-widest border border-info/30">
                 Event ID: {selectedEvent.id}
               </span>
               <span className="px-2 py-0.5 bg-slate-800 text-slate-500 text-[9px] font-bold rounded uppercase tracking-widest">
                 Region: {selectedEvent.region}
               </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight max-w-4xl uppercase italic">
              {selectedEvent.title}
            </h1>
            <p className="text-slate-500 text-sm mt-4 leading-relaxed max-w-4xl font-medium border-l-2 border-border pl-4">
              {selectedEvent.description}
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-12">
            {selectedEvent.impacts.map((impact, idx) => (
              <ImpactCard key={idx} impact={impact} />
            ))}
          </div>
        </div>
      </section>

      {/* Right Panel: Overview & Filters */}
      <section className="w-[400px] border-l border-border flex flex-col bg-panel/40 backdrop-blur-xl">
        <div className="p-8 flex flex-col gap-10">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Global Markets</h2>
              <span className="text-[9px] font-mono text-slate-600">SOURCE: REED_INTEL_V2</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {MARKET_TICKERS.map((ticker, idx) => (
                <MarketTicker key={idx} ticker={ticker} />
              ))}
            </div>
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
             <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Correlated Trending</h2>
             <div className="flex flex-col gap-3">
               {[1,2,3].map(i => (
                 <div key={i} className="group cursor-pointer">
                   <div className="flex justify-between items-center mb-1">
                     <span className="text-[10px] font-mono text-slate-600 uppercase">Trend Group {i}</span>
                     <span className="text-[9px] text-info font-bold">ALPHA: 0.84</span>
                   </div>
                   <div className="p-3 intelligence-card border border-border rounded-lg group-hover:border-info/30 transition-all">
                     <p className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                       {i === 1 ? "OPEC+ Supply Adjustments Scenario" : i === 2 ? "Cross-Strait Semiconductor Logics" : "Central Bank Digital Currency Beta"}
                     </p>
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
