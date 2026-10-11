import { NextResponse } from "next/server";
import { fetchBatchQuotes } from "@/lib/stockService";

// Indian NSE stocks - Yahoo Finance symbols
const INDIAN_TICKER_MAP = [
  { symbol: "RELIANCE.NS",   display: "RELIANCE",  name: "Reliance Industries"  },
  { symbol: "TCS.NS",        display: "TCS",       name: "Tata Consultancy"     },
  { symbol: "INFY.NS",       display: "INFY",      name: "Infosys"              },
  { symbol: "HDFCBANK.NS",   display: "HDFC",      name: "HDFC Bank"            },
  { symbol: "ICICIBANK.NS",  display: "ICICI",     name: "ICICI Bank"           },
  { symbol: "BHARTIARTL.NS", display: "BHARTI",    name: "Bharti Airtel"        },
  { symbol: "ITC.NS",        display: "ITC",       name: "ITC Ltd"              },
  { symbol: "SBIN.NS",       display: "SBIN",      name: "State Bank of India"  },
  { symbol: "KOTAKBANK.NS",  display: "KOTAK",     name: "Kotak Mahindra Bank"  },
  { symbol: "LT.NS",         display: "LT",        name: "Larsen & Toubro"      },
  { symbol: "WIPRO.NS",      display: "WIPRO",     name: "Wipro"                },
  { symbol: "HCLTECH.NS",    display: "HCL",       name: "HCL Technologies"     },
  { symbol: "MARUTI.NS",     display: "MARUTI",    name: "Maruti Suzuki"        },
  { symbol: "AXISBANK.NS",   display: "AXIS",      name: "Axis Bank"            },
  { symbol: "TATAMOTORS.NS", display: "TATAMOT",   name: "Tata Motors"          },
  { symbol: "SUNPHARMA.NS",  display: "SUNPH",     name: "Sun Pharma"           },
  { symbol: "^NSEI",         display: "NIFTY 50",  name: "Nifty 50 Index"       },
  { symbol: "BAJFINANCE.NS", display: "BAJFIN",    name: "Bajaj Finance"        },
  { symbol: "ASIANPAINT.NS", display: "ASIANPT",   name: "Asian Paints"         },
  { symbol: "TITAN.NS",      display: "TITAN",     name: "Titan Company"        },
];

let priceCache = {};
let cacheTimestamp = 0;
const CACHE_TTL = 15_000;

function buildResponse() {
  return INDIAN_TICKER_MAP.map((t) => {
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

  // Return fresh cache
  if (Object.keys(priceCache).length > 0 && now - cacheTimestamp < CACHE_TTL) {
    return NextResponse.json({ success: true, data: buildResponse(), cached: true });
  }

  try {
    const batchResults = await fetchBatchQuotes(INDIAN_TICKER_MAP, 6);

    for (const t of INDIAN_TICKER_MAP) {
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
    console.error("[indian-stocks API error]:", err?.message || err);
    if (Object.keys(priceCache).length > 0) {
      return NextResponse.json({ success: true, data: buildResponse(), stale: true });
    }
    return NextResponse.json({ success: false, data: buildResponse(), error: err.message }, { status: 500 });
  }
}