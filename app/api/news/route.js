import { NextResponse } from "next/server";

// GNews free tier: 100 req/day — https://gnews.io/register
// Set GNEWS_API_KEY in .env.local
const GNEWS_KEY = process.env.GNEWS_API_KEY;

let cache = { data: null, timestamp: 0 };
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes – news doesn't need rapid polling

export async function GET() {
  const now = Date.now();

  if (cache.data && now - cache.timestamp < CACHE_TTL) {
    return NextResponse.json({ success: true, articles: cache.data, cached: true });
  }

  if (!GNEWS_KEY) {
    // Return helpful fallback so UI gracefully degrades
    return NextResponse.json({
      success: false,
      noKey: true,
      articles: [],
      message: "Add GNEWS_API_KEY to .env.local — free at https://gnews.io/register",
    });
  }

  const query = encodeURIComponent("stock market OR financial markets OR Fed OR economy");
  const url = `https://gnews.io/api/v4/search?q=${query}&lang=en&country=us&max=10&sortby=publishedAt&token=${GNEWS_KEY}`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });

    if (!res.ok) {
      throw new Error(`GNews responded with ${res.status}`);
    }

    const json = await res.json();

    const articles = (json.articles || []).map((a) => ({
      title: a.title,
      source: a.source?.name || "NEWS",
      url: a.url,
      publishedAt: a.publishedAt,
      description: a.description,
      image: a.image || null,
    }));

    cache = { data: articles, timestamp: now };

    return NextResponse.json({ success: true, articles });
  } catch (err) {
    console.error("[/api/news] fetch error:", err.message);

    if (cache.data) {
      return NextResponse.json({ success: true, articles: cache.data, stale: true });
    }

    return NextResponse.json(
      { success: false, error: err.message, articles: [] },
      { status: 502 }
    );
  }
}
