"use client";

import { useState, useEffect } from "react";

export default function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // India timezone (IST = UTC+5:30)
      const indiaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

      const hours = indiaTime.getHours().toString().padStart(2, "0");
      const minutes = indiaTime.getMinutes().toString().padStart(2, "0");
      const seconds = indiaTime.getSeconds().toString().padStart(2, "0");

      setTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-end">
      <span className="text-[10px] text-slate-500 font-mono uppercase">IND</span>
      <span className="text-sm font-mono tracking-wider tabular-nums">{time}</span>
    </div>
  );
}