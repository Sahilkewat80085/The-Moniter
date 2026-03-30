import { NextResponse } from "next/server";

// Indian NSE stocks - Yahoo Finance symbols
const INDIAN_TICKER_MAP = [
  { symbol: "RELIANCE.NS",  display: "RELIANCE",  name: "Reliance Industries"  },
  { symbol: "TCS.NS",       display: "TCS",       name: "Tata Consultancy"     },
  { symbol: "INFY.NS",      display: "INFY",      name: "Infosys"              },
  { symbol: "HDFCBANK.NS",  display: "HDFC",      name: "HDFC Bank"            },
  { symbol: "ICICIBANK.NS", display: "ICICI",     name: "ICICI Bank"           },
  { symbol: "BHARTIARTL.NS",display: "BHARTI",    name: "Bharti Airtel"        },
  { symbol: "ITC.NS",       display: "ITC",       name: "ITC Ltd"              },
  { symbol: "SBIN.NS",      display: "SBIN",      name: "State Bank of India"  },
  { symbol: "KOTAKBANK.NS", display: "KOTAK",     name: "Kotak Mahindra Bank"  },
  { symbol: "LT.NS",        display: "LT",        name: "Larsen & Toubro"      },
  { symbol: "WIPRO.NS",     display: "WIPRO",     name: "Wipro"                },
  { symbol: "HCLTECH.NS",   display: "HCL",       name: "HCL Technologies"     },
  { symbol: "MARUTI.NS",    display: "MARUTI",    name: "Maruti Suzuki"        },
  { symbol: "AXISBANK.NS",  display: "AXIS",      name: "Axis Bank"            },
  { symbol: "TATAMOTORS.NS",display: "TATAMOT",   name: "Tata Motors"          },
  { symbol: "SUNPHARMA.NS", display: "SUNPH",     name: "Sun Pharma"           },
  { symbol: "^NSEI",        display: "NIFTY 50",  name: "Nifty 50 Index"       },
  { symbol: "BAJFINANCE.NS",display: "BAJFIN",    name: "Bajaj Finance"        },
  { symbol: "ASIANPAINT.NS",display: "ASIANPT",   name: "Asian Paints"         },
  { symbol: "TITAN.NS",     display: "TITAN",     name: "Titan Company"        },
];

// Cache
let priceCache = {};
let cacheTimestamp = 0;
const CACHE_TTL = 15_000;

async function fetchYahooQuote(symbol) {
  // Yahoo Finance API - free, no key required
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1m&range=1d`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Yahoo ${res.status} for ${symbol}`);

  const data = await res.json();
  const quote = data.chart?.result?.[0];

  if (!quote || !quote.meta) {
    throw new Error(`No data for ${symbol}`);
  }

  const meta = quote.meta;
  const currentPrice = meta.regularMarketPrice || quote.indicators?.quote?.[0]?.close?.slice(-1)[0];

  if (!currentPrice) {
    throw new Error(`No price for ${symbol}`);
  }

  const previousClose = meta.chartPreviousClose || meta.previousClose || currentPrice;
  const change = currentPrice - previousClose;
  const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

  return {
    price: currentPrice,
    change: change,
    changePercent: changePercent,
  };
}

export async function GET() {
  const now = Date.now();

  // Return cache if fresh
  if (Object.keys(priceCache).length > 0 && now - cacheTimestamp < CACHE_TTL) {
    const data = buildResponse();
    return NextResponse.json({ success: true, data, cached: true });
  }

  // Fetch all symbols in parallel
  const results = await Promise.allSettled(
    INDIAN_TICKER_MAP.map(async (t) => {
      const quote = await fetchYahooQuote(t.symbol);
      return { symbol: t.symbol, ...quote };
    })
  );

  // Merge results
  results.forEach((result, idx) => {
    const t = INDIAN_TICKER_MAP[idx];
    if (result.status === "fulfilled") {
      priceCache[t.symbol] = { ...result.value, error: false };
    } else {
      console.warn(`[indian-stocks] ${t.symbol}: ${result.reason?.message}`);
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
  return INDIAN_TICKER_MAP.map((t) => ({
    symbol: t.symbol,
    display: t.display,
    name: t.name,
    ...(priceCache[t.symbol] || { price: null, change: 0, changePercent: 0, error: true }),
  }));
}