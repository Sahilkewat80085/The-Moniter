import { NextResponse } from "next/server";

// ─── Symbol definitions ────────────────────────────────────────────────────
const ALL_TICKERS = [
  { symbol: "GC=F",     display: "GOLD",    name: "Gold Futures",     source: "stooq", stooq: "xauusd" },
  { symbol: "^GSPC",    display: "S&P 500", name: "S&P 500",          source: "stooq", stooq: "^spx"   },
  { symbol: "BTC-USD",  display: "BTC",     name: "Bitcoin",          source: "coinbase", coin: "BTC"   },
  { symbol: "ETH-USD",  display: "ETH",     name: "Ethereum",         source: "coinbase", coin: "ETH"   },
  { symbol: "^DJI",     display: "DOW",     name: "Dow Jones",        source: "stooq", stooq: "^dji"   },
  { symbol: "^IXIC",    display: "NASDAQ",  name: "Nasdaq",           source: "stooq", stooq: "^ndq"   },
  { symbol: "CL=F",     display: "OIL",     name: "Crude Oil WTI",   source: "stooq", stooq: "cl.f"   },
  { symbol: "DX-Y.NYB", display: "DXY",    name: "Dollar Index",     source: "stooq", stooq: "dx.f"   },
  { symbol: "SI=F",     display: "SILVER",  name: "Silver Futures",  source: "stooq", stooq: "xagusd"  },
  { symbol: "AAPL",     display: "AAPL",    name: "Apple Inc.",        source: "stooq", stooq: "aapl.us" },
  { symbol: "NVDA",     display: "NVDA",    name: "NVIDIA Corp.",      source: "stooq", stooq: "nvda.us" },
  { symbol: "TSLA",     display: "TSLA",    name: "Tesla Inc.",        source: "stooq", stooq: "tsla.us" },
  { symbol: "MSFT",     display: "MSFT",    name: "Microsoft",         source: "stooq", stooq: "msft.us" },
  { symbol: "AMZN",     display: "AMZN",    name: "Amazon",            source: "stooq", stooq: "amzn.us" },
  { symbol: "META",     display: "META",    name: "Meta Platforms",    source: "stooq", stooq: "meta.us" },
  { symbol: "GOOGL",    display: "GOOGL",   name: "Alphabet",          source: "stooq", stooq: "googl.us"},
  { symbol: "XRP-USD",  display: "XRP",     name: "Ripple",           source: "coinbase", coin: "XRP"   },
  { symbol: "SOL-USD",  display: "SOL",     name: "Solana",           source: "coinbase", coin: "SOL"   },
  { symbol: "^VIX",     display: "VIX",     name: "Volatility Index", source: "stooq", stooq: "^vix"   },
  { symbol: "EURUSD=X", display: "EUR/USD", name: "Euro Dollar",      source: "stooq", stooq: "eurusd"  },
];

// ─── Cache ────────────────────────────────────────────────────────────────
let priceCache = {};
let cacheTimestamp = 0;
const CACHE_TTL = 15_000;

// ─── Coinbase public API ──────────────────────────────────────────────────
async function fetchCoinbase(coin) {
  const r = await fetch(`https://api.coinbase.com/v2/prices/${coin}-USD/spot`, {
    headers: { Accept: "application/json" },
  });
  if (!r.ok) throw new Error(`Coinbase ${r.status}`);
  const j = await r.json();
  return parseFloat(j.data.amount);
}

// ─── Stooq CSV API (free, no auth) ───────────────────────────────────────
// CSV header: Symbol,Date,Time,Open,High,Low,Close,Volume
async function fetchStooq(stooqSymbol) {
  const url = `https://stooq.com/q/l/?s=${encodeURIComponent(stooqSymbol)}&f=sd2t2ohlcv&e=csv`;
  const r = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36",
      Accept: "*/*",
    },
  });
  if (!r.ok) throw new Error(`Stooq HTTP ${r.status}`);
  const text = await r.text();
  const lines = text.trim().split("\n");
  if (lines.length < 1) throw new Error(`Stooq empty response for ${stooqSymbol}`);
  // Stooq returns NO header — data is directly on line 0
  // Format: Symbol,Date,Time,Open,High,Low,Close,Volume
  const cols = lines[0].split(",");
  const close = parseFloat(cols[6]);
  const open  = parseFloat(cols[3]);
  if (isNaN(close) || close === 0) throw new Error(`Stooq bad data for ${stooqSymbol}: close=${cols[6]}`);
  const change = close - open;
  const changePercent = open !== 0 ? (change / open) * 100 : 0;
  return { price: close, change, changePercent };
}

// ─── Main route ───────────────────────────────────────────────────────────
export async function GET() {
  const now = Date.now();

  if (Object.keys(priceCache).length > 0 && now - cacheTimestamp < CACHE_TTL) {
    const data = ALL_TICKERS.map(t => ({
      symbol: t.symbol, display: t.display, name: t.name,
      ...(priceCache[t.symbol] || { price: null, change: 0, changePercent: 0, error: true }),
    }));
    return NextResponse.json({ success: true, data, cached: true });
  }

  const newCache = {};

  // Run all fetches in parallel
  await Promise.allSettled(
    ALL_TICKERS.map(async t => {
      try {
        if (t.source === "coinbase") {
          const price = await fetchCoinbase(t.coin);
          const prev = priceCache[t.symbol];
          const change = prev?.price ? price - prev.price : 0;
          const changePercent = prev?.price ? (change / prev.price) * 100 : 0;
          newCache[t.symbol] = { price, change, changePercent, error: false };
        } else {
          // stooq for everything else
          const result = await fetchStooq(t.stooq);
          newCache[t.symbol] = { ...result, error: false };
        }
      } catch (e) {
        console.warn(`[stocks] ${t.symbol} (${t.source}/${t.stooq || t.coin}) failed: ${e.message}`);
        // Keep previous value if available
        if (priceCache[t.symbol] && !priceCache[t.symbol].error) {
          newCache[t.symbol] = { ...priceCache[t.symbol] };
        } else {
          newCache[t.symbol] = { price: null, change: 0, changePercent: 0, error: true };
        }
      }
    })
  );

  Object.assign(priceCache, newCache);
  cacheTimestamp = now;

  const data = ALL_TICKERS.map(t => ({
    symbol: t.symbol, display: t.display, name: t.name,
    ...(priceCache[t.symbol] || { price: null, change: 0, changePercent: 0, error: true }),
  }));

  return NextResponse.json({ success: true, data });
}
