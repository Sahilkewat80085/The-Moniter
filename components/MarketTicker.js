import React from "react";

export default function MarketTicker({ ticker }) {
  const isUp = ticker.trend === "up";
  
  return (
    <div className="p-3 bg-background border border-border rounded-lg flex flex-col gap-1 hover:border-info/50 transition-colors group">
      <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
        <span className="group-hover:text-slate-300 transition-colors uppercase">{ticker.symbol}</span>
        <span className={isUp ? "text-positive" : "text-negative"}>
          {isUp ? "↑" : "↓"} {ticker.change}
        </span>
      </div>
      <div className="text-lg font-bold tabular-nums text-slate-200 group-hover:text-white transition-colors">
        {ticker.price}
      </div>
    </div>
  );
}
