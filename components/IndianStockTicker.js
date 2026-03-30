"use client";

import React, { useState, useEffect, useRef } from "react";

function formatPriceINR(price) {
  if (price === null || price === undefined) return "—";
  if (price >= 10000) {
    return "₹" + price.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  if (price >= 1000) {
    return "₹" + price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return "₹" + price.toFixed(2);
}

async function fetchIndianStockData() {
  try {
    const res = await fetch("/api/indian-stocks", { cache: "no-store" });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error("[IndianStockTicker] fetch error:", err.message);
    return null;
  }
}

export default function IndianStockTicker() {
  const [tickerData, setTickerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const previousDataRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchIndianStockData();
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
      <div className="ticker-wrapper ticker-top">
        <div className="ticker-track ticker-track-reverse" style={{ justifyContent: "center" }}>
          <span className="ticker-item" style={{ color: "#64748b" }}>
            Connecting to Indian market data...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="ticker-wrapper ticker-top"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={`ticker-track ticker-track-reverse ${isPaused ? "paused" : ""}`}>
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
              {item.error ? "N/A" : formatPriceINR(item.price)}
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