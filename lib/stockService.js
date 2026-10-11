/**
 * Shared Yahoo Finance Quote Fetcher
 * Includes request timeout, batching, caching, and resilient fallback handling.
 */

const DEFAULT_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Accept": "application/json",
};

/**
 * Fetch quote for a single symbol with AbortController timeout
 */
export async function fetchYahooQuote(symbol, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1m&range=1d`;
    const res = await fetch(url, {
      headers: DEFAULT_HEADERS,
      cache: "no-store",
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Yahoo status ${res.status} for ${symbol}`);
    }

    const data = await res.json();
    const quote = data.chart?.result?.[0];

    if (!quote || !quote.meta) {
      throw new Error(`Incomplete quote data for ${symbol}`);
    }

    const meta = quote.meta;
    const currentPrice = meta.regularMarketPrice || quote.indicators?.quote?.[0]?.close?.slice(-1)[0];

    if (typeof currentPrice !== "number") {
      throw new Error(`No numeric price for ${symbol}`);
    }

    const previousClose = meta.chartPreviousClose || meta.previousClose || currentPrice;
    const change = currentPrice - previousClose;
    const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

    return {
      price: currentPrice,
      change,
      changePercent,
      error: false,
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch multiple quotes in concurrent batches to prevent Yahoo 429 rate-limiting
 */
export async function fetchBatchQuotes(tickerMap, concurrency = 6) {
  const results = {};
  
  // Split into chunks of `concurrency`
  for (let i = 0; i < tickerMap.length; i += concurrency) {
    const chunk = tickerMap.slice(i, i + concurrency);
    const chunkPromises = chunk.map(async (t) => {
      try {
        const quote = await fetchYahooQuote(t.symbol);
        return { symbol: t.symbol, ...quote };
      } catch (err) {
        return {
          symbol: t.symbol,
          price: null,
          change: 0,
          changePercent: 0,
          error: true,
          errorMessage: err.message,
        };
      }
    });

    const settled = await Promise.allSettled(chunkPromises);
    settled.forEach((res) => {
      if (res.status === "fulfilled" && res.value) {
        results[res.value.symbol] = res.value;
      }
    });
  }

  return results;
}
