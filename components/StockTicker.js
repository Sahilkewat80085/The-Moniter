"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

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

export default function StockTicker() {
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
      const res = await fetch("/api/stocks", {
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
        console.error("[StockTicker] fetch error:", err.message);
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
      <div className="ticker-wrapper" role="region" aria-label="Global Market Ticker">
        <div className="ticker-track" style={{ justifyContent: "center" }}>
          <span className="ticker-item text-slate-500 font-mono text-xs">
            Connecting to global market feed...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="ticker-wrapper select-none"
      role="region"
      aria-label="Global Equities and Commodities Ticker"
      tabIndex={0}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className={`ticker-track ${isPaused ? "paused" : ""}`}>
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
                {item.error ? "N/A" : formatPrice(item.price, item.symbol)}
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