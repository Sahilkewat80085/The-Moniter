import { NextResponse } from "next/server";

const FINNHUB_KEY = process.env.FINNHUB_API_KEY;

/**
 * Symbol map: our internal symbol → Finnhub symbol
 *
 * Finnhub free tier supports:
 *  - US stocks:  plain ticker  (AAPL, NVDA, …)
 *  - Indices:    ^GSPC, ^DJI, ^IXIC, ^VIX
 *  - Crypto:     BINANCE:BTCUSDT  (or COINBASE:BTC-USD)
 *  - Forex/Spot: OANDA:XAU_USD, OANDA:EUR_USD, etc.
 */
const TICKER_MAP = [
  { symbol: "GC=F",     display: "GOLD",    name: "Gold (Spot)",       finnhub: "OANDA:XAU_USD"   },
  { symbol: "^GSPC",    display: "S&P 500", name: "S&P 500",           finnhub: "^GSPC"            },
  { symbol: "BTC-USD",  display: "BTC",     name: "Bitcoin",           finnhub: "BINANCE:BTCUSDT" },
  { symbol: "ETH-USD",  display: "ETH",     name: "Ethereum",          finnhub: "BINANCE:ETHUSDT" },
  { symbol: "^DJI",     display: "DOW",     name: "Dow Jones",         finnhub: "^DJI"             },
  { symbol: "^IXIC",    display: "NASDAQ",  name: "Nasdaq Composite",  finnhub: "^IXIC"            },
  { symbol: "CL=F",     display: "OIL",     name: "Crude Oil (Brent)", finnhub: "OANDA:BCO_USD"   },
  { symbol: "DX-Y.NYB", display: "DXY",     name: "Dollar Index",      finnhub: "OANDA:USD_BASKET" },
  { symbol: "SI=F",     display: "SILVER",  name: "Silver (Spot)",     finnhub: "OANDA:XAG_USD"   },
  { symbol: "AAPL",     display: "AAPL",    name: "Apple Inc.",         finnhub: "AAPL"             },
  { symbol: "NVDA",     display: "NVDA",    name: "NVIDIA Corp.",       finnhub: "NVDA"             },
  { symbol: "TSLA",     display: "TSLA",    name: "Tesla Inc.",         finnhub: "TSLA"             },
  { symbol: "MSFT",     display: "MSFT",    name: "Microsoft",          finnhub: "MSFT"             },
  { symbol: "AMZN",     display: "AMZN",    name: "Amazon",             finnhub: "AMZN"             },
  { symbol: "META",     display: "META",    name: "Meta Platforms",     finnhub: "META"             },
  { symbol: "GOOGL",    display: "GOOGL",   name: "Alphabet",           finnhub: "GOOGL"            },
  { symbol: "XRP-USD",  display: "XRP",     name: "Ripple",            finnhub: "BINANCE:XRPUSDT" },
  { symbol: "SOL-USD",  display: "SOL",     name: "Solana",            finnhub: "BINANCE:SOLUSDT" },
  { symbol: "^VIX",     display: "VIX",     name: "Volatility Index",  finnhub: "^VIX"             },
  { symbol: "EURUSD=X", display: "EUR/USD", name: "Euro Dollar",       finnhub: "OANDA:EUR_USD"   },
];

// ─── Cache ────────────────────────────────────────────────────────────────
let priceCache = {};
let cacheTimestamp = 0;
const CACHE_TTL = 15_000; // 15 seconds

// ─── Fetch a single Finnhub quote ─────────────────────────────────────────
// GET /api/v1/quote?symbol=AAPL&token=KEY
// Response: { c: current, d: change, dp: changePercent, h, l, o, pc }
async function fetchQuote(finnhubSymbol) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(finnhubSymbol)}&token=${FINNHUB_KEY}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    // Don't use Next.js cache — we manage our own TTL
    cache: "no-store",
  });

  if (res.status === 429) throw new Error("Finnhub rate limit hit");
  if (!res.ok) throw new Error(`Finnhub ${res.status} for ${finnhubSymbol}`);

  const data = await res.json();

  // Finnhub returns { c: 0, d: 0, dp: 0 } when symbol is invalid/unavailable
  if (!data.c || data.c === 0) {
    throw new Error(`No price data for ${finnhubSymbol} (c=${data.c})`);
  }

  return {
    price: data.c,           // current price
    change: data.d ?? 0,     // change vs previous close
    changePercent: data.dp ?? 0, // change percent
  };
}

// ─── Main handler ─────────────────────────────────────────────────────────
export async function GET() {
  // Guard: key not set
  if (!FINNHUB_KEY || FINNHUB_KEY === "your_finnhub_key_here") {
    return NextResponse.json(
      { success: false, noKey: true, error: "Add FINNHUB_API_KEY to .env.local and restart the dev server." },
      { status: 503 }
    );
  }

  const now = Date.now();

  // Return cache if still fresh
  if (Object.keys(priceCache).length > 0 && now - cacheTimestamp < CACHE_TTL) {
    const data = buildResponse();
    return NextResponse.json({ success: true, data, cached: true });
  }

  // Fetch all symbols in parallel
  const results = await Promise.allSettled(
    TICKER_MAP.map(async (t) => {
      const quote = await fetchQuote(t.finnhub);
      return { symbol: t.symbol, ...quote };
    })
  );

  // Merge results into cache
  results.forEach((result, idx) => {
    const t = TICKER_MAP[idx];
    if (result.status === "fulfilled") {
      priceCache[t.symbol] = { ...result.value, error: false };
    } else {
      console.warn(`[stocks] ${t.symbol} (${t.finnhub}): ${result.reason?.message}`);
      // Keep stale value if we have it; otherwise mark as error
      if (!priceCache[t.symbol]) {
        priceCache[t.symbol] = { price: null, change: 0, changePercent: 0, error: true };
      }
    }
  });

  cacheTimestamp = now;
  const data = buildResponse();
  return NextResponse.json({ success: true, data });
}

function buildResponse() {
  return TICKER_MAP.map((t) => ({
    symbol: t.symbol,
    display: t.display,
    name: t.name,
    ...(priceCache[t.symbol] || { price: null, change: 0, changePercent: 0, error: true }),
  }));
}
