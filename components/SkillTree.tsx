"use client";

import { LESSONS, TIERS, lessonsByTier } from "@/lib/lessons";
import { Progress, isTierUnlocked } from "@/lib/progress";
import LessonCard from "./LessonCard";

export default function SkillTree({ progress }: { progress: Progress }) {
  // First available (unlocked, not mastered) lesson — the spotlight target.
  const nextLesson = LESSONS.find(
    (l) =>
      isTierUnlocked(l.tier, progress.mastered) &&
      !progress.mastered.includes(l.id)
  );

  return (
    <div className="flex flex-col gap-10">
      {TIERS.map(({ tier, name }) => {
        const unlocked = isTierUnlocked(tier, progress.mastered);
        const lessons = lessonsByTier(tier);
        const doneInTier = lessons.filter((l) =>
          progress.mastered.includes(l.id)
        ).length;

        return (
          <section key={tier} className="relative">
            <div className="mb-4 flex items-center gap-3">
              <span
                className={[
                  "grid h-7 w-7 place-items-center rounded-full font-display text-sm font-bold",
                  unlocked ? "bg-violet text-white" : "bg-line text-muted",
                ].join(" ")}
              >
                {tier}
              </span>
              <div>
                <div className="eyebrow">Tier {tier}</div>
                <h2 className="font-display text-xl font-bold leading-none">
                  {name}
                </h2>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm text-muted">
                  {doneInTier}/{lessons.length}
                </span>
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-violet transition-all duration-500"
                    style={{
                      width: `${Math.round((doneInTier / lessons.length) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {lessons.map((lesson) => {
                const mastered = progress.mastered.includes(lesson.id);
                const state = mastered
                  ? "mastered"
                  : unlocked
                  ? "available"
                  : "locked";
                return (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    state={state}
                    bestScore={progress.bestScores[lesson.id]}
                    isNext={nextLesson?.id === lesson.id}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
