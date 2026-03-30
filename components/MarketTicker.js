"use client";

import React, { useState, useEffect } from "react";

// Which symbols we show in the right panel "Global Markets" grid
const PANEL_SYMBOLS = [
  { symbol: "GC=F", display: "GOLD" },
  { symbol: "^GSPC", display: "S&P 500" },
  { symbol: "BTC-USD", display: "BTC" },
  { symbol: "DX-Y.NYB", display: "DXY" },
  { symbol: "CL=F", display: "OIL" },
  { symbol: "^VIX", display: "VIX" },
];

function fmt(price, symbol) {
  if (price === null || price === undefined) return "—";
  if (price >= 10000) return price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  if (price >= 1000) return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price < 10) return price.toFixed(4);
  return price.toFixed(2);
}

export default function MarketTicker() {
  const [tickers, setTickers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetch("/api/stocks", { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.data) {
        const filtered = PANEL_SYMBOLS.map((ps) => {
          const match = json.data.find((d) => d.symbol === ps.symbol);
          return match
            ? { ...match, display: ps.display }
            : { symbol: ps.symbol, display: ps.display, price: null, change: 0, changePercent: 0, error: true };
        });
        setTickers(filtered);
      }
    } catch (e) {
      console.error("[MarketTicker]", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 15_000);
    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {PANEL_SYMBOLS.map((s) => (
          <div key={s.symbol} className="p-3 bg-background border border-border rounded-lg animate-pulse h-16" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {tickers.map((ticker) => {
        const isUp = ticker.changePercent >= 0;
        const color = ticker.error
          ? "#4b5563"
          : isUp
          ? "#00c853"
          : "#ff4d4f";

        return (
          <div
            key={ticker.symbol}
            className="p-3 bg-background border border-border rounded-lg flex flex-col gap-1 hover:border-info/50 transition-colors group"
          >
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span className="group-hover:text-slate-300 transition-colors uppercase">
                {ticker.display}
              </span>
              {!ticker.error && (
                <span style={{ color }} className="font-semibold">
                  {isUp ? "↑" : "↓"} {Math.abs(ticker.changePercent).toFixed(2)}%
                </span>
              )}
            </div>
            <div className="text-lg font-bold tabular-nums group-hover:text-white transition-colors" style={{ color: ticker.error ? "#4b5563" : "#e2e8f0" }}>
              {ticker.error ? "N/A" : fmt(ticker.price, ticker.symbol)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
