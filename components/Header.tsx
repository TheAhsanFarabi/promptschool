"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { levelInfo, Progress } from "@/lib/progress";
import { getUserApiKey } from "@/lib/apiKey";
import ApiKeyModal from "./ApiKeyModal";

export default function Header({ progress }: { progress: Progress | null }) {
  const info = progress ? levelInfo(progress.xp) : null;
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [hasUserKey, setHasUserKey] = useState(false);

  useEffect(() => {
    setHasUserKey(!!getUserApiKey());
  }, [showKeyModal]);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-bg/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet text-white font-display font-bold">
              P
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              Prompt<span className="text-violet">School</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {info && (
              <div className="hidden items-center gap-3 sm:flex">
                <div className="text-right">
                  <div className="font-display text-sm font-semibold leading-none">
                    {info.name}
                  </div>
                  <div className="text-xs text-muted">
                    Lv {info.level} · {progress!.xp} XP ·{" "}
                    <span className="text-violet-dark">
                      {info.needed - info.intoLevel} to Lv {info.level + 1}
                    </span>
                  </div>
                </div>
                <div className="h-2.5 w-28 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-gold transition-all"
                    style={{ width: `${info.pct}%` }}
                  />
                </div>
              </div>
            )}

            <Link href="/history" className="btn-quiet text-sm">
              History
            </Link>

            <Link href="/refine" className="btn-ghost text-sm">
              Free Refine
            </Link>

            {/* API key button */}
            <button
              onClick={() => setShowKeyModal(true)}
              className="relative btn-quiet text-sm px-2.5"
              title="Set your Gemini API key"
              aria-label="API key settings"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M8 7a5 5 0 1 1 3.61 4.804l-1.903 1.903A1 1 0 0 1 9 14H8v1a1 1 0 0 1-1 1H6v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 .293-.707L7.196 10.39A5.002 5.002 0 0 1 8 7Zm5-3a.75.75 0 0 0 0 1.5A1.5 1.5 0 0 1 14.5 7 .75.75 0 0 0 16 7a3 3 0 0 0-3-3Z"
                  clipRule="evenodd"
                />
              </svg>
              {hasUserKey && (
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green border border-bg" />
              )}
            </button>
          </div>
        </div>
      </header>

      {showKeyModal && (
        <ApiKeyModal onClose={() => setShowKeyModal(false)} />
      )}
    </>
  );
}
