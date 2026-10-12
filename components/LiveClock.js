"use client";

import React, { useState, useEffect } from "react";

const istFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const utcFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "UTC",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export default function LiveClock() {
  const [times, setTimes] = useState({ ist: "--:--:--", utc: "--:--:--" });
  const [showUtc, setShowUtc] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimes({
        ist: istFormatter.format(now),
        utc: utcFormatter.format(now),
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <button
      type="button"
      onClick={() => setShowUtc((prev) => !prev)}
      title="Click to toggle IST / UTC"
      className="flex flex-col items-end px-2 py-1 rounded hover:bg-slate-800/40 transition-colors focus:outline-none"
    >
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
          {showUtc ? "UTC / ZULU" : "IST (UTC+5:30)"}
        </span>
      </div>
      <span className="text-sm font-mono tracking-wider tabular-nums font-semibold text-foreground">
        {showUtc ? times.utc : times.ist}
      </span>
    </button>
  );
}