"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

// Which symbols we show in the right panel "Core Markets" grid
const PANEL_SYMBOLS = [
  { symbol: "GC=F", display: "GOLD", name: "Gold Futures" },
  { symbol: "^GSPC", display: "S&P 500", name: "S&P 500 Index" },
  { symbol: "BTC-USD", display: "BTC", name: "Bitcoin" },
  { symbol: "DX=F", altSymbol: "DX-Y.NYB", display: "DXY", name: "US Dollar Index" },
  { symbol: "CL=F", display: "OIL", name: "Crude Oil WTI" },
  { symbol: "^VIX", display: "VIX", name: "Volatility Index" },
];

function fmt(price, symbol) {
  if (price === null || price === undefined) return "—";
  if (price >= 10000) {
    return price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  if (price >= 1000) {
    return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (symbol?.includes("-USD") && price < 10) {
    return price.toFixed(4);
  }
  return price.toFixed(2);
}

export default function MarketTicker() {
  const [tickers, setTickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const abortControllerRef = useRef(null);

  const load = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch("/api/stocks", {
        cache: "no-store",
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const filtered = PANEL_SYMBOLS.map((ps) => {
          const match = json.data.find(
            (d) => d.symbol === ps.symbol || (ps.altSymbol && d.symbol === ps.altSymbol)
          );
          return match
            ? { ...match, display: ps.display, name: match.name || ps.name }
            : {
                symbol: ps.symbol,
                display: ps.display,
                name: ps.name,
                price: null,
                change: 0,
                changePercent: 0,
                error: true,
              };
        });
        setTickers(filtered);
      }
    } catch (e) {
      if (e.name !== "AbortError") {
        console.error("[MarketTicker] Fetch error:", e.message);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 15_000);
    return () => {
      clearInterval(id);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [load]);

  if (loading && tickers.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-3" aria-label="Loading Core Markets">
        {PANEL_SYMBOLS.map((s) => (
          <div
            key={s.symbol}
            className="p-3 bg-background/50 border border-border rounded-lg animate-pulse h-16 flex flex-col justify-between"
          >
            <div className="h-2 w-10 bg-slate-700/50 rounded" />
            <div className="h-4 w-16 bg-slate-700/50 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3" role="region" aria-label="Core Markets Overview">
      {tickers.map((ticker) => {
        const isUp = (ticker.changePercent || 0) >= 0;
        const color = ticker.error
          ? "var(--foreground)"
          : isUp
          ? "var(--positive-color)"
          : "var(--negative-color)";

        return (
          <div
            key={ticker.symbol}
            title={ticker.name}
            className="p-3 bg-panel/40 border border-border/70 rounded-lg flex flex-col gap-1 hover:border-info/50 hover:bg-panel/70 transition-all duration-200 group cursor-default"
          >
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span className="group-hover:text-slate-200 transition-colors uppercase font-bold tracking-wider">
                {ticker.display}
              </span>
              {!ticker.error && (
                <span style={{ color }} className="font-semibold tabular-nums">
                  {isUp ? "↑" : "↓"} {Math.abs(ticker.changePercent || 0).toFixed(2)}%
                </span>
              )}
            </div>
            <div className="text-base font-extrabold tabular-nums text-foreground group-hover:text-info transition-colors">
              {ticker.error ? "N/A" : fmt(ticker.price, ticker.symbol)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
