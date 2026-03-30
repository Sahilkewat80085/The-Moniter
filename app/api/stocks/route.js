import { NextResponse } from "next/server";

const TICKER_SYMBOLS = [
  { symbol: "GC=F", display: "GOLD", name: "Gold Futures" },
  { symbol: "^GSPC", display: "S&P 500", name: "S&P 500 Index" },
  { symbol: "BTC-USD", display: "BTC", name: "Bitcoin" },
  { symbol: "ETH-USD", display: "ETH", name: "Ethereum" },
  { symbol: "^DJI", display: "DOW", name: "Dow Jones" },
  { symbol: "^IXIC", display: "NASDAQ", name: "Nasdaq" },
  { symbol: "CL=F", display: "OIL", name: "Crude Oil WTI" },
  { symbol: "DX-Y.NYB", display: "DXY", name: "Dollar Index" },
  { symbol: "SI=F", display: "SILVER", name: "Silver Futures" },
  { symbol: "AAPL", display: "AAPL", name: "Apple Inc." },
  { symbol: "NVDA", display: "NVDA", name: "NVIDIA Corp." },
  { symbol: "TSLA", display: "TSLA", name: "Tesla Inc." },
  { symbol: "MSFT", display: "MSFT", name: "Microsoft" },
  { symbol: "AMZN", display: "AMZN", name: "Amazon" },
  { symbol: "META", display: "META", name: "Meta Platforms" },
  { symbol: "GOOGL", display: "GOOGL", name: "Alphabet" },
  { symbol: "XRP-USD", display: "XRP", name: "Ripple" },
  { symbol: "SOL-USD", display: "SOL", name: "Solana" },
  { symbol: "^VIX", display: "VIX", name: "Volatility Index" },
  { symbol: "EURUSD=X", display: "EUR/USD", name: "Euro Dollar" },
];

// Cache the result for 10 seconds to avoid hammering Yahoo
let cache = { data: null, timestamp: 0 };
const CACHE_TTL = 10_000;

export async function GET() {
  const now = Date.now();

  // Return cached data if still fresh
  if (cache.data && now - cache.timestamp < CACHE_TTL) {
    return NextResponse.json({ success: true, data: cache.data, cached: true });
  }

  const symbols = TICKER_SYMBOLS.map((t) => t.symbol).join(",");

  // Yahoo Finance v7 – no API key needed, server-side has no CORS restriction
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,shortName`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      // Next.js cache: revalidate every 10 seconds
      next: { revalidate: 10 },
    });

    if (!res.ok) {
      throw new Error(`Yahoo Finance responded with ${res.status}`);
    }

    const json = await res.json();
    const quotes = json?.quoteResponse?.result || [];

    const data = TICKER_SYMBOLS.map((ticker) => {
      const q = quotes.find((r) => r.symbol === ticker.symbol);
      if (!q) {
        return {
          symbol: ticker.symbol,
          display: ticker.display,
          name: ticker.name,
          price: null,
          change: 0,
          changePercent: 0,
          error: true,
        };
      }

      return {
        symbol: ticker.symbol,
        display: ticker.display,
        name: ticker.name,
        price: q.regularMarketPrice ?? null,
        change: q.regularMarketChange ?? 0,
        changePercent: q.regularMarketChangePercent ?? 0,
        error: false,
      };
    });

    // Update cache
    cache = { data, timestamp: now };

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[/api/stocks] fetch error:", err.message);

    // Return stale cache if available
    if (cache.data) {
      return NextResponse.json({ success: true, data: cache.data, stale: true });
    }

    return NextResponse.json(
      { success: false, error: err.message },
      { status: 502 }
    );
  }
}
