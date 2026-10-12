"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  { name: "Mumbai", lat: 19.15, lng: 73.00, region: "Asia" },
  { name: "New Delhi", lat: 28.61, lng: 77.21, region: "Asia" },
  { name: "Bangalore", lat: 12.97, lng: 77.59, region: "Asia" },
  { name: "London", lat: 51.51, lng: -0.11, region: "Europe" },
  { name: "New York", lat: 40.73, lng: -74.15, region: "North America" },
  { name: "Washington", lat: 38.91, lng: -77.04, region: "North America" },
  { name: "Dubai", lat: 25.15, lng: 55.40, region: "Middle East" },
  { name: "Singapore", lat: 1.30, lng: 103.85, region: "Asia" },
  { name: "Tokyo", lat: 35.68, lng: 139.76, region: "Asia" },
  { name: "Frankfurt", lat: 50.11, lng: 8.68, region: "Europe" },
];

const COUNTRY_HUBS = {
  USA: [
    { lat: 40.73, lng: -74.15 }, { lat: 34.05, lng: -118.24 }, { lat: 41.87, lng: -87.62 },
    { lat: 29.76, lng: -95.36 }, { lat: 39.73, lng: -104.99 }, { lat: 47.60, lng: -122.33 },
    { lat: 25.76, lng: -80.25 }, { lat: 33.74, lng: -84.38 }, { lat: 32.77, lng: -96.79 },
  ],
  India: [
    { lat: 28.61, lng: 77.20 }, { lat: 19.15, lng: 73.00 }, { lat: 12.97, lng: 77.59 },
    { lat: 13.08, lng: 80.21 }, { lat: 22.57, lng: 88.36 }, { lat: 17.38, lng: 78.48 },
    { lat: 23.02, lng: 72.60 }, { lat: 18.52, lng: 73.85 }, { lat: 21.14, lng: 79.08 },
  ],
  China: [
    { lat: 39.90, lng: 116.40 }, { lat: 31.23, lng: 121.47 }, { lat: 23.12, lng: 113.26 },
    { lat: 22.54, lng: 114.05 }, { lat: 30.59, lng: 114.30 }, { lat: 30.65, lng: 104.06 },
  ],
  Europe: [
    { lat: 51.50, lng: -0.12 }, { lat: 48.85, lng: 2.35 }, { lat: 52.52, lng: 13.40 },
    { lat: 41.90, lng: 12.49 }, { lat: 50.11, lng: 8.68 }, { lat: 40.41, lng: -3.70 },
  ],
  "Middle East": [
    { lat: 25.20, lng: 55.27 }, { lat: 24.71, lng: 46.67 }, { lat: 32.08, lng: 34.78 },
    { lat: 35.68, lng: 51.38 }, { lat: 33.31, lng: 44.36 }, { lat: 24.45, lng: 54.37 },
  ],
  Global: [
    { lat: 40.71, lng: -74.00 }, { lat: 51.50, lng: -0.12 }, { lat: 35.67, lng: 139.65 },
    { lat: 1.35, lng: 103.81 }, { lat: -33.86, lng: 151.20 }, { lat: 19.07, lng: 72.87 },
  ],
};

function generateCorrelationsForLiveEvent(asset, sentiment) {
  const isUp = sentiment === "bullish";
  switch (asset) {
    case "Crude Oil":
      return {
        pastEvent: "2022 Strategic Petroleum Reserve Drawdown",
        similarity: 86,
        impacts: [
          { symbol: "XLE", name: "Energy Select Sector SPDR", change: isUp ? "+16.4%" : "-9.2%", period: "60 Days Post" },
          { symbol: "USO", name: "United States Oil Fund", change: isUp ? "+22.1%" : "-14.5%", period: "60 Days Post" },
          { symbol: "CVX", name: "Chevron Corporation", change: isUp ? "+11.8%" : "-7.3%", period: "60 Days Post" },
        ],
      };
    case "Gold":
      return {
        pastEvent: "2020 Sovereign Reserve Expansion",
        similarity: 91,
        impacts: [
          { symbol: "GLD", name: "SPDR Gold Shares", change: isUp ? "+18.2%" : "-6.4%", period: "90 Days Post" },
          { symbol: "GDX", name: "VanEck Gold Miners ETF", change: isUp ? "+24.5%" : "-11.1%", period: "90 Days Post" },
          { symbol: "NEM", name: "Newmont Corporation", change: isUp ? "+15.7%" : "-8.9%", period: "90 Days Post" },
        ],
      };
    case "NASDAQ":
      return {
        pastEvent: "2023 Generative AI Capex Cycle",
        similarity: 89,
        impacts: [
          { symbol: "QQQ", name: "Invesco QQQ Trust", change: isUp ? "+19.4%" : "-12.8%", period: "45 Days Post" },
          { symbol: "SMH", name: "VanEck Semiconductor ETF", change: isUp ? "+28.7%" : "-16.2%", period: "45 Days Post" },
          { symbol: "XLK", name: "Technology Select Sector SPDR", change: isUp ? "+17.3%" : "-10.5%", period: "45 Days Post" },
        ],
      };
    default:
      return {
        pastEvent: "2019 Global Central Bank Synchronized Policy",
        similarity: 84,
        impacts: [
          { symbol: "SPY", name: "S&P 500 ETF Trust", change: isUp ? "+12.1%" : "-8.4%", period: "60 Days Post" },
          { symbol: "VIX", name: "CBOE Volatility Index", change: isUp ? "-24.3%" : "+38.1%", period: "30 Days Post" },
          { symbol: "EEM", name: "iShares MSCI Emerging Markets", change: isUp ? "+14.6%" : "-9.7%", period: "60 Days Post" },
        ],
      };
  }
}

export function useIntelligenceFeed() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const abortControllerRef = useRef(null);

  const loadNews = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setArticlesLoading(true);
      const res = await fetch("/api/news", { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();

      if (json.success && Array.isArray(json.articles) && json.articles.length > 0) {
        setArticles(json.articles);

        const formattedEvents = json.articles.map((article, idx) => {
          const hash = hashString(article.title || "");
          const textToAnalyze = `${article.title || ""} ${article.description || ""}`.toLowerCase();
          
          const matchedCity = CITIES.find((c) => textToAnalyze.includes(c.name.toLowerCase()));
          
          let region = "Global";
          let lat = 0;
          let lng = 0;

          if (matchedCity) {
            region = matchedCity.region;
            lat = matchedCity.lat;
            lng = matchedCity.lng;
          } else {
            let countryKey = "Global";
            if (/(india|rbi|delhi|mumbai|sensex|modi|nifty)/i.test(textToAnalyze)) {
              countryKey = "India";
              region = "Asia";
            } else if (/(us|america|biden|washington|new york|fed|wall street|treasury)/i.test(textToAnalyze)) {
              countryKey = "USA";
              region = "North America";
            } else if (/(china|beijing|xi jinping|shanghai|pboc)/i.test(textToAnalyze)) {
              countryKey = "China";
              region = "Asia";
            } else if (/(europe|eu|uk|london|france|germany|italy|ecb)/i.test(textToAnalyze)) {
              countryKey = "Europe";
              region = "Europe";
            } else if (/(middle east|israel|iran|dubai|saudi|opec|gulf)/i.test(textToAnalyze)) {
              countryKey = "Middle East";
              region = "Middle East";
            }

            const hubs = COUNTRY_HUBS[countryKey] || COUNTRY_HUBS.Global;
            const hubIdx = (hash + idx) % hubs.length;
            lat = hubs[hubIdx].lat;
            lng = hubs[hubIdx].lng;
          }

          // Terrestrial spiral jitter to avoid marker overlap
          const goldenAngle = 137.508;
          const angleVal = (idx * goldenAngle + (hash % 360)) * (Math.PI / 180);
          const spreadFactor = matchedCity ? 0.12 : 0.22;
          const radius = Math.min(Math.sqrt(idx + 1) * spreadFactor, 1.1);
          
          lat += radius * Math.cos(angleVal);
          lng += radius * Math.sin(angleVal);
          
          let sentiment = "neutral";
          let bullish = 35;
          let bearish = 35;
          if (/(growth|surge|jump|gain|up|bull|positive|soar|buy|rally|record|stimulus)/i.test(textToAnalyze)) {
            sentiment = "bullish";
            bullish = 75;
            bearish = 15;
          } else if (/(drop|fall|loss|down|bear|negative|plunge|crash|fear|sell|low|war|crisis|inflation|recession)/i.test(textToAnalyze)) {
            sentiment = "bearish";
            bearish = 75;
            bullish = 15;
          }
          
          const impactScore = Math.floor((hash % 35) + 65);
          
          let asset = "Global Index";
          if (/(oil|crude|energy|brent|wti)/i.test(textToAnalyze)) asset = "Crude Oil";
          else if (/(gold|silver|precious metals)/i.test(textToAnalyze)) asset = "Gold";
          else if (/(tech|apple|microsoft|nvidia|ai|nasdaq|chips|semiconductor)/i.test(textToAnalyze)) asset = "NASDAQ";
          else if (/(dollar|fed|rates|yield|treasury)/i.test(textToAnalyze)) asset = "USD Indicator";

          return {
            id: `ev_live_${hash}_${idx}`,
            title: article.title,
            timestamp: timeAgo(article.publishedAt),
            publishedAt: article.publishedAt || new Date().toISOString(),
            source: article.source?.toUpperCase() || "GLOBAL NEWS",
            url: article.url || null,
            tags: ["Live Update", region, asset],
            sentiment,
            impactScore,
            region,
            coordinates: [lat, lng],
            description: article.description || "Intelligence data collected from verified real-time sources.",
            image: article.image,
            impacts: [
              { 
                asset, 
                bullish, 
                bearish, 
                neutral: 100 - bullish - bearish, 
                reasoning: ["Real-time market sentiment parsing", "Algorithmic macro correlation"] 
              }
            ],
            historicalCorrelations: generateCorrelationsForLiveEvent(asset, sentiment),
          };
        });

        setEvents(formattedEvents);
        setLastUpdated(new Date());
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.warn("[useIntelligenceFeed] Live feed fetch failed:", err.message);
      }
    } finally {
      setArticlesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
    const interval = setInterval(loadNews, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadNews]);

  return { events, articles, articlesLoading, lastUpdated, refresh: loadNews };
}
