"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import {
  HistoryEntry,
  loadHistory,
  deleteEntry,
  clearHistory,
} from "@/lib/history";
import { loadProgress } from "@/lib/progress";
import type { Progress } from "@/lib/progress";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

export default function HistoryPage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
    setEntries(loadHistory());
  }, []);

  function handleDelete(id: string) {
    setEntries(deleteEntry(id));
    if (expanded === id) setExpanded(null);
  }

  function handleClearAll() {
    if (confirm("Delete all prompt history? This cannot be undone.")) {
      clearHistory();
      setEntries([]);
    }
  }

  return (
    <main className="min-h-screen">
      <Header progress={progress} />

      <div className="mx-auto max-w-3xl px-5 py-10">
        <Link href="/" className="text-sm text-muted hover:text-ink">
          ← Back to the tree
        </Link>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Your work</p>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">
              Prompt History
            </h1>
            <p className="mt-1 text-muted text-sm">
              Every attempt you've submitted — lesson rewrites and free refines.
            </p>
          </div>
          {entries.length > 0 && (
            <button
              onClick={handleClearAll}
              className="btn-quiet text-sm shrink-0"
            >
              Clear all
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="card mt-8 p-10 text-center text-muted">
            No history yet. Submit a lesson or use Free Refine.
          </div>
        ) : (
          <ul className="mt-6 flex flex-col gap-3">
            {entries.map((entry) => (
              <li key={entry.id}>
                <div className="card p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={[
                          "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          entry.type === "lesson"
                            ? "bg-violet-soft text-violet-dark"
                            : "bg-gold/15 text-gold",
                        ].join(" ")}
                      >
                        {entry.type === "lesson" ? "Lesson" : "Free Refine"}
                      </span>
                      <span className="font-display text-sm font-bold">
                        {entry.title}
                      </span>
                      {entry.type === "lesson" && typeof entry.score === "number" && (
                        <span
                          className={[
                            "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            entry.passed
                              ? "bg-green/15 text-green"
                              : "bg-gold/15 text-gold",
                          ].join(" ")}
                        >
                          {entry.passed ? "Passed" : "Failed"} · {entry.score}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted">
                        {timeAgo(entry.timestamp)}
                      </span>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-xs text-muted hover:text-ink transition-colors px-1"
                        aria-label="Delete entry"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setExpanded(expanded === entry.id ? null : entry.id)
                    }
                    className="text-left"
                  >
                    <p
                      className={[
                        "font-mono text-sm text-muted transition-all",
                        expanded === entry.id ? "" : "line-clamp-2",
                      ].join(" ")}
                    >
                      {entry.attempt}
                    </p>
                    {entry.attempt.length > 120 && (
                      <span className="text-xs text-violet-dark mt-1 inline-block">
                        {expanded === entry.id ? "Show less" : "Show more"}
                      </span>
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
