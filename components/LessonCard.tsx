"use client";

import Link from "next/link";
import { Lesson } from "@/lib/lessons";

type State = "locked" | "available" | "mastered";

export default function LessonCard({
  lesson,
  state,
  bestScore,
  isNext = false,
}: {
  lesson: Lesson;
  state: State;
  bestScore?: number;
  isNext?: boolean;
}) {
  const locked = state === "locked";
  const mastered = state === "mastered";

  const inner = (
    <div
      className={[
        "card group relative flex h-full flex-col gap-2 p-5 transition-all",
        locked
          ? "cursor-default"
          : "hover:-translate-y-0.5 hover:shadow-glow cursor-pointer",
        mastered ? "border-green/40" : "",
        isNext ? "ring-2 ring-violet/40 border-violet/30" : "",
      ].join(" ")}
    >
      {/* "Up next" pill */}
      {isNext && (
        <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-violet px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          Up next
        </div>
      )}

      <div className="flex items-start justify-between">
        <span
          className={[
            "grid h-11 w-11 place-items-center rounded-xl text-xl",
            mastered
              ? "bg-green/15"
              : locked
              ? "bg-line"
              : isNext
              ? "bg-violet/15"
              : "bg-violet-soft",
          ].join(" ")}
          aria-hidden
        >
          {locked ? "🔒" : lesson.icon}
        </span>

        {mastered ? (
          <span className="rounded-full bg-green/15 px-2.5 py-1 text-xs font-semibold text-green">
            Mastered{typeof bestScore === "number" ? ` · ${bestScore}` : ""}
          </span>
        ) : locked ? (
          <span className="rounded-full bg-line px-2.5 py-1 text-xs font-semibold text-muted">
            Locked
          </span>
        ) : (
          <span className="rounded-full bg-gold/15 px-2.5 py-1 text-xs font-semibold text-gold">
            +{lesson.xp} XP
          </span>
        )}
      </div>

      <h3 className="font-display text-lg font-bold leading-tight">
        {lesson.title}
      </h3>
      <p className={["text-sm", locked ? "text-muted/70" : "text-muted"].join(" ")}>
        {lesson.summary}
      </p>

      {!locked && (
        <span
          className={[
            "mt-auto pt-2 font-display text-sm font-semibold transition-colors",
            isNext
              ? "text-violet group-hover:text-violet-dark"
              : mastered
              ? "text-green/80 group-hover:text-green"
              : "text-violet group-hover:text-violet-dark",
          ].join(" ")}
        >
          {mastered ? "Practice again →" : isNext ? "▶ Start here" : "Start lesson →"}
        </span>
      )}
      {locked && (
        <span className="mt-auto pt-2 text-xs text-muted/70">
          Master Tier {lesson.tier - 1} to unlock · {lesson.xp} XP inside
        </span>
      )}
    </div>
  );

  if (locked) {
    return <div aria-disabled>{inner}</div>;
  }
  return <Link href={`/lesson/${lesson.id}`}>{inner}</Link>;
}
