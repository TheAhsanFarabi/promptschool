"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import SkillTree from "@/components/SkillTree";
import {
  Progress,
  loadProgress,
  resetProgress,
  levelInfo,
} from "@/lib/progress";
import { LESSONS } from "@/lib/lessons";

export default function Home() {
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (!progress) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-5xl px-5 py-20 text-muted">Loading…</div>
      </main>
    );
  }

  const info = levelInfo(progress.xp);
  const masteredCount = progress.mastered.length;

  function handleReset() {
    if (confirm("Reset all progress? This clears your XP and badges.")) {
      resetProgress();
      setProgress(loadProgress());
    }
  }

  return (
    <main className="min-h-screen">
      <Header progress={progress} />

      <section className="mx-auto max-w-5xl px-5 pt-12 pb-8">
        <p className="eyebrow mb-3">Learn prompting by doing</p>
        <h1 className="max-w-2xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
          Stop guessing.{" "}
          <span className="text-violet">Climb the prompt tree.</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Six real techniques, one at a time. Rewrite a weak prompt, get live AI
          feedback, earn XP, and unlock the next skill. By the end you will not
          need a refiner at all.
        </p>

        {/* Stat strip */}
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            { icon: "🎯", label: `${LESSONS.length} techniques`, done: masteredCount >= LESSONS.length },
            { icon: "⏱", label: "~25 min", done: false },
            { icon: "✦", label: `Up to ${LESSONS.reduce((s, l) => s + l.xp, 0)} XP`, done: masteredCount >= LESSONS.length },
          ].map(({ icon, label, done }) => (
            <span
              key={label}
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold",
                done
                  ? "bg-green/15 text-green"
                  : "bg-violet-soft text-violet-dark",
              ].join(" ")}
            >
              {icon} {label}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a href="#tree" className="btn-primary">
            {masteredCount > 0 ? "Keep going" : "Start with Tier 1"}
          </a>
          <div className="flex items-center gap-2 text-sm text-muted">
            <span className="font-display font-semibold text-ink">
              {info.name}
            </span>
            · {masteredCount}/{LESSONS.length} techniques mastered
          </div>
        </div>
      </section>

      <section id="tree" className="mx-auto max-w-5xl scroll-mt-20 px-5 pb-20">
        <SkillTree progress={progress} />

        <div className="mt-10 flex justify-center">
          <button onClick={handleReset} className="btn-quiet text-sm">
            Reset progress
          </button>
        </div>
      </section>
    </main>
  );
}
