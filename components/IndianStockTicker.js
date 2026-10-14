"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

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

export default function IndianStockTicker() {
  const [tickerData, setTickerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const previousDataRef = useRef(null);
  const abortControllerRef = useRef(null);

  const loadData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch("/api/indian-stocks", {
        cache: "no-store",
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        previousDataRef.current = json.data;
        setTickerData(json.data);
      } else if (previousDataRef.current) {
        setTickerData(previousDataRef.current);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("[IndianStockTicker] fetch error:", err.message);
        if (previousDataRef.current) {
          setTickerData(previousDataRef.current);
        }
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15_000);
    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadData]);

  const getColor = (pct) => {
    if (pct > 0) return "var(--positive-color)";
    if (pct < 0) return "var(--negative-color)";
    return "var(--foreground)";
  };

  const items = useMemo(() => {
    return tickerData.length ? [...tickerData, ...tickerData] : [];
  }, [tickerData]);

  if (isLoading && items.length === 0) {
    return (
      <div className="ticker-wrapper ticker-top" role="region" aria-label="Indian Market Ticker">
        <div className="ticker-track ticker-track-reverse" style={{ justifyContent: "center" }}>
          <span className="ticker-item text-slate-500 font-mono text-xs">
            Connecting to Indian market feed...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="ticker-wrapper ticker-top select-none"
      role="region"
      aria-label="Indian NSE Equities Ticker"
      tabIndex={0}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className={`ticker-track ticker-track-reverse ${isPaused ? "paused" : ""}`}>
        {items.map((item, index) => {
          const isPositive = (item.changePercent || 0) >= 0;
          return (
            <span key={`${item.symbol}-${index}`} className="ticker-item">
              <span
                className="font-bold text-foreground text-xs tracking-wide"
                style={{ marginRight: "4px" }}
              >
                {item.display}
              </span>
              <span
                className="text-slate-400 dark:text-slate-300 text-xs font-mono tabular-nums"
                style={{ marginRight: "4px" }}
              >
                {item.error ? "N/A" : formatPriceINR(item.price)}
              </span>
              {!item.error && (
                <span
                  className="text-xs font-mono font-semibold tabular-nums"
                  style={{ color: getColor(item.changePercent) }}
                >
                  ({isPositive ? "+" : ""}
                  {typeof item.changePercent === "number"
                    ? item.changePercent.toFixed(2)
                    : item.changePercent}
                  %)
                </span>
              )}
              <span className="ticker-separator">|</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}