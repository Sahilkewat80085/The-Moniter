import { NextResponse } from "next/server";

const GNEWS_KEY = process.env.GNEWS_API_KEY;
const FINNHUB_KEY = process.env.FINNHUB_API_KEY;

let cache = { data: null, timestamp: 0 };
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  const now = Date.now();

  if (cache.data && now - cache.timestamp < CACHE_TTL) {
    return NextResponse.json({ success: true, articles: cache.data, cached: true });
  }

  let articles = [];

  // 1. Fetch GNews (Macro & Geopolitics)
  if (GNEWS_KEY && GNEWS_KEY !== "your_key_here") {
    const url = `https://gnews.io/api/v4/search?q="global economy" OR geopolitics OR finance&lang=en&max=20&sortby=publishedAt&token=${GNEWS_KEY}`;
    try {
      const res = await fetch(url, { next: { revalidate: 300 } });
      if (res.ok) {
        const json = await res.json();
        const gnewsArticles = (json.articles || []).map((a) => ({
          title: a.title,
          source: a.source?.name || "NEWS",
          url: a.url,
          publishedAt: a.publishedAt,
          description: a.description,
        }));
        articles = [...articles, ...gnewsArticles];
      }
    } catch (err) {
      console.error("[GNews Fetch]", err.message);
    }
  }

  // 2. Fetch Finnhub (General Market & Global News)
  if (FINNHUB_KEY && FINNHUB_KEY !== "your_key_here") {
    // Finnhub category=general gives tons of OSINT / geopolitical / economic news
    const url = `https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_KEY}`;
    try {
      const res = await fetch(url, { next: { revalidate: 300 } });
      if (res.ok) {
        const json = await res.json();
        // Finnhub returns an array directly. Let's map up to 100 to populate the globe heavily.
        const finnArticles = (json || []).slice(0, 100).map((a) => ({
          title: a.headline,
          source: a.source || "FINNHUB",
          url: a.url,
          // Finnhub timestamp is in Unix seconds
          publishedAt: a.datetime ? new Date(a.datetime * 1000).toISOString() : new Date().toISOString(),
          description: a.summary,
        }));
        articles = [...articles, ...finnArticles];
      }
    } catch (err) {
      console.error("[Finnhub Fetch]", err.message);
    }
  }

  if (articles.length === 0) {
    if (cache.data) {
      return NextResponse.json({ success: true, articles: cache.data, stale: true });
    }
    return NextResponse.json({ 
      success: false, 
      noKey: !GNEWS_KEY && !FINNHUB_KEY, 
      message: "Both APIs failed or keys are missing.", 
      articles: [] 
    }, { status: 502 });
  }

  cache = { data: articles, timestamp: now };
  return NextResponse.json({ success: true, articles });
}
