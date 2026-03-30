"use client";

import React, { useState, useEffect, useRef } from "react";

function formatPrice(price, symbol) {
  if (price === null || price === undefined) return "—";

  // Forex pairs show rate without $ sign
  if (symbol === "EURUSD=X") {
    return price.toFixed(4);
  }
  // Crypto under $10 show more precision
  if (symbol.includes("-USD") && price < 10) {
    return "$" + price.toFixed(4);
  }
  if (price >= 1000) {
    return "$" + price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return "$" + price.toFixed(2);
}

async function fetchStockData() {
  try {
    const res = await fetch("/api/stocks", { cache: "no-store" });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error("[StockTicker] fetchStockData error:", err.message);
    return null;
  }
}

export default function StockTicker() {
  const [tickerData, setTickerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const previousDataRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchStockData();
      if (data && data.length > 0) {
        previousDataRef.current = data;
        setTickerData(data);
      } else if (previousDataRef.current) {
        setTickerData(previousDataRef.current);
      }
      setIsLoading(false);
    };

    load();
    const interval = setInterval(load, 15_000);
    return () => clearInterval(interval);
  }, []);

  const getColor = (pct) => {
    if (pct > 0) return "#00c853";
    if (pct < 0) return "#ff4d4f";
    return "#9ca3af";
  };

  const items = tickerData.length ? [...tickerData, ...tickerData] : [];

  if (isLoading) {
    return (
      <div className="ticker-wrapper">
        <div className="ticker-track" style={{ justifyContent: "center" }}>
          <span className="ticker-item" style={{ color: "#64748b" }}>
            Connecting to market data...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="ticker-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={`ticker-track ${isPaused ? "paused" : ""}`}>
        {items.map((item, index) => (
          <span key={`${item.symbol}-${index}`} className="ticker-item">
            <span
              className="font-bold text-white text-xs tracking-wide"
              style={{ marginRight: "4px" }}
            >
              {item.display}
            </span>
            <span
              className="text-slate-300 text-xs font-mono"
              style={{ marginRight: "4px" }}
            >
              {item.error ? "N/A" : formatPrice(item.price, item.symbol)}
            </span>
            {!item.error && (
              <span
                className="text-xs font-mono font-semibold"
                style={{ color: getColor(item.changePercent) }}
              >
                ({item.changePercent >= 0 ? "+" : ""}
                {typeof item.changePercent === "number"
                  ? item.changePercent.toFixed(2)
                  : item.changePercent}
                %)
              </span>
            )}
            <span className="ticker-separator">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}