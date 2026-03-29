"use client";

import React, { useState, useEffect } from "react";

const INITIAL_TICKER_DATA = [
  { symbol: "GOLD", price: 2384.5, change: 0.82 },
  { symbol: "S&P 500", price: 5248.1, change: -0.45 },
  { symbol: "BTC", price: 67432.18, change: 2.34 },
  { symbol: "ETH", price: 3421.56, change: 1.89 },
  { symbol: "NASDAQ", price: 18392.45, change: -0.32 },
  { symbol: "DOW", price: 39127.24, change: 0.15 },
  { symbol: "OIL", price: 78.34, change: -1.24 },
  { symbol: "EUR/USD", price: 1.0847, change: 0.08 },
  { symbol: "GBP/USD", price: 1.2634, change: -0.21 },
  { symbol: "SILVER", price: 28.45, change: 0.67 },
  { symbol: "AAPL", price: 178.72, change: 0.93 },
  { symbol: "NVDA", price: 874.28, change: 3.21 },
  { symbol: "TSLA", price: 248.92, change: -2.15 },
  { symbol: "MSFT", price: 415.56, change: 0.45 },
  { symbol: "AMZN", price: 178.23, change: 1.12 },
  { symbol: "META", price: 493.12, change: -0.78 },
  { symbol: "GOOGL", price: 152.34, change: 0.34 },
  { symbol: "XRP", price: 0.5234, change: -0.56 },
  { symbol: "SOL", price: 142.67, change: 4.23 },
  { symbol: "VIX", price: 13.45, change: -5.67 },
];

function formatPrice(price, symbol) {
  if (symbol.includes("/") || price < 1) {
    return price.toFixed(4);
  }
  if (price > 1000) {
    return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  return price.toFixed(2);
}

export default function StockTicker() {
  const [tickerData, setTickerData] = useState(INITIAL_TICKER_DATA);
  const [isPaused, setIsPaused] = useState(false);

  // Simulate real-time price updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerData((prev) =>
        prev.map((item) => {
          const fluctuation = (Math.random() - 0.5) * 0.01;
          const newPrice = item.price * (1 + fluctuation);
          const newChange = item.change + fluctuation * 100;
          return {
            ...item,
            price: Number(newPrice.toFixed(item.price < 1 ? 4 : 2)),
            change: Number(newChange.toFixed(2)),
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getChangeColor = (change) => {
    if (change > 0) return "#00c853";
    if (change < 0) return "#ff4d4f";
    return "#9ca3af";
  };

  const getChangeSymbol = (change) => {
    return change > 0 ? "+" : "";
  };

  // Duplicate items for seamless loop
  const items = [...tickerData, ...tickerData];

  return (
    <div
      className="ticker-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={`ticker-track ${isPaused ? 'paused' : ''}`}>
        {items.map((item, index) => (
          <span key={`${item.symbol}-${index}`} className="ticker-item">
            <span className="font-bold text-white text-xs tracking-wide" style={{ marginRight: '4px' }}>
              {item.symbol}
            </span>
            <span className="text-slate-300 text-xs font-mono" style={{ marginRight: '4px' }}>
              {formatPrice(item.price, item.symbol)}
            </span>
            <span
              className="text-xs font-mono font-semibold"
              style={{ color: getChangeColor(item.change) }}
            >
              ({getChangeSymbol(item.change)}{item.change.toFixed(2)}%)
            </span>
            <span className="ticker-separator"> | </span>
          </span>
        ))}
      </div>
    </div>
  );
}