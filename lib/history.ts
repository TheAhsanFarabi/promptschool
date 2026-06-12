"use client";

const KEY = "promptschool_history_v1";
const MAX_ENTRIES = 50;

export type HistoryEntry = {
  id: string;
  type: "lesson" | "refine";
  title: string;
  attempt: string;
  score?: number;
  passed?: boolean;
  timestamp: number;
};

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function saveEntry(entry: Omit<HistoryEntry, "id" | "timestamp">): void {
  if (typeof window === "undefined") return;
  const history = loadHistory();
  const newEntry: HistoryEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
  };
  const updated = [newEntry, ...history].slice(0, MAX_ENTRIES);
  window.localStorage.setItem(KEY, JSON.stringify(updated));
}

export function deleteEntry(id: string): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  const updated = loadHistory().filter((e) => e.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
