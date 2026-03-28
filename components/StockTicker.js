"use client";

import React, { useState, useEffect } from "react";

const INITIAL_TICKER_DATA = [
  { symbol: "GOLD", name: "Gold Futures", price: 2384.5, change: 0.82 },
  { symbol: "S&P 500", name: "S&P 500 Index", price: 5248.1, change: -0.45 },
  { symbol: "BTC", name: "Bitcoin", price: 67432.18, change: 2.34 },
  { symbol: "ETH", name: "Ethereum", price: 3421.56, change: 1.89 },
  { symbol: "NASDAQ", name: "Nasdaq 100", price: 18392.45, change: -0.32 },
  { symbol: "DOW", name: "Dow Jones", price: 39127.24, change: 0.15 },
  { symbol: "OIL", name: "Crude Oil WTI", price: 78.34, change: -1.24 },
  { symbol: "EUR/USD", name: "Euro Dollar", price: 1.0847, change: 0.08 },
  { symbol: "GBP/USD", name: "Pound Dollar", price: 1.2634, change: -0.21 },
  { symbol: "SILVER", name: "Silver Futures", price: 28.45, change: 0.67 },
  { symbol: "AAPL", name: "Apple Inc.", price: 178.72, change: 0.93 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 874.28, change: 3.21 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 248.92, change: -2.15 },
  { symbol: "MSFT", name: "Microsoft", price: 415.56, change: 0.45 },
  { symbol: "AMZN", name: "Amazon", price: 178.23, change: 1.12 },
  { symbol: "META", name: "Meta Platforms", price: 493.12, change: -0.78 },
  { symbol: "GOOGL", name: "Alphabet", price: 152.34, change: 0.34 },
  { symbol: "XRP", name: "Ripple", price: 0.5234, change: -0.56 },
  { symbol: "SOL", name: "Solana", price: 142.67, change: 4.23 },
  { symbol: "VIX", name: "Volatility Index", price: 13.45, change: -5.67 },
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
    if (change > 0) return "text-positive";
    if (change < 0) return "text-negative";
    return "text-gray-400";
  };

  const getChangeSymbol = (change) => {
    if (change > 0) return "+";
    return "";
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-8 bg-background border-t border-border z-50 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-animate {
          animation: ticker-scroll 40s linear infinite;
        }
        .ticker-animate.paused {
          animation-play-state: paused;
        }
      `}</style>
      <div
        className={`ticker-animate flex items-center h-full whitespace-nowrap ${isPaused ? 'paused' : ''}`}
        style={{ width: "fit-content" }}
      >
        {[...tickerData, ...tickerData].map((item, index) => (
          <React.Fragment key={`${item.symbol}-${index}`}>
            <div className="flex items-center gap-2 px-4 hover:bg-panel/50 transition-all duration-200 cursor-default group">
              <span className="font-bold text-white text-xs tracking-wide group-hover:text-info transition-colors">
                {item.symbol}
              </span>
              <span className="text-slate-300 text-xs font-mono">
                {formatPrice(item.price, item.symbol)}
              </span>
              <span className={`text-xs font-mono font-semibold ${getChangeColor(item.change)}`}>
                ({getChangeSymbol(item.change)}
                {item.change.toFixed(2)}%)
              </span>
            </div>
            {index < tickerData.length * 2 - 1 && (
              <span className="text-border text-xs mx-1">|</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}