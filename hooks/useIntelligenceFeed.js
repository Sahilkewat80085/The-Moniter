"use client";

import { useState, useEffect } from "react";
import { INITIAL_EVENTS } from "@/lib/mockData";

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function timeAgo(publishedAt) {
  if (!publishedAt) return "just now";
  const now = new Date();
  const then = new Date(publishedAt);
  const diffMins = Math.floor((now - then) / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const hrs = Math.floor(diffMins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  return `${Math.floor(hrs / 24)} d ago`;
}

export function useIntelligenceFeed() {
  const [events, setEvents] = useState(INITIAL_EVENTS);

  useEffect(() => {
    let mounted = true;

    async function loadNews() {
      try {
        const res = await fetch("/api/news");
        const json = await res.json();
        
        if (json.success && json.articles?.length > 0) {
          const formattedEvents = json.articles.map((article, idx) => {
            const hash = hashString(article.title || "");
            const sentimentOptions = ["bullish", "bearish", "neutral"];
            const sentiment = sentimentOptions[hash % 3];
            
            const regionOptions = ["Global", "US", "Asia", "Europe", "Middle East"];
            const region = regionOptions[(hash >> 2) % 5];
            
            const impactScore = (hash % 40) + 60;
            
            // Deterministic coordinates based on region
            let lat = 0, lng = 0;
            if (region === "US") { lat = 38.9; lng = -77.0; }
            else if (region === "Asia") { lat = 35.8; lng = 104.1; }
            else if (region === "Europe") { lat = 50.1; lng = 8.6; }
            else if (region === "Middle East") { lat = 25.2; lng = 55.2; }
            else { lat = (hash % 180) - 90; lng = ((hash >> 1) % 360) - 180; }

            // Add slight randomness based on hash to avoid exact overlaps
            lat += (hash % 10) / 10;
            lng += ((hash >> 3) % 10) / 10;

            return {
              id: `ev_${hash}_${idx}`,
              title: article.title,
              timestamp: timeAgo(article.publishedAt),
              source: article.source?.toUpperCase() || "GLOBAL NEWS",
              tags: ["Breaking", region],
              sentiment: sentiment,
              impactScore: impactScore,
              region: region,
              coordinates: [lat, lng],
              description: article.description || "No further details available for this event.",
              impacts: [
                { 
                  asset: "Global Index", 
                  bullish: hash % 100, 
                  bearish: (hash >> 1) % 100, 
                  neutral: (hash >> 2) % 30, 
                  reasoning: ["Algorithmic trigger", "Market sentiment shift"] 
                }
              ]
            };
          });
          
          if (mounted) {
            setEvents(formattedEvents);
          }
        }
      } catch (err) {
        console.error("Failed to fetch news for feed", err);
      }
    }

    loadNews();
    const interval = setInterval(loadNews, 5 * 60 * 1000); // update every 5 minutes

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return events;
}
