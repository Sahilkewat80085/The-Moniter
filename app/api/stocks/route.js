import { NextResponse } from "next/server";
import { fetchBatchQuotes } from "@/lib/stockService";

// Symbol map using Yahoo Finance symbols
const TICKER_MAP = [
  { symbol: "GC=F",     display: "GOLD",    name: "Gold Futures"        },
  { symbol: "^GSPC",    display: "S&P 500", name: "S&P 500"             },
  { symbol: "BTC-USD",  display: "BTC",     name: "Bitcoin"             },
  { symbol: "ETH-USD",  display: "ETH",     name: "Ethereum"            },
  { symbol: "^DJI",     display: "DOW",     name: "Dow Jones"           },
  { symbol: "^IXIC",    display: "NASDAQ",  name: "Nasdaq Composite"   },
  { symbol: "CL=F",     display: "OIL",     name: "Crude Oil WTI"       },
  { symbol: "DX=F",     display: "DXY",     name: "Dollar Index"        },
  { symbol: "SI=F",     display: "SILVER",  name: "Silver Futures"      },
  { symbol: "AAPL",     display: "AAPL",    name: "Apple Inc."          },
  { symbol: "NVDA",     display: "NVDA",    name: "NVIDIA Corp."        },
  { symbol: "TSLA",     display: "TSLA",    name: "Tesla Inc."          },
  { symbol: "MSFT",     display: "MSFT",    name: "Microsoft"           },
  { symbol: "AMZN",     display: "AMZN",    name: "Amazon"              },
  { symbol: "META",     display: "META",    name: "Meta Platforms"      },
  { symbol: "GOOGL",    display: "GOOGL",   name: "Alphabet"            },
  { symbol: "XRP-USD",  display: "XRP",     name: "Ripple"              },
  { symbol: "SOL-USD",  display: "SOL",     name: "Solana"              },
  { symbol: "^VIX",     display: "VIX",     name: "Volatility Index"    },
  { symbol: "EURUSD=X", display: "EUR/USD", name: "Euro Dollar"         },
];

let priceCache = {};
let cacheTimestamp = 0;
const CACHE_TTL = 15_000;

function buildResponse() {
  return TICKER_MAP.map((t) => {
    const cached = priceCache[t.symbol];
    return {
      symbol: t.symbol,
      display: t.display,
      name: t.name,
      price: cached?.price ?? null,
      change: cached?.change ?? 0,
      changePercent: cached?.changePercent ?? 0,
      error: cached?.error ?? (!cached?.price),
    };
  });
}

export async function GET() {
  const now = Date.now();

  // Return cache if still within TTL
  if (Object.keys(priceCache).length > 0 && now - cacheTimestamp < CACHE_TTL) {
    return NextResponse.json({ success: true, data: buildResponse(), cached: true });
  }

  try {
    const batchResults = await fetchBatchQuotes(TICKER_MAP, 6);

    // Merge new quotes while preserving last known good prices for failed items
    for (const t of TICKER_MAP) {
      const result = batchResults[t.symbol];
      if (result && !result.error && typeof result.price === "number") {
        priceCache[t.symbol] = result;
      } else if (!priceCache[t.symbol]) {
        priceCache[t.symbol] = result || { price: null, change: 0, changePercent: 0, error: true };
      }
    }

    cacheTimestamp = now;
    return NextResponse.json({ success: true, data: buildResponse() });
  } catch (err) {
    console.error("[stocks API error]:", err?.message || err);
    // Return stale cache if available
    if (Object.keys(priceCache).length > 0) {
      return NextResponse.json({ success: true, data: buildResponse(), stale: true });
    }
    return NextResponse.json({ success: false, data: buildResponse(), error: err.message }, { status: 500 });
  }
}