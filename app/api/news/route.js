import { NextResponse } from "next/server";
import { INITIAL_EVENTS } from "@/lib/mockData";

const GNEWS_KEY = process.env.GNEWS_API_KEY;
const FINNHUB_KEY = process.env.FINNHUB_API_KEY;

let cache = { data: null, timestamp: 0 };
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Curated baseline articles for fallback when external API quotas are exhausted or keys are absent
const FALLBACK_ARTICLES = INITIAL_EVENTS.map((event) => ({
  title: event.title,
  source: event.source,
  url: "https://finance.yahoo.com",
  publishedAt: event.publishedAt,
  description: event.description,
  image: event.image || null,
}));

async function fetchWithTimeout(url, timeoutMs = 6000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      next: { revalidate: 300 },
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const now = Date.now();

  if (cache.data && now - cache.timestamp < CACHE_TTL) {
    return NextResponse.json({ success: true, articles: cache.data, cached: true });
  }

  let articles = [];

  // 1. Fetch GNews (Macro & Geopolitics)
  if (GNEWS_KEY && GNEWS_KEY !== "your_gnews_key" && GNEWS_KEY !== "your_key_here") {
    const url = `https://gnews.io/api/v4/search?q="global economy" OR geopolitics OR finance&lang=en&max=20&sortby=publishedAt&token=${GNEWS_KEY}`;
    try {
      const res = await fetchWithTimeout(url);
      if (res.ok) {
        const json = await res.json();
        const gnewsArticles = (json.articles || []).map((a) => ({
          title: a.title,
          source: a.source?.name || "GNEWS",
          url: a.url,
          publishedAt: a.publishedAt,
          description: a.description,
          image: a.image,
        }));
        articles.push(...gnewsArticles);
      }
    } catch (err) {
      console.warn("[GNews Fetch Failed/Timed out]:", err.message);
    }
  }

  // 2. Fetch Finnhub (General Market & Global News)
  if (FINNHUB_KEY && FINNHUB_KEY !== "your_finnhub_key" && FINNHUB_KEY !== "your_key_here") {
    const url = `https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_KEY}`;
    try {
      const res = await fetchWithTimeout(url);
      if (res.ok) {
        const json = await res.json();
        const finnArticles = (json || []).slice(0, 80).map((a) => ({
          title: a.headline,
          source: a.source || "FINNHUB",
          url: a.url,
          publishedAt: a.datetime ? new Date(a.datetime * 1000).toISOString() : new Date().toISOString(),
          description: a.summary,
          image: a.image,
        }));
        articles.push(...finnArticles);
      }
    } catch (err) {
      console.warn("[Finnhub Fetch Failed/Timed out]:", err.message);
    }
  }

  // Deduplicate articles by normalized title
  if (articles.length > 0) {
    const seenTitles = new Set();
    articles = articles.filter((a) => {
      const key = (a.title || "").toLowerCase().trim();
      if (!key || seenTitles.has(key)) return false;
      seenTitles.add(key);
      return true;
    });
  }

  // If both APIs returned nothing, serve cached data or robust fallback
  if (articles.length === 0) {
    if (cache.data && cache.data.length > 0) {
      return NextResponse.json({ success: true, articles: cache.data, stale: true });
    }
    return NextResponse.json({
      success: true,
      articles: FALLBACK_ARTICLES,
      fallback: true,
      message: "Using curated OSINT baseline data (API keys missing or limits exceeded).",
    });
  }

  cache = { data: articles, timestamp: now };
  return NextResponse.json({ success: true, articles });
}
