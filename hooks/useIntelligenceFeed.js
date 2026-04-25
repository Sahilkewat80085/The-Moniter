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
  { name: "Mumbai", lat: 19.15, lng: 73.00, region: "Asia" }, // Sunk slightly inland
  { name: "New Delhi", lat: 28.61, lng: 77.21, region: "Asia" },
  { name: "Bangalore", lat: 12.97, lng: 77.59, region: "Asia" },
  { name: "London", lat: 51.51, lng: -0.11, region: "Europe" },
  { name: "New York", lat: 40.73, lng: -74.15, region: "North America" }, // Shifts away from Atlantic
  { name: "Washington", lat: 38.91, lng: -77.04, region: "North America" },
  { name: "Dubai", lat: 25.15, lng: 55.40, region: "Middle East" }, // Sunk inland
  { name: "Singapore", lat: 1.30, lng: 103.85, region: "Asia" }
];

// High-density terrestrial hub list to ensure dots stay inside borders
const COUNTRY_HUBS = {
  "USA": [
    { lat: 40.73, lng: -74.15 }, { lat: 34.05, lng: -118.24 }, { lat: 41.87, lng: -87.62 },
    { lat: 29.76, lng: -95.36 }, { lat: 39.73, lng: -104.99 }, { lat: 47.60, lng: -122.33 },
    { lat: 25.76, lng: -80.25 }, { lat: 33.74, lng: -84.38 }, { lat: 32.77, lng: -96.79 },
    { lat: 39.95, lng: -75.20 }, { lat: 37.77, lng: -122.41 }, { lat: 42.36, lng: -71.10 }
  ],
  "India": [
    { lat: 28.61, lng: 77.20 }, { lat: 19.15, lng: 73.00 }, { lat: 12.97, lng: 77.59 },
    { lat: 13.08, lng: 80.21 }, { lat: 22.57, lng: 88.36 }, { lat: 17.38, lng: 78.48 },
    { lat: 23.02, lng: 72.60 }, { lat: 18.52, lng: 73.85 }, { lat: 21.14, lng: 79.08 },
    { lat: 26.84, lng: 80.94 }, { lat: 26.91, lng: 75.80 }, { lat: 15.35, lng: 74.00 }
  ],
  "China": [
    { lat: 39.90, lng: 116.40 }, { lat: 31.23, lng: 121.47 }, { lat: 23.12, lng: 113.26 },
    { lat: 22.54, lng: 114.05 }, { lat: 30.59, lng: 114.30 }, { lat: 30.65, lng: 104.06 },
    { lat: 34.26, lng: 108.94 }, { lat: 39.12, lng: 117.19 }, { lat: 45.75, lng: 126.64 }
  ],
  "Europe": [
    { lat: 51.50, lng: -0.12 }, { lat: 48.85, lng: 2.35 }, { lat: 52.52, lng: 13.40 },
    { lat: 41.90, lng: 12.49 }, { lat: 50.11, lng: 8.68 }, { lat: 40.41, lng: -3.70 },
    { lat: 52.36, lng: 4.90 }, { lat: 48.20, lng: 16.37 }, { lat: 59.32, lng: 18.06 },
    { lat: 53.55, lng: 9.99 }, { lat: 45.46, lng: 9.18 }, { lat: 43.70, lng: 7.26 }
  ],
  "Middle East": [
    { lat: 25.20, lng: 55.27 }, { lat: 24.71, lng: 46.67 }, { lat: 32.08, lng: 34.78 },
    { lat: 35.68, lng: 51.38 }, { lat: 33.31, lng: 44.36 }, { lat: 24.45, lng: 54.37 },
    { lat: 31.94, lng: 35.92 }, { lat: 29.37, lng: 47.97 }, { lat: 30.04, lng: 31.23 }
  ],
  "Global": [
    { lat: 40.71, lng: -74.00 }, { lat: 51.50, lng: -0.12 }, { lat: 35.67, lng: 139.65 },
    { lat: 1.35, lng: 103.81 }, { lat: -33.86, lng: 151.20 }, { lat: 19.07, lng: 72.87 }
  ]
};

export function useIntelligenceFeed() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadNews() {
      try {
        const res = await fetch("/api/news");
        const json = await res.json();

        if (json.success && json.articles?.length > 0) {
          if (mounted) {
            setArticles(json.articles);
          }

          const formattedEvents = json.articles.map((article, idx) => {
            const hash = hashString(article.title || "");
            const textToAnalyze = (article.title + " " + (article.description || "")).toLowerCase();
            
            const matchedCity = CITIES.find(c => textToAnalyze.includes(c.name.toLowerCase()));
            
            let region = "Global";
            let lat = 0;
            let lng = 0;

            if (matchedCity) {
              region = matchedCity.region;
              lat = matchedCity.lat;
              lng = matchedCity.lng;
            } else {
              // Precise Country Detection
              let countryKey = "Global";
              if (/(india|rbi|delhi|mumbai|sensex|modi)/i.test(textToAnalyze)) { countryKey = "India"; region = "Asia"; }
              else if (/(us|america|biden|washington|new york|fed|wall street)/i.test(textToAnalyze)) { countryKey = "USA"; region = "North America"; }
              else if (/(china|beijing|xi jinping|shanghai|pboc)/i.test(textToAnalyze)) { countryKey = "China"; region = "Asia"; }
              else if (/(europe|eu|uk|london|france|germany|italy)/i.test(textToAnalyze)) { countryKey = "Europe"; region = "Europe"; }
              else if (/(middle east|israel|iran|dubai|saudi|oil)/i.test(textToAnalyze)) { countryKey = "Middle East"; region = "Middle East"; }

              const hubs = COUNTRY_HUBS[countryKey] || COUNTRY_HUBS["Global"];
              // Rotate through terrestrial hubs to ensure news doesn't pile on one city
              const hubIdx = (hash + idx) % hubs.length;
              lat = hubs[hubIdx].lat;
              lng = hubs[hubIdx].lng;
            }

            // High-Performance Terrestrial Separation
            // We use a tightened phyllotaxis spiral (max ~1.1 degrees).
            const goldenAngle = 137.508; 
            const angleVal = (idx * goldenAngle + (hash % 360)) * (Math.PI / 180);
            
            // Tightened spreadFactors ensure markers stay inland
            const spreadFactor = matchedCity ? 0.12 : 0.22; 
            // Cap the radius to prevent dots from drifting into oceans
            const radius = Math.min(Math.sqrt(idx + 1) * spreadFactor, 1.1); 
            
            // Final coordinates bounded to terrestrial hub + unique jitter
            lat += radius * Math.cos(angleVal);
            lng += radius * Math.sin(angleVal);
            
            let sentiment = "neutral";
            let bullish = 30;
            let bearish = 30;
            if (/(growth|surge|jump|gain|up|bull|positive|soar|buy|high)/i.test(textToAnalyze)) { sentiment = "bullish"; bullish = 75; bearish = 15; }
            else if (/(drop|fall|loss|down|bear|negative|plunge|crash|fear|sell|low|war|crisis)/i.test(textToAnalyze)) { sentiment = "bearish"; bearish = 80; bullish = 10; }
            
            const impactScore = Math.floor(Math.random() * 40) + 60;
            
            let asset = "Global Index";
            if (/(oil|crude|energy)/i.test(textToAnalyze)) asset = "Crude Oil";
            else if (/(gold|silver)/i.test(textToAnalyze)) asset = "Gold";
            else if (/(tech|apple|microsoft|nvidia|ai)/i.test(textToAnalyze)) asset = "NASDAQ";
            else if (/(dollar|fed|rates)/i.test(textToAnalyze)) asset = "USD Indicator";

            return {
              id: `ev_live_${hash}_${idx}`,
              title: article.title,
              timestamp: timeAgo(article.publishedAt),
              publishedAt: article.publishedAt || new Date().toISOString(),
              source: article.source?.toUpperCase() || "GLOBAL NEWS",
              tags: ["Live Update", region],
              sentiment,
              impactScore,
              region,
              coordinates: [lat, lng],
              description: article.description || "No further details available for this event.",
              impacts: [
                { 
                  asset, 
                  bullish, 
                  bearish, 
                  neutral: 100 - bullish - bearish, 
                  reasoning: ["Real-time market analysis", "News sentiment parsing"] 
                }
              ]
            };
          });
          
          if (mounted) {
            setEvents(formattedEvents);
          }
        } else if (mounted) {
          setArticles([]);
        }
      } catch (err) {
        console.error("Failed to fetch news for feed", err);
      } finally {
        if (mounted) {
          setArticlesLoading(false);
        }
      }
    }

    loadNews();
    const interval = setInterval(loadNews, 5 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { events, articles, articlesLoading };
}
