"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        className="w-8 h-8 rounded-full border border-border bg-panel/60 flex items-center justify-center opacity-40 animate-pulse" 
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-8 h-8 rounded-full border border-border bg-panel flex items-center justify-center cursor-pointer hover:border-info hover:bg-panel/80 transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-info active:scale-95 group"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:rotate-45 transition-all duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-slate-600 group-hover:text-info group-hover:-rotate-12 transition-all duration-300" />
      )}
    </button>
  );
}
