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

const CITIES = [
  { name: "Beijing", lat: 39.9042, lng: 116.4074, region: "Asia" },
  { name: "Shanghai", lat: 31.2304, lng: 121.4737, region: "Asia" },
  { name: "Shenzhen", lat: 22.5431, lng: 114.0579, region: "Asia" },
  { name: "Hong Kong", lat: 22.3193, lng: 114.1694, region: "Asia" },
  { name: "Wuhan", lat: 30.5928, lng: 114.3055, region: "Asia" },
  { name: "Taipei", lat: 25.0330, lng: 121.5654, region: "Asia" },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503, region: "Asia" },
  { name: "Seoul", lat: 37.5665, lng: 126.9780, region: "Asia" },
  { name: "Singapore", lat: 1.3521, lng: 103.8198, region: "Asia" },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777, region: "Asia" },
  { name: "New Delhi", lat: 28.6139, lng: 77.2090, region: "Asia" },
  { name: "Bangkok", lat: 13.7563, lng: 100.5018, region: "Asia" },
  { name: "Washington", lat: 38.9072, lng: -77.0369, region: "North America" },
  { name: "New York", lat: 40.7128, lng: -74.0060, region: "North America" },
  { name: "San Francisco", lat: 37.7749, lng: -122.4194, region: "North America" },
  { name: "Los Angeles", lat: 34.0522, lng: -118.2437, region: "North America" },
  { name: "London", lat: 51.5074, lng: -0.1278, region: "Europe" },
  { name: "Paris", lat: 48.8566, lng: 2.3522, region: "Europe" },
  { name: "Berlin", lat: 52.5200, lng: 13.4050, region: "Europe" },
  { name: "Frankfurt", lat: 50.1109, lng: 8.6821, region: "Europe" },
  { name: "Brussels", lat: 50.8503, lng: 4.3517, region: "Europe" },
  { name: "Moscow", lat: 55.7558, lng: 37.6173, region: "Europe" },
  { name: "Kyiv", lat: 50.4501, lng: 30.5234, region: "Europe" },
  { name: "Rome", lat: 41.9028, lng: 12.4964, region: "Europe" },
  { name: "Dubai", lat: 25.2048, lng: 55.2708, region: "Middle East" },
  { name: "Riyadh", lat: 24.7136, lng: 46.6753, region: "Middle East" },
  { name: "Tehran", lat: 35.6892, lng: 51.3890, region: "Middle East" },
  { name: "Tel Aviv", lat: 32.0853, lng: 34.7818, region: "Middle East" },
  { name: "Jerusalem", lat: 31.7683, lng: 35.2137, region: "Middle East" },
  { name: "Sydney", lat: -33.8688, lng: 151.2093, region: "Oceania" },
  { name: "Cape Town", lat: -33.9249, lng: 18.4241, region: "Africa" },
  { name: "Cairo", lat: 30.0444, lng: 31.2357, region: "Africa" },
  { name: "Brasília", lat: -15.7975, lng: -47.8919, region: "South America" },
  { name: "São Paulo", lat: -23.5505, lng: -46.6333, region: "South America" }
];

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
            
            // Check for exact city match
            const matchedCity = CITIES.find(c => textToAnalyze.includes(c.name.toLowerCase()));
            
            let region = "Global";
            let lat = (hash % 180) - 90;
            let lng = ((hash >> 1) % 360) - 180;
            let foundExact = false;

            if (matchedCity) {
              region = matchedCity.region;
              lat = matchedCity.lat;
              lng = matchedCity.lng;
              foundExact = true;
            } else {
              // Infer Region
              if (/(us|america|biden|washington|new york|fed|federal reserve)/i.test(textToAnalyze)) { region = "North America"; lat = 38.9; lng = -77.0; }
              else if (/(china|japan|asia|tokyo|beijing|india)/i.test(textToAnalyze)) { region = "Asia"; lat = 35.8; lng = 104.1; }
              else if (/(europe|uk|london|eu|germany|france|ecb)/i.test(textToAnalyze)) { region = "Europe"; lat = 50.1; lng = 8.6; }
              else if (/(middle east|israel|iran|dubai|saudi|oil)/i.test(textToAnalyze)) { region = "Middle East"; lat = 25.2; lng = 55.2; }
              
              // Only add randomness if we didn't find an exact address, to avoid exact overlaps of default regions
              lat += (hash % 10) / 10;
              lng += ((hash >> 3) % 10) / 10;
            }
            
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
