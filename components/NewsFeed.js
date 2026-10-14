"use client";

import React, { useMemo } from "react";

function formatTimeAgo(publishedAt) {
  if (!publishedAt) return "";
  const parsed = Date.parse(publishedAt);
  if (Number.isNaN(parsed)) return "";
  const diffMins = Math.floor((Date.now() - parsed) / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const hrs = Math.floor(diffMins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NewsFeed({ articles = [], loading = false }) {
  const renderedArticles = useMemo(() => {
    return Array.isArray(articles) ? articles : [];
  }, [articles]);

  if (loading) {
    return (
      <div className="flex flex-col gap-2.5" aria-label="Loading headlines">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-16 rounded-lg bg-panel/30 border border-border/60 animate-pulse p-3 flex flex-col justify-between"
          >
            <div className="flex justify-between">
              <div className="h-2 w-14 bg-slate-700/40 rounded" />
              <div className="h-2 w-10 bg-slate-700/40 rounded" />
            </div>
            <div className="h-3 w-4/5 bg-slate-700/40 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (renderedArticles.length === 0) {
    return (
      <div className="p-4 rounded-lg border border-dashed border-border/60 text-center bg-panel/20">
        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
          No headlines currently in feed
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-2 max-h-72 overflow-y-auto custom-scrollbar pr-1 select-none"
      role="feed"
      aria-label="Financial News Stream"
    >
      {renderedArticles.map((article, i) => {
        const key = article.url || `${article.title}-${i}`;
        const timeStr = formatTimeAgo(article.publishedAt);

        return (
          <a
            key={key}
            href={article.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-lg border border-border/70 bg-panel/30 hover:border-info/40 hover:bg-panel/60 transition-all duration-200 block outline-none focus-visible:ring-1 focus-visible:ring-info"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-bold text-info uppercase tracking-widest flex items-center gap-1">
                {article.source || "OSINT"}
              </span>
              {timeStr && (
                <span className="text-[9px] font-mono text-slate-500 tabular-nums">
                  {timeStr}
                </span>
              )}
            </div>
            <p className="text-[11px] font-semibold text-slate-300 group-hover:text-white leading-snug transition-colors line-clamp-2">
              {article.title}
            </p>
          </a>
        );
      })}
    </div>
  );
}
