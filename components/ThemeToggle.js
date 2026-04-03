"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full border border-border bg-panel flex items-center justify-center opacity-50"></div>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-8 h-8 rounded-full border border-border bg-panel flex items-center justify-center cursor-pointer hover:border-info hover:text-info transition-colors focus:outline-none"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-slate-400 hover:text-info transition-colors" />
      ) : (
        <Moon className="w-4 h-4 text-slate-500 hover:text-info transition-colors" />
      )}
    </button>
  );
}
