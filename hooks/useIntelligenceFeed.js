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
            const textToAnalyze = (article.title + " " + (article.description || "")).toLowerCase();
            
            // Infer Region
            let region = "Global";
            let lat = (hash % 180) - 90;
            let lng = ((hash >> 1) % 360) - 180;
            if (/(us|america|biden|washington|new york|fed|federal reserve)/i.test(textToAnalyze)) { region = "North America"; lat = 38.9; lng = -77.0; }
            else if (/(china|japan|asia|tokyo|beijing|india)/i.test(textToAnalyze)) { region = "Asia"; lat = 35.8; lng = 104.1; }
            else if (/(europe|uk|london|eu|germany|france|ecb)/i.test(textToAnalyze)) { region = "Europe"; lat = 50.1; lng = 8.6; }
            else if (/(middle east|israel|iran|dubai|saudi|oil)/i.test(textToAnalyze)) { region = "Middle East"; lat = 25.2; lng = 55.2; }
            
            lat += (hash % 10) / 10;
            lng += ((hash >> 3) % 10) / 10;
            
            // Infer Sentiment
            let sentiment = "neutral";
            let bullish = 30;
            let bearish = 30;
            if (/(growth|surge|jump|gain|up|bull|positive|soar|buy|high)/i.test(textToAnalyze)) { sentiment = "bullish"; bullish = 75; bearish = 15; }
            else if (/(drop|fall|loss|down|bear|negative|plunge|crash|fear|sell|low|war|crisis)/i.test(textToAnalyze)) { sentiment = "bearish"; bearish = 80; bullish = 10; }
            
            const impactScore = Math.floor(Math.random() * 40) + 60; // 60-99
            
            // Determine affected asset
            let asset = "Global Index";
            if (/(oil|crude|energy)/i.test(textToAnalyze)) asset = "Crude Oil";
            else if (/(gold|silver)/i.test(textToAnalyze)) asset = "Gold";
            else if (/(tech|apple|microsoft|nvidia|ai)/i.test(textToAnalyze)) asset = "NASDAQ";
            else if (/(dollar|fed|rates)/i.test(textToAnalyze)) asset = "USD Indicator";

            return {
              id: `ev_live_${hash}_${idx}`,
              title: article.title,
              timestamp: timeAgo(article.publishedAt),
              source: article.source?.toUpperCase() || "GLOBAL NEWS",
              tags: ["Live Update", region],
              sentiment: sentiment,
              impactScore: impactScore,
              region: region,
              coordinates: [lat, lng],
              description: article.description || "No further details available for this event.",
              impacts: [
                { 
                  asset: asset, 
                  bullish: bullish, 
                  bearish: bearish, 
                  neutral: 100 - bullish - bearish, 
                  reasoning: ["Real-time market analysis", "News sentiment parsing"] 
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
