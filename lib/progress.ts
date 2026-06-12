"use client";

import { LESSONS } from "./lessons";

const KEY = "promptschool_progress_v1";

export type Progress = {
  xp: number;
  mastered: string[]; // lesson ids
  bestScores: Record<string, number>;
};

const EMPTY: Progress = { xp: 0, mastered: [], bestScores: {} };

export function loadProgress(): Progress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Progress;
    return {
      xp: parsed.xp ?? 0,
      mastered: parsed.mastered ?? [],
      bestScores: parsed.bestScores ?? {},
    };
  } catch {
    return EMPTY;
  }
}

export function saveProgress(p: Progress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

// Record a practice result. Returns the updated progress and how much XP was gained.
export function recordResult(
  lessonId: string,
  score: number,
  passed: boolean
): { progress: Progress; xpGained: number; newlyMastered: boolean } {
  const p = loadProgress();
  const lesson = LESSONS.find((l) => l.id === lessonId);
  const prevBest = p.bestScores[lessonId] ?? 0;
  const wasMastered = p.mastered.includes(lessonId);

  let xpGained = 0;
  let newlyMastered = false;

  if (lesson && passed && !wasMastered) {
    // First time mastering: award the lesson's full XP.
    xpGained = lesson.xp;
    p.mastered.push(lessonId);
    newlyMastered = true;
  } else if (score > prevBest) {
    // Improving a score later gives a small bonus.
    xpGained = Math.round((score - prevBest) / 2);
  }

  p.xp += xpGained;
  p.bestScores[lessonId] = Math.max(prevBest, score);
  saveProgress(p);
  return { progress: p, xpGained, newlyMastered };
}

// Levels scale gently: each level needs a bit more XP than the last.
const LEVEL_NAMES = [
  "Novice",
  "Apprentice",
  "Crafter",
  "Tactician",
  "Specialist",
  "Prompt Smith",
  "Prompt Master",
];

export function levelInfo(xp: number) {
  // XP needed to reach level n (1-indexed) = 200 * n
  let level = 1;
  let needed = 200;
  let floor = 0;
  while (xp >= floor + needed) {
    floor += needed;
    level += 1;
    needed = 200 * level;
  }
  const intoLevel = xp - floor;
  const name = LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)];
  return {
    level,
    name,
    intoLevel,
    needed,
    pct: Math.min(100, Math.round((intoLevel / needed) * 100)),
  };
}

// A tier is unlocked when every lesson in the tier below is mastered.
export function isTierUnlocked(tier: number, mastered: string[]): boolean {
  if (tier <= 1) return true;
  const below = LESSONS.filter((l) => l.tier === tier - 1);
  return below.every((l) => mastered.includes(l.id));
}
