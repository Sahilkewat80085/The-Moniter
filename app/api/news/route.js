import { NextResponse } from "next/server";

const GNEWS_KEY = process.env.GNEWS_API_KEY;

let cache = { data: null, timestamp: 0 };
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  const now = Date.now();

  if (cache.data && now - cache.timestamp < CACHE_TTL) {
    return NextResponse.json({ success: true, articles: cache.data, cached: true });
  }

  if (!GNEWS_KEY || GNEWS_KEY === "your_key_here") {
    return NextResponse.json({
      success: false,
      noKey: true,
      articles: [],
      message: "Add GNEWS_API_KEY to .env.local — free at https://gnews.io/register",
    });
  }

  // Simple query for global business and geopolitics
  const url = `https://gnews.io/api/v4/search?q="global economy" OR geopolitics OR finance&lang=en&max=20&sortby=publishedAt&token=${GNEWS_KEY}`;

  try {
    const res = await fetch(url, {
      headers: { "Accept": "application/json" },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`GNews ${res.status}: ${text.slice(0, 200)}`);
    }

    const json = await res.json();

    const articles = (json.articles || []).map((a) => ({
      title: a.title,
      source: a.source?.name || "NEWS",
      url: a.url,
      publishedAt: a.publishedAt,
      description: a.description,
    }));

    cache = { data: articles, timestamp: now };
    return NextResponse.json({ success: true, articles });
  } catch (err) {
    console.error("[/api/news]", err.message);
    if (cache.data) {
      return NextResponse.json({ success: true, articles: cache.data, stale: true });
    }
    return NextResponse.json({ success: false, error: err.message, articles: [] }, { status: 502 });
  }
}
