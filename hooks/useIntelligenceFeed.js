"use client";

import { useState, useEffect } from "react";
import { INITIAL_EVENTS } from "@/lib/mockData";

export function useIntelligenceFeed() {
  const [events, setEvents] = useState(INITIAL_EVENTS);

  useEffect(() => {
    // Simulate incoming events every 15-30 seconds
    const interval = setInterval(() => {
      const newEvent = {
        id: `ev_${Math.floor(Math.random() * 1000)}`,
        title: getRandomTitle(),
        timestamp: "just now",
        source: ["BLOOMBERG", "REUTERS", "AP NEWS", "AL JAZEERA"][Math.floor(Math.random() * 4)],
        tags: ["Macro", "Breaking", "Alert"],
        sentiment: ["bullish", "bearish", "neutral"][Math.floor(Math.random() * 3)],
        impactScore: Math.floor(Math.random() * 40) + 60,
        region: ["Global", "US", "Asia", "Europe"][Math.floor(Math.random() * 4)],
        coordinates: [Math.random() * 180 - 90, Math.random() * 360 - 180],
        description: "Automated intelligence report: Significant market volatility detected in correlated asset classes following recent geopolitical shifts.",
        impacts: [
          { 
            asset: "Global Index", 
            bullish: Math.floor(Math.random() * 100), 
            bearish: Math.floor(Math.random() * 100), 
            neutral: 10, 
            reasoning: ["Algorithmic trigger", "Liquidity shift"] 
          }
        ]
      };

      setEvents(prev => [newEvent, ...prev.slice(0, 9)]);
    }, 25000);

    return () => clearInterval(interval);
  }, []);

  return events;
}

function getRandomTitle() {
  const titles = [
    "OPEC+ unexpected production cut announced for Q3",
    "Central Bank of Japan intervenes in currency markets",
    "Tech sector earnings beat expectations across major indices",
    "Geopolitical tensions escalate in key shipping corridors",
    "New trade tariffs proposed for semiconductor exports",
    "Major crypto exchange gains regulatory approval in EU",
    "US Treasury yields hit 12-month highs on inflation data"
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}
