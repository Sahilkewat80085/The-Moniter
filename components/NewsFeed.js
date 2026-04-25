"use client";

import React from "react";

export default function NewsFeed({ articles = [], loading = false }) {
  function timeAgo(publishedAt) {
    if (!publishedAt) return "";
    const now = new Date();
    const then = new Date(publishedAt);
    const diffMins = Math.floor((now - then) / 60000);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const hrs = Math.floor(diffMins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 rounded-lg bg-background/50 border border-border animate-pulse" />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <p className="text-[10px] text-slate-600 font-mono">No headlines available.</p>
    );
  }

  return (
    <div className="flex flex-col gap-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
      {articles.map((article, i) => (
        <a
          key={i}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group p-3 rounded-lg border border-border bg-background/30 hover:border-info/40 hover:bg-background/60 transition-all"
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-bold text-info uppercase tracking-widest">
              {article.source}
            </span>
            <span className="text-[9px] font-mono text-slate-600">
              {timeAgo(article.publishedAt)}
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-300 group-hover:text-white leading-snug transition-colors line-clamp-2">
            {article.title}
          </p>
        </a>
      ))}
    </div>
  );
}
